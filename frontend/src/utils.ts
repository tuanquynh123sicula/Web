import type { ApiError } from './types/ApiError'
import type { Product } from './types/Product'
import type { CartItem } from './types/Cart'


export const getError = (error: ApiError) => {
     return error.response && error.response.data.message
       ? error.response.data.message
       : error.message
   }
export const convertProductToCartItem = (product: Product): CartItem => {
     const cartItem: CartItem = {
       _id: product._id,
       name: product.name,
       slug: product.slug,
       image: product.image,
       price: product.price,
       countInStock: product.countInStock,
       quantity: 1,
     }
     return cartItem
   }

export const authHeader = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return {}

  const user = JSON.parse(userInfo)
  if (!user.token) return {}

  return { Authorization: `Bearer ${user.token}` }
}
