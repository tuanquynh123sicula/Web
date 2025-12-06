"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const wishlistModel_1 = require("../models/wishlistModel");
const productModel_1 = require("../models/productModel");
const utils_1 = require("../utils");
exports.wishlistRouter = express_1.default.Router();
// ✅ GET wishlist của user
exports.wishlistRouter.get('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    const wishlist = await wishlistModel_1.WishlistModel.find({ userId: user._id })
        .sort({ createdAt: -1 });
    res.json({
        wishlist,
        count: wishlist.length,
    });
}));
// ✅ POST - Thêm sản phẩm vào wishlist
exports.wishlistRouter.post('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
        res.status(400).json({ error: 'productId không hợp lệ' });
        return;
    }
    // Kiểm tra product tồn tại
    const product = await productModel_1.ProductModel.findById(productId);
    if (!product) {
        res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        return;
    }
    // Kiểm tra đã có trong wishlist chưa
    const existing = await wishlistModel_1.WishlistModel.findOne({
        userId: user._id,
        productId,
    });
    if (existing) {
        res.status(400).json({ error: 'Sản phẩm đã có trong danh sách yêu thích' });
        return;
    }
    // Thêm vào wishlist
    const wishlistItem = new wishlistModel_1.WishlistModel({
        userId: user._id,
        productId,
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        productSlug: product.slug,
    });
    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
}));
// ✅ DELETE - Xóa sản phẩm khỏi wishlist
exports.wishlistRouter.delete('/:wishlistId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { wishlistId } = req.params;
    const user = req.user;
    const wishlistItem = await wishlistModel_1.WishlistModel.findById(wishlistId);
    if (!wishlistItem) {
        res.status(404).json({ error: 'Không tìm thấy item' });
        return;
    }
    // Kiểm tra quyền
    if (wishlistItem.userId !== user._id) {
        res.status(403).json({ error: 'Không có quyền xóa' });
        return;
    }
    await wishlistModel_1.WishlistModel.findByIdAndDelete(wishlistId);
    res.json({ message: 'Xóa khỏi wishlist thành công' });
}));
// ✅ DELETE - Xóa theo productId
exports.wishlistRouter.delete('/product/:productId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    await wishlistModel_1.WishlistModel.deleteOne({
        userId: user._id,
        productId,
    });
    res.json({ message: 'Xóa khỏi wishlist thành công' });
}));
// ✅ POST - Check xem product có trong wishlist không
exports.wishlistRouter.post('/check/:productId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    const item = await wishlistModel_1.WishlistModel.findOne({
        userId: user._id,
        productId,
    });
    res.json({
        inWishlist: !!item,
        wishlistId: item?._id,
    });
}));
//# sourceMappingURL=wishlistRouter.js.map