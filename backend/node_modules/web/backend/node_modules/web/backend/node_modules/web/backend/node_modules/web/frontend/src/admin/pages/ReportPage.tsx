import React, { useState, useEffect } from 'react'
import {
  useGetSummaryReportQuery,
  useExportReport,
} from '../../hooks/reportHooks'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/ui/table'
import { Separator } from '../../components/ui/separator'
import { formatCurrency } from '../../utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Download } from 'lucide-react'
import { getAllOrders } from '../../api/adminApi'
import type { Order } from '../../types/Order'

// Helper function để xử lý Tooltip cho Recharts
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg animate-fadeIn">
//         <p className="font-semibold text-gray-800">{label}</p>
//         <p className="text-sm text-blue-600">{`Doanh số: ${formatCurrency(payload[0].value)}`}</p>
//       </div>
//     )
//   }
//   return null
// }

const ReportPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  })
  const [isExporting, setIsExporting] = useState(false)

  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: errorSummary,
  } = useGetSummaryReportQuery()
  const { exportOrders } = useExportReport()

  // Load orders to compute monthly revenue like Dashboard
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const ods = await getAllOrders()
        setOrders(Array.isArray(ods) ? ods : [])
      } catch (e) {
        console.error('Error loading orders for monthly chart:', e)
      }
    })()
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportOrders(dateFilter.startDate, dateFilter.endDate)
    } finally {
      setIsExporting(false)
    }
  }

  const toDate = (d?: string | Date) => (d ? new Date(d) : new Date(0))
  const formatMonthLabel = (ym: string) =>
    new Date(`${ym}-01T00:00:00`).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })

  // Daily sales for line chart (unchanged)
  const dailySalesData = summary?.dailySales.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
  })) || []

  // Fallback monthly sales from summary
  const monthlySalesData = summary?.monthlySales.map(m => ({ ...m })) || []

  // Dashboard-like monthly revenue aggregation from orders
  const monthlyMap = orders.reduce<Record<string, number>>((acc, o) => {
    const d = toDate(o.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    acc[key] = (acc[key] || 0) + Number((o).totalPrice ?? 0)
    return acc
  }, {})

  const chartData =
    orders.length > 0
      ? Object.entries(monthlyMap)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, sales]) => ({
            name: formatMonthLabel(key),
            sales,
          }))
      : monthlySalesData
          .sort((a, b) => String(a.month).localeCompare(String(b.month)))
          .map(m => ({
            name: formatMonthLabel(String(m.month)),
            sales: Number(m.sales || 0),
          }))

  if (isLoadingSummary) return <LoadingBox />
  if (errorSummary)
    return (
      <MessageBox variant="danger">
        {errorSummary.message || 'Lỗi khi tải dữ liệu báo cáo.'}
      </MessageBox>
    )

  const totalSales = summary?.totalSales || 0

  return (
    <div className="p-6 space-y-8">
      {/* Title với animation */}
      <div className="animate-slideDown">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Báo Cáo & Thống Kê</h1>
            <p className="text-gray-500 mt-2">Tổng quan hoạt động kinh doanh chi tiết</p>
          </div>
        </div>
      </div>

      {/* 1. KPI Tổng quan - Grid với stagger animation - Giống Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Doanh Thu"
            value={formatCurrency(totalSales)}
            icon={<DollarSign />}
            color="emerald"
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="Đơn Hàng"
            value={summary?.totalOrders}
            icon={<ShoppingCart />}
            color="yellow"
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <StatCard
            title="Người Dùng"
            value={summary?.totalUsers}
            icon={<Users />}
            color="blue"
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <StatCard
            title="Doanh Thu TB/Tháng"
            value={formatCurrency(
              totalSales / (monthlySalesData.length || 1)
            )}
            icon={<TrendingUp />}
            color="green"
          />
        </div>
      </section>

      <Separator className="my-6" />

      {/* 2. Biểu đồ Doanh số theo ngày */}
      <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <Card className="shadow-md border transition-all duration-500 hover:shadow-lg">
          <CardHeader className="transition-all duration-300">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LineChart className="text-blue-600" />
              Doanh số 7 Ngày Gần Nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailySalesData}
                margin={{ top: 5, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                {/* Hiển thị VNĐ trên trục Y */}
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />
                {/* Tooltip hiển thị VNĐ */}
                <Tooltip
                  formatter={(value: ValueType) => formatCurrency(Number(value as number))}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3b82f6' }}
                  activeDot={{ r: 8, fill: '#1e40af' }}
                  name="Doanh số (VNĐ)"
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Biểu đồ Doanh số hàng tháng */}
      <div className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
        <Card className="shadow-md border transition-all duration-500 hover:shadow-lg">
          <CardHeader className="transition-all duration-300">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart className="text-green-600" />
              Tổng Doanh số theo Tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  width={90}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />
                <Tooltip
                  formatter={(value: ValueType) => formatCurrency(Number(value as number))}
                  contentStyle={{ transition: 'all 0.3s ease' }}
                />
                <Bar
                  dataKey="sales"
                  name="Doanh số"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* 4. Top Sản phẩm bán chạy & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Section */}
        <div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
          <Card className="shadow-md border transition-all duration-500 hover:shadow-lg h-full">
            <CardHeader className="transition-all duration-300">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Download size={20} className="text-indigo-600" />
                Xuất Báo Cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2 transform transition-all duration-300 hover:scale-105">
                <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 block">
                  Ngày bắt đầu
                </label>
                <Input
                  type="date"
                  id="start-date"
                  value={dateFilter.startDate}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, startDate: e.target.value })
                  }
                  className="transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:scale-105 border-gray-300 hover:border-indigo-400"
                />
              </div>
              <div className="space-y-2 transform transition-all duration-300 hover:scale-105">
                <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 block">
                  Ngày kết thúc
                </label>
                <Input
                  type="date"
                  id="end-date"
                  value={dateFilter.endDate}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, endDate: e.target.value })
                  }
                  className="transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:scale-105 border-gray-300 hover:border-indigo-400"
                />
              </div>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Download size={18} className="mr-2" />
                {isExporting ? 'Đang xuất...' : 'Xuất CSV'}
              </Button>
              <p className="text-xs text-gray-500 transition-all duration-300 hover:text-gray-700">
                *Nếu không chọn ngày, sẽ xuất tất cả đơn hàng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <div className="lg:col-span-2 animate-slideUp" style={{ animationDelay: '0.8s' }}>
          <Card className="shadow-md border transition-all duration-500 hover:shadow-lg h-full">
            <CardHeader className="transition-all duration-300">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package size={20} className="text-emerald-600" />
                Top 5 Sản Phẩm Bán Chạy Nhất
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-100 transition-colors duration-300">
                      <TableHead className="w-[50px] font-medium text-gray-600">Hạng</TableHead>
                      <TableHead className="font-medium text-gray-600">Tên Sản Phẩm</TableHead>
                      <TableHead className="text-right font-medium text-gray-600">SL Bán</TableHead>
                      <TableHead className="text-right font-medium text-gray-600">Doanh Thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary?.topSellingProducts && summary.topSellingProducts.length > 0 ? (
                      summary.topSellingProducts.map((product, index) => (
                        <TableRow
                          key={product._id}
                          className="transition-all duration-300 hover:bg-blue-50/50 cursor-pointer border-b last:border-none"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <TableCell className="font-semibold text-gray-700">
                            {index === 0 && <span className="text-lg"></span>}
                            {index === 1 && <span className="text-lg"></span>}
                            {index === 2 && <span className="text-lg"></span>}
                            {index >= 3 && <span className="text-lg"></span>}
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-gray-800 transition-colors duration-300">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">
                            {product.count}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-700">
                            {formatCurrency(product.totalRevenue)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          Chưa có dữ liệu bán hàng
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Smooth transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth hover effects */
        button {
          transition: all 0.3s ease;
        }

        button:active {
          transform: scale(0.98);
        }

        /* Table row smooth hover */
        tbody tr {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        tbody tr:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }

        /* Input focus animation */
        input {
          transition: all 0.3s ease;
        }

        input:focus {
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </div>
  )
}

// Component StatCard - Giống Dashboard
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number | undefined
  icon: React.ReactNode
  color: string
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  }

  return (
    <Card className="p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer hover:-translate-y-1 border">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-500 transition-colors duration-300">{title}</p>
        <div className={`p-2 transition-all duration-300 ${colorMap[color]} rounded-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold transition-colors duration-300">{value}</p>
    </Card>
  )
}

export default ReportPage