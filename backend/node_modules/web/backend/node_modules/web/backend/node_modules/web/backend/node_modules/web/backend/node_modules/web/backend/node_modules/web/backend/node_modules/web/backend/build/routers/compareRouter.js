"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const compareModel_1 = require("../models/compareModel");
const productModel_1 = require("../models/productModel");
const utils_1 = require("../utils");
exports.compareRouter = express_1.default.Router();
// ✅ GET compare list của user
exports.compareRouter.get('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    const compareList = await compareModel_1.CompareModel.find({ userId: user._id })
        .sort({ createdAt: -1 });
    res.json({
        compareList,
        count: compareList.length,
    });
}));
// ✅ POST - Thêm sản phẩm vào so sánh (có variant)
exports.compareRouter.post('/', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, variantIndex } = req.body;
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
    // Kiểm tra đã có trong compare chưa
    const existing = await compareModel_1.CompareModel.findOne({
        userId: user._id,
        productId,
    });
    if (existing) {
        res.status(400).json({ error: 'Sản phẩm đã có trong danh sách so sánh' });
        return;
    }
    // Giới hạn 5 sản phẩm so sánh
    const compareCount = await compareModel_1.CompareModel.countDocuments({ userId: user._id });
    if (compareCount >= 5) {
        res.status(400).json({ error: 'Chỉ có thể so sánh tối đa 5 sản phẩm' });
        return;
    }
    // ✅ Lấy variant được chọn (default index 0 nếu không chọn)
    const selectedVarIdx = variantIndex ?? 0;
    const selectedVariant = product.variants?.[selectedVarIdx];
    // Thêm vào compare
    const compareItem = new compareModel_1.CompareModel({
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
    });
    const savedItem = await compareItem.save();
    res.status(201).json(savedItem);
}));
// ✅ DELETE - Xóa sản phẩm khỏi so sánh
exports.compareRouter.delete('/:compareId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { compareId } = req.params;
    const user = req.user;
    const compareItem = await compareModel_1.CompareModel.findById(compareId);
    if (!compareItem) {
        res.status(404).json({ error: 'Không tìm thấy item' });
        return;
    }
    if (compareItem.userId !== user._id) {
        res.status(403).json({ error: 'Không có quyền xóa' });
        return;
    }
    await compareModel_1.CompareModel.findByIdAndDelete(compareId);
    res.json({ message: 'Xóa khỏi danh sách so sánh thành công' });
}));
// ✅ DELETE - Xóa theo productId
exports.compareRouter.delete('/product/:productId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    await compareModel_1.CompareModel.deleteOne({
        userId: user._id,
        productId,
    });
    res.json({ message: 'Xóa khỏi danh sách so sánh thành công' });
}));
// ✅ PUT - Cập nhật variant cho item so sánh
exports.compareRouter.put('/:compareId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { compareId } = req.params;
    const { variantIndex } = req.body;
    const user = req.user;
    const compareItem = await compareModel_1.CompareModel.findById(compareId);
    if (!compareItem) {
        res.status(404).json({ error: 'Không tìm thấy item' });
        return;
    }
    if (compareItem.userId !== user._id) {
        res.status(403).json({ error: 'Không có quyền cập nhật' });
        return;
    }
    // Lấy product để update variant
    const product = await productModel_1.ProductModel.findById(compareItem.productId);
    if (!product) {
        res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        return;
    }
    const newVariant = product.variants?.[variantIndex] || product.variants?.[0];
    const updated = await compareModel_1.CompareModel.findByIdAndUpdate(compareId, {
        selectedVariant: newVariant,
    }, { new: true });
    res.json(updated);
}));
// ✅ POST - Check xem product có trong compare không
exports.compareRouter.post('/check/:productId', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    const item = await compareModel_1.CompareModel.findOne({
        userId: user._id,
        productId,
    });
    res.json({
        inCompare: !!item,
        compareId: item?._id,
    });
}));
//# sourceMappingURL=compareRouter.js.map