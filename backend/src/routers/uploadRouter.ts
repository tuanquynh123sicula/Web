import express from 'express'
import multer from 'multer'
import { isAuth } from '../utils' 

const uploadRouter = express.Router()

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, `${Date.now()}-${file.fieldname}${ext}`); 
  },
})

// ✅ Giới hạn file size 10MB
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh!'))
    }
  }
})

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
  }
  
  const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                  process.env.BACKEND_URL || 
                  'https://web-934k.onrender.com'
  
  const imagePath = `/uploads/${req.file.filename}`
  const fullUrl = `${baseUrl}${imagePath}`

  res.send({ image: fullUrl })
})

// ✅ Error handler cho multer
uploadRouter.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File quá lớn! Kích thước tối đa là 10MB' 
      })
    }
  }
  res.status(500).json({ message: error.message || 'Lỗi upload file' })
})

export default uploadRouter
