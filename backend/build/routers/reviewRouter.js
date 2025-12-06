"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const reviewModel_1 = require("../models/reviewModel");
const productModel_1 = require("../models/productModel");
const utils_1 = require("../utils");
exports.reviewRouter = express_1.default.Router();
// ... rest of code
const updateProductRating = async (productId) => {
    try {
        const reviews = await reviewModel_1.ReviewModel.find({ productId });
        console.log(`Found ${reviews.length} reviews for product ${productId}`);
        if (reviews.length === 0) {
            await productModel_1.ProductModel.findByIdAndUpdate(productId, {
                rating: 0,
                numReviews: 0,
            });
            return;
        }
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        console.log(`Updating product ${productId}: avgRating=${avgRating}, count=${reviews.length}`);
        await productModel_1.ProductModel.findByIdAndUpdate(productId, {
            rating: parseFloat(avgRating.toFixed(1)),
            numReviews: reviews.length,
        }, { new: true });
    }
    catch (error) {
        console.error('Error updating product rating:', error);
    }
};
// ✅ GET reviews của 1 sản phẩm
exports.reviewRouter.get('/:productId', (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const reviews = await reviewModel_1.ReviewModel.find({ productId })
        .sort({ createdAt: -1 });
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0';
    res.json({
        reviews,
        avgRating,
        totalReviews: reviews.length,
        ratingDistribution: {
            '5': reviews.filter((r) => r.rating === 5).length,
            '4': reviews.filter((r) => r.rating === 4).length,
            '3': reviews.filter((r) => r.rating === 3).length,
            '2': reviews.filter((r) => r.rating === 2).length,
            '1': reviews.filter((r) => r.rating === 1).length,
        }
    });
}));
// ✅ POST review mới
exports.reviewRouter.post('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, rating, title, comment } = req.body;
    const user = req.user;
    if (!productId || !rating || !title || !comment) {
        res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        return;
    }
    if (rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating phải từ 1-5' });
        return;
    }
    const product = await productModel_1.ProductModel.findById(productId);
    if (!product) {
        res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        return;
    }
    const existingReview = await reviewModel_1.ReviewModel.findOne({
        productId,
        userId: user._id,
    });
    if (existingReview) {
        res.status(400).json({ error: 'Bạn đã review sản phẩm này rồi' });
        return;
    }
    const newReview = new reviewModel_1.ReviewModel({
        productId,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        rating,
        title,
        comment,
        isVerifiedPurchase: false,
    });
    const savedReview = await newReview.save();
    console.log('Review saved:', savedReview._id);
    await updateProductRating(productId);
    res.status(201).json(savedReview);
}));
// ✅ DELETE review
exports.reviewRouter.delete('/:reviewId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { reviewId } = req.params;
    const user = req.user;
    const review = await reviewModel_1.ReviewModel.findById(reviewId);
    if (!review) {
        res.status(404).json({ error: 'Không tìm thấy review' });
        return;
    }
    if (review.userId !== user._id && !user.isAdmin) {
        res.status(403).json({ error: 'Không có quyền xóa review này' });
        return;
    }
    const productId = review.productId;
    await reviewModel_1.ReviewModel.findByIdAndDelete(reviewId);
    await updateProductRating(productId);
    res.json({ message: 'Xóa review thành công' });
}));
// ✅ UPDATE helpful count
exports.reviewRouter.patch('/:reviewId/helpful', (0, express_async_handler_1.default)(async (req, res) => {
    const { reviewId } = req.params;
    const review = await reviewModel_1.ReviewModel.findByIdAndUpdate(reviewId, { $inc: { helpful: 1 } }, { new: true });
    res.json(review);
}));
//# sourceMappingURL=reviewRouter.js.map