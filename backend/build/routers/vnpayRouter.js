"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vnpayRouter = void 0;
const express_1 = __importDefault(require("express"));
const qs_1 = __importDefault(require("qs"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderModel_1 = require("../models/orderModel");
const mongoose_1 = __importDefault(require("mongoose"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
dotenv_1.default.config();
exports.vnpayRouter = express_1.default.Router();
// ====================
// ⚙️ Đọc cấu hình ENV
// ====================
const vnp_TmnCode = process.env.VNP_TMNCODE || '';
const vnp_HashSecret = process.env.VNP_HASHSECRET || '';
const vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
// const VNP_RETURN_URL = process.env.VNP_RETURNURL || 'http://localhost:5173/order/:id'
const FRONTEND_URL = 'http://localhost:5173';
// =============================
// 1️⃣ TẠO URL THANH TOÁN
// =============================
exports.vnpayRouter.post('/create_payment_url', async (req, res) => {
    try {
        const { amount, bankCode, orderId } = req.body;
        if (!amount || !orderId) {
            return res.status(400).json({ message: 'Thiếu amount hoặc orderId' });
        }
        let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        if (typeof ipAddr === 'string' && ipAddr.includes('::1'))
            ipAddr = '127.0.0.1';
        const date = new Date();
        const createDate = (0, moment_1.default)(date).format('YYYYMMDDHHmmss');
        const expireDate = (0, moment_1.default)(date).add(15, 'minutes').format('YYYYMMDDHHmmss');
        const orderInfo = `Thanh toan don hang ${orderId}`;
        const vnp_TxnRef = orderId; // 🔑 dùng orderId làm mã giao dịch để đối chiếu dễ hơn
        const vnp_Params = {
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
        };
        if (bankCode)
            vnp_Params['vnp_BankCode'] = bankCode;
        const sortedParams = sortObject(vnp_Params);
        const signData = qs_1.default.stringify(sortedParams, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;
        const paymentUrl = `${vnp_Url}?${qs_1.default.stringify(sortedParams, { encode: false })}`;
        console.log('Payment URL:', paymentUrl);
        res.json({ paymentUrl });
    }
    catch (err) {
        console.error('Error creating VNPay URL:', err);
        res.status(500).json({ message: 'Tạo URL thanh toán thất bại' });
    }
});
// =============================
// 2️⃣ XỬ LÝ RETURN (client redirect)
// =============================
exports.vnpayRouter.get('/vnpay_return', (0, express_async_handler_1.default)(async (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    const signData = Object.keys(vnp_Params)
        .sort()
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join('&');
    const hmac = crypto_1.default.createHmac('sha512', process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    // ✅ Nếu VNPay xác nhận thanh toán thành công
    if (secureHash === signed && rspCode === '00') {
        await orderModel_1.OrderModel.updateOne({ _id: new mongoose_1.default.Types.ObjectId(orderId) }, {
            isPaid: true,
            paidAt: new Date(),
            paymentResult: vnp_Params,
        });
        console.log('✅ Đã cập nhật order thanh toán thành công:', orderId);
        return res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}?success=true`);
    }
    else {
        console.log('❌ Thanh toán thất bại hoặc sai chữ ký:', rspCode);
        return res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}?success=false`);
    }
}));
// =============================
// 3️⃣ XỬ LÝ IPN (VNPay gọi lại server xác nhận)
// =============================
exports.vnpayRouter.get('/vnpay_ipn', async (req, res) => {
    try {
        const vnp_Params = { ...req.query };
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        const sortedParams = sortObject(vnp_Params);
        const signData = qs_1.default.stringify(sortedParams, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const responseCode = vnp_Params['vnp_ResponseCode'];
            console.log('🔹 VNPay return params:', vnp_Params);
            console.log('🔹 orderId nhận được:', orderId);
            console.log('🔹 responseCode nhận được:', responseCode);
            if (responseCode === '00') {
                await orderModel_1.OrderModel.updateOne({ _id: orderId }, {
                    isPaid: true,
                    paidAt: new Date(),
                    paymentResult: vnp_Params, // bạn có thể lưu toàn bộ thông tin VNPay trả về
                });
                console.log('🔹 Kết quả update order:');
                return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            }
            else {
                return res.status(200).json({ RspCode: '01', Message: 'Payment Failed' });
            }
        }
        else {
            return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
        }
    }
    catch (err) {
        console.error('IPN error:', err);
        res.status(500).json({ RspCode: '99', Message: 'Server error' });
    }
});
// =============================
// 🧩 Hàm sắp xếp object chuẩn VNPay
// =============================
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
}
//# sourceMappingURL=vnpayRouter.js.map