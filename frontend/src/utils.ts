import type { ApiError } from './types/ApiError'
import type { Product, Variant } from './types/Product'
import type { CartItem } from './types/Cart'


export const getError = (error: ApiError) => {
     return error.response && error.response.data.message
       ? error.response.data.message
       : error.message
   }
   
export const convertProductToCartItem = (
  product: Product,
  variantInfo?: Variant
): CartItem => {
  const defaultVariant = product.variants[0] as Variant

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    quantity: 1,
    price: variantInfo ? variantInfo.price : defaultVariant.price,
    countInStock: variantInfo
      ? variantInfo.countInStock
      : defaultVariant.countInStock,
    variantInfo: variantInfo || defaultVariant,
  }
}

export const authHeader = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return {}

  const user = JSON.parse(userInfo)
  if (!user.token) return {}

  return { Authorization: `Bearer ${user.token}` }
}
