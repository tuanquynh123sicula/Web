// backend/src/routers/productRouter.ts
import express from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'
import { isAuth, isAdmin } from '../utils'

export const productRouter = express.Router()

// GET /api/products → public
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

// GET /api/products/slug/:slug → public
productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    if (product) res.json(product)
    else res.status(404).json({ message: 'Product Not Found' })
  })
)

// ✅ GET /api/products/admin → admin only
productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

// POST / → thêm sản phẩm mới
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const product = new ProductModel({
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      image: req.body.image,
      price: req.body.price,
      category: req.body.category, 
      brand: req.body.brand,      
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    })
    const created = await product.save()
    res.status(201).json(created)
  })
)


// PUT /api/admin/products/:id → sửa sản phẩm
productRouter.put(
  '/admin/products/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if (product) {
      product.name = req.body.name || product.name
      product.price = req.body.price || product.price
      product.countInStock = req.body.countInStock || product.countInStock
      product.description = req.body.description || product.description
      const updated = await product.save()
      res.json(updated)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  })
)

