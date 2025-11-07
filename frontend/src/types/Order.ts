import type { CartItem, ShippingAddress } from "./Cart";
import  type { User } from "./User";

export type OrderStatus = 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled';

export type Order = {
    _id: string;
    orderItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    user: User;
    createdAt: string;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    discount?: number;
    status?: OrderStatus;
    tierSnapshot?: 'regular' | 'vip' | 'new'; 
  };