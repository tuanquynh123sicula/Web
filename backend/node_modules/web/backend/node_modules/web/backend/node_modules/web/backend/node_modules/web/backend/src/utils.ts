import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from './models/userModel'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    { expiresIn: '30d' }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  
  
  if (authorization) {
    const token = authorization.slice(7) // Bỏ "Bearer "
    
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(401).json({ message: 'Invalid or expired token' })
        } else {
          req.user = {
            ...(decode as JwtPayload),
            isAdmin: Boolean((decode as any).isAdmin),
            token,
          } as {
            _id: string
            name: string
            email: string
            isAdmin: boolean
            token: string
          }
          next()
        }
      }
    )
  } else {
    res.status(401).json({ message: 'No token provided' })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).send({ message: 'Access denied — you are not an admin.' })
  }
}
