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
  'https://techhub02.vercel.app',
  'http://localhost:5173',
  'http://localhost:4000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = ALLOWED_ORIGINS.some((o) => origin === o);
    if (allowed) {
      cb(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Requested-With',
  ],
  exposedHeaders: ['Content-Length'],
}));

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}))

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins:`, ALLOWED_ORIGINS);
})