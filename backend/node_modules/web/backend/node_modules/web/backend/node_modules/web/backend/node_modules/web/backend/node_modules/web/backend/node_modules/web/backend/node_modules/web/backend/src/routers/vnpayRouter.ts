import express, { Request, Response } from 'express'
import querystring from 'qs'
import crypto from 'crypto'
import moment from 'moment'
import dotenv from 'dotenv'
import {Order} from '../models/orderModel'
import { OrderModel } from '../models/orderModel'
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
dotenv.config()




export const vnpayRouter = express.Router()

// Đọc cấu hình ENV
const vnp_TmnCode = process.env.VNP_TMNCODE || 'TMNCODE'
const vnp_HashSecret = process.env.VNP_HASHSECRET || ''
const vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
// const VNP_RETURN_URL = process.env.VNP_RETURNURL || 'http://localhost:5173/order/:id'
const FRONTEND_URL = 'http://localhost:5173'


// TẠO URL THANH TOÁN
vnpayRouter.post('/create_payment_url', async (req: Request, res: Response) => {
  try {
    console.log('🔍 VNP_TMNCODE:', vnp_TmnCode)
    console.log('🔍 VNP_HASHSECRET length:', vnp_HashSecret.length)
    console.log('🔍 VNP_URL:', vnp_Url)
    
    const { amount, bankCode, orderId } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Thiếu amount hoặc orderId' })
    }

    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
    if (typeof ipAddr === 'string' && ipAddr.includes('::1')) ipAddr = '127.0.0.1'

    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')
    const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss')
    const orderInfo = `Thanh toan don hang ${orderId}`
    
    const vnp_TxnRef = orderId

    const vnp_Params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Amount: (Number(amount) * 100).toFixed(0),
      vnp_ReturnUrl: `${FRONTEND_URL}/order/${orderId}`,
      vnp_IpAddr: String(ipAddr),
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    }

    if (bankCode) vnp_Params['vnp_BankCode'] = bankCode

    const sortedParams = sortObject(vnp_Params)
    const signData = querystring.stringify(sortedParams, { encode: false })
    const hmac = crypto.createHmac('sha512', vnp_HashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    sortedParams['vnp_SecureHash'] = signed

    const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams, { encode: false })}`

    console.log('✅ Payment URL created:', paymentUrl)
    res.json({ paymentUrl })
  } catch (err) {
    console.error('❌ Error:', err)
    res.status(500).json({ message: 'Tạo URL thanh toán thất bại' })
  }
})
    

// XỬ LÝ RETURN (client redirect)
vnpayRouter.get(
  '/vnpay_return',
  asyncHandler(async (req: Request, res: Response) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'] as string;
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const signData = Object.keys(vnp_Params)
      .sort()
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET as string);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Nếu VNPay xác nhận thanh toán thành công
    if (secureHash === signed && rspCode === '00') {
      await OrderModel.updateOne(
        { _id: new mongoose.Types.ObjectId(orderId) },
        {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: vnp_Params,
        }
      );

      console.log('✅ Đã cập nhật order thanh toán thành công:', orderId);
      return res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}?success=true`);
    } else {
      console.log('❌ Thanh toán thất bại hoặc sai chữ ký:', rspCode);
      return res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}?success=false`);
    }
  })
);


//  XỬ LÝ IPN (VNPay gọi lại server xác nhận)
vnpayRouter.get('/vnpay_ipn', async (req: Request, res: Response) => {
  try {
    const vnp_Params: any = { ...req.query }
    const secureHash = vnp_Params['vnp_SecureHash'] as string
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    const sortedParams = sortObject(vnp_Params)
    const signData = querystring.stringify(sortedParams, { encode: false })
    const hmac = crypto.createHmac('sha512', vnp_HashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef']
      const responseCode = vnp_Params['vnp_ResponseCode']
      console.log('🔹 VNPay return params:', vnp_Params)
console.log('🔹 orderId nhận được:', orderId)
      console.log('🔹 responseCode nhận được:', responseCode)
      if (responseCode === '00') {
        await OrderModel.updateOne(
  { _id: new mongoose.Types.ObjectId(orderId) },
            {
                isPaid: true,
                paidAt: new Date(),
                paymentResult: vnp_Params,
            }
        )
console.log('🔹 Kết quả update order:',)
        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' })
      } else {
        return res.status(200).json({ RspCode: '01', Message: 'Payment Failed' })
      }
    } else {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' })
    }
  } catch (err) {
    console.error('IPN error:', err)
    res.status(500).json({ RspCode: '99', Message: 'Server error' })
  }
})

// Hàm sắp xếp object chuẩn VNPay
function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+')
  }
  return sorted
}
