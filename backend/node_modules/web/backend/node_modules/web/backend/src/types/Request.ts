/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express'

declare namespace Express {
    export interface Request {
        user?: {
            _id: string
            name: string
            email: string
            isAdmin: boolean
            token: string
        }
    }
}

export interface RequestWithUser extends Request {
    user: {
        _id: string
        name: string
        email: string
        isAdmin: boolean
        token: string
    }
}