import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ProductModel } from '../models/productModel'

dotenv.config()

const updateImagePaths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)

    const products = await ProductModel.find()
    
    let updated = 0
    
    for (const product of products) {
      // Nếu image không bắt đầu bằng http/https
      if (product.image && !product.image.startsWith('http')) {
        // Thêm baseURL vào đầu
        product.image = `https://web-934k.onrender.com${product.image}`
        await product.save()
        updated++
        console.log(`✅ Updated: ${product.name}`)
      }
    }
    
    console.log(`🎉 Updated ${updated} products`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateImagePaths()