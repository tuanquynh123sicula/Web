import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
export declare const generateToken: (user: User) => string;
export declare const isAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map