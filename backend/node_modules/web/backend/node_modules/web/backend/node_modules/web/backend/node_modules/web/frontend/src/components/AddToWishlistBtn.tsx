import { useContext, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Store } from '@/Store'
import { useAddToWishlistMutation, useRemoveByProductIdMutation, useCheckWishlistMutation } from '@/hooks/wishlistHook'
import { toast } from 'react-toastify'

interface AddToWishlistBtnProps {
  productId: string
}

export default function AddToWishlistBtn({ productId }: AddToWishlistBtnProps) {
  const { state } = useContext(Store)
  const { userInfo } = state
  const [inWishlist, setInWishlist] = useState(false)

  const { mutateAsync: addToWishlist } = useAddToWishlistMutation()
  const { mutateAsync: removeFromWishlist } = useRemoveByProductIdMutation()
  const { mutateAsync: checkWishlist, isPending: isChecking } = useCheckWishlistMutation()

  useEffect(() => {
    if (userInfo && productId) {
      checkWishlist(productId)
        .then(res => setInWishlist(res.inWishlist))
        .catch(() => setInWishlist(false))
    }
  }, [productId, userInfo, checkWishlist])

  const handleToggleWishlist = async () => {
    if (!userInfo) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    try {
      if (inWishlist) {
        // ✅ Update state TRƯỚC khi call API
        setInWishlist(false)
        await removeFromWishlist(productId)
        toast.success('Đã xóa khỏi danh sách yêu thích')
      } else {
        // ✅ Update state TRƯỚC khi call API
        setInWishlist(true)
        await addToWishlist(productId)
        toast.success('Đã thêm vào danh sách yêu thích')
      }
    } catch {
      // ✅ Revert state nếu API lỗi
      setInWishlist(!inWishlist)
      toast.error('Lỗi')
    }
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isChecking}
      className={`p-2 rounded-full transition ${
        inWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
      title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
    </button>
  )
}