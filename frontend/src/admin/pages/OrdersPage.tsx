import React, { useEffect, useMemo, useState } from 'react'
import { getAllOrders } from '@/api/adminApi'
import { Order } from '@/types/Order'
import apiClient from '@/apiClient'
import { toast } from 'sonner'
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type OrderStatus = 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled'

type OrderItemLite = {
  _id?: string
  name: string
  quantity: number
  price: number
}

type OrderListItem = Omit<Order, 'orderItems'> & {
  orderItems?: OrderItemLite[]
  createdAt?: string | Date
  user?: { name?: string } | null
  status?: OrderStatus
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang vận chuyển',
  delivered: 'Đã giao hàng',
  canceled: 'Đã hủy',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  packing: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  shipping: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  delivered: 'bg-green-100 text-green-700 hover:bg-green-200',
  canceled: 'bg-red-100 text-red-700 hover:bg-red-200',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [filters, setFilters] = useState({
    status: '' as '' | OrderStatus,
    customer: '',
    dateFrom: '',
    dateTo: '',
    minTotal: '',
    maxTotal: '',
  })
  const [selected, setSelected] = useState<OrderListItem | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    getAllOrders().then((data) => {
      const normalized: OrderListItem[] = (data as OrderListItem[]).map((o) => ({
        ...o,
        status: ((o.status ?? (o.isDelivered ? 'delivered' : 'pending')) as OrderStatus),
      }))
      setOrders(normalized)
    })
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filters.status && (o.status ?? 'pending') !== filters.status) return false
      if (filters.customer && !o.user?.name?.toLowerCase().includes(filters.customer.toLowerCase()))
        return false
      if (filters.dateFrom && new Date(o.createdAt ?? 0) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && new Date(o.createdAt ?? 0) > new Date(filters.dateTo + 'T23:59:59'))
        return false
      if (filters.minTotal && Number(o.totalPrice) < Number(filters.minTotal)) return false
      if (filters.maxTotal && Number(o.totalPrice) > Number(filters.maxTotal)) return false
      return true
    })
  }, [orders, filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const goto = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))
  
  const pageNumbers = useMemo(() => {
    const maxBtns = 5
    let start = Math.max(1, page - Math.floor(maxBtns / 2))
    const end = Math.min(totalPages, start + maxBtns - 1)
    start = Math.max(1, Math.min(start, end - maxBtns + 1))
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [page, totalPages])

  const resetFilters = () =>
    setFilters({ status: '', customer: '', dateFrom: '', dateTo: '', minTotal: '', maxTotal: '' })

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      setUpdatingId(id)
      await apiClient.patch(`/api/admin/orders/${id}/status`, { status })
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)))
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      if (selected?._id === id) setSelected((s) => (s ? { ...s, status } : s))
    } catch {
      toast.error('Không thể cập nhật trạng thái')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600 mt-2">
          Tổng: <span className="font-semibold text-blue-600">{filtered.length}</span> đơn hàng • 
          Trang <span className="font-semibold">{page}</span>/<span className="font-semibold">{totalPages}</span>
        </p>
      </motion.div>

      {/* Bộ lọc */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Khách hàng</label>
            <input
              value={filters.customer}
              onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))}
              className="border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300"
              placeholder="Tên khách hàng"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as OrderStatus }))}
              className="border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300"
            >
              <option value="">Tất cả</option>
              {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Từ ngày</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Đến ngày</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300"
            />
          </div>
          <div className="col-span-6 flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters} 
              className="bg-gray-200 px-6 py-2 font-medium transition-all duration-300 hover:shadow-md active:shadow-sm hover:bg-gray-300"
            >
              Xóa bộ lọc
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bảng đơn hàng */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border shadow-md transition-all duration-500 hover:shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Khách hàng</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Ngày</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Tổng tiền</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Thanh toán</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Giao hàng</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Trạng thái</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {pageData.map((o, idx) => (
                  <motion.tr 
                    key={o._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">{o.user?.name ?? 'Khách'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {Number(o.totalPrice).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg ${o.isPaid ? 'animate-pulse' : ''}`}>
                        {o.isPaid ? '✅' : '❌'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg ${o.isDelivered ? 'animate-pulse' : ''}`}>
                        {o.isDelivered ? '✅' : '❌'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`inline-block px-3 py-1 text-xs font-semibold transition-all duration-300 ${STATUS_COLORS[o.status ?? 'pending']}`}
                      >
                        {STATUS_LABELS[o.status ?? 'pending']}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700"
                        onClick={() => setSelected(o)}
                      >
                        Xem
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            Hiển thị{' '}
            <span className="font-bold text-blue-600">
              {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
              {' - '}
              {Math.min(page * pageSize, filtered.length)}
            </span>{' '}
            trong tổng số <span className="font-bold text-blue-600">{filtered.length}</span> đơn hàng
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => goto(1)}
              disabled={page === 1}
              title="Trang đầu"
            >
              <ChevronsLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => goto(page - 1)}
              disabled={page === 1}
              title="Trang trước"
            >
              <ChevronLeft size={18} />
            </motion.button>
            {pageNumbers.map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                  p === page 
                    ? 'bg-blue-600 text-white' 
                    : 'border bg-white hover:bg-gray-50'
                }`}
                onClick={() => goto(p)}
              >
                {p}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => goto(page + 1)}
              disabled={page === totalPages}
              title="Trang sau"
            >
              <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => goto(totalPages)}
              disabled={page === totalPages}
              title="Trang cuối"
            >
              <ChevronsRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal chi tiết */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white border p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Chi tiết đơn hàng
                </h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setSelected(null)}
                >
                  <X size={24} className="text-gray-600" />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="font-semibold text-gray-900 mb-3 text-lg">Khách hàng</div>
                  <div className="text-gray-700 text-lg">{selected.user?.name ?? 'Khách'}</div>
                  
                  <div className="font-semibold text-gray-900 mt-6 mb-3 text-lg">Thông tin vận chuyển</div>
                  <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 border">
                    <div className="font-medium">{selected.shippingAddress?.fullName}</div>
                    <div>{selected.shippingAddress?.address}, {selected.shippingAddress?.city}</div>
                    <div>{selected.shippingAddress?.postalCode}, {selected.shippingAddress?.country}</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="font-semibold text-gray-900 mb-3 text-lg">Trạng thái</div>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block px-4 py-2 text-sm font-semibold shadow-md ${STATUS_COLORS[selected.status ?? 'pending']}`}
                  >
                    {STATUS_LABELS[selected.status ?? 'pending']}
                  </motion.span>

                  <div className="font-semibold text-gray-900 mt-6 mb-3 text-lg">Tổng tiền</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Number(selected.totalPrice).toLocaleString('vi-VN')} ₫
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Cập nhật trạng thái</label>
                    <select
                      className="border w-full px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300 bg-white shadow-sm"
                      value={selected.status ?? 'pending'}
                      onChange={(e) => updateStatus(selected._id!, e.target.value as OrderStatus)}
                      disabled={updatingId === selected._id}
                    >
                      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((k) => (
                        <option key={k} value={k}>
                          {STATUS_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-semibold text-gray-900 mb-4 text-lg">Sản phẩm</div>
                <div className="max-h-80 overflow-auto border shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 border-b sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Tên sản phẩm</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">SL</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Giá</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selected.orderItems ?? []).map((it: OrderItemLite, idx) => (
                        <motion.tr 
                          key={it._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                          className="border-b last:border-none hover:bg-blue-50 transition-colors duration-300"
                        >
                          <td className="px-6 py-4 font-medium">{it.name}</td>
                          <td className="px-6 py-4 font-semibold text-blue-600">{it.quantity}</td>
                          <td className="px-6 py-4">{Number(it.price).toLocaleString('vi-VN')} ₫</td>
                          <td className="px-6 py-4 font-bold text-blue-600">
                            {(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN')} ₫
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <div className="flex justify-end gap-4 mt-8">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-300 px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-400"
                  onClick={() => setSelected(null)}
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}