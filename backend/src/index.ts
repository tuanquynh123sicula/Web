import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { productRouter } from './routers/productRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { vnpayRouter } from './routers/vnpayRouter';
import { adminRouter } from './routers/adminRouter'
import uploadRouter from './routers/uploadRouter'
import { reviewRouter } from './routers/reviewRouter'
import { seedRouter } from './routers/seedRouter'
import { wishlistRouter } from './routers/wishlistRouter'
import { compareRouter } from './routers/compareRouter'
import { voucherRouter } from './routers/voucherRouter'


dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is required');
}
mongoose.set('strictQuery', true);
mongoose
  .connect(uri)
  .then(() => {
    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected: host=${host}, db=${name}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const app = express()

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_PREVIEW || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = ALLOWED_ORIGINS.some((o) => origin === o);
    cb(allowed ? null : new Error('Not allowed by CORS'), allowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Add headers sent by axios client
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Requested-With',
  ],
  // Optional: expose headers if needed
  exposedHeaders: ['Content-Length'],
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use('/api/products', productRouter)
app.use('/api/seed', seedRouter)
app.use('/api/orders', orderRouter)
app.use('/api/users', userRouter)
app.use('/api/vnpay', vnpayRouter)
app.use('/api/admin', adminRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/compare', compareRouter)
app.use('/api/vouchers', voucherRouter)
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
