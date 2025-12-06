import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'
import { isAuth, isAdmin } from '../utils'

export const productRouter = express.Router()

// --- CONTROLLER cho SẢN PHẨM LIÊN QUAN ---
export async function getRelatedProducts(req: Request, res: Response) {
    const { category, exclude, limit } = req.query;

    if (!category) {
        res.status(400).send({ message: 'Category parameter is required' });
        return;
    }

    const limitNum = parseInt(limit as string) || 4;

    try {
        const products = await ProductModel.find({
            category: category,
            _id: { $ne: exclude },
            countInStock: { $gt: 0 }
        })
        .limit(limitNum)
        .sort({ rating: -1, createdAt: -1 })

        res.send(products); 
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).send({ message: 'Failed to fetch related products.' });
    }
}

// ✅ GET /api/products → public with filters & sorting
// 💡 Đặt route generic TRƯỚC routes specific
productRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        try {
            const { category, minPrice, maxPrice, rating, sortBy, inStock } = req.query

            const filter: any = {}

            if (category) {
                if (category === 'Phone') {
                    filter.$or = [
                        { category: 'Iphone'},
                        { category: 'Samsung'},
                        { category: 'Xiaomi'},
                        { category: 'Honor'},
                    ]
                } else {
                    filter.$or = [
                        { category: category },
                        { brand: category }
                    ]
                }
            }

            if (minPrice || maxPrice) {
                filter.price = {}
                if (minPrice) filter.price.$gte = Number(minPrice)
                if (maxPrice) filter.price.$lte = Number(maxPrice)
            }

            if (rating) {
                filter.rating = { $gte: Number(rating) }
            }

            if (inStock === 'true') {
                filter.countInStock = { $gt: 0 }
            }

            let sort: any = { createdAt: -1 }
            if (sortBy === 'price-low') sort = { price: 1 }
            else if (sortBy === 'price-high') sort = { price: -1 }
            else if (sortBy === 'rating') sort = { rating: -1 }

            const products = await ProductModel.find(filter).sort(sort)

            res.json(products)
        } catch (error) {
            console.error('Product API Error:', error)
            res.status(500).json({ 
                message: 'Error fetching products', 
                error: error instanceof Error ? error.message : String(error)
            })
        }
    })
)

// ✅ GET /api/products/slug/:slug → public
productRouter.get(
    '/slug/:slug',
    asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductModel.findOne({ slug: req.params.slug })
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product Not Found' })
        }
    })
)

// ✅ GET /api/products/related → public
productRouter.get(
    '/related',
    asyncHandler(getRelatedProducts)
)

// ✅ GET /api/products/by-rating → public
productRouter.get(
    '/by-rating',
    asyncHandler(async (req: Request, res: Response) => {
        const { limit = 10 } = req.query

        const products = await ProductModel.find()
            .sort({ rating: -1, numReviews: -1 })
            .limit(Number(limit))

        res.json(products)
    })
)

// ✅ GET /api/products/admin → admin only (THÊM ROUTE NÀY)
productRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        console.log('Fetching all products for admin')
        const products = await ProductModel.find()
        console.log('Found products:', products.length)
        res.json(products)
    })
)

// ✅ POST /api/products → create product (admin only)
productRouter.post(
    '/',
    isAuth,
    isAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { 
            name, 
            brand, 
            category, 
            description, 
            price,
            countInStock,
            image,
            rating,
            numReviews,
            variants 
        } = req.body

        // ✅ Validation
        if (!name || !brand || !category || !image) {
            res.status(400).json({ 
                message: 'Missing required fields: name, brand, category, image' 
            })
            return
        }

        const product = new ProductModel({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            brand,
            category,
            description,
            price: Number(price) || 0,
            countInStock: Number(countInStock) || 0,
            image,
            rating: Number(rating) || 0,
            numReviews: Number(numReviews) || 0,
            variants: variants || [],
        })

        console.log('Creating product:', product)
        const created = await product.save()
        console.log('Product created:', created)
        res.status(201).json(created)
    })
)

// ✅ GET /api/products/:id → get single product
productRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        console.log('Fetching product by ID:', req.params.id)
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    })
)

// ✅ PUT /api/products/:id → update product (admin only)
productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        console.log('Updating product:', req.params.id)
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            product.name = req.body.name || product.name
            product.brand = req.body.brand || product.brand
            product.category = req.body.category || product.category
            product.description = req.body.description || product.description
            product.price = req.body.price !== undefined ? Number(req.body.price) : product.price
            product.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : product.countInStock
            product.image = req.body.image || product.image
            product.rating = req.body.rating !== undefined ? Number(req.body.rating) : product.rating
            product.numReviews = req.body.numReviews !== undefined ? Number(req.body.numReviews) : product.numReviews

            if (req.body.variants && Array.isArray(req.body.variants)) {
                product.variants = req.body.variants
            }

            const updated = await product.save()
            console.log('Product updated:', updated)
            res.json(updated)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    })
)

// ✅ DELETE /api/products/:id → delete product (admin only)
productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        console.log('Deleting product:', req.params.id)
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        if (product) {
            res.json({ message: 'Product deleted', product })
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    })
)