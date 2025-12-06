import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
export declare class Wishlist extends TimeStamps {
    _id?: string;
    userId: string;
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
    productSlug: string;
}
export declare const WishlistModel: import("@typegoose/typegoose").ReturnModelType<typeof Wishlist, import("@typegoose/typegoose/lib/types").BeAnObject>;
//# sourceMappingURL=wishlistModel.d.ts.map