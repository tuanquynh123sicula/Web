import { useContext, useEffect } from 'react'
import { Card, Col, ListGroup, Row, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useParams, useLocation } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../hooks/orderHooks'
import { Store } from '../Store'
import type { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function OrderPage() {
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const params = useParams()
  const { id: orderId } = params
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const paymentSuccess = searchParams.get('success') === 'true'

  const {
    data: order,
    isPending,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!, userInfo!)

  const imageUrl = (src?: string) => {
    if (!src) return '/images/placeholder.png'
    if (src.startsWith('http')) return src
    if (src.startsWith('/images/')) return src
    if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
    if (src.startsWith('/')) return src
    return `/images/${src}`
  }
  const payOrder = usePayOrderMutation()

  // ✅ Khi VNPay redirect về → cập nhật trạng thái đơn hàng & xóa giỏ hàng
  useEffect(() => {
    if (window.location.search.includes('vnp_') && order && !order.isPaid) {
      const confirmPayment = async () => {
        try {
          console.log('🔄 Đang cập nhật thanh toán cho đơn:', orderId)

          await payOrder.mutateAsync({
            orderId: orderId!,
            token: userInfo!.token,
            paymentResult: { status: 'Paid' },
          })

          // Xóa giỏ hàng khi thanh toán thành công
          dispatch({ type: 'CART_CLEAR' })
          localStorage.removeItem('cartItems')

          await refetch()

          // Dọn URL để tránh lặp lại
          window.history.replaceState({}, '', `/order/${orderId}?success=true`)
        } catch (err) {
          console.error('❌ Lỗi khi cập nhật thanh toán:', err)
        }
      }

      confirmPayment()
    }
  }, [order, payOrder, orderId, userInfo, dispatch, refetch])

  // ✅ Khi người dùng chọn thanh toán Cash thủ công
  const handlePaymentSuccess = async () => {
    try {
      await payOrder.mutateAsync({
        orderId: orderId!,
        token: userInfo!.token,
        paymentResult: { status: 'Paid' },
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      await refetch()
      window.history.replaceState({}, '', `/order/${orderId}?success=true`)
    } catch {
      alert('Lỗi khi cập nhật trạng thái thanh toán')
    }
  }

  return isPending ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  ) : (
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <Helmet>
          <title>Order {orderId}</title>
        </Helmet>

        {/* Hiển thị thông báo đặt hàng thành công */}
        {paymentSuccess && (
          <div className="mb-4">
            <MessageBox variant="success">
              🎉 Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua hàng.
            </MessageBox>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Đơn hàng #<span className="text-red-600">{orderId?.slice(0, 8).toUpperCase()}</span>
          <small className="text-base text-gray-500 ml-3 font-normal">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
          </small>
        </h1>

        <Row className="g-4">
          <Col md={8}>
            {/* Shipping Info */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1"> 
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800">Thông tin giao hàng</Card.Title>
                <Card.Text className="text-gray-600 mt-2 transition-colors duration-200">
                  <strong>Tên:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">Đã giao hàng lúc {order.deliveredAt}</MessageBox>
                ) : (
                  <MessageBox variant="warning">Chưa giao hàng</MessageBox>
                )}
              </Card.Body>
            </Card>

            {/* Payment Info */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1  "> {/* Loại bỏ rounded-lg */}
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800">Thông tin thanh toán</Card.Title>
                <Card.Text className="text-gray-600 mt-2 transition-colors duration-200">
                  <strong>Phương thức:</strong> <span className="font-semibold">{order.paymentMethod}</span>
                </Card.Text>

                {order.isPaid ? (
                  <MessageBox variant="success">
                    Đã thanh toán lúc{' '}
                    {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Không xác định thời gian'}
                  </MessageBox>
                ) : (
                  <div>
                    <MessageBox variant="warning">Chưa thanh toán</MessageBox>
                    {order.paymentMethod === 'Cash' && (
                      <Button
                        variant="dark"
                        onClick={handlePaymentSuccess}
                        disabled={payOrder.isPending}
                        className="mt-2 py-2 px-6 font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200"
                      >
                        Xác nhận Thanh toán (Thủ công)
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Items */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1 "> {/* Loại bỏ rounded-lg */}
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800 mb-3">Sản phẩm</Card.Title>
                <ListGroup variant="flush" className="border-t border-gray-200">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id} className="bg-white px-0 py-3 border-b">
                      <Row className="align-items-center">
                        <Col md={6} className="flex items-center">
                          <img
                            src={imageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-contain mr-3 transition-transform duration-200"
                            style={{ border: '1px solid #e0e0e0' }}
                          />
                          <div>
                            <Link
                              to={`/product/${item.slug ?? item._id}`}
                              className="font-semibold text-gray-700 hover:text-black transition-colors duration-200"
                            >
                              {item.name}
                            </Link>
                            {item.variant && (
                              <div className="text-muted text-xs mt-1 transition-colors duration-200">
                                {item.variant.color} / {item.variant.storage} / {item.variant.ram}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col md={3} className="text-center font-semibold text-gray-700 transition-colors duration-200">
                          SL: {item.quantity}
                        </Col>
                        <Col md={3} className="text-right font-bold text-gray-800 transition-colors duration-200">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Summary */}
          <Col md={4}>
            <Card className="mb-3 hover:scale-105"> {/* Loại bỏ rounded-lg */}
              <Card.Body className="p-4">
                <Card.Title className="text-2xl font-bold text-gray-900 mb-3">Tổng đơn hàng</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-white p-2 flex justify-between transition-colors duration-200">
                    <span className="text-gray-700">Tổng tiền hàng</span>
                    <span className="font-semibold">{order.itemsPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  {order.discount && order.discount > 0 && (
                    <ListGroup.Item className="bg-white p-2 flex justify-between transition-colors duration-200">
                      <span className="text-gray-700">Giảm giá (Hạng)</span>
                      <span className="font-semibold text-red-600">- {order.discount.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="bg-white p-2 flex justify-between transition-colors duration-200">
                    <span className="text-gray-700">Phí vận chuyển</span>
                    <span className="font-semibold">{order.shippingPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  <ListGroup.Item className="bg-white p-2 flex justify-between transition-colors duration-200">
                    <span className="text-gray-700">Thuế</span>
                    <span className="font-semibold">{order.taxPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  <ListGroup.Item className="bg-white p-2 mt-2 pt-3 border-t-2 border-gray-300 flex justify-between transition-colors duration-200">
                    <span className="text-xl font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-xl font-bold text-red-600">
                      {order.totalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}