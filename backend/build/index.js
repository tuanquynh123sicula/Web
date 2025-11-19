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
const seedRouter_1 = __importDefault(require("./routers/seedRouter"));
const userRouter_1 = require("./routers/userRouter");
const orderRouter_1 = require("./routers/orderRouter");
const vnpayRouter_1 = require("./routers/vnpayRouter");
const adminRouter_1 = require("./routers/adminRouter");
const uploadRouter_1 = __importDefault(require("./routers/uploadRouter"));
const reviewRouter_1 = require("./routers/reviewRouter");
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
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:5173'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/products', productRouter_1.productRouter);
app.use('/api/seed', seedRouter_1.default);
app.use('/api/orders', orderRouter_1.orderRouter);
app.use('/api/vnpay', vnpayRouter_1.vnpayRouter);
app.use('/api/admin', adminRouter_1.adminRouter);
app.use('/api/upload', uploadRouter_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api/users', userRouter_1.userRouter);
app.use('/api/reviews', reviewRouter_1.reviewRouter);
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map