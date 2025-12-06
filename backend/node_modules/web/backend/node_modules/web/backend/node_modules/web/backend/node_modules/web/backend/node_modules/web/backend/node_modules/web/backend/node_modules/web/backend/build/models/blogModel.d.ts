export interface IBlog {
    _id?: string;
    title: string;
    category: 'Đánh giá' | 'Tin tức' | 'Mẹo sử dụng' | 'So sánh';
    description: string;
    content: string;
    image: string;
    date: string;
    author?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const BlogModel: import("mongoose").Model<IBlog, {}, {}, {}, import("mongoose").Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=blogModel.d.ts.map