import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ReviewModel } from '../models/reviewModel'
import { ProductModel } from '../models/productModel'
import { isAuth } from '../utils'

export const reviewRouter = express.Router()

// ... rest of code

const updateProductRating = async (productId: string) => {
  try {
    const reviews = await ReviewModel.find({ productId })
    
    console.log(`Found ${reviews.length} reviews for product ${productId}`)

    if (reviews.length === 0) {
      await ProductModel.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0,
      })
      return
    }

    const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    
    console.log(`Updating product ${productId}: avgRating=${avgRating}, count=${reviews.length}`)

    await ProductModel.findByIdAndUpdate(
      productId,
      {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: reviews.length,
      },
      { new: true }
    )
  } catch (error) {
    console.error('Error updating product rating:', error)
  }
}

// ✅ GET reviews của 1 sản phẩm
reviewRouter.get(
  '/:productId',
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    
    const reviews = await ReviewModel.find({ productId })
      .sort({ createdAt: -1 })

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0'

    res.json({
      reviews,
      avgRating,
      totalReviews: reviews.length,
      ratingDistribution: {
        '5': reviews.filter((r: any) => r.rating === 5).length,
        '4': reviews.filter((r: any) => r.rating === 4).length,
        '3': reviews.filter((r: any) => r.rating === 3).length,
        '2': reviews.filter((r: any) => r.rating === 2).length,
        '1': reviews.filter((r: any) => r.rating === 1).length,
      }
    })
  })
)

// ✅ POST review mới
reviewRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId, rating, title, comment } = req.body
    const user = (req as any).user

    if (!productId || !rating || !title || !comment) {
      res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating phải từ 1-5' })
      return
    }

    const product = await ProductModel.findById(productId)
    if (!product) {
      res.status(404).json({ error: 'Sản phẩm không tồn tại' })
      return
    }

    const existingReview = await ReviewModel.findOne({
      productId,
      userId: user._id,
    })

    if (existingReview) {
      res.status(400).json({ error: 'Bạn đã review sản phẩm này rồi' })
      return
    }

    const newReview = new ReviewModel({
      productId,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      rating,
      title,
      comment,
      isVerifiedPurchase: false,
    })

    const savedReview = await newReview.save()
    console.log('Review saved:', savedReview._id)

    await updateProductRating(productId)

    res.status(201).json(savedReview)
  })
)

// ✅ DELETE review
reviewRouter.delete(
  '/:reviewId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params
    const user = (req as any).user

    const review = await ReviewModel.findById(reviewId)
    if (!review) {
      res.status(404).json({ error: 'Không tìm thấy review' })
      return
    }

    if (review.userId !== user._id && !user.isAdmin) {
      res.status(403).json({ error: 'Không có quyền xóa review này' })
      return
    }

    const productId = review.productId

    await ReviewModel.findByIdAndDelete(reviewId)

    await updateProductRating(productId)

    res.json({ message: 'Xóa review thành công' })
  })
)

// ✅ UPDATE helpful count
reviewRouter.patch(
  '/:reviewId/helpful',
  asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    )
    res.json(review)
  })
)