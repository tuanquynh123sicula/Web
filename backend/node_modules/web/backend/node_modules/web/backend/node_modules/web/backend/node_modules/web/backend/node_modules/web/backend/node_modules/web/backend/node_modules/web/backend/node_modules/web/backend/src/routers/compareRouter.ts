import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CompareModel } from '../models/compareModel'
import { ProductModel } from '../models/productModel'
import { isAuth } from '../utils'

export const compareRouter = express.Router()

// ✅ GET compare list của user
compareRouter.get(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user

    const compareList = await CompareModel.find({ userId: user._id })
      .sort({ createdAt: -1 })

    res.json({
      compareList,
      count: compareList.length,
    })
  })
)

// ✅ POST - Thêm sản phẩm vào so sánh (có variant)
compareRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId, variantIndex } = req.body
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

    // Kiểm tra đã có trong compare chưa
    const existing = await CompareModel.findOne({
      userId: user._id,
      productId,
    })

    if (existing) {
      res.status(400).json({ error: 'Sản phẩm đã có trong danh sách so sánh' })
      return
    }

    // Giới hạn 5 sản phẩm so sánh
    const compareCount = await CompareModel.countDocuments({ userId: user._id })
    if (compareCount >= 5) {
      res.status(400).json({ error: 'Chỉ có thể so sánh tối đa 5 sản phẩm' })
      return
    }

    // ✅ Lấy variant được chọn (default index 0 nếu không chọn)
    const selectedVarIdx = variantIndex ?? 0
    const selectedVariant = product.variants?.[selectedVarIdx]

    // Thêm vào compare
    const compareItem = new CompareModel({
      userId: user._id,
      productId,
      productName: product.name,
      productImage: product.image,
      productPrice: product.price,
      productSlug: product.slug,
      productBrand: product.brand,
      productCategory: product.category,
      productRating: product.rating,
      productNumReviews: product.numReviews,
      // ✅ Thêm variant info
      selectedVariant: selectedVariant || {
        color: product.variants?.[0]?.color || 'N/A',
        storage: product.variants?.[0]?.storage || 'N/A',
        ram: product.variants?.[0]?.ram || 'N/A',
        price: product.variants?.[0]?.price || product.price,
        countInStock: product.variants?.[0]?.countInStock || product.countInStock,
        image: product.variants?.[0]?.image || product.image,
      },
      allVariants: product.variants || [],
    })

    const savedItem = await compareItem.save()
    res.status(201).json(savedItem)
  })
)

// ✅ DELETE - Xóa sản phẩm khỏi so sánh
compareRouter.delete(
  '/:compareId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { compareId } = req.params
    const user = (req as any).user

    const compareItem = await CompareModel.findById(compareId)
    if (!compareItem) {
      res.status(404).json({ error: 'Không tìm thấy item' })
      return
    }

    if (compareItem.userId !== user._id) {
      res.status(403).json({ error: 'Không có quyền xóa' })
      return
    }

    await CompareModel.findByIdAndDelete(compareId)
    res.json({ message: 'Xóa khỏi danh sách so sánh thành công' })
  })
)

// ✅ DELETE - Xóa theo productId
compareRouter.delete(
  '/product/:productId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const user = (req as any).user

    await CompareModel.deleteOne({
      userId: user._id,
      productId,
    })

    res.json({ message: 'Xóa khỏi danh sách so sánh thành công' })
  })
)

// ✅ PUT - Cập nhật variant cho item so sánh
compareRouter.put(
  '/:compareId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { compareId } = req.params
    const { variantIndex } = req.body
    const user = (req as any).user

    const compareItem = await CompareModel.findById(compareId)
    if (!compareItem) {
      res.status(404).json({ error: 'Không tìm thấy item' })
      return
    }

    if (compareItem.userId !== user._id) {
      res.status(403).json({ error: 'Không có quyền cập nhật' })
      return
    }

    // Lấy product để update variant
    const product = await ProductModel.findById(compareItem.productId)
    if (!product) {
      res.status(404).json({ error: 'Sản phẩm không tồn tại' })
      return
    }

    const newVariant = product.variants?.[variantIndex] || product.variants?.[0]

    const updated = await CompareModel.findByIdAndUpdate(
      compareId,
      {
        selectedVariant: newVariant,
      },
      { new: true }
    )

    res.json(updated)
  })
)

// ✅ POST - Check xem product có trong compare không
compareRouter.post(
  '/check/:productId',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const user = (req as any).user

    const item = await CompareModel.findOne({
      userId: user._id,
      productId,
    })

    res.json({
      inCompare: !!item,
      compareId: item?._id,
    })
  })
)