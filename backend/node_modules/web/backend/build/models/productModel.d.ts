declare class Variant {
    color: string;
    storage: string;
    ram: string;
    price: number;
    countInStock: number;
    image?: string;
}
export declare class Product {
    _id?: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    description: string;
    rating: number;
    numReviews: number;
    image?: string;
    price?: number;
    countInStock?: number;
    variants: Variant[];
}
export declare const ProductModel: import("@typegoose/typegoose").ReturnModelType<typeof Product, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};
//# sourceMappingURL=productModel.d.ts.map