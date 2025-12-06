"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ['Đánh giá', 'Tin tức', 'Mẹo sử dụng', 'So sánh'],
        default: 'Tin tức',
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: () => new Date().toLocaleDateString('vi-VN'),
    },
    author: {
        type: String,
        default: 'Admin',
    },
}, { timestamps: true });
exports.BlogModel = (0, mongoose_1.model)('Blog', blogSchema);
//# sourceMappingURL=blogModel.js.map