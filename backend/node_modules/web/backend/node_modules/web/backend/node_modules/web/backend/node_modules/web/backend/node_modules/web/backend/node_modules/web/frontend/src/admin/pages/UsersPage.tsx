import React, { useEffect, useState } from 'react'
import { getAllUsers, deleteUser, updateUserRoleTier, getUserOrders } from '@/api/adminApi'
import { toast } from 'sonner'
import { User } from '@/types/User'
import { X, Shield, User as UserIcon } from 'lucide-react'

type OrderLite = {
  _id: string
  createdAt: string
  totalPrice: number
  status?: 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled'
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang vận chuyển',
  delivered: 'Đã giao hàng',
  canceled: 'Đã hủy',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  packing: 'bg-blue-100 text-blue-700',
  shipping: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<OrderLite[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const load = async () => {
    try {
      setIsLoading(true)
      const data = await getAllUsers()
      setUsers((data as User[]).map(u => ({ tier: 'regular', ...u })))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá người dùng này không?')) return
    try {
      setIsLoading(true)
      await deleteUser(id)
      toast.success('Xoá người dùng thành công')
      load()
    } catch {
      toast.error('Lỗi khi xoá người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (u: User) => {
    try {
      setIsLoading(true)
      await updateUserRoleTier(u._id, { isAdmin: !!u.isAdmin, tier: u.tier ?? 'regular' })
      toast.success('Cập nhật quyền / hạng khách hàng thành công')
      load()
    } catch {
      toast.error('Lỗi khi cập nhật')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewOrders = async (u: User) => {
    setSelectedUser(u)
    setLoadingOrders(true)
    try {
      const data = await getUserOrders(u._id)
      setOrders(data as OrderLite[])
    } catch {
      toast.error('Lỗi khi tải đơn hàng')
    } finally {
      setLoadingOrders(false)
    }
  }

  const updateLocal = (id: string, patch: Partial<User>) => {
    setUsers(prev => prev.map(u => (u._id === id ? { ...u, ...patch } : u)))
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
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-gray-500 mt-1">Tổng: {users.length} người dùng</p>
      </div>

      <div className="bg-white border shadow-md animate-slide-down transition-all duration-500 hover:shadow-lg overflow-x-auto" style={{ animationDelay: '0.1s' }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b transition-colors duration-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Admin</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Hạng</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr 
                key={u._id} 
                className="border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <td className="px-4 py-3 font-medium text-gray-900 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} className="text-gray-400" />
                    {u.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 transition-colors duration-300">{u.email}</td>
                <td className="px-4 py-3 transition-all duration-300">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!u.isAdmin}
                      onChange={e => updateLocal(u._id, { isAdmin: e.target.checked })}
                      className="w-4 h-4 cursor-pointer transition-all duration-300"
                    />
                    {u.isAdmin && <Shield size={16} className="ml-2 text-blue-600" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="border px-3 py-1 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                    value={u.tier ?? 'regular'}
                    onChange={e => updateLocal(u._id, { tier: e.target.value as User['tier'] })}
                  >
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="new">New</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm active:scale-95 disabled:opacity-50"
                      onClick={() => handleSave(u)}
                      disabled={isLoading}
                    >
                      Lưu
                    </button>
                    <button 
                      className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-400 hover:shadow-sm active:scale-95 disabled:opacity-50"
                      onClick={() => handleViewOrders(u)}
                      disabled={isLoading}
                    >
                      Đơn hàng
                    </button>
                    <button 
                      className="border border-red-300 text-red-600 px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-sm active:scale-95 disabled:opacity-50"
                      onClick={() => handleDelete(u._id)}
                      disabled={isLoading}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không có người dùng nào</p>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 w-full max-w-3xl shadow-xl animate-fade-in transform transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Đơn hàng của {selectedUser.name}</h2>
              <button 
                className="p-1 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                onClick={() => setSelectedUser(null)}
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">Người dùng này chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto border shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Tổng tiền</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, idx) => (
                      <tr 
                        key={o._id} 
                        className="border-b last:border-none hover:bg-gray-50 transition-colors duration-300"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="px-4 py-3 font-mono text-gray-600">{String(o._id).slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {Number(o.totalPrice).toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium transition-all duration-300 ${STATUS_COLORS[o.status ?? 'pending']}`}>
                            {STATUS_LABELS[o.status ?? 'pending']}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="border px-6 py-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-95"
                onClick={() => setSelectedUser(null)}
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