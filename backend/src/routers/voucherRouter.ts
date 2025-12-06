import { Router, Request, Response } from 'express'
import { VoucherModel } from '../models/voucherModel'
import { isAuth, isAdmin } from '../utils/auth'

const voucherRouter = Router()

// ✅ POST: Xác thực voucher (dùng khi checkout) - PUBLIC
// Route tĩnh này phải được đặt trước /:id
voucherRouter.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code, orderTotal } = req.body

    console.log('🔍 Validate voucher request:', { code, orderTotal })

    if (!code || orderTotal === undefined || orderTotal === null) {
      res.status(400).json({ message: 'Vui lòng nhập mã voucher và giá trị đơn hàng' })
      return
    }

    const voucher = await VoucherModel.findOne({
      code: code.toUpperCase(),
      isActive: true,
    })

    if (!voucher) {
      res.status(404).json({ message: 'Mã voucher không hợp lệ hoặc đã bị vô hiệu hóa' })
      return
    }

    // Kiểm tra hết hạn
    if (new Date(voucher.expiryDate) < new Date()) {
      res.status(400).json({ message: 'Voucher đã hết hạn' })
      return
    }

    // Kiểm tra lượt sử dụng
    if (voucher.usageCount >= voucher.maxUsage) {
      res.status(400).json({ message: 'Voucher đã hết lượt sử dụng' })
      return
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (orderTotal < voucher.minOrderValue) {
      res.status(400).json({
        message: `Đơn hàng tối thiểu phải là ${voucher.minOrderValue.toLocaleString('vi-VN')} ₫`,
      })
      return
    }

    console.log('✅ Voucher validated successfully:', voucher.code)

    res.json({ 
      message: 'Voucher hợp lệ',
      voucher 
    })
  } catch (error: any) {
    console.error('❌ Validate voucher error:', error)
    res.status(500).json({ message: error.message || 'Lỗi khi xác thực voucher' })
  }
})

// ✅ GET: Lấy danh sách vouchers PUBLIC (chỉ active)
voucherRouter.get('/public', async (req: Request, res: Response) => {
  try {
    const vouchers = await VoucherModel.find({ 
      isActive: true,
      expiryDate: { $gte: new Date() } // Chỉ lấy voucher chưa hết hạn
    }).sort({ createdAt: -1 })
    
    res.json(vouchers)
  } catch (error: any) {
    console.error('❌ Get public vouchers error:', error)
    res.status(500).json({ message: error.message || 'Lỗi khi tải vouchers' })
  }
})

// GET: Lấy danh sách TẤT CẢ vouchers (Admin only)
voucherRouter.get('/', isAuth, isAdmin, async (req: Request, res: Response) => {
  try {
    const vouchers = await VoucherModel.find().sort({ createdAt: -1 })
    res.json(vouchers)
  } catch (error: any) {
    console.error('❌ Get all vouchers error:', error)
    res.status(500).json({ message: error.message || 'Lỗi khi tải vouchers' })
  }
})

// GET: Lấy 1 voucher theo ID
voucherRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const voucher = await VoucherModel.findById(req.params.id)
    if (!voucher) {
      res.status(404).json({ message: 'Voucher không tồn tại' })
      return
    }
    res.json(voucher)
  } catch (error: any) {
    console.error('❌ Get voucher by ID error:', error)
    res.status(500).json({ message: error.message })
  }
})

