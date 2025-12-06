import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
declare class ProductVariant {
    color?: string;
    storage?: string;
    ram?: string;
    price?: number;
    countInStock?: number;
    image?: string;
}
export declare class Compare extends TimeStamps {
    _id?: string;
    userId: string;
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
    productSlug: string;
    productBrand: string;
    productCategory: string;
    productRating: number;
    productNumReviews: number;
    selectedVariant?: ProductVariant;
    allVariants?: ProductVariant[];
}
export declare const CompareModel: import("@typegoose/typegoose").ReturnModelType<typeof Compare, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};
//# sourceMappingURL=compareModel.d.ts.map