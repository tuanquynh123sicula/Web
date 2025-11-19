import React, { useEffect, useMemo, useState } from 'react'
import { getAllOrders } from '@/api/adminApi'
import { Order } from '@/types/Order'
import apiClient from '@/apiClient'
import { toast } from 'sonner'
import { X } from 'lucide-react'

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
  pending: 'bg-yellow-100 text-yellow-700',
  packing: 'bg-blue-100 text-blue-700',
  shipping: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
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
    <div className="p-6">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <div className="mb-6 animate-slide-down">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-gray-500 mt-1">Tổng: {filtered.length} đơn hàng</p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white border shadow-sm p-4 mb-6 transition-all duration-300 hover:shadow-md animate-slide-down" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700">Khách hàng</label>
            <input
              value={filters.customer}
              onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))}
              className="border w-full px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="Tên khách hàng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as OrderStatus }))}
              className="border w-full px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
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
            <label className="block text-sm font-medium mb-2 text-gray-700">Từ ngày</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="border w-full px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Đến ngày</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="border w-full px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
            />
          </div>
          <div className="col-span-6 flex gap-2">
            <button 
              onClick={resetFilters} 
              className="border px-4 py-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-95"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white border shadow-md animate-slide-down transition-all duration-500 hover:shadow-lg overflow-x-auto" style={{ animationDelay: '0.2s' }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b transition-colors duration-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tổng tiền</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Thanh toán</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Giao hàng</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, idx) => (
              <tr 
                key={o._id} 
                className="border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <td className="px-4 py-3 font-medium transition-colors duration-300">{o.user?.name ?? 'Guest'}</td>
                <td className="px-4 py-3 text-gray-600 transition-colors duration-300">
                  {o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '-'}
                </td>
                <td className="px-4 py-3 font-semibold transition-colors duration-300">{Number(o.totalPrice).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3 transition-all duration-300">{o.isPaid ? '✅' : '❌'}</td>
                <td className="px-4 py-3 transition-all duration-300">{o.isDelivered ? '✅' : '❌'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium transition-all duration-300 ${STATUS_COLORS[o.status ?? 'pending']}`}>
                    {STATUS_LABELS[o.status ?? 'pending']}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    className="border px-3 py-1 transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm active:scale-95"
                    onClick={() => setSelected(o)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 w-full max-w-2xl shadow-xl animate-fade-in transform transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <button 
                className="p-1 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                onClick={() => setSelected(null)}
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
              <div>
                <div className="font-semibold text-gray-900 mb-2">Khách hàng</div>
                <div className="text-gray-700">{selected.user?.name ?? 'Guest'}</div>
                
                <div className="font-semibold text-gray-900 mt-4 mb-2">Thông tin vận chuyển</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{selected.shippingAddress?.fullName}</div>
                  <div>{selected.shippingAddress?.address}, {selected.shippingAddress?.city}</div>
                  <div>{selected.shippingAddress?.postalCode}, {selected.shippingAddress?.country}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 mb-2">Trạng thái</div>
                <span className={`inline-block px-3 py-1 text-sm font-medium ${STATUS_COLORS[selected.status ?? 'pending']}`}>
                  {STATUS_LABELS[selected.status ?? 'pending']}
                </span>

                <div className="font-semibold text-gray-900 mt-4 mb-2">Tổng tiền</div>
                <div className="text-2xl font-bold text-blue-600">{Number(selected.totalPrice).toLocaleString('vi-VN')} ₫</div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Cập nhật trạng thái</label>
                  <select
                    className="border w-full px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
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
              </div>
            </div>

            <div className="font-semibold text-gray-900 mb-3">Sản phẩm</div>
            <div className="max-h-64 overflow-auto border shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">SL</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Giá</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.orderItems ?? []).map((it: OrderItemLite, idx) => (
                    <tr 
                      key={it._id} 
                      className="border-b last:border-none hover:bg-gray-50 transition-colors duration-300"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <td className="px-4 py-3">{it.name}</td>
                      <td className="px-4 py-3 font-medium">{it.quantity}</td>
                      <td className="px-4 py-3">{Number(it.price).toLocaleString('vi-VN')} ₫</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN')} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="border px-6 py-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-95"
                onClick={() => setSelected(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}