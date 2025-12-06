"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherRouter = void 0;
const express_1 = require("express");
const voucherModel_1 = require("../models/voucherModel");
const auth_1 = require("../utils/auth");
const voucherRouter = (0, express_1.Router)();
exports.voucherRouter = voucherRouter;
// ✅ POST: Xác thực voucher (dùng khi checkout) - PUBLIC
// Route tĩnh này phải được đặt trước /:id
voucherRouter.post('/validate', async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        console.log('Request body:', req.body); // Debug log
        console.log('Code:', code, 'OrderTotal:', orderTotal);
        if (!code || !orderTotal) {
            res.status(400).json({ message: 'Vui lòng nhập mã voucher và giá trị đơn hàng' });
            return;
        }
        const voucher = await voucherModel_1.VoucherModel.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });
        if (!voucher) {
            res.status(404).json({ message: 'Mã voucher không hợp lệ hoặc đã bị vô hiệu hóa' });
            return;
        }
        // Kiểm tra hết hạn
        if (new Date(voucher.expiryDate) < new Date()) {
            res.status(400).json({ message: 'Voucher đã hết hạn' });
            return;
        }
        // Kiểm tra lượt sử dụng
        if (voucher.usageCount >= voucher.maxUsage) {
            res.status(400).json({ message: 'Voucher đã hết lượt sử dụng' });
            return;
        }
        // Kiểm tra giá trị đơn hàng tối thiểu
        if (orderTotal < voucher.minOrderValue) {
            res.status(400).json({
                message: `Đơn hàng tối thiểu phải là ${voucher.minOrderValue.toLocaleString('vi-VN')} ₫`,
            });
            return;
        }
        res.json({
            message: 'Voucher hợp lệ',
            voucher
        });
    }
    catch (error) {
        console.error('Validate voucher error:', error);
        res.status(500).json({ message: error.message || 'Lỗi khi xác thực voucher' });
    }
});
// GET: Lấy danh sách tất cả vouchers
voucherRouter.get('/', async (req, res) => {
    try {
        const vouchers = await voucherModel_1.VoucherModel.find().sort({ createdAt: -1 });
        res.json(vouchers);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Lỗi khi tải vouchers' });
    }
});
// GET: Lấy 1 voucher theo ID
voucherRouter.get('/:id', async (req, res) => {
    try {
        const voucher = await voucherModel_1.VoucherModel.findById(req.params.id);
        if (!voucher) {
            res.status(404).json({ message: 'Voucher không tồn tại' });
            return;
        }
        res.json(voucher);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST: Tạo voucher mới (Admin only)
voucherRouter.post('/', auth_1.isAuth, auth_1.isAdmin, async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxUsage, expiryDate } = req.body;
        // Validate
        if (!code || !discountType || !discountValue || !maxUsage || !expiryDate) {
            res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
            return;
        }
        // Kiểm tra mã đã tồn tại
        const existing = await voucherModel_1.VoucherModel.findOne({
            code: code.toUpperCase(),
        });
        if (existing) {
            res.status(400).json({ message: 'Mã voucher đã tồn tại' });
            return;
        }
        const voucher = new voucherModel_1.VoucherModel({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderValue: minOrderValue || 0,
            maxUsage,
            expiryDate,
            isActive: true,
        });
        const savedVoucher = await voucher.save();
        res.status(201).json(savedVoucher);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Lỗi khi tạo voucher' });
    }
});
// PUT: Cập nhật voucher (Admin only)
voucherRouter.put('/:id', auth_1.isAuth, auth_1.isAdmin, async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxUsage, expiryDate } = req.body;
        const voucher = await voucherModel_1.VoucherModel.findById(req.params.id);
        if (!voucher) {
            res.status(404).json({ message: 'Voucher không tồn tại' });
            return;
        }
        // Kiểm tra mã trùng (nếu có thay đổi)
        if (code && code.toUpperCase() !== voucher.code) {
            const existing = await voucherModel_1.VoucherModel.findOne({
                code: code.toUpperCase(),
            });
            if (existing) {
                res.status(400).json({ message: 'Mã voucher đã tồn tại' });
                return;
            }
            voucher.code = code.toUpperCase();
        }
        if (discountType)
            voucher.discountType = discountType;
        if (discountValue !== undefined)
            voucher.discountValue = discountValue;
        if (minOrderValue !== undefined)
            voucher.minOrderValue = minOrderValue;
        if (maxUsage !== undefined)
            voucher.maxUsage = maxUsage;
        if (expiryDate)
            voucher.expiryDate = new Date(expiryDate);
        const updatedVoucher = await voucher.save();
        res.json(updatedVoucher);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Lỗi khi cập nhật voucher' });
    }
});
// PATCH: Cập nhật trạng thái voucher (Admin only)
voucherRouter.patch('/:id', auth_1.isAuth, auth_1.isAdmin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const voucher = await voucherModel_1.VoucherModel.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
        if (!voucher) {
            res.status(404).json({ message: 'Voucher không tồn tại' });
            return;
        }
        res.json(voucher);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// DELETE: Xóa voucher (Admin only)
voucherRouter.delete('/:id', auth_1.isAuth, auth_1.isAdmin, async (req, res) => {
    try {
        const voucher = await voucherModel_1.VoucherModel.findByIdAndDelete(req.params.id);
        if (!voucher) {
            res.status(404).json({ message: 'Voucher không tồn tại' });
            return;
        }
        res.json({ message: 'Voucher đã được xóa', voucher });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//# sourceMappingURL=voucherRouter.js.map