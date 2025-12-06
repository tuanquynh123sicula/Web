import { useContext, useState } from 'react'
import { Store } from '@/Store'
import { useGetReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation, useHelpfulReviewMutation } from '@/hooks/reviewHook'
import { toast } from 'react-toastify'
import { Trash2, ThumbsUp } from 'lucide-react'
import LoadingBox from './LoadingBox'
import { AxiosError } from 'axios'
import { motion } from 'framer-motion'

interface ReviewSectionProps {
  productId: string
}

interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  helpful: number
  createdAt: string
}

interface ReviewData {
  reviews: Review[]
  avgRating: number
  totalReviews: number
  ratingDistribution: Record<string, number>
}

// Variants cho các phần tử xuất hiện
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { state } = useContext(Store)
  const { userInfo } = state

  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: reviewData, isLoading, refetch } = useGetReviewsQuery(productId)
  const { mutateAsync: createReview, isPending: isCreating } = useCreateReviewMutation()
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReviewMutation()
  const { mutateAsync: markHelpful } = useHelpfulReviewMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInfo) {
      toast.error('Vui lòng đăng nhập để review')
      return
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      await createReview({
        productId,
        rating,
        title,
        comment,
      })
      toast.success('Review thành công!')
      setTitle('')
      setComment('')
      setRating(5)
      setShowForm(false)
      refetch()
    } catch (err) {
      const error = err as AxiosError<{ error: string }>
      toast.error(error.response?.data?.error || 'Lỗi khi tạo review')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Xác nhận xóa review?')) return

    try {
      await deleteReview(reviewId)
      toast.success('Xóa review thành công')
      refetch()
    } catch (err) {
      const error = err as AxiosError<{ error: string }>
      toast.error(error.response?.data?.error || 'Lỗi khi xóa review')
    }
  }
  
  const handleHelpful = async (reviewId: string) => {
      try {
          await markHelpful(reviewId)
          refetch()
      } catch (err) {
          const error = err as AxiosError<{ error: string }>
          toast.error(error.response?.data?.error || 'Lỗi khi đánh dấu hữu ích')
      }
  }


  if (isLoading) return <LoadingBox />

  const { reviews = [], avgRating = 0, totalReviews = 0, ratingDistribution = {} } = (reviewData as ReviewData) || {}

  return (
    <div className="mt-8 border-t pt-6">
      
      {/* Rating Summary */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 p-4 border border-gray-200 bg-gray-50 shadow-inner"
      >
        <motion.div 
          variants={itemVariants} 
          className="col-span-1 flex flex-col items-center justify-center p-4"
        >
          <div className="text-6xl font-extrabrabold text-black">{Number(avgRating).toFixed(1)}</div>
          <div className="flex gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(Number(avgRating)) ? 'text-yellow-500' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-700 font-medium">Từ {totalReviews} đánh giá</p>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div 
          variants={itemVariants} 
          className="col-span-2 space-y-3 p-4 border-l border-gray-200 md:pl-8"
        >
          <h3 className='font-semibold text-gray-800 mb-2'>Phân bố đánh giá</h3>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = ratingDistribution[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 transition duration-300 hover:bg-gray-100 p-1 -m-1">
                <span className="text-sm w-12 flex items-center gap-1 font-medium">{stars} <span className='text-yellow-500'>★</span></span>
                <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-yellow-500 h-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-700 w-10 text-right font-bold">{count}</span>
              </div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Write Review Button */}
      {!showForm ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => setShowForm(true)}
          className="mb-6 px-8 py-3 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition duration-300 font-semibold shadow-md rounded-md"
        >
          VIẾT ĐÁNH GIÁ CỦA BẠN
        </motion.button>
      ) : (
        <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit} 
            className="mb-8 p-6 border border-gray-300 bg-white shadow-lg rounded-md"
        >
          <h3 className='text-xl font-bold mb-4 border-b pb-2'>Gửi đánh giá mới</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Đánh giá (sao)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition duration-200 transform hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ví dụ: Sản phẩm rất tốt, giao hàng nhanh chóng"
              className="w-full border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-200 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Nhận xét chi tiết</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              rows={4}
              className="w-full border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-200 rounded-md"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 font-semibold shadow-sm rounded-md"
            >
              {isCreating ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition duration-200 font-semibold shadow-sm rounded-md"
            >
              Hủy
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-4 pt-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8 border border-dashed rounded-md">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
        ) : (
          reviews.map((review: Review, index) => (
            <motion.div 
                key={review._id} 
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={index} // Sử dụng custom để tạo delay mượt mà
                className="p-4 border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md rounded-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-bold text-lg mb-1">{review.title}</p>
                  <p className="text-sm text-gray-600">
                    {review.userName} • {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {userInfo?._id === review.userId && (
                  <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(review._id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 transition disabled:opacity-50 p-2"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                )}
              </div>
              <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => handleHelpful(review._id)}
                className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1 transition p-1 border border-transparent hover:border-gray-300 rounded-md"
              >
                <ThumbsUp size={14} />
                Hữu ích ({review.helpful})
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}