import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import type { OrderModel } from '../models/orderModel'

type OrderItemInput = { _id: string } & Record<string, unknown>
type AuthRequest = Request & { user?: { _id: string } }

export const orderRouter = express.Router()

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const items = req.body.orderItems as OrderItemInput[] | undefined
    if (!items || items.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
      return
    }

    const createdOrder = await OrderModel.create({
      orderItems: items.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user?._id,
    })

    res.status(201).send({ message: 'Order Created', order: createdOrder })
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await OrderModel.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      res.status(404).send({ message: 'Order Not Found' })
      return
    }
    res.send(order)
  })
)