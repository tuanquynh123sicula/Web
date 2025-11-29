import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import type { ApiError } from '../types/ApiError'
import type { Order } from '../types/Order'
import {
  useGetOrderHistoryQuery,
  useDeleteOrderMutation,
  useDeleteAllOrdersMutation,
} from '../hooks/orderHooks'
import { toast } from 'sonner'

type OrderStatus = 'pending' | 'packing' | 'shipping' | 'delivered' | 'canceled'
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang vận chuyển',
  delivered: 'Đã giao hàng',
  canceled: 'Đã hủy',
}

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'bg-success text-white'
    case 'shipping':
    case 'packing':
      return 'bg-primary text-white'
    case 'canceled':
      return 'bg-danger text-white'
    case 'pending':
    default:
      return 'bg-warning text-dark'
  }
}

export default function OrderHistoryPage() {
  const navigate = useNavigate()

  const { data: orders, isPending, error, refetch } = useGetOrderHistoryQuery()
  const deleteOrder = useDeleteOrderMutation()
  const deleteAllOrders = useDeleteAllOrdersMutation()

  const handleDelete = async (id: string) => {
    // Giữ nguyên logic xóa (chỉ xóa khi đã HỦY, theo logic đã sửa)
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return
    try {
      await deleteOrder.mutateAsync(id)
      toast.success('Đã xóa đơn hàng')
      refetch()
    } catch (err) {
      toast.error(getError(err as unknown as ApiError))
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠ Bạn có chắc muốn xóa TẤT CẢ đơn hàng?')) return
    try {
      await deleteAllOrders.mutateAsync()
      toast.success('Đã xóa tất cả đơn hàng')
      refetch()
    } catch (err) {
      toast.error(getError(err as unknown as ApiError))
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <Helmet>
          <title>Lịch sử Đơn hàng</title>
        </Helmet>

        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="text-3xl font-bold text-gray-900 m-0">Lịch sử Đơn hàng</h1>
          <Button
            variant="danger"
            onClick={handleDeleteAll}
            disabled={deleteAllOrders.isPending || (orders?.length || 0) === 0}
            className="py-2 px-4 font-semibold hover:bg-red-700 transition-colors"
          >
            Xóa tất cả
          </Button>
        </div>
      
        {isPending ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
            <Table striped hover responsive className="text-sm">
              <thead>
                <tr>
                  <th className="text-gray-700">MÃ ĐH</th>
                  <th className="text-gray-700">NGÀY</th>
                  <th className="text-gray-700">TỔNG TIỀN</th>
                  <th className="text-gray-700">TT. THANH TOÁN</th>
                  <th className="text-gray-700">TT. GIAO HÀNG</th>
                  <th className="text-gray-700">TRẠNG THÁI</th>
                  <th className="text-gray-700">CHI TIẾT</th>
                  <th className="text-gray-700">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {(orders as Order[]).map((order) => {
                  const status: OrderStatus =
                    (order as unknown as { status?: OrderStatus }).status ??
                    (order.isDelivered ? 'delivered' : 'pending')

                  // Cho phép xóa nếu trạng thái là đã HỦY (canceled)
                  const canDelete = status === 'canceled'; 

                  return (
                    <tr key={order._id}>
                      <td className="font-medium">{order._id.slice(-6).toUpperCase()}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="font-semibold text-gray-800">
                        {Number(order.totalPrice).toLocaleString('vi-VN')} ₫
                      </td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge bg-success">Đã Thanh Toán</span>
                        ) : (
                          <span className="badge bg-danger">Chưa Thanh Toán</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="badge bg-success">Đã Giao</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Chưa Giao</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(status)} text-xs p-2`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="gray-100" 
                          size="sm"
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="py-1 px-3 font-semibold text-black hover:bg-gray-100 transition-colors"
                        >
                          Xem
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(order._id)}
                          // Chỉ cho phép xóa nếu trạng thái là Đã hủy (canceled)
                          disabled={deleteOrder.isPending || !canDelete} 
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}