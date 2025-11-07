import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { MessageCircle } from 'lucide-react';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const faqData = [
  { question: 'Làm sao để đặt hàng?', answer: 'Bạn chọn sản phẩm → Add to cart → Checkout.' },
  { question: 'Có hỗ trợ thanh toán VNPAY không?', answer: 'Hiện tại cửa hàng đang hỗ trợ thanh toán qua VNPAY và COD.' },
  { question: 'Phí vận chuyển là bao nhiêu?', answer: 'Phí vận chuyển tùy khu vực, trung bình 20.000đ – 30.000đ.' },
];

export default function FaqChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      sender: 'user' as const, 
      text: input 
    };
    
    const faq = faqData.find(f =>
      f.question.toLowerCase().includes(input.toLowerCase())
    );

    const botReply: Message = {
      sender: 'bot' as const,
      text: faq ? faq.answer : 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này 😅',
    };

    setMessages([...messages, userMessage, botReply]);
    setInput('');
  };

  return (
    <>
      {/* Nút bóng chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          zIndex: 1000,
        }}
      >
        <MessageCircle size={28} />
      </Button>

      {/* Hộp chat */}
      {isOpen && (
        <Card
          style={{
            position: 'fixed',
            bottom: '90px',
            left: '20px',
            width: '320px',
            height: '400px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card.Header className="text-center bg-primary text-white">
            FAQ Chat Bot 💬
          </Card.Header>
          <Card.Body
            style={{ overflowY: 'auto', flex: 1, padding: '10px' }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '15px',
                    backgroundColor:
                      msg.sender === 'user' ? '#007bff' : '#e9ecef',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    maxWidth: '80%',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </Card.Body>
          <Card.Footer>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" variant="primary" className="ms-2">
                  Gửi
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}
