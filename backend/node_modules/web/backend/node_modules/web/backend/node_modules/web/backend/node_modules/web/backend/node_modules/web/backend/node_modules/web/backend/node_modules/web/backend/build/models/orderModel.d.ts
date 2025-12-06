import { Ref } from "@typegoose/typegoose";
import { Product } from "./productModel";
import { User } from "./userModel";
declare class ShippingAddress {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    lat?: string;
    lng?: string;
    postalCode?: string;
}
declare class Item {
    name: string;
    quantity: string;
    image: number;
    price: number;
    product?: Ref<Product>;
}
declare class PaymentResult {
    paymentId: string;
    status: string;
    update_time: string;
    email_address: string;
}
export type OrderStatus = 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled';
export declare class Order {
    _id: string;
    orderItems: Item[];
    shippingAddress?: ShippingAddress;
    user?: Ref<User>;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    discount: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
    status: 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled';
    tierSnapshot?: 'regular' | 'vip' | 'new';
}
export declare const OrderModel: import("@typegoose/typegoose").ReturnModelType<typeof Order, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};
//# sourceMappingURL=orderModel.d.ts.map