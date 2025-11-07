import React, { useEffect, useMemo, useState } from 'react'
import { getAllOrders } from '@/api/adminApi'
import { Order } from '@/types/Order'
import apiClient from '@/apiClient'
import { toast } from 'sonner'

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Bộ lọc */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Khách hàng</label>
          <input
            value={filters.customer}
            onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
            placeholder="Tên khách hàng"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as OrderStatus }))}
            className="border rounded px-2 py-1 w-full"
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
          <label className="block text-sm font-medium mb-1">Từ ngày</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Đến ngày</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="col-span-6 flex gap-2">
          <button onClick={resetFilters} className="border px-3 py-2 rounded">
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Paid</th>
              <th className="px-3 py-2">Delivered</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="px-3 py-2">{o.user?.name ?? 'Guest'}</td>
                <td className="px-3 py-2">
                  {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-3 py-2">{Number(o.totalPrice).toLocaleString('vi-VN')} ₫</td>
                <td className="px-3 py-2">{o.isPaid ? '✅' : '❌'}</td>
                <td className="px-3 py-2">{o.isDelivered ? '✅' : '❌'}</td>
                <td className="px-3 py-2">
                  <span className="inline-block rounded px-2 py-0.5 bg-gray-100 mr-2">
                    {STATUS_LABELS[o.status ?? 'pending']}
                  </span>
                  <select
                    disabled={updatingId === o._id}
                    value={o.status ?? 'pending'}
                    onChange={(e) => updateStatus(o._id!, e.target.value as OrderStatus)}
                    className="border rounded px-2 py-1"
                  >
                    {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((k) => (
                      <option key={k} value={k}>
                        {STATUS_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button className="border px-3 py-1 rounded" onClick={() => setSelected(o)}>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
              <button className="text-gray-600" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-1">Khách hàng</div>
                <div>{selected.user?.name ?? 'Guest'}</div>
                <div className="font-medium mt-3 mb-1">Thông tin vận chuyển</div>
                <div className="text-sm text-gray-700">
                  {selected.shippingAddress?.fullName}
                  <br />
                  {selected.shippingAddress?.address}, {selected.shippingAddress?.city}
                  <br />
                  {selected.shippingAddress?.postalCode}, {selected.shippingAddress?.country}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Trạng thái</div>
                <div>{STATUS_LABELS[selected.status ?? 'pending']}</div>
                <div className="font-medium mt-3 mb-1">Tổng tiền</div>
                <div>{Number(selected.totalPrice).toLocaleString('vi-VN')} ₫</div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Cập nhật trạng thái</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={selected.status ?? 'pending'}
                    onChange={(e) => updateStatus(selected._id!, e.target.value as OrderStatus)}
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

            <div className="font-medium mt-4 mb-2">Sản phẩm</div>
            <div className="max-h-64 overflow-auto border rounded">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-3 py-2">Tên</th>
                    <th className="px-3 py-2">SL</th>
                    <th className="px-3 py-2">Giá</th>
                    <th className="px-3 py-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.orderItems ?? []).map((it: OrderItemLite) => (
                    <tr key={it._id} className="border-t">
                      <td className="px-3 py-2">{it.name}</td>
                      <td className="px-3 py-2">{it.quantity}</td>
                      <td className="px-3 py-2">{Number(it.price).toLocaleString('vi-VN')} ₫</td>
                      <td className="px-3 py-2">
                        {(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN')} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4">
              <button className="border px-4 py-2 rounded" onClick={() => setSelected(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}