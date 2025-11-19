"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const uploadRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
uploadRouter.post('/', utils_1.isAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "No file uploaded." });
    }
    const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
    res.send({ image: imagePath });
});
exports.default = uploadRouter;
//# sourceMappingURL=uploadRouter.js.map