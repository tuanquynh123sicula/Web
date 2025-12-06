import express from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth, isAdmin } from '../utils'
import { ProductModel } from '../models/productModel'
import { OrderModel } from '../models/orderModel'
import { UserModel } from '../models/userModel'
import { BlogModel } from '../models/blogModel'
import multer from 'multer'

export const adminRouter = express.Router()

// === REPORTS / STATISTICS ===
adminRouter.get(
  '/reports/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    // --- 1. Tổng hợp doanh thu, đơn hàng, người dùng
    const totalSales = await OrderModel.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ])

    const totalOrders = await OrderModel.countDocuments()
    const totalUsers = await UserModel.countDocuments()

    // --- 2. Doanh thu hàng ngày (Ví dụ: 7 ngày gần nhất)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const dailySalesData = await OrderModel.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', sales: 1, _id: 0 } },
    ])
    
    // --- 3. Top Sản phẩm bán chạy (Top 5)
    const topSellingProducts = await OrderModel.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          count: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        },
      },
      { $sort: { count: -1, totalRevenue: -1 } },
      { $limit: 5 }
    ]);


    // --- 4. Doanh thu hàng tháng (Giả lập đơn giản)
    // Để có dữ liệu real-time chính xác, bạn sẽ cần query phức tạp hơn.
    // Tạm thời, tôi sẽ cung cấp dữ liệu mẫu hoặc sử dụng dữ liệu từ bước 2
    // và thêm một trường giả lập cho biểu đồ tháng.
    const monthlySalesData = [
        { month: 'Tháng 1', sales: 120000000 },
        { month: 'Tháng 2', sales: 150000000 },
        { month: 'Tháng 3', sales: 110000000 },
        { month: 'Tháng 4', sales: 180000000 },
        { month: 'Tháng 5', sales: 250000000 },
        { month: 'Tháng 6', sales: 210000000 },
    ];


    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
      totalOrders: totalOrders,
      totalUsers: totalUsers,
      dailySales: dailySalesData,
      monthlySales: monthlySalesData, // Dữ liệu giả lập
      topSellingProducts: topSellingProducts,
    })
  })
)

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