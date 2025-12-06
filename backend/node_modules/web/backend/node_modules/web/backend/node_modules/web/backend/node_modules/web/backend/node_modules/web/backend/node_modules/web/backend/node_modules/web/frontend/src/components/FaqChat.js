import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
// Sử dụng FaqData mới có thêm thông tin
const faqData = [
    { question: 'Làm sao để đặt hàng?', answer: 'Bạn chọn sản phẩm → Add to cart → Checkout. Vui lòng điền đầy đủ thông tin nhận hàng để được xử lý nhanh nhất.' },
    { question: 'Có hỗ trợ thanh toán VNPAY không?', answer: 'Hiện tại cửa hàng đang hỗ trợ thanh toán qua VNPAY, chuyển khoản ngân hàng, và COD (Thanh toán khi nhận hàng).' },
    { question: 'Phí vận chuyển là bao nhiêu?', answer: 'Phí vận chuyển tùy khu vực và cân nặng, trung bình 20.000đ – 30.000đ. Bạn sẽ thấy chi phí chính xác ở bước thanh toán.' },
    { question: 'Chính sách đổi trả hàng như thế nào?', answer: 'Cửa hàng hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mô tả.' },
];
const initialBotMessage = {
    sender: 'bot',
    text: 'Chào bạn! Tôi là Bot hỗ trợ FAQ. Hãy chọn một câu hỏi dưới đây hoặc gõ câu hỏi của bạn:',
};
export default function FaqChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    // Auto scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    // Hiển thị tin nhắn chào mừng khi mở chat
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([initialBotMessage]);
        }
    }, [isOpen, messages.length]);
    /**
     * Xử lý click vào nút gợi ý FAQ
     */
    const handleFaqClick = (question) => {
        // Tìm câu trả lời tương ứng
        const faq = faqData.find(f => f.question === question);
        const answer = faq ? faq.answer : 'Lỗi không tìm thấy câu trả lời.';
        const userMessage = { sender: 'user', text: question };
        const botReply = { sender: 'bot', text: answer };
        // Gửi cả câu hỏi và câu trả lời vào luồng chat
        setMessages((prev) => [...prev, userMessage, botReply]);
        setInput('');
    };
    /**
     * Xử lý gửi tin nhắn của người dùng
     */
    const handleSend = () => {
        if (!input.trim())
            return;
        const userQuestion = input.trim();
        const userMessage = { sender: 'user', text: userQuestion };
        // Tìm kiếm câu trả lời
        const foundFaq = faqData.find(f => userQuestion.toLowerCase().includes(f.question.toLowerCase().split('?')[0].trim()) // Tìm kiếm theo từ khóa
        );
        const botReplyText = foundFaq
            ? foundFaq.answer
            : 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này 😅. Bạn có thể thử hỏi lại hoặc chọn một câu hỏi gợi ý.';
        const botReply = {
            sender: 'bot',
            text: botReplyText,
        };
        setMessages((prev) => [...prev, userMessage, botReply]);
        setInput('');
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "fixed bottom-5 left-5 w-16 h-16 bg-blue-600 text-white shadow-2xl transition duration-300 transform \r\n                   hover:scale-105 active:scale-95 focus:outline-none z-[1000] flex items-center justify-center", style: { borderRadius: '50%' }, children: _jsx(MessageCircle, { size: 32 }) }), _jsxs("div", { className: `fixed bottom-24 left-5 w-80 h-[480px] bg-white shadow-2xl border border-gray-200 flex flex-col z-[1000] 
          transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`, children: [_jsxs("div", { className: "p-4 bg-blue-600 text-white font-bold text-lg flex justify-between items-center", children: [_jsx("span", { children: "FAQ Chat Bot \uD83D\uDCAC" }), _jsx("button", { onClick: () => setIsOpen(false), className: "text-white hover:text-gray-200 transition", children: "\u2715" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg, idx) => (_jsx("div", { className: `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `
                  inline-block max-w-[80%] p-3 text-sm shadow-md transition duration-300
                  ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-t-xl rounded-bl-xl'
                                        : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl'}
                `, children: msg.text }) }, idx))), _jsx("div", { ref: messagesEndRef }), (messages.length === 1 || messages[messages.length - 1]?.text.includes('Xin lỗi, tôi chưa có câu trả lời')) && (_jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("p", { className: "text-xs text-gray-500 font-semibold uppercase", children: "Quick Access:" }), faqData.map((faq, index) => (_jsx("button", { onClick: () => handleFaqClick(faq.question), className: "w-full text-left p-2 text-sm bg-white border border-gray-300 text-blue-600 hover:bg-gray-50 transition duration-300 shadow-sm", children: faq.question }, index)))] }))] }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("form", { onSubmit: (e) => {
                                e.preventDefault();
                                handleSend();
                            }, className: "flex", children: [_jsx("input", { type: "text", placeholder: "Nh\u1EADp c\u00E2u h\u1ECFi...", value: input, onChange: (e) => setInput(e.target.value), className: "flex-1 border border-gray-300 p-2 text-sm focus:border-blue-500 transition duration-300 outline-none", autoFocus: true }), _jsx("button", { type: "submit", className: "ml-2 w-10 h-10 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-300", disabled: !input.trim(), children: _jsx(Send, { size: 20 }) })] }) })] })] }));
}
