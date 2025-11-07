// src/routers/faqRouter.ts
import express from 'express'

export const faqRouter = express.Router()

const faqs = [
  {
    question: 'Làm sao để đặt hàng?',
    answer: 'Bạn có thể chọn sản phẩm, thêm vào giỏ hàng và nhấn "Thanh toán".'
  },
  {
    question: 'Phương thức thanh toán nào được hỗ trợ?',
    answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ, chuyển khoản và VNPAY.'
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Đơn hàng sẽ được giao trong vòng 2-5 ngày làm việc.'
  },
  {
    question: 'Tôi có thể đổi trả hàng không?',
    answer: 'Có, bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.'
  }
]

faqRouter.post('/', (req, res) => {
  const { question } = req.body

  if (!question) return res.status(400).json({ error: 'Thiếu câu hỏi' })

  const found = faqs.find(f =>
    question.toLowerCase().includes(f.question.toLowerCase())
  )

  res.json({
    answer:
      found?.answer ||
      'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này. Bạn vui lòng liên hệ hỗ trợ nhé!'
  })
})
