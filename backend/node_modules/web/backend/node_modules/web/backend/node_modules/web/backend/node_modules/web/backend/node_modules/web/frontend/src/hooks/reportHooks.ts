import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { ApiError } from '../types/ApiError'

// Định nghĩa kiểu dữ liệu cho Dữ liệu báo cáo
interface DailySale {
  date: string
  sales: number
}

interface MonthlySale {
  month: string
  sales: number
}

interface TopSellingProduct {
  _id: string
  name: string
  count: number
  totalRevenue: number
}

interface SummaryReport {
  totalSales: number
  totalOrders: number
  totalUsers: number
  dailySales: DailySale[]
  monthlySales: MonthlySale[]
  topSellingProducts: TopSellingProduct[]
}

// Hook để lấy báo cáo tổng hợp
export const useGetSummaryReportQuery = () =>
  useQuery<SummaryReport, ApiError>({
    queryKey: ['admin-summary-report'],
    queryFn: async () => (await apiClient.get<SummaryReport>(`/api/admin/reports/summary`)).data,
  })

// Helper function để thêm BOM cho UTF-8
const addUtf8Bom = (content: string): string => {
  return '\uFEFF' + content
}

// Helper function để escape CSV
const escapeCsvField = (field: string | number | boolean | null | undefined): string => {
  if (field === null || field === undefined) return '""'
  const stringField = String(field)
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`
  }
  return stringField
}

// --- Chức năng Export ---
export const useExportReport = () => {
  const exportOrders = async (
    startDate: string | null = null,
    endDate: string | null = null
  ) => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiClient.get(`/api/admin/orders`, {
        params: params,
      })

      const orders = response.data
      if (!orders || orders.length === 0) {
        alert('Không có dữ liệu đơn hàng để xuất.')
        return
      }

      // Tiêu đề cột
      const headers = [
        'ID Đơn Hàng',
        'Tổng Tiền',
        'Tên Khách Hàng',
        'Email',
        'Địa Chỉ',
        'Trạng Thái Thanh Toán',
        'Trạng Thái Giao Hàng',
        'Ngày Tạo',
      ]

      // Dữ liệu hàng
      const rows = orders.map((order) => [
        escapeCsvField(order._id),
        escapeCsvField(order.totalPrice),
        escapeCsvField(order.user?.name || 'N/A'),
        escapeCsvField(order.user?.email || 'N/A'),
        escapeCsvField(order.shippingAddress?.address || 'N/A'),
        escapeCsvField(order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'),
        escapeCsvField(order.isDelivered ? 'Đã giao' : 'Chưa giao'),
        escapeCsvField(new Date(order.createdAt).toLocaleDateString('vi-VN')),
      ])

      // Tạo content CSV
      const csvHeaders = headers.map(escapeCsvField).join(',')
      const csvRows = rows.map(row => row.join(',')).join('\n')
      const csvContent = csvHeaders + '\n' + csvRows

      // Thêm UTF-8 BOM để Excel đọc đúng font Tiếng Việt
      const csvWithBom = addUtf8Bom(csvContent)

      // Tải file về máy
      const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bao_cao_don_hang_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ File CSV exported successfully')
    } catch (error) {
      console.error('❌ Lỗi khi xuất file:', error)
      alert('Đã xảy ra lỗi khi xuất file.')
    }
  }

  // Export to Excel (XLSX format)
  const exportOrdersToExcel = async (
    startDate: string | null = null,
    endDate: string | null = null
  ) => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiClient.get(`/api/admin/orders`, {
        params: params,
      })

      const orders = response.data
      if (!orders || orders.length === 0) {
        alert('Không có dữ liệu đơn hàng để xuất.')
        return
      }

      // Lưu ý: Cần cài đặt library xlsx: npm install xlsx
      // import * as XLSX from 'xlsx'
      
      const data = orders.map((order) => ({
        'ID Đơn Hàng': order._id,
        'Tổng Tiền': order.totalPrice,
        'Tên Khách Hàng': order.user?.name || 'N/A',
        'Email': order.user?.email || 'N/A',
        'Địa Chỉ': order.shippingAddress?.address || 'N/A',
        'Trạng Thái Thanh Toán': order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
        'Trạng Thái Giao Hàng': order.isDelivered ? 'Đã giao' : 'Chưa giao',
        'Ngày Tạo': new Date(order.createdAt).toLocaleDateString('vi-VN'),
      }))

      // Tạo workbook
      const ws = XLSX.utils.json_to_sheet(data, {
        header: ['ID Đơn Hàng', 'Tổng Tiền', 'Tên Khách Hàng', 'Email', 'Địa Chỉ', 'Trạng Thái Thanh Toán', 'Trạng Thái Giao Hàng', 'Ngày Tạo']
      })
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Đơn Hàng')

      // Tải file
      XLSX.writeFile(wb, `bao_cao_don_hang_${new Date().toISOString().split('T')[0]}.xlsx`)
      
      console.log('✅ File Excel exported successfully')
    } catch (error) {
      console.error('❌ Lỗi khi xuất file Excel:', error)
      alert('Đã xảy ra lỗi khi xuất file Excel.')
    }
  }

  return { exportOrders, exportOrdersToExcel }
}