import React, { useState, useEffect, useContext } from 'react'
// Đã điều chỉnh import - Thử sử dụng alias @/ hoặc đường dẫn tương đối khác nếu cấu trúc cho phép
// Dựa trên cấu trúc Web/frontend/src/..., đường dẫn sau đây là hợp lý nhất nếu không dùng alias:
import { toast } from 'react-toastify'
import axios from 'axios'
import { Store } from '@/Store'
import type { ApiError } from '@/types/ApiError'
import { getError } from '@/utils'

// Components giả định (thay thế nếu bạn có component UI riêng)
const LoadingBox = () => <div className="text-center py-8">Đang tải...</div>
const MessageBox = ({ children }: { children: React.ReactNode }) => <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{children}</div>

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
  // Lấy Store và userInfo
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

  // --- FETCH DATA ---
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
    // Yêu cầu phải là admin để truy cập
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

  // --- CREATE / UPDATE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Chuẩn hóa dữ liệu
    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue.toString()),
      minOrderValue: parseFloat(formData.minOrderValue.toString()),
      maxUsage: parseInt(formData.maxUsage.toString()),
      code: formData.code.toUpperCase(),
    }

    try {
      if (editingId) {
        // UPDATE (PUT)
        await axios.put(`${API_BASE_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        })
        toast.success('Cập nhật voucher thành công.')
      } else {
        // CREATE (POST)
        await axios.post(API_BASE_URL, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        })
        toast.success('Tạo voucher mới thành công.')
      }
      
      // Fetch lại dữ liệu sau khi thành công
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
      expiryDate: voucher.expiryDate.split('T')[0], // Định dạng lại cho input type="date"
    })
    setEditingId(voucher._id)
    setShowForm(true)
  }

  // --- DELETE ---
  const handleDelete = async (id: string, code: string) => {
    // Thay thế window.confirm bằng toast.error (hoặc modal)
    toast.error('Chức năng xác nhận xóa tạm thời bị vô hiệu hóa. Tiếp tục xóa.')

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

  // --- TOGGLE ACTIVE STATUS ---
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {showForm ? 'Đóng' : '+ Tạo Voucher'}
        </button>
        
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mã voucher */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã Voucher *
                </label>
                <input
                  type="text"
                  placeholder="VD: SUMMER20, SAVE50"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Loại giảm giá */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại Giảm Giá *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Giá cố định (₫)</option>
                </select>
              </div>

              {/* Giá trị giảm */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá Trị Giảm *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder={formData.discountType === 'percentage' ? 'VD: 20' : 'VD: 100000'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r px-3 py-2 font-semibold text-gray-700">
                    {formData.discountType === 'percentage' ? '%' : '₫'}
                  </div>
                </div>
              </div>

              {/* Giá trị đơn hàng tối thiểu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá Trị Đơn Hàng Tối Thiểu
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="VD: 500000"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({...formData, minOrderValue: parseFloat(e.target.value)})}
                    className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r px-3 py-2 font-semibold text-gray-700">
                    ₫
                  </div>
                </div>
              </div>

              {/* Số lượng sử dụng tối đa */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Lần Sử Dụng Tối Đa *
                </label>
                <input
                  type="number"
                  placeholder="VD: 100"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                  min="1"
                />
              </div>

              {/* Ngày hết hạn */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Hết Hạn *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`bg-blue-600 text-white px-6 py-2 rounded font-semibold transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Đang xử lý...' : editingId ? '💾 Cập nhật' : '✚ Tạo Voucher'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="bg-gray-300 text-black px-6 py-2 rounded font-semibold hover:bg-gray-400 transition"
              >
                ✕ Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mã Voucher</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Loại Giảm</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Giá Trị</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Lượt Dùng</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hết hạn</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{voucher.code}</td>
                <td className="px-6 py-4 text-sm">
                  {voucher.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {voucher.discountValue.toLocaleString('vi-VN')}
                  {voucher.discountType === 'percentage' ? '%' : '₫'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {voucher.usageCount} / {voucher.maxUsage}
                </td>
                <td className="px-6 py-4 text-sm">
                  {voucher.expiryDate.split('T')[0]}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleToggleActive(voucher)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      voucher.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {voucher.isActive ? 'Hoạt động' : 'Tắt'}
                  </button>
                </td>
                <td className="px-6 py-4 text-center text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(voucher)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(voucher._id, voucher.code)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vouchers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Không có voucher nào được tạo.
          </div>
        )}
      </div>
    </div>
  )
}