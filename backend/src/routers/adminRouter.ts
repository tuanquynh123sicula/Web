// backend/src/routers/adminRouter.ts
import express from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth, isAdmin } from '../utils'
import { ProductModel } from '../models/productModel'
import { OrderModel } from '../models/orderModel'
import { UserModel } from '../models/userModel'
import { BlogModel } from '../models/blogModel'
import multer from 'multer'

export const adminRouter = express.Router()

// === PRODUCTS ===
adminRouter.get(
  '/products',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

adminRouter.get(
  '/products/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  })
)

adminRouter.post(
  '/products',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const newProduct = new ProductModel(req.body)
    const created = await newProduct.save()
    res.status(201).json(created)
  })
)

adminRouter.put(
  '/products/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(updated)
  })
)

adminRouter.delete(
  '/products/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json({ message: 'Deleted successfully' })
  })
)

// === ORDERS ===
adminRouter.get(
  '/orders',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await OrderModel.find().populate('user', 'name email')
    res.json(orders)
  })
)

// === USERS ===
adminRouter.get(
  '/users',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const users = await UserModel.find()
    res.json(users)
  })
)

adminRouter.delete(
  '/users/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const deleted = await UserModel.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ message: 'User deleted' })
  })
)

adminRouter.patch(
  '/orders/:id/status',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      res.status(404).send({ message: 'Order not found' })
      return
    }
    const { status } = req.body
    order.status = status
    if (status === 'delivered') order.isDelivered = true
    await order.save()
    res.send(order)
  })
)

adminRouter.patch(
  '/users/:id/role',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    if (typeof req.body.isAdmin === 'boolean') user.isAdmin = req.body.isAdmin
    if (req.body.tier) user.tier = req.body.tier
    await user.save()
    res.json(user)
  })
)

// Lấy đơn hàng theo user
adminRouter.get(
  '/users/:id/orders',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await OrderModel.find({ user: req.params.id })
    res.json(orders)
  })
)

// === BLOGS ===
adminRouter.get(
  '/blogs',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find().sort({ createdAt: -1 })
    res.json(blogs)
  })
)

adminRouter.get(
  '/blogs/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const blog = await BlogModel.findById(req.params.id)
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' })
      return
    }
    res.json(blog)
  })
)

adminRouter.post(
  '/blogs',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const newBlog = new BlogModel(req.body)
    const created = await newBlog.save()
    res.status(201).json(created)
  })
)

adminRouter.put(
  '/blogs/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const updated = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) {
      res.status(404).json({ message: 'Blog not found' })
      return
    }
    res.json(updated)
  })
)

adminRouter.delete(
  '/blogs/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res): Promise<void> => {
    const deleted = await BlogModel.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404).json({ message: 'Blog not found' })
      return
    }
    res.json({ message: 'Blog deleted successfully' })
  })
)

// Public route - Lấy blogs (không cần auth)
adminRouter.get(
  '/blogs/public/all',
  asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find().sort({ createdAt: -1 })
    res.json(blogs)
  })
)

// Public route - Lấy blog detail
adminRouter.get(
  '/blogs/public/:id',
  asyncHandler(async (req, res): Promise<void> => {
    const blog = await BlogModel.findById(req.params.id)
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' })
      return
    }
    res.json(blog)
  })
)

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

adminRouter.post(
  '/upload',
  isAuth,
  isAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }
    res.json({ image: `/uploads/${req.file.filename}` })
  })
)

export default adminRouter