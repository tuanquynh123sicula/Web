"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET || 'somethingsecret', { expiresIn: '30d' });
};
exports.generateToken = generateToken;
const isAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.slice(7); // Bỏ "Bearer "
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'somethingsecret', (err, decode) => {
            if (err) {
                res.status(401).json({ message: 'Invalid or expired token' });
            }
            else {
                req.user = {
                    ...decode,
                    isAdmin: Boolean(decode.isAdmin),
                    token,
                };
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: 'No token provided' });
    }
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).send({ message: 'Access denied — you are not an admin.' });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=utils.js.map