import { motion } from "framer-motion"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { Store } from "../Store"
import { toast } from "react-toastify"
import type { Product } from "../types/Product"
import type { CartItem } from "../types/Cart"
import { convertProductToCartItem } from "../utils"
import AddToWishlistBtn from "@/components/AddToWishlistBtn"
import { useAddToCompareMutation, useRemoveByProductIdMutation } from '@/hooks/compareHooks'

function ProductItem({ product }: { product?: Product | null }) {
  const [imgError, setImgError] = useState(false)
  const [inCompare, setInCompare] = useState(false)
  const { state, dispatch } = useContext(Store)
  const { mutateAsync: addToCompare } = useAddToCompareMutation()
  const { mutateAsync: removeFromCompare } = useRemoveByProductIdMutation()

  if (!product) return null

  const {
    cart: { cartItems },
    userInfo,
  } = state

  const tier = (userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
  const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }
  const hasDiscount = rateMap[tier] > 0
  const displayPrice = hasDiscount
    ? Math.round((product.price ?? 0) * (1 - rateMap[tier]))
    : (product.price ?? 0)

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if ((product.countInStock ?? 0) < quantity) {
      toast.warn("Sản phẩm đã hết hàng")
      return
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    })
    toast.success("Đã thêm vào giỏ hàng")
  }

  // Hàm xử lý So Sánh
  const handleToggleCompare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() 

    if (!userInfo) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    try {
      if (inCompare) {
        setInCompare(false)
        await removeFromCompare(product._id!)
        toast.success('Đã xóa khỏi danh sách so sánh')
      } else {
        setInCompare(true)
        await addToCompare({ 
          productId: product._id!,
          variantIndex: 0
        })
        toast.success('Đã thêm vào danh sách so sánh')
      }
    } catch(err){
      setInCompare(!inCompare)
      console.error('Compare error:', err)
      toast.error('Lỗi khi cập nhật danh sách so sánh')
    }
  }

  const imageSrc = (() => {
    const img = product.variants?.[0]?.image || product.image
    if (!img || typeof img !== "string" || img.trim() === "") return null
    if (img.startsWith("http")) return img
    if (img.startsWith("/images/")) return img
    if (img.startsWith("/uploads/")) return `http://localhost:4000${img}`
    if (!img.startsWith("/")) return `http://localhost:4000/uploads/${img}`
    return `http://localhost:4000${img}`
  })()

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white border border-gray-100 shadow-md rounded-none overflow-hidden transition group flex flex-col" // 💡 Cấu trúc cột để căn chỉnh dưới cùng
    >
      <div className="relative">
        <Link to={`/product/${product.slug ?? ''}`} className="block">
          {/* Ảnh sản phẩm */}
          {imgError || !imageSrc ? (
            <div className="bg-gray-200 flex items-center justify-center h-[320px] text-gray-400 text-sm">
              No image
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={product.name ?? "product"}
              onError={() => setImgError(true)}
              className="w-full h-[320px] object-contain bg-white transition-opacity duration-300 group-hover:opacity-90"
            />
          )}
        </Link>
        
        {/* Nút ICON YÊU THÍCH */}
        {product._id && (
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                <div className="transition duration-300 opacity-80 hover:opacity-100 hover:scale-110">
                    <AddToWishlistBtn productId={product._id} />
                </div>
            </div>
        )}
      </div>

      {/* Thông tin sản phẩm & Nút hành động */}
      <div className="p-4 text-left bg-[#f5f5f5] flex flex-col flex-grow">
        
        {/* VÙNG 1: Tên & Đánh giá (Giãn nở) */}
        <div className="flex-grow">
          <Link to={`/product/${product.slug ?? ''}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-1 hover:underline line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
          </Link>
          {product.rating && (
            <p className="text-sm text-gray-500 mb-2">
              {product.rating} ⭐ ({product.numReviews ?? 0} reviews)
            </p>
          )}
        </div>

        {/* VÙNG 2: GIÁ */}
        <div className="mb-2">
          {hasDiscount ? (
            <div>
              <span className="text-gray-400 line-through mr-2 text-sm">
                {(product.price ?? 0).toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-black font-bold text-base">
                {displayPrice.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          ) : (
            <span className="font-semibold text-black text-base">
              {(product.price ?? 0).toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>


        {/* VÙNG 3: HÀNH ĐỘNG (Luôn nằm ở đáy và thẳng hàng) */}
        <div className="flex justify-start gap-3 items-center mt-2">
          
          {/* Nút + Thêm vào giỏ hàng */}
          {product._id && (
            <button
              onClick={handleToggleCompare}
              disabled={false} 
              className={`text-sm transition p-1 text-blue-500 ${
                inCompare 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-blue-500 hover:text-blue-900'
              }`}
            >
              + So sánh
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCartHandler(convertProductToCartItem(product))
            }}
            className="text-sm text-gray-700 hover:text-black transition p-1"
          >
            + Thêm vào giỏ hàng
          </button>
          
          {/* Nút + So sánh */}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductItem