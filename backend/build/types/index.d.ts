/* eslint-disable @typescript-eslint/no-namespace */
import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload & {
        _id: string
        name: string
        email: string
        isAdmin: boolean
        token: string
      }
    }
  }
}

export {}
