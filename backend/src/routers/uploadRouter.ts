import express from 'express'
import multer from 'multer'
import path from 'path'
import { isAuth, isAdmin } from '../utils'

const uploadRouter = express.Router()

// Lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

// POST /api/upload
uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
  res.send({ image: `/uploads/${req.file?.filename}` })
})

export default uploadRouter
