"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRouter_1 = require("./routers/productRouter");
const userRouter_1 = require("./routers/userRouter");
const orderRouter_1 = require("./routers/orderRouter");
const vnpayRouter_1 = require("./routers/vnpayRouter");
const adminRouter_1 = require("./routers/adminRouter");
const uploadRouter_1 = __importDefault(require("./routers/uploadRouter"));
const reviewRouter_1 = require("./routers/reviewRouter");
const seedRouter_1 = require("./routers/seedRouter");
const wishlistRouter_1 = require("./routers/wishlistRouter");
const compareRouter_1 = require("./routers/compareRouter");
const voucherRouter_1 = require("./routers/voucherRouter");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/ecomerecedb';
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('connected to mongodb');
})
    .catch(() => {
    console.log('error mongodb');
});
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== 'production') {
    app.use((0, cors_1.default)({
        credentials: true,
        origin: ['http://localhost:5173']
    }));
}
const __dirname = path_1.default.resolve();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../frontend/dist/index.html"));
    });
}
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; font-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
//   )
//   next()
// })
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/products', productRouter_1.productRouter);
app.use('/api/seed', seedRouter_1.seedRouter);
app.use('/api/orders', orderRouter_1.orderRouter);
app.use('/api/users', userRouter_1.userRouter);
app.use('/api/vnpay', vnpayRouter_1.vnpayRouter);
app.use('/api/admin', adminRouter_1.adminRouter);
app.use('/api/upload', uploadRouter_1.default);
app.use('/api/reviews', reviewRouter_1.reviewRouter);
app.use('/api/wishlist', wishlistRouter_1.wishlistRouter);
app.use('/api/compare', compareRouter_1.compareRouter);
app.use('/api/vouchers', voucherRouter_1.voucherRouter);
app.use('/uploads', express_1.default.static('uploads'));
// ❌ KHỐI CORS TRÙNG LẶP ĐÃ BỊ XÓA KHỎI ĐÂY
// app.use(cors({
// origin: 'http://localhost:5173', 
// methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// allowedHeaders: ['Content-Type', 'Authorization'],
// credentials: true 
// }));
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map