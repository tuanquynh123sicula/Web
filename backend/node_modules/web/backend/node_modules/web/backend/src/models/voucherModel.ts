import { Document, Schema, model } from 'mongoose'

export interface IVoucher extends Document {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxUsage: number
  usageCount: number
  expiryDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const voucherSchema = new Schema<IVoucher>(
  {
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
  },
  { timestamps: true }
)

export const VoucherModel = model<IVoucher>('Voucher', voucherSchema)