"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
exports.getRelatedProducts = getRelatedProducts;
// backend/src/routers/productRouter.ts
const express_1 = __importDefault(require("express")); // 💡 Đảm bảo Request, Response được import từ express
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const productModel_1 = require("../models/productModel");
const utils_1 = require("../utils");
exports.productRouter = express_1.default.Router();
// --- CONTROLLER cho SẢN PHẨM LIÊN QUAN ---
// 💡 Khai báo rõ ràng kiểu dữ liệu cho req và res
async function getRelatedProducts(req, res) {
    // req.query đã được TypeScript nhận ra vì Request được import
    const { category, exclude, limit } = req.query;
    if (!category) {
        // 💡 res.status(number).send(object) là cú pháp đúng
        res.status(400).send({ message: 'Category parameter is required' });
        return;
    }
    // 💡 Chuyển đổi limit sang số, sử dụng || 4 để đảm bảo giá trị mặc định
    const limitNum = parseInt(limit) || 4;
    try {
        // Tìm sản phẩm cùng category nhưng loại trừ sản phẩm hiện tại (dùng $ne: not equal)
        const products = await productModel_1.ProductModel.find({
            category: category,
            _id: { $ne: exclude }, // Loại trừ ID của sản phẩm hiện tại
            countInStock: { $gt: 0 } // Chỉ lấy sản phẩm còn hàng
        })
            .limit(limitNum)
            .sort({ rating: -1, createdAt: -1 }); // Ưu tiên các sản phẩm rating cao hơn
        // 💡 res.send(products) là cú pháp đúng
        res.send(products);
    }
    catch (error) {
        console.error("Error fetching related products:", error);
        // 💡 res.status(number).send(object) là cú pháp đúng
        res.status(500).send({ message: 'Failed to fetch related products.' });
    }
}
// ✅ GET /api/products/slug/:slug → public
exports.productRouter.get('/slug/:slug', (0, express_async_handler_1.default)(async (req, res) => {
    const product = await productModel_1.ProductModel.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json({ message: 'Product Not Found' }); // 💡 Cú pháp JSON
    }
}));
// ✅ GET /api/products → public with filters & sorting
exports.productRouter.get('/', (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { category, minPrice, maxPrice, rating, sortBy, inStock } = req.query;
        const filter = {};
        if (category) {
            if (category === 'Phone') {
                filter.$or = [
                    { category: 'Iphone' },
                    { category: 'Samsung' },
                    { category: 'Xiaomi' },
                    { category: 'Honor' },
                ];
            }
            else {
                filter.$or = [
                    { category: category },
                    { brand: category }
                ];
            }
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }
        if (inStock === 'true') {
            filter.countInStock = { $gt: 0 };
        }
        let sort = { createdAt: -1 };
        if (sortBy === 'price-low')
            sort = { price: 1 };
        else if (sortBy === 'price-high')
            sort = { price: -1 };
        else if (sortBy === 'rating')
            sort = { rating: -1 };
        const products = await productModel_1.ProductModel.find(filter).sort(sort);
        res.json(products);
    }
    catch (error) {
        console.error('Product API Error:', error);
        res.status(500).json({
            message: 'Error fetching products',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}));
// ✅ GET /api/products/admin → admin only
exports.productRouter.get('/admin', utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const products = await productModel_1.ProductModel.find();
    res.json(products);
}));
// ✅ POST /api/products → thêm sản phẩm mới
exports.productRouter.post('/', utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const { name, brand, category, description, variants } = req.body;
    const product = new productModel_1.ProductModel({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        brand,
        category,
        description,
        rating: 0,
        numReviews: 0,
        variants,
    });
    const created = await product.save();
    res.status(201).json(created);
}));
// ✅ PUT /api/admin/products/:id → sửa sản phẩm
exports.productRouter.put('/admin/products/:id', utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const product = await productModel_1.ProductModel.findById(req.params.id);
    if (product) {
        product.name = req.body.name || product.name;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        if (req.body.variants && Array.isArray(req.body.variants)) {
            product.variants = req.body.variants;
        }
        const updated = await product.save();
        res.json(updated);
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
}));
// 💡 ROUTE SẢN PHẨM LIÊN QUAN (Sử dụng Controller đã khai báo rõ kiểu)
exports.productRouter.get('/related', (0, express_async_handler_1.default)(getRelatedProducts));
// Thêm vào productRouter.ts
exports.productRouter.get('/by-rating', (0, express_async_handler_1.default)(async (req, res) => {
    const { limit = 10 } = req.query;
    const products = await productModel_1.ProductModel.find()
        .sort({ rating: -1, numReviews: -1 })
        .limit(Number(limit));
    res.json(products);
}));
//# sourceMappingURL=productRouter.js.map