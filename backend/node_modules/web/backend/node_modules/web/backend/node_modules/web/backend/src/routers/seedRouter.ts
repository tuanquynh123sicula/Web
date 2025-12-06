import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'
import { sampleProducts, sampleUsers } from '../data'
import { UserModel } from '../models/userModel'



export const seedRouter = express.Router()

    seedRouter.get(
      '/',
      asyncHandler(async (req: Request, res: Response) => {
        await ProductModel.deleteMany({})
        const createdProducts = await ProductModel.insertMany(sampleProducts)

        await UserModel.deleteMany({})
        const createdUsers = await UserModel.insertMany(sampleUsers)
        // res.send({ createdProducts, createdUsers })

        res.json({ createdProducts, createdUsers })
      })
    )
    seedRouter.get(
      '/users',
      asyncHandler(async (req: Request, res: Response) => {
        await UserModel.deleteMany({})
        const createdUsers = await UserModel.insertMany([
          {
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true,
            tier: 'vip', // Thêm tier
          },
          {
            name: 'Tuấn Quỳnh',
            email: 'quynh@example.com',
            password: '123',
            isAdmin: false,
            tier: 'regular', // Thêm tier
          },
        ])
        res.json(createdUsers)
      })
    )
    export default seedRouter

