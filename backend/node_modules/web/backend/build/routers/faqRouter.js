"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
exports.faqRouter = express_1.default.Router();
const SYSTEM_PROMPT = `Bạn là trợ lý chăm sóc khách hàng thân thiện của cửa hàng thương mại điện tử chuyên bán điện thoại và phụ kiện. Hãy trả lời các câu hỏi của khách hàng bằng tiếng Việt một cách ngắn gọn, chuyên nghiệp và lịch sự.`;
const faqData = [
    { question: 'Làm sao để đặt hàng?', answer: 'Bạn chọn sản phẩm → Add to cart → Checkout.' },
    { question: 'Có hỗ trợ thanh toán VNPAY không?', answer: 'Hiện tại cửa hàng đang hỗ trợ thanh toán qua VNPAY và COD.' },
    { question: 'Phí vận chuyển là bao nhiêu?', answer: 'Phí vận chuyển tùy khu vực, trung bình 20.000đ – 30.000đ.' },
];
exports.faqRouter.post('/chat', (0, express_async_handler_1.default)(async (req, res) => {
    const { message, conversationHistory } = req.body;
    // Kiểm tra FAQ trước
    const faqMatch = faqData.find(f => message.toLowerCase().includes(f.question.toLowerCase().slice(0, 5)) ||
        f.question.toLowerCase().includes(message.toLowerCase()));
    if (faqMatch) {
        res.json({ answer: faqMatch.answer });
        return;
    }
    // Gọi OpenAI từ Backend
    try {
        const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: 'user', content: message },
            ],
            temperature: 0.7,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        const botText = response.data.choices[0].message.content || 'Lỗi kết nối AI.';
        res.json({ answer: botText });
    }
    catch (error) {
        console.error('OpenAI API Error:', error.response?.status);
        if (error.response?.status === 429) {
            res.status(429).json({ error: 'Hệ thống quá tải, vui lòng thử lại sau.' });
        }
        else {
            res.status(500).json({ error: 'Có lỗi xảy ra với AI.' });
        }
    }
}));
//# sourceMappingURL=faqRouter.js.map