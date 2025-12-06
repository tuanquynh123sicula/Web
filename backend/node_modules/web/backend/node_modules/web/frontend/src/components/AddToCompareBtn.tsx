import { useContext, useEffect, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Store } from '@/Store'
import { useAddToCompareMutation, useRemoveByProductIdMutation, useCheckCompareMutation } from '@/hooks/compareHooks'
import { toast } from 'react-toastify'

interface AddToCompareBtnProps {
  productId: string
}

export default function AddToCompareBtn({ productId }: AddToCompareBtnProps) {
  const { state } = useContext(Store)
  const { userInfo } = state
  const [inCompare, setInCompare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: addToCompare } = useAddToCompareMutation()
  const { mutateAsync: removeFromCompare } = useRemoveByProductIdMutation()
  const { mutateAsync: checkCompare } = useCheckCompareMutation()

  // ✅ Check compare status khi mount
  useEffect(() => {
    if (productId && userInfo) {
      checkCompare(productId)
        .then(res => setInCompare(res.inCompare))
        .catch(err => {
          console.error('Check compare error:', err)
          setInCompare(false)
        })
    }
  }, [productId, userInfo, checkCompare])

  const handleToggleCompare = async () => {
    if (!userInfo) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    setIsLoading(true)
    try {
      if (inCompare) {
        await removeFromCompare(productId)
        setInCompare(false)
        toast.success('Đã xóa khỏi danh sách so sánh')
      } else {
        await addToCompare({
          productId,
          variantIndex: 0,
        })
        setInCompare(true)
        toast.success('Đã thêm vào danh sách so sánh')
      }
    } catch  {
      console.error('Compare error:')
      setInCompare(!inCompare)
      toast.error('Lỗi khi cập nhật danh sách so sánh')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleCompare}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition-all duration-300 font-semibold text-sm ${
        inCompare
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={inCompare ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
    >
      <ArrowLeftRight size={18} />
    </button>
  )
}