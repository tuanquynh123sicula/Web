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

export default function OrderHistoryPage() {
  const navigate = useNavigate()

  const { data: orders, isPending, error, refetch } = useGetOrderHistoryQuery()
  const deleteOrder = useDeleteOrderMutation()
  const deleteAllOrders = useDeleteAllOrdersMutation()

  const handleDelete = async (id: string) => {
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
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Order History</h1>
        <Button
          variant="danger"
          onClick={handleDeleteAll}
          disabled={deleteAllOrders.isPending || (orders?.length || 0) === 0}
        >
          Xóa tất cả
        </Button>
      </div>

      {isPending ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {(orders as Order[]).map((order) => {
              const status: OrderStatus =
                (order as unknown as { status?: OrderStatus }).status ??
                (order.isDelivered ? 'delivered' : 'pending')
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>{Number(order.totalPrice).toLocaleString('vi-VN')} ₫</td>
                  <td>{order.isPaid ? 'Yes' : 'No'}</td>
                  <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                  <td>
                    <span className="badge bg-secondary">{STATUS_LABELS[status]}</span>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      Details
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(order._id)}
                      disabled={deleteOrder.isPending || status !== 'canceled'}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </div>
  )
}