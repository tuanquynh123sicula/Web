import { Document } from 'mongoose';
export interface IVoucher extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxUsage: number;
    usageCount: number;
    expiryDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VoucherModel: import("mongoose").Model<IVoucher, {}, {}, {}, Document<unknown, {}, IVoucher, {}, {}> & IVoucher & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=voucherModel.d.ts.map