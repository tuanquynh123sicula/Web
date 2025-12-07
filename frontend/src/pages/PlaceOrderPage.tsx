import { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Col, ListGroup, Row, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'
import type { ApiError } from '../types/ApiError'
// ❌ XÓA DÒNG NÀY: import axios from 'axios'
import apiClient, { getImageUrl } from '@/apiClient' // ✅ THÊM getImageUrl
import type { CartItem, ShippingAddress } from '@/types/Cart'
import { FaTag } from 'react-icons/fa'

export type CreateOrderInput = {
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  discount?: number
  couponDiscount: number
  totalPrice: number
  voucherId?: string
}

interface Voucher {
  _id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxUsage: number
  usageCount: number
  expiryDate: string
  isActive: boolean
}

export default function PlaceOrderPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin')
      return
    }
    
    if (!cart.paymentMethod) {
      navigate('/payment')
      return
    }

    if (cart.cartItems.length === 0 && !cart.shippingAddress.address) {
      toast.info('Giỏ hàng của bạn đang trống.')
      navigate('/')
      return
    }
  }, [cart.paymentMethod, userInfo, navigate])

  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<Voucher | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const [resolvedTier, setResolvedTier] = useState<'regular' | 'vip' | 'new'>(
    ((userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular')
  )

  useEffect(() => {
    let mounted = true
    if (!userInfo) {
      navigate('/signin')
      return
    }
  
    const storedUserInfo = localStorage.getItem('userInfo')
    console.log('Stored userInfo:', storedUserInfo)
    console.log('Context userInfo:', userInfo)
  
    apiClient
      .get('/api/users/profile')
      .then((res) => {
        if (mounted) {
          const t = (res.data?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
          setResolvedTier(t)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err.response?.status, err.message)
        setResolvedTier('regular')
      })
    return () => {
      mounted = false
    }
  }, [userInfo, navigate])

  const tier = resolvedTier
  const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = useMemo(
    () => round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)),
    [cart.cartItems]
  )

  const tierDiscount = useMemo(() => Math.round(itemsPrice * rateMap[tier]), [itemsPrice, tier])

  const shippingPrice = useMemo(
    () => (itemsPrice - tierDiscount >= 1_000_000 || tier === 'vip' ? 0 : 30000),
    [itemsPrice, tierDiscount, tier]
  )
  const taxPrice = 0

  const totalPrice = itemsPrice + shippingPrice + taxPrice - tierDiscount - couponDiscount

  cart.itemsPrice = itemsPrice
  cart.shippingPrice = shippingPrice
  cart.taxPrice = taxPrice
  cart.totalPrice = totalPrice

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation()

  // ✅ FIX 1: ÁP DỤNG VOUCHER - DÙNG apiClient
  const handleApplyCoupon = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const code = couponCode.toUpperCase().trim()

    if (!code) {
      toast.error('Vui lòng nhập mã giảm giá.')
      return
    }

    if (appliedCoupon?.code === code) {
      toast.info('Mã này đã được áp dụng.')
      return
    }

    setIsValidatingCoupon(true)
    try {
      // ✅ DÙNG apiClient THAY VÌ axios
      const { data } = await apiClient.post<{ message: string; voucher: Voucher }>(
        '/api/vouchers/validate', 
        { 
          code, 
          orderTotal: itemsPrice
        }
      )

      const voucher = data.voucher
      
      let discountValue = 0
      if (voucher.discountType === 'fixed') {
        discountValue = voucher.discountValue
      } else if (voucher.discountType === 'percentage') {
        discountValue = Math.round(itemsPrice * (voucher.discountValue / 100))
      }

      discountValue = Math.min(discountValue, itemsPrice)

      setCouponDiscount(discountValue)
      setAppliedCoupon(voucher)
      toast.success(
        `Áp dụng mã ${code} thành công! Giảm ${discountValue.toLocaleString('vi-VN')} ₫`
      )
    } catch (err) {
      setCouponDiscount(0)
      setAppliedCoupon(null)
      const errorMsg = getError(err as ApiError)
      toast.error(errorMsg)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setAppliedCoupon(null)
    toast.info('Đã hủy áp dụng voucher.')
  }

  // ✅ FIX 2: THANH TOÁN VNPAY - DÙNG apiClient
  const handleVNPayPayment = async () => {
    if (!cart.shippingAddress.address) {
      toast.error('Vui lòng quay lại bước 2 để chọn địa chỉ giao hàng.')
      return
    }

    if (cart.cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!')
      navigate('/cart')
      return
    }

    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount: tierDiscount,
        couponDiscount: couponDiscount,
        totalPrice,
        voucherId: appliedCoupon?._id,
      } as CreateOrderInput)

      localStorage.removeItem('cartItems')
      dispatch({ type: 'CART_CLEAR' })

      if (cart.paymentMethod === 'VNPAY') {
        // ✅ DÙNG apiClient THAY VÌ axios
        const response = await apiClient.post('/api/vnpay/create_payment_url', {
          amount: data.order.totalPrice,
          orderId: data.order._id,
        })
        localStorage.removeItem('shippingAddress')
        localStorage.removeItem('paymentMethod')
        window.location.href = response.data.paymentUrl
      } else {
        localStorage.removeItem('shippingAddress')
        localStorage.removeItem('paymentMethod')
        navigate(`/order/${data.order._id}`)
      }
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  // ❌ XÓA HÀM NÀY - DÙNG getImageUrl TỪ apiClient
  // const getImageUrl = (src?: string) => {
  //   if (!src) return '/images/placeholder.png'
  //   if (src.startsWith('http')) return src
  //   if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
  //   if (src.startsWith('/')) return src
  //   return `/images/${src}`
  // }

  if (cart.cartItems.length === 0 && !cart.shippingAddress.address) {
    return <LoadingBox />
  }

  const canPlaceOrder = cart.cartItems.length > 0

  return (
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <CheckoutSteps step1 step2 step3 step4 />
        <Helmet>
          <title>Đặt hàng</title>
        </Helmet>
        <h1 className="text-3xl font-bold my-4 text-gray-900">Xác nhận đơn hàng</h1>

        {!canPlaceOrder && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 mb-4 shadow-md">
            <p className="font-semibold">⚠️ Đơn hàng đã được đặt. Giỏ hàng hiện tại đang trống.</p>
            <p className="text-sm mt-1">
              <Link to="/orderhistory" className="text-blue-600 hover:underline font-medium">
                Xem lịch sử đơn hàng
              </Link>
            </p>
          </div>
        )}

        <Row className='g-4'>
          <Col md={8}>
            {/* Địa chỉ giao hàng */}
            <Card className="mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1">
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
            <Card className="mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1">
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800">Phương thức thanh toán</Card.Title>
                <Card.Text className="text-gray-600 mt-2">
                  <strong>Hình thức:</strong> <span className='font-semibold'>{cart.paymentMethod}</span>
                </Card.Text>
                <Link to="/payment" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Chỉnh sửa</Link>
              </Card.Body>
            </Card>

            {/* Sản phẩm */}
            <Card className="mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1">
              <Card.Body className="p-4">
                <Card.Title className="text-xl font-bold text-gray-800 mb-3">Sản phẩm</Card.Title>
                {cart.cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-semibold mb-2">Giỏ hàng trống</p>
                    <p className="text-sm">Đơn hàng đã được đặt thành công.</p>
                  </div>
                ) : (
                  <ListGroup variant="flush" className="border-t border-gray-200">
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item._id} className="bg-white px-0 py-3 border-b">
                        <Row className="align-items-center">
                          <Col md={6} className="flex items-center">
                            <img
                              src={getImageUrl(item.image ?? '')}
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
                )}
                <Link to="/cart" className="text-blue-600 hover:text-blue-800 font-medium mt-3 block transition-colors duration-300">
                  Chỉnh sửa giỏ hàng
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột Tóm tắt */}
          <Col md={4}>
            <Card className="mb-3 hover:bg-gray-50 hover:shadow-xl border-md border-1">
              <Card.Body className='p-4'>
                <Card.Title className='text-2xl font-bold text-gray-900 mb-3'>Tổng đơn hàng</Card.Title>
                <ListGroup variant="flush">
                  {!appliedCoupon ? (
                    <ListGroup.Item className='bg-white border-0 p-0 mb-3'>
                      <Form onSubmit={handleApplyCoupon} className='p-3'>
                        <div className='flex gap-2'>
                          <Form.Control
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={isValidatingCoupon}
                            className="flex-1 border px-3 py-2"
                          />
                          <Button 
                            variant="dark"
                            type="submit"
                            disabled={isValidatingCoupon}
                            className='px-4 py-2 font-semibold hover:bg-gray-800'
                          >
                            {isValidatingCoupon ? (
                              <>
                                <span className='inline-block animate-spin mr-2'>⏳</span>
                                Kiểm tra
                              </>
                            ) : (
                              <>
                                <FaTag className='inline mr-2' />
                                Áp dụng
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </ListGroup.Item>
                  ) : (
                    <ListGroup.Item className='bg-green-50 border border-green-300 rounded p-3 mb-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-green-600 text-xl font-bold'>✓</span>
                          <div>
                            <p className='text-green-700 font-bold text-sm m-0'>
                              Mã <span className='text-green-900'>{appliedCoupon.code}</span> đã được áp dụng
                            </p>
                            <p className='text-green-600 text-xs m-0'>
                              Tiết kiệm: {couponDiscount.toLocaleString('vi-VN')} ₫
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className='bg-red-600 hover:bg-red-700 border-0 px-3 py-1 text-sm font-semibold'
                        >
                          ✕ Hủy
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                    <span className='text-gray-700'>Tạm tính ({cart.cartItems.length} sản phẩm)</span>
                    <span className='font-semibold'>{itemsPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                    <span className='text-gray-700'>
                      Giảm theo hạng{' '}
                      <span className={`badge bg-warning text-dark font-semibold text-xs`}>{tier.toUpperCase()}</span>
                    </span>
                    <span className='font-semibold text-red-600'>- {tierDiscount.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  {couponDiscount > 0 && (
                    <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                      <span className='text-gray-700 font-bold'>Giảm giá Voucher</span>
                      <span className='font-bold text-red-600'>- {couponDiscount.toLocaleString('vi-VN')} ₫</span>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                    <span className='text-gray-700'>Phí vận chuyển</span>
                    <span className='font-semibold'>{shippingPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  <ListGroup.Item className='bg-white p-2 flex justify-between transition-colors duration-200'>
                    <span className='text-gray-700'>Thuế</span>
                    <span className='font-semibold'>{taxPrice.toLocaleString('vi-VN')} ₫</span>
                  </ListGroup.Item>

                  <ListGroup.Item className='bg-white p-2 mt-2 pt-3 border-t-2 border-gray-300 flex justify-between transition-colors duration-200'>
                    <span className='text-xl font-bold text-gray-900'>Tổng cộng</span>
                    <span className='text-xl font-bold text-red-600'>
                      {totalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </ListGroup.Item>

                  <ListGroup.Item className='bg-white p-2 border-0'>
                    <div className="d-grid mt-3">
                      <Button
                        type="button"
                        variant="dark"
                        onClick={handleVNPayPayment}
                        disabled={!canPlaceOrder || isPending}
                        className="py-2 text-base font-semibold hover:bg-gray-800 active:bg-gray-900 hover:scale-105 transition-transform"
                      >
                        {isPending ? (
                          <LoadingBox />
                        ) : !canPlaceOrder ? (
                          '✓ Đơn hàng đã được đặt'
                        ) : (
                          cart.paymentMethod === 'VNPAY'
                            ? '🛒 Đặt hàng và Thanh toán VNPay'
                            : '🛒 Đặt hàng (Thanh toán khi nhận)'
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