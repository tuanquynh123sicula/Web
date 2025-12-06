"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../models/userModel");
const utils_1 = require("../utils");
exports.userRouter = express_1.default.Router();
// ✅ GET /api/users/profile → lấy thông tin user đang login
exports.userRouter.get('/profile', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.findById(req.user?._id).select('-password');
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
}));
// ✅ POST /api/users/signin
exports.userRouter.post('/signin', (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_1.UserModel.findOne({ email });
    if (user && user.password === password) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, utils_1.generateToken)(user),
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}));
// ✅ POST /api/users/signup
exports.userRouter.post('/signup', (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    const user = new userModel_1.UserModel({ name, email, password });
    const created = await user.save();
    res.status(201).json({
        _id: created._id,
        name: created.name,
        email: created.email,
        isAdmin: created.isAdmin,
        token: (0, utils_1.generateToken)(created),
    });
}));
// ✅ PUT /api/users/profile → update thông tin user
exports.userRouter.put('/profile', utils_1.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.findById(req.user?._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            isAdmin: updated.isAdmin,
        });
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
}));
//# sourceMappingURL=userRouter.js.map