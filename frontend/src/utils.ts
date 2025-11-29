import type { ApiError } from './types/ApiError'
import type { Product, Variant as ProductVariant } from './types/Product'


export const getError = (error: ApiError) => {
     return error.response && error.response.data.message
       ? error.response.data.message
       : error.message
   }
   
export const convertProductToCartItem = (
  product: Product,
  selectedVariant?: ProductVariant
) => {
  // ✅ FIX: Kiểm tra selectedVariant trước
  const variant = selectedVariant || product.variants?.[0]
  
  return {
    _id: product._id!,
    name: product.name,
    slug: product.slug,
    image: variant?.image || product.image,
    price: variant?.price ?? product.price ?? 0, // ✅ Fallback to product.price
    countInStock: variant?.countInStock ?? product.countInStock ?? 0,
    quantity: 1,
  }
}

export const authHeader = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return {}

  const user = JSON.parse(userInfo)
  if (!user.token) return {}

  return { Authorization: `Bearer ${user.token}` }
}
