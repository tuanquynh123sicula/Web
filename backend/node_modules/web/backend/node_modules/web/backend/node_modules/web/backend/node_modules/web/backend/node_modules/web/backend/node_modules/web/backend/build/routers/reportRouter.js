"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../utils/auth");
const orderModel_1 = require("../models/orderModel");
const userModel_1 = require("../models/userModel");
const reportRouter = (0, express_1.Router)();
// GET /api/admin/reports/summary
reportRouter.get('/summary', auth_1.isAuth, auth_1.isAdmin, async (req, res) => {
    try {
        console.log('📊 Fetching summary report...');
        // Tính toán các metric
        const totalOrders = await orderModel_1.OrderModel.countDocuments({});
        const totalUsers = await userModel_1.UserModel.countDocuments({ isAdmin: false });
        // Tính tổng doanh thu từ các đơn hàng đã thanh toán
        const salesResult = await orderModel_1.OrderModel.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;
        // Doanh số 7 ngày gần nhất
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailySalesData = await orderModel_1.OrderModel.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Doanh số theo tháng (12 tháng gần nhất)
        const twelveMonthsAgo = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
        const monthlySalesData = await orderModel_1.OrderModel.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Top 5 sản phẩm bán chạy nhất
        const topProducts = await orderModel_1.OrderModel.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    count: { $sum: '$orderItems.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $project: {
                    _id: 1,
                    name: { $arrayElemAt: ['$productInfo.name', 0] },
                    count: 1,
                    totalRevenue: 1,
                },
            },
        ]);
        console.log('✅ Summary report data:', {
            totalSales,
            totalOrders,
            totalUsers,
            dailySalesCount: dailySalesData.length,
            monthlySalesCount: monthlySalesData.length,
            topProductsCount: topProducts.length,
        });
        res.json({
            totalSales,
            totalOrders,
            totalUsers,
            dailySales: dailySalesData.map(d => ({
                date: d._id,
                sales: d.sales,
            })),
            monthlySales: monthlySalesData.map(m => ({
                month: m._id,
                sales: m.sales,
            })),
            topSellingProducts: topProducts.map(p => ({
                _id: p._id,
                name: p.name || 'Unknown Product',
                count: p.count,
                totalRevenue: p.totalRevenue,
            })),
        });
    }
    catch (error) {
        console.error('❌ Error fetching summary report:', error);
        const errorMessage = error.message || 'Unknown error';
        res.status(500).json({ message: 'Lỗi khi tải báo cáo', error: errorMessage });
    }
});
exports.default = reportRouter;
//# sourceMappingURL=reportRouter.js.map