import { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'
import type { ApiError } from '../types/ApiError'
import axios from 'axios'
import type { CartItem, ShippingAddress } from '@/types/Cart'

export type CreateOrderInput = {
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  discount?: number
  totalPrice: number
}

export default function PlaceOrderPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  // Đồng bộ hạng thành viên mới nhất từ backend (tránh tình trạng userInfo cũ)
  const [resolvedTier, setResolvedTier] = useState<'regular' | 'vip' | 'new'>(
    ((userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular')
  )

  useEffect(() => {
    let mounted = true
    if (!userInfo) {
      navigate('/signin')
      return
    }
    // Lấy profile để cập nhật tier mới nhất
    axios
      .get('http://localhost:4000/api/users/profile', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      .then((res) => {
        if (mounted) {
          const t = (res.data?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
          setResolvedTier(t)
        }
      })
      .catch(() => {
        // giữ nguyên tier cũ nếu lỗi
      })
    return () => {
      mounted = false
    }
  }, [userInfo, navigate])

  // Hạng thành viên hiện tại
  const tier = resolvedTier
  const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }

  // Tính toán giá trị đơn hàng
  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = useMemo(
    () => round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)),
    [cart.cartItems]
  )
  const discount = useMemo(() => Math.round(itemsPrice * rateMap[tier]), [itemsPrice, tier])
  const shippingPrice = useMemo(
    () => (itemsPrice - discount >= 1_000_000 || tier === 'vip' ? 0 : 30000),
    [itemsPrice, discount, tier]
  )
  const taxPrice = 0
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discount

  // Cập nhật lại cart để giữ tương thích luồng hiện tại
  cart.itemsPrice = itemsPrice
  cart.shippingPrice = shippingPrice
  cart.taxPrice = taxPrice
  cart.totalPrice = totalPrice

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation()

  // Tạo đơn + điều hướng VNPay (nếu chọn)
  const handleVNPayPayment = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount,
        totalPrice,
      })

      // Dọn giỏ
      localStorage.removeItem('cartItems')
      localStorage.removeItem('shippingAddress')
      localStorage.removeItem('paymentMethod')
      dispatch({ type: 'CART_CLEAR' })

      if (cart.paymentMethod === 'VNPAY') {
        const response = await axios.post('http://localhost:4000/api/vnpay/create_payment_url', {
          amount: data.order.totalPrice,
          orderId: data.order._id,
        })
        window.location.href = response.data.paymentUrl
      } else {
        navigate(`/order/${data.order._id}`)
      }
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment')
  }, [cart, navigate])

  const imageUrl = (src?: string) => {
    if (!src) return '/images/placeholder.png'
    if (src.startsWith('http')) return src
    if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
    if (src.startsWith('/')) return src
    return `/images/${src}`
  }

  return (
    <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Đặt hàng</title>
      </Helmet>
      <h1 className="my-3">Xác nhận đơn hàng</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Địa chỉ giao hàng</Card.Title>
              <Card.Text>
                <strong>Tên:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Địa chỉ:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Chỉnh sửa</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Phương thức thanh toán</Card.Title>
              <Card.Text>
                <strong>Hình thức:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Chỉnh sửa</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Sản phẩm</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={imageUrl(item.image)}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                          style={{ maxWidth: 64, maxHeight: 64, objectFit: 'contain' }}
                        />{' '}
                        <Link to={`/product/${item.slug ?? item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>{item.price.toLocaleString('vi-VN')} ₫</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Chỉnh sửa</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Tổng đơn hàng</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Tạm tính</Col>
                    <Col>{itemsPrice.toLocaleString('vi-VN')} ₫</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      Giảm theo hạng{' '}
                      <span className="badge bg-warning text-dark">{tier.toUpperCase()}</span>
                    </Col>
                    <Col>-{discount.toLocaleString('vi-VN')} ₫</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Phí vận chuyển</Col>
                    <Col>{shippingPrice.toLocaleString('vi-VN')} ₫</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Thuế</Col>
                    <Col>{taxPrice.toLocaleString('vi-VN')} ₫</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Tổng cộng</strong>
                    </Col>
                    <Col>
                      <strong>{totalPrice.toLocaleString('vi-VN')} ₫</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={handleVNPayPayment}
                      disabled={cart.cartItems.length === 0 || isPending}
                    >
                      {cart.paymentMethod === 'VNPAY'
                        ? 'Đặt hàng và Thanh toán VNPay'
                        : 'Đặt hàng (Thanh toán khi nhận)'}
                    </Button>
                  </div>
                  {isPending && <LoadingBox />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}