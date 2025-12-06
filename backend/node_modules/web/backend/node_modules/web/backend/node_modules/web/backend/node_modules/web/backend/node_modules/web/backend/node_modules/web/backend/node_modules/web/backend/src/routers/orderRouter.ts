import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { OrderModel } from '../models/orderModel';
import { isAuth } from '../utils';
import { isAdmin } from '../utils';
import { Product } from '../models/productModel';
import { UserModel } from '../models/userModel';


export const orderRouter = express.Router();

orderRouter.get(
     '/mine',
     isAuth,
     asyncHandler(async (req: Request, res: Response) => {
       const orders = await OrderModel.find({ user: req.user?._id })
       res.json(orders)
     })
   )

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Giỏ hàng trống' });
      return;
    }

    const isCash = req.body.paymentMethod === 'Cash';

    const createdOrder = await OrderModel.create({
      orderItems: req.body.orderItems.map((x: Product) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user?._id,

      // ✅ Nếu là Cash thì tự động set thanh toán
      isPaid: isCash,
      paidAt: isCash ? new Date() : undefined,
      paymentResult: isCash
        ? {
            status: 'Paid',
            update_time: new Date().toISOString(),
            email_address: req.user?.email || '',
          }
        : undefined,
    });

    res.status(201).send({ message: 'Đã tạo đơn hàng', order: createdOrder });
  })
);


orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
)
orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        paymentId: req.body.paymentId || '',
        status: req.body.status || 'Paid',
        update_time: new Date().toISOString(),
        email_address: req.body.email_address || req.user?.email || '',
      };
      const updatedOrder = await order.save();
      res.send(updatedOrder);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    // ✅ Nếu là admin hoặc chủ đơn hàng thì được xóa
    if (order.user?.toString() === req.user?._id.toString() || req.user?.isAdmin) {
      await order.deleteOne()
      res.json({ message: 'Order deleted successfully' })
    } else {
      res.status(403).json({ message: 'Not authorized to delete this order' })
    }
  })
)

// 💣 Xóa tất cả đơn hàng (chỉ admin)
orderRouter.delete(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    await OrderModel.deleteMany({})
    res.json({ message: 'All orders deleted successfully (Admin only)' })
  })
)

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req, res) => {
    // Tính tổng tiền hàng
    const itemsPrice = Math.round(
      (req.body.orderItems || []).reduce(
        (sum: number, it: any) => sum + Number(it.price) * Number(it.quantity),
        0
      )
    )

    // Lấy tier của user
    const userId = (req as any).user?._id
    const userDoc = userId ? await UserModel.findById(userId).lean() : null
    const tier: 'regular' | 'vip' | 'new' = (userDoc?.tier as any) ?? 'regular'

    // Tính giảm theo hạng
    const rateMap: Record<'regular' | 'vip' | 'new', number> = {
      regular: 0,
      new: 0.02,  // 2% cho khách mới
      vip: 0.1,   // 10% cho VIP
    }
    const discount = Math.round(itemsPrice * (rateMap[tier] ?? 0))

    // Ship miễn phí nếu VIP hoặc sau giảm còn >= 1tr
    const shippingPrice =
      itemsPrice - discount >= 1_000_000 || tier === 'vip' ? 0 : 30000

    const taxPrice = 0
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount

    // Tạo order (chỉ hiển thị phần thay đổi, giữ nguyên các field khác)
    const order = new OrderModel({
      // ...existing code...
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discount,           // lưu số tiền giảm
      totalPrice,
      isPaid: false,
      isDelivered: false,
      user: userId,
      tierSnapshot: tier, // lưu hạng tại thời điểm đặt
    })

    const created = await order.save()
    res.status(201).send(created)
  })
)