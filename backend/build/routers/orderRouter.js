"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const orderModel_1 = require("../models/orderModel");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const userModel_1 = require("../models/userModel");
exports.orderRouter = express_1.default.Router();
exports.orderRouter.get('/mine', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const orders = await orderModel_1.OrderModel.find({ user: req.user?._id });
    res.json(orders);
}));
exports.orderRouter.post('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Giỏ hàng trống' });
        return;
    }
    const isCash = req.body.paymentMethod === 'Cash';
    const createdOrder = await orderModel_1.OrderModel.create({
        orderItems: req.body.orderItems.map((x) => ({
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
}));
exports.orderRouter.get('/:id', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const order = await orderModel_1.OrderModel.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.send(order);
    }
    else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));
exports.orderRouter.put('/:id/pay', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const order = await orderModel_1.OrderModel.findById(req.params.id);
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
    }
    else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));
exports.orderRouter.delete('/:id', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const order = await orderModel_1.OrderModel.findById(req.params.id);
    if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
    }
    // ✅ Nếu là admin hoặc chủ đơn hàng thì được xóa
    if (order.user?.toString() === req.user?._id.toString() || req.user?.isAdmin) {
        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    }
    else {
        res.status(403).json({ message: 'Not authorized to delete this order' });
    }
}));
// 💣 Xóa tất cả đơn hàng (chỉ admin)
exports.orderRouter.delete('/', utils_1.isAuth, utils_2.isAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    await orderModel_1.OrderModel.deleteMany({});
    res.json({ message: 'All orders deleted successfully (Admin only)' });
}));
exports.orderRouter.post('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    // Tính tổng tiền hàng
    const itemsPrice = Math.round((req.body.orderItems || []).reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0));
    // Lấy tier của user
    const userId = req.user?._id;
    const userDoc = userId ? await userModel_1.UserModel.findById(userId).lean() : null;
    const tier = userDoc?.tier ?? 'regular';
    // Tính giảm theo hạng
    const rateMap = {
        regular: 0,
        new: 0.02, // 2% cho khách mới
        vip: 0.1, // 10% cho VIP
    };
    const discount = Math.round(itemsPrice * (rateMap[tier] ?? 0));
    // Ship miễn phí nếu VIP hoặc sau giảm còn >= 1tr
    const shippingPrice = itemsPrice - discount >= 1000000 || tier === 'vip' ? 0 : 30000;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;
    // Tạo order (chỉ hiển thị phần thay đổi, giữ nguyên các field khác)
    const order = new orderModel_1.OrderModel({
        // ...existing code...
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount, // lưu số tiền giảm
        totalPrice,
        isPaid: false,
        isDelivered: false,
        user: userId,
        tierSnapshot: tier, // lưu hạng tại thời điểm đặt
    });
    const created = await order.save();
    res.status(201).send(created);
}));
//# sourceMappingURL=orderRouter.js.map