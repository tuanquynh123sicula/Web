export type CartItem = {
        image: string | undefined
        slug: string
        quantity: number
        countInStock: number
        price: number
        _id: string
        name: string
        variantId?: string;
        variant?: {
          color: string;
          storage: string;
          ram: string;
        };
      }
      
export type ShippingAddress = {
        id?: string
        fullName: string
        address: string
        city: string
        country: string
        postalCode: string
        phoneNumber?: string
        isDefault?: boolean
      }

export type Cart = {
        itemsPrice: number
        shippingPrice: number
        taxPrice: number
        totalPrice: number
        cartItems: CartItem[]
        shippingAddress: ShippingAddress
        paymentMethod: string
      }

// export type VariantInfo = {
//   color: string
//   storage: string
//   ram: string
//   price: number
//   countInStock: number
// }