import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getAllProducts, getAllOrders, getAllUsers } from "@/api/adminApi"
import type { Order } from "@/types/Order"
import type { ValueType } from "recharts/types/component/DefaultTooltipContent"

type OrderStatus = "pending" | "packing" | "shipping" | "delivered" | "canceled"
type OrderWithUser = Order & {
  createdAt: string | Date
  status?: OrderStatus
  user?: { name?: string } | null
}

export default function DashboardPage() {
  const [usersCount, setUsersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [orders, setOrders] = useState<OrderWithUser[]>([])
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, products, ordersData] = await Promise.all([getAllUsers(), getAllProducts(), getAllOrders()])
        setUsersCount(Array.isArray(users) ? users.length : 0)
        setProductsCount(Array.isArray(products) ? products.length : 0)
        const ods = (ordersData ?? []) as OrderWithUser[]
        setOrders(ods)
        setRevenue(ods.reduce((sum, o) => sum + Number(o.totalPrice ?? 0), 0))
      } catch (err) {
        console.error("Error loading dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toDate = (d?: string | Date) => (d ? new Date(d) : new Date(0))
  const formatVND = (n: number) => `${Number(n).toLocaleString("vi-VN")} ₫`

  // Doanh thu theo tháng (YYYY-MM) -> sort tăng dần
  const monthlyMap = orders.reduce<Record<string, number>>((acc, o) => {
    const d = toDate(o.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    acc[key] = (acc[key] || 0) + Number(o.totalPrice ?? 0)
    return acc
  }, {})
  const chartData = Object.entries(monthlyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, sales]) => ({
      name: new Date(`${key}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
      sales,
    }))

  const recentOrders = [...orders]
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, 5)

  if (loading) return <div className="text-center mt-20 text-muted-foreground">Đang tải dữ liệu...</div>

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động kinh doanh</p>
        </div>
        <Button onClick={() => window.location.reload()}>Làm mới</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Người dùng" value={usersCount} icon={<Users />} color="blue" />
        <StatCard title="Sản phẩm" value={productsCount} icon={<Package />} color="green" />
        <StatCard title="Đơn hàng" value={orders.length} icon={<ShoppingCart />} color="yellow" />
        <StatCard title="Doanh thu" value={formatVND(revenue)} icon={<DollarSign />} color="emerald" />
      </div>

      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip formatter={(value: ValueType) => formatVND(Number(value))} />
                        <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">User</th>
                  <th className="py-2 text-left">Total</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id} className="border-b last:border-none hover:bg-muted/40 transition">
                    <td className="py-2">{String(o._id).slice(0, 6)}...</td>
                    <td>{o.createdAt ? toDate(o.createdAt).toLocaleDateString("vi-VN") : "-"}</td>
                    <td>{o.user?.name ?? "Unknown"}</td>
                    <td>{formatVND(Number(o.totalPrice ?? 0))}</td>
                    <td>
                      <StatusBadge order={o} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    emerald: "bg-emerald-100 text-emerald-600",
  }
  return (
    <Card className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2 rounded-full ${colorMap[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  )
}

function StatusBadge({ order }: { order: OrderWithUser }) {
  const base = "px-2 py-1 text-xs rounded-full font-medium"
  const status: OrderStatus = order.status ?? (order.isDelivered ? "delivered" : "pending")
  const map: Record<OrderStatus, { text: string; cls: string }> = {
    pending: { text: "Chờ xác nhận", cls: `${base} bg-yellow-100 text-yellow-700` },
    packing: { text: "Đang đóng gói", cls: `${base} bg-blue-100 text-blue-700` },
    shipping: { text: "Đang vận chuyển", cls: `${base} bg-indigo-100 text-indigo-700` },
    delivered: { text: "Đã giao hàng", cls: `${base} bg-green-100 text-green-700` },
    canceled: { text: "Đã hủy", cls: `${base} bg-red-100 text-red-700` },
  }
  return <span className={map[status].cls}>{map[status].text}</span>
}