"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherModel = void 0;
const mongoose_1 = require("mongoose");
const voucherSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, 'Vui lòng nhập mã voucher'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Vui lòng chọn loại giảm giá'],
    },
    discountValue: {
        type: Number,
        required: [true, 'Vui lòng nhập giá trị giảm'],
        min: [0, 'Giá trị giảm phải lớn hơn 0'],
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    maxUsage: {
        type: Number,
        required: [true, 'Vui lòng nhập số lượng sử dụng tối đa'],
        min: [1, 'Số lượng sử dụng tối đa phải lớn hơn 0'],
    },
    usageCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    expiryDate: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày hết hạn'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.VoucherModel = (0, mongoose_1.model)('Voucher', voucherSchema);
//# sourceMappingURL=voucherModel.js.map