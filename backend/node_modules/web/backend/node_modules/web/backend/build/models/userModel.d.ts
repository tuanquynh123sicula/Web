export declare class User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    tier: 'regular' | 'vip' | 'new';
}
export declare const UserModel: import("@typegoose/typegoose").ReturnModelType<typeof User, import("@typegoose/typegoose/lib/types").BeAnObject>;
//# sourceMappingURL=userModel.d.ts.map