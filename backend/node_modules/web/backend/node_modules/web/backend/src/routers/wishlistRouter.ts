import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { WishlistModel } from '../models/wishlistModel'
import { ProductModel } from '../models/productModel'
import { isAuth } from '../utils'

export const wishlistRouter = express.Router()

// ✅ GET wishlist của user
wishlistRouter.get(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user

    const wishlist = await WishlistModel.find({ userId: user._id })
      .sort({ createdAt: -1 })

    res.json({
      wishlist,
      count: wishlist.length,
    })
  })
)

// ✅ POST - Thêm sản phẩm vào wishlist
wishlistRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.body
    const user = (req as any).user

    if (!productId) {
      res.status(400).json({ error: 'productId không hợp lệ' })
      return
    }

    // Kiểm tra product tồn tại
    const product = await ProductModel.findById(productId)
    if (!product) {
      res.status(404).json({ error: 'Sản phẩm không tồn tại' })
      return
    }

    // Kiểm tra đã có trong wishlist chưa
    const existing = await WishlistModel.findOne({
      userId: user._id,
      productId,
    })

    if (existing) {
      res.status(400).json({ error: 'Sản phẩm đã có trong danh sách yêu thích' })
      return
    }

    // Thêm vào wishlist
    const wishlistItem = new WishlistModel({
      userId: user._id,
      productId,
      productName: product.name,
      productImage: product.image,
      productPrice: product.price,
      productSlug: product.slug,
    })

    const savedItem = await wishlistItem.save()
    res.status(201).json(savedItem)
  })
)

// ✅ DELETE - Xóa sản phẩm khỏi wishlist
wishlistRouter.delete(
  '/:wishlistId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { wishlistId } = req.params
    const user = (req as any).user

    const wishlistItem = await WishlistModel.findById(wishlistId)
    if (!wishlistItem) {
      res.status(404).json({ error: 'Không tìm thấy item' })
      return
    }

    // Kiểm tra quyền
    if (wishlistItem.userId !== user._id) {
      res.status(403).json({ error: 'Không có quyền xóa' })
      return
    }

    await WishlistModel.findByIdAndDelete(wishlistId)
    res.json({ message: 'Xóa khỏi wishlist thành công' })
  })
)

// ✅ DELETE - Xóa theo productId
wishlistRouter.delete(
  '/product/:productId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const user = (req as any).user

    await WishlistModel.deleteOne({
      userId: user._id,
      productId,
    })

    res.json({ message: 'Xóa khỏi wishlist thành công' })
  })
)

// ✅ POST - Check xem product có trong wishlist không
wishlistRouter.post(
  '/check/:productId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const user = (req as any).user

    const item = await WishlistModel.findOne({
      userId: user._id,
      productId,
    })

    res.json({
      inWishlist: !!item,
      wishlistId: item?._id,
    })
  })
)