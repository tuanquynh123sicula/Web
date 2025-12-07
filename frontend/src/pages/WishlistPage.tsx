import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Store } from '@/Store'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/hooks/wishlistHook'
import { toast } from 'react-toastify'
import LoadingBox from '@/components/LoadingBox'
import MessageBox from '@/components/MessageBox'

interface WishlistItem {
  _id: string
  userId: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  productSlug: string
  productCountInStock?: number
  createdAt: string
}

interface WishlistResponse {
  wishlist: WishlistItem[]
  count: number
}

// Hàm xử lý đường dẫn ảnh (giữ nguyên)
 const getImageUrl = (src?: string) => {
        if (!src) return '/images/placeholder.png'
        if (src.startsWith('http')) return src
        
        // Để nguyên đường dẫn /images/xxx, React sẽ tìm trong public
        if (src.startsWith('/images/')) return src
        
        if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
        if (src.startsWith('/')) return src
        return `/images/${src}`
    }

export default function WishlistPage() {
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()

  const { data: wishlistData, isLoading } = useGetWishlistQuery()
  const { mutateAsync: removeFromWishlist, isPending } = useRemoveFromWishlistMutation()

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center pl-56 pr-6">
        <MessageBox variant="danger">
          Vui lòng đăng nhập để xem danh sách yêu thích
        </MessageBox>
      </div>
    )
  }

  const handleRemove = async (wishlistId: string) => {
    try {
      await removeFromWishlist(wishlistId)
      toast.success('Đã xóa khỏi danh sách yêu thích')
    } catch {
      toast.error('Lỗi khi xóa')
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _id: item.productId,
        name: item.productName,
        image: item.productImage,
        price: item.productPrice,
        slug: item.productSlug,
        countInStock: item.productCountInStock || 0,
        quantity: 1,
      },
    })
    toast.success('Đã thêm vào giỏ hàng')
    navigate('/cart') // Chuyển hướng sau khi thêm thành công
  }

  if (isLoading) return <LoadingBox />

  const typedData = wishlistData as WishlistResponse | undefined
  const wishlist = typedData?.wishlist || []

  return (
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <Helmet>
        <title>Danh sách yêu thích</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-4 bg-white shadow-lg border border-gray-200">
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300 flex items-center gap-2">
          <Heart size={32} className="text-red-600" />
          DANH SÁCH YÊU THÍCH ({wishlist.length})
        </h1>

        {/* TRƯỜNG HỢP RỖNG */}
        {wishlist.length === 0 ? (
          <div className="bg-gray-50 p-12 text-center border border-dashed border-gray-400 transition duration-300 hover:shadow-inner">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-6 font-medium">
              Danh sách yêu thích của bạn đang trống.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-black text-white border border-black hover:bg-gray-800 transition duration-300 font-semibold shadow-md"
            >
              BẮT ĐẦU MUA SẮM
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item: WishlistItem) => (
              <div 
                key={item._id} 
                className="bg-white overflow-hidden shadow-md border border-gray-200 transition duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-50 h-56">
                  <img
                    src={getImageUrl(item.productImage)}
                    alt={item.productName}
                    className="w-full h-full object-contain transition duration-500 cursor-pointer"
                    onClick={() => navigate(`/product/${item.productSlug}`)}
                  />
                </div>

                {/* Product Info & Actions */}
                <div className="p-4 flex flex-col justify-between h-[calc(100%-14rem)]">
                  <div>
                    <h3
                      className="text-base font-bold text-gray-900 cursor-pointer hover:text-black hover:underline transition line-clamp-2 mb-2"
                      onClick={() => navigate(`/product/${item.productSlug}`)}
                    >
                      {item.productName}
                    </h3>

                    <div className="text-xl font-extrabold text-black mb-4">
                      {item.productPrice.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                    className="text-sm text-gray-700 hover:text-black hover:scale-105 transition p-1 font-bold"
                          >
                            + Thêm vào giỏ hàng     
                        </button>
                    
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={isPending}
                      className="text-sm text-red-500 hover:text-red-700 hover:scale-105 transition p-1 font-bold"
                        >
                          
                          - Xóa
                        </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}