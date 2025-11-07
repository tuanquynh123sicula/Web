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
    <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>

      {/* ✅ Hiển thị thông báo đặt hàng thành công */}
      {paymentSuccess && (
        <MessageBox variant="success">
          🎉 Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua hàng.
        </MessageBox>
      )}

      <h1>
        Order #{orderId?.slice(0, 6).toUpperCase()} •{' '}
        <small>{new Date(order.createdAt).toLocaleDateString()}</small>
      </h1>

      <Row>
        <Col md={8}>
          {/* Shipping Info */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">Delivered at {order.deliveredAt}</MessageBox>
              ) : (
                <MessageBox variant="warning">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          {/* Payment Info */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>

              {order.isPaid ? (
                <MessageBox variant="success">
                  Đã thanh toán lúc{' '}
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleString()
                    : 'Không xác định thời gian'}
                </MessageBox>
              ) : (
                <div>
                  <MessageBox variant="warning">Chưa thanh toán</MessageBox>
                  <Button
                    variant="primary"
                    onClick={handlePaymentSuccess}
                    disabled={payOrder.isPending}
                  >
                    Xác nhận Thanh toán (Cash)
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Items */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Summary */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {order.shippingPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      {order.taxPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>
                        {order.totalPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