// POST: Tạo voucher mới (Admin only)
voucherRouter.post(
  '/',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { code, discountType, discountValue, minOrderValue, maxUsage, expiryDate } = req.body

      console.log('📝 Create voucher request:', req.body)

      // Validate
      if (!code || !discountType || !discountValue || !maxUsage || !expiryDate) {
        res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
        return
      }

      // Validate discountValue
      if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
        res.status(400).json({ message: 'Giá trị giảm giá phần trăm phải từ 0-100' })
        return
      }

      if (discountType === 'fixed' && discountValue < 0) {
        res.status(400).json({ message: 'Giá trị giảm giá phải lớn hơn 0' })
        return
      }

      // Kiểm tra mã đã tồn tại
      const existing = await VoucherModel.findOne({
        code: code.toUpperCase(),
      })
      if (existing) {
        res.status(400).json({ message: 'Mã voucher đã tồn tại' })
        return
      }

      const voucher = new VoucherModel({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderValue: minOrderValue || 0,
        maxUsage,
        expiryDate,
        isActive: true,
      })

      const savedVoucher = await voucher.save()
      console.log('✅ Voucher created:', savedVoucher.code)
      res.status(201).json(savedVoucher)
    } catch (error: any) {
      console.error('❌ Create voucher error:', error)
      res.status(500).json({ message: error.message || 'Lỗi khi tạo voucher' })
    }
  }
)

// PUT: Cập nhật voucher (Admin only)
voucherRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { code, discountType, discountValue, minOrderValue, maxUsage, expiryDate } = req.body

      console.log('📝 Update voucher request:', req.params.id, req.body)

      const voucher = await VoucherModel.findById(req.params.id)
      if (!voucher) {
        res.status(404).json({ message: 'Voucher không tồn tại' })
        return
      }

      // Kiểm tra mã trùng (nếu có thay đổi)
      if (code && code.toUpperCase() !== voucher.code) {
        const existing = await VoucherModel.findOne({
          code: code.toUpperCase(),
        })
        if (existing) {
          res.status(400).json({ message: 'Mã voucher đã tồn tại' })
          return
        }
        voucher.code = code.toUpperCase()
      }

      // Validate discountValue nếu có update
      if (discountValue !== undefined) {
        const type = discountType || voucher.discountType
        if (type === 'percentage' && (discountValue < 0 || discountValue > 100)) {
          res.status(400).json({ message: 'Giá trị giảm giá phần trăm phải từ 0-100' })
          return
        }
        if (type === 'fixed' && discountValue < 0) {
          res.status(400).json({ message: 'Giá trị giảm giá phải lớn hơn 0' })
          return
        }
      }

      if (discountType) voucher.discountType = discountType
      if (discountValue !== undefined) voucher.discountValue = discountValue
      if (minOrderValue !== undefined) voucher.minOrderValue = minOrderValue
      if (maxUsage !== undefined) voucher.maxUsage = maxUsage
      if (expiryDate) voucher.expiryDate = new Date(expiryDate)

      const updatedVoucher = await voucher.save()
      console.log('✅ Voucher updated:', updatedVoucher.code)
      res.json(updatedVoucher)
    } catch (error: any) {
      console.error('❌ Update voucher error:', error)
      res.status(500).json({ message: error.message || 'Lỗi khi cập nhật voucher' })
    }
  }
)

// PATCH: Cập nhật trạng thái voucher (Admin only)
voucherRouter.patch(
  '/:id/status',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { isActive } = req.body

      console.log('🔄 Update voucher status:', req.params.id, { isActive })

      const voucher = await VoucherModel.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      )

      if (!voucher) {
        res.status(404).json({ message: 'Voucher không tồn tại' })
        return
      }

      console.log('✅ Voucher status updated:', voucher.code, isActive)
      res.json(voucher)
    } catch (error: any) {
      console.error('❌ Update status error:', error)
      res.status(500).json({ message: error.message })
    }
  }
)

// DELETE: Xóa voucher (Admin only)
voucherRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      console.log('🗑️ Delete voucher:', req.params.id)

      const voucher = await VoucherModel.findByIdAndDelete(req.params.id)
      if (!voucher) {
        res.status(404).json({ message: 'Voucher không tồn tại' })
        return
      }

      console.log('✅ Voucher deleted:', voucher.code)
      res.json({ message: 'Voucher đã được xóa', voucher })
    } catch (error: any) {
      console.error('❌ Delete voucher error:', error)
      res.status(500).json({ message: error.message })
    }
  }
)

export { voucherRouter }