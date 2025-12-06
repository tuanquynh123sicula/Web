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

const upload = multer({ storage })

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
  }
  const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

  res.send({ image: imagePath })
})

export default uploadRouter
