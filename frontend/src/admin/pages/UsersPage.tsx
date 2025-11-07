// ...existing code...
import React, { useEffect, useState } from 'react'
import { getAllUsers, deleteUser, updateUserRoleTier, getUserOrders } from '@/api/adminApi'
import { toast } from 'sonner'
import { User } from '@/types/User'

type OrderLite = {
  _id: string
  createdAt: string
  totalPrice: number
  status?: 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<OrderLite[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const load = async () => {
    const data = await getAllUsers()
    setUsers((data as User[]).map(u => ({ tier: 'regular', ...u })))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete user?')) return
    await deleteUser(id)
    toast.success('User deleted')
    load()
  }

  const handleSave = async (u: User) => {
    await updateUserRoleTier(u._id, { isAdmin: !!u.isAdmin, tier: u.tier ?? 'regular' })
    toast.success('Cập nhật quyền / hạng khách hàng thành công')
    load()
  }

  const handleViewOrders = async (u: User) => {
    setSelectedUser(u)
    setLoadingOrders(true)
    try {
      const data = await getUserOrders(u._id)
      setOrders(data as OrderLite[])
    } finally {
      setLoadingOrders(false)
    }
  }

  const updateLocal = (id: string, patch: Partial<User>) => {
    setUsers(prev => prev.map(u => (u._id === id ? { ...u, ...patch } : u)))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Admin</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={!!u.isAdmin}
                    onChange={e => updateLocal(u._id, { isAdmin: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.tier ?? 'regular'}
                    onChange={e => updateLocal(u._id, { tier: e.target.value as User['tier'] })}
                  >
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="new">New</option>
                  </select>
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button className="border px-3 py-1 rounded" onClick={() => handleSave(u)}>
                    Lưu
                  </button>
                  <button className="border px-3 py-1 rounded" onClick={() => handleViewOrders(u)}>
                    Đơn hàng
                  </button>
                  <button className="border px-3 py-1 rounded text-red-600" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Đơn hàng của {selectedUser.name}</h2>
              <button className="text-gray-600" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            {loadingOrders ? (
              <div className="p-6">Đang tải...</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-gray-600">Không có đơn hàng</div>
            ) : (
              <table className="min-w-full text-left border rounded">
                <thead>
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-t">
                      <td className="px-3 py-2">{o._id}</td>
                      <td className="px-3 py-2">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-3 py-2">{Number(o.totalPrice).toLocaleString('vi-VN')} ₫</td>
                      <td className="px-3 py-2">
                        {(o.status ?? 'pending')
                          .replace('pending', 'Chờ xác nhận')
                          .replace('packing', 'Đang đóng gói')
                          .replace('shipping', 'Đang vận chuyển')
                          .replace('delivered', 'Đã giao hàng')
                          .replace('canceled', 'Đã hủy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="text-right mt-4">
              <button className="border px-4 py-2 rounded" onClick={() => setSelectedUser(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// ...existing code...