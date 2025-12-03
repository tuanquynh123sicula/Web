import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Store } from '@/Store'
import type { ApiError } from '@/types/ApiError'
import { getError } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit, Trash2 } from 'lucide-react'

const LoadingBox = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Đang tải...</p>
    </motion.div>
  </div>
)

const MessageBox = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4"
  >
    {children}
  </motion.div>
)

interface Voucher {
  _id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxUsage: number
  usageCount: number
  expiryDate: string
  isActive: boolean
  createdAt: string
}

const API_BASE_URL = 'http://localhost:4000/api/vouchers'

export default function VouchersPage() {
  const { state } = useContext(Store)
  const { userInfo } = state

  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderValue: 0,
    maxUsage: 0,
    expiryDate: '',
  })

  const fetchVouchers = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get<Voucher[]>(API_BASE_URL, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      })
      setVouchers(data)
      setError(null)
    } catch (err) {
      setError(getError(err as ApiError))
      toast.error('Lỗi tải danh sách voucher.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      setError('Bạn không có quyền truy cập trang này.')
      setIsLoading(false)
      return
    }
    fetchVouchers()
  }, [userInfo])

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxUsage: 0,
      expiryDate: '',
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã voucher!')
      return
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      toast.error('Vui lòng nhập giá trị giảm hợp lệ!')
      return
    }
    if (!formData.maxUsage || formData.maxUsage <= 0) {
      toast.error('Vui lòng nhập số lần sử dụng tối đa!')
      return
    }
    if (!formData.expiryDate) {
      toast.error('Vui lòng chọn ngày hết hạn!')
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue.toString()),
      minOrderValue: parseFloat(formData.minOrderValue.toString()),
      maxUsage: parseInt(formData.maxUsage.toString()),
      code: formData.code.toUpperCase(),
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        })
        toast.success('Cập nhật voucher thành công.')
      } else {
        await axios.post(API_BASE_URL, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        })
        toast.success('Tạo voucher mới thành công.')
      }
      
      fetchVouchers()
      resetForm()
      setShowForm(false)
    } catch (err) {
      const errorMsg = getError(err as ApiError)
      toast.error(`Lỗi: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (voucher: Voucher) => {
    setFormData({
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minOrderValue: voucher.minOrderValue,
      maxUsage: voucher.maxUsage,
      expiryDate: voucher.expiryDate.split('T')[0],
    })
    setEditingId(voucher._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa voucher ${code}?`)) return

    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      })
      toast.success(`Xóa voucher ${code} thành công.`)
      fetchVouchers()
    } catch (err) {
      const errorMsg = getError(err as ApiError)
      toast.error(`Lỗi xóa: ${errorMsg}`)
    }
  }

  const handleToggleActive = async (voucher: Voucher) => {
    try {
      await axios.patch(`${API_BASE_URL}/${voucher._id}`, 
        { isActive: !voucher.isActive }, 
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      )
      toast.success(`Cập nhật trạng thái ${voucher.code} thành công.`)
      fetchVouchers()
    } catch (err) {
      const errorMsg = getError(err as ApiError)
      toast.error(`Lỗi cập nhật trạng thái: ${errorMsg}`)
    }
  }

  if (error) return <MessageBox>{error}</MessageBox>
  if (isLoading) return <LoadingBox />

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-600 mt-1">Tổng: <span className="font-semibold text-blue-600">{vouchers.length}</span> voucher</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="bg-blue-600 text-white px-6 py-3 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Đóng' : 'Tạo Voucher'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingId ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã Voucher <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: SUMMER20, SAVE50"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại Giảm Giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Giá cố định (₫)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá Trị Giảm <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder={formData.discountType === 'percentage' ? 'VD: 20' : 'VD: 100000'}
                      value={formData.discountValue || ''}
                      onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                      className="flex-1 border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                    />
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 font-semibold text-gray-700">
                      {formData.discountType === 'percentage' ? '%' : '₫'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá Trị Đơn Hàng Tối Thiểu
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="VD: 500000"
                      value={formData.minOrderValue || ''}
                      onChange={(e) => setFormData({...formData, minOrderValue: parseFloat(e.target.value) || 0})}
                      className="flex-1 border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                    />
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 font-semibold text-gray-700">
                      ₫
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số Lần Sử Dụng Tối Đa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 100"
                    value={formData.maxUsage || ''}
                    onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value) || 0})}
                    className="w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Hết Hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`bg-blue-600 text-white px-6 py-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Tạo Voucher'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  className="bg-gray-300 text-black px-6 py-2 font-semibold hover:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Hủy
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Mã Voucher</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Loại Giảm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Giá Trị</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Lượt Dùng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Hết hạn</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {vouchers.map((voucher, idx) => (
                  <motion.tr
                    key={voucher._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="border-b last:border-none transition-all duration-300 hover:bg-blue-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{voucher.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {voucher.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {voucher.discountValue.toLocaleString('vi-VN')}
                      {voucher.discountType === 'percentage' ? '%' : '₫'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {voucher.usageCount} / {voucher.maxUsage}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {voucher.expiryDate.split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleActive(voucher)}
                        className={`px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                          voucher.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {voucher.isActive ? 'Hoạt động' : 'Tắt'}
                      </motion.button>
                    </td>
                    <td className="px-6 py-4 text-center text-sm space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(voucher)}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors duration-300"
                      >
                        <Edit size={16} /> Sửa
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(voucher._id, voucher.code)}
                        className="text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1 transition-colors duration-300"
                      >
                        <Trash2 size={16} /> Xóa
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {vouchers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 text-center text-gray-500"
            >
              Không có voucher nào được tạo.
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}