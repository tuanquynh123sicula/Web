import { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Col, ListGroup, Row, Form, InputGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'
import type { ApiError } from '../types/ApiError'
import axios from 'axios'
import type { CartItem, ShippingAddress } from '@/types/Cart'
import { FaTag } from 'react-icons/fa'

export type CreateOrderInput = {
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  discount?: number // Giảm giá theo hạng
  couponDiscount: number // Giảm giá theo Coupon
  totalPrice: number
}

const MOCK_COUPONS: Record<string, { type: 'fixed' | 'percentage', value: number }> = {
  'GIAM50K': { type: 'fixed', value: 50000 },
  'SALE10': { type: 'percentage', value: 0.10 }, 
  'VIPFREE': { type: 'fixed', value: 100000 },
  'GIAM100K': { type: 'fixed', value: 100000 }, 
  'FREESHIP': { type: 'fixed', value: 30000 },  
  'SALE15': { type: 'percentage', value: 0.15 }, 
}

export default function PlaceOrderPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

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

  // 1. ITEMS PRICE
  const itemsPrice = useMemo(
    () => round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)),
    [cart.cartItems]
  )
  
  // 2. TIER DISCOUNT
  const tierDiscount = useMemo(() => Math.round(itemsPrice * rateMap[tier]), [itemsPrice, tier])

  // 3. SHIPPING PRICE
  const shippingPrice = useMemo(
    () => (itemsPrice - tierDiscount >= 1_000_000 || tier === 'vip' ? 0 : 30000),
    [itemsPrice, tierDiscount, tier]
  )
  const taxPrice = 0

  // 4. FINAL TOTAL PRICE
  const totalPrice = itemsPrice + shippingPrice + taxPrice - tierDiscount - couponDiscount

  // Cập nhật lại cart để giữ tương thích luồng hiện tại
  cart.itemsPrice = itemsPrice
  cart.shippingPrice = shippingPrice
  cart.taxPrice = taxPrice
  cart.totalPrice = totalPrice

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation()

  // LOGIC XỬ LÝ ÁP DỤNG MÃ GIẢM GIÁ
  const handleApplyCoupon = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = couponCode.toUpperCase().trim();

    if (!code) {
      toast.error('Vui lòng nhập mã giảm giá.');
      return;
    }

    if (appliedCoupon === code) {
      toast.info('Mã này đã được áp dụng.');
      return;
    }

    const coupon = MOCK_COUPONS[code];

    if (coupon) {
      let discountValue = 0;
      if (coupon.type === 'fixed') {
        discountValue = coupon.value;
      } else if (coupon.type === 'percentage') {
        discountValue = Math.round(itemsPrice * coupon.value);
      }

      // Giới hạn giảm giá không vượt quá itemsPrice
      discountValue = Math.min(discountValue, itemsPrice); 
      
      setCouponDiscount(discountValue);
      setAppliedCoupon(code);
      toast.success(`Áp dụng mã ${code} thành công! Giảm thêm ${discountValue.toLocaleString('vi-VN')} ₫`);
    } else {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  }

  // Tạo đơn + điều hướng VNPay (nếu chọn)
  const handleVNPayPayment = async () => {
    if (!cart.shippingAddress.address) {
        toast.error('Vui lòng quay lại bước 2 để chọn địa chỉ giao hàng.');
        return;
    }
    
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount: tierDiscount, // Giảm giá theo hạng
        couponDiscount: couponDiscount, // Gửi giảm giá coupon
        totalPrice,
      } as CreateOrderInput)

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
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <CheckoutSteps step1 step2 step3 step4 />
        <Helmet>
          <title>Đặt hàng</title>
        </Helmet>
        <h1 className="text-3xl font-bold my-4 text-gray-900">Xác nhận đơn hàng</h1>
        <Row className='g-4'>
          <Col md={8}>
            {/* Địa chỉ giao hàng */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1 ">
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800">Địa chỉ giao hàng</Card.Title>
                <Card.Text className="text-gray-600 mt-2">
                  <strong>Tên:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Địa chỉ:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </Card.Text>
                <Link to="/shipping" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Chỉnh sửa</Link>
              </Card.Body>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1">
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800">Phương thức thanh toán</Card.Title>
                <Card.Text className="text-gray-600 mt-2">
                  <strong>Hình thức:</strong> <span className='font-semibold'>{cart.paymentMethod}</span>
                </Card.Text>
                <Link to="/payment" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Chỉnh sửa</Link>
              </Card.Body>
            </Card>

            {/* Sản phẩm */}
            <Card className="mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1">
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800 mb-3">Sản phẩm</Card.Title>
                <ListGroup variant="flush" className="border-t border-gray-200">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="bg-white px-0 py-3 border-b">
                      <Row className="align-items-center">
                        <Col md={6} className="flex items-center">
                          <img
                            src={imageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded-none mr-3"
                            style={{ border: '1px solid #e0e0e0' }}
                          />
                          <div>
                            <Link to={`/product/${item.slug ?? item._id}`} className="font-semibold text-gray-700 hover:text-black transition-colors duration-200">
                              {item.name}
                            </Link>
                            {item.variant && (
                              <div className="text-muted text-xs mt-1">
                                {item.variant.color} / {item.variant.storage} / {item.variant.ram}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col md={3} className="text-center font-semibold text-gray-700 transition-colors duration-200">
                          {item.quantity}
                        </Col>
                        <Col md={3} className="text-right font-bold text-gray-800 transition-colors duration-200">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart" className="text-blue-600 hover:text-blue-800 font-medium mt-3 block transition-colors duration-300 ">Chỉnh sửa giỏ hàng</Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột Tóm tắt */}
          <Col md={4}>
            <Card className="mb-3 hover:bg-gray-50  hover:shadow-xl border-md  border-1">
              <Card.Body className='p-4'>
                <Card.Title className='text-2xl font-bold text-gray-900 mb-3'>Tổng đơn hàng</Card.Title>
                <ListGroup variant="flush">
                    {/* Ô NHẬP MÃ GIẢM GIÁ */}
                    <ListGroup.Item className='bg-white p-2 border-0 mb-3'>
                        <Form onSubmit={handleApplyCoupon}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-r-0">
                                    <FaTag className='text-gray-500'/>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="focus:border-black focus:ring-black border-l-0"
                                />
                                <Button 
                                    variant={appliedCoupon ? "outline-success" : "outline-dark"} 
                                    type="submit"
                                >
                                    {appliedCoupon ? 'Đã áp dụng' : 'Áp dụng'}
                                </Button>
                            </InputGroup>
                            {appliedCoupon && (
                                <small className='text-success mt-1 block font-semibold'>
                                    Mã **{appliedCoupon}** đã được kích hoạt.
                                </small>
                            )}
                        </Form>
                    </ListGroup.Item>
                    
                    {/* Tạm tính */}
                    <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                        <span className='text-gray-700'>Tạm tính ({cart.cartItems.length} sản phẩm)</span>
                        <span className='font-semibold'>{itemsPrice.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>

                    {/* Giảm giá theo hạng */}
                    <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                        <span className='text-gray-700'>
                            Giảm theo hạng{' '}
                            <span className={`badge bg-warning text-dark font-semibold text-xs`}>{tier.toUpperCase()}</span>
                        </span>
                        <span className='font-semibold text-red-600'>- {tierDiscount.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>

                    {/* GIẢM GIÁ THEO COUPON */}
                    {couponDiscount > 0 && (
                        <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                            <span className='text-gray-700 font-bold'>Giảm giá Coupon</span>
                            <span className='font-bold text-red-600'>- {couponDiscount.toLocaleString('vi-VN')} ₫</span>
                        </ListGroup.Item>
                    )}
                    

                    {/* Phí vận chuyển */}
                    <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                        <span className='text-gray-700'>Phí vận chuyển</span>
                        <span className='font-semibold'>{shippingPrice.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>

                    {/* Thuế */}
                    <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                        <span className='text-gray-700'>Thuế</span>
                        <span className='font-semibold'>{taxPrice.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>

                    {/* Tổng cộng */}
                    <ListGroup.Item className='bg-white p-2 mt-2 pt-3 border-t-2 border-gray-300 flex justify-between transition-colors duration-200'>
                        <span className='text-xl font-bold text-gray-900'>Tổng cộng</span>
                        <span className='text-xl font-bold text-red-600'>
                            {totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                    </ListGroup.Item>

                    {/* Nút Đặt hàng */}
                    <ListGroup.Item className='bg-white p-2 border-0'>
                        <div className="d-grid mt-3">
                            <Button
                                type="button"
                                variant="dark"
                                onClick={handleVNPayPayment}
                                disabled={cart.cartItems.length === 0 || isPending}
                                className="py-2 text-base font-semibold hover:bg-gray-800 active:bg-gray-900 hover:scale-105 transition-transform"
                            >
                                {isPending ? <LoadingBox /> : (
                                    cart.paymentMethod === 'VNPAY'
                                    ? '💳 Đặt hàng và Thanh toán VNPay'
                                    : '💵 Đặt hàng (Thanh toán khi nhận)'
                                )}
                            </Button>
                        </div>
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