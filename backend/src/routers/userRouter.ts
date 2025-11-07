import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { UserModel, User} from '../models/userModel'
import { generateToken } from '../utils'
import { isAuth } from '../utils'

export const userRouter = express.Router()


userRouter.post(
     '/signin',
     asyncHandler(async (req: Request, res: Response) => {
       const user = await UserModel.findOne({ email: req.body.email })
       if (user) {
         if (bcrypt.compareSync(req.body.password, user.password)) {
           res.json({
             _id: user._id,
             name: user.name,
             email: user.email,
             isAdmin: user.isAdmin,
             token: generateToken(user),
           })
           return
         }
       }
       res.status(401).send({ message: 'Invalid email or password' })
     })
   )

userRouter.post(
        '/signup',
        asyncHandler(async (req: Request, res: Response) => {
          const user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
          } as User)

          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          })
        })
      )

userRouter.get(
  '/profile',
  isAuth,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById((req as any).user._id).select('-password')
    if (!user) {
      res.status(404).send({ message: 'User not found' })
      return
    }
    res.send(user)
  })
)
      