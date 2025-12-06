import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
export declare class Review extends TimeStamps {
    _id?: string;
    productId: string;
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    helpful: number;
}
export declare const ReviewModel: import("@typegoose/typegoose").ReturnModelType<typeof Review, import("@typegoose/typegoose/lib/types").BeAnObject>;
//# sourceMappingURL=reviewModel.d.ts.map