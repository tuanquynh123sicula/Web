import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { UserModel } from '../models/userModel'
import { isAuth } from '../utils'

export const userRouter = express.Router()

// ✅ GET /api/users/profile → lấy thông tin user đang login
userRouter.get(
    '/profile',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        console.log('Fetching user profile for:', req.user?._id)
        
        const user = await UserModel.findById(req.user?._id).select('-password')
        
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    })
)

// ✅ POST /api/users/signin
userRouter.post(
    '/signin',
    asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body
        
        const user = await UserModel.findOne({ email })
        if (user && user.password === password) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: 'your-jwt-token', // Thay bằng JWT nếu có
            })
        } else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    })
)

// ✅ POST /api/users/signup
userRouter.post(
    '/signup',
    asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password } = req.body
        
        const user = new UserModel({ name, email, password })
        const created = await user.save()
        
        res.status(201).json({
            _id: created._id,
            name: created.name,
            email: created.email,
            isAdmin: created.isAdmin,
            token: 'your-jwt-token',
        })
    })
)

// ✅ PUT /api/users/profile → update thông tin user
userRouter.put(
    '/profile',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.user?._id)
        
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            
            if (req.body.password) {
                user.password = req.body.password
            }
            
            const updated = await user.save()
            res.json({
                _id: updated._id,
                name: updated.name,
                email: updated.email,
                isAdmin: updated.isAdmin,
            })
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    })
)