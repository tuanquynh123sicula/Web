"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
exports.userRouter = express_1.default.Router();
exports.userRouter.post('/signin', (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.findOne({ email: req.body.email });
    if (user) {
        if (bcryptjs_1.default.compareSync(req.body.password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: (0, utils_1.generateToken)(user),
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' });
}));
exports.userRouter.post('/signup', (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: bcryptjs_1.default.hashSync(req.body.password),
    });
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: (0, utils_1.generateToken)(user),
    });
}));
exports.userRouter.get('/profile', utils_2.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.findById(req.user._id).select('-password');
    if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        tier: user.tier || 'regular',
    });
}));
exports.userRouter.put('/profile', utils_2.isAuth, (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.UserModel.findById(req.user._id);
    if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
        user.password = bcryptjs_1.default.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        tier: updatedUser.tier || 'regular',
        token: (0, utils_1.generateToken)(updatedUser),
    });
}));
//# sourceMappingURL=userRouter.js.map