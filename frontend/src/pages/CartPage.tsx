// --- GIỮ NGUYÊN IMPORTS ---
import { Helmet } from 'react-helmet-async'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap'
import MessageBox from '../components/MessageBox'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import type { CartItem } from '../types/Cart'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  const getImageUrl = (src?: string) => {
    if (!src) return '/images/placeholder.png'
    if (src.startsWith('http')) return src
    if (src.startsWith('/images/')) return src
    if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
    if (src.startsWith('/')) return src
    return `/images/${src}`
  }

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all">
        <Helmet>
          <title>Shopping Cart</title>
        </Helmet>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Giỏ Hàng Của Bạn</h1>

          <Row className="g-4">

            {/* LEFT SIDE */}
            <Col md={8}>
              {cartItems.length === 0 ? (
                <MessageBox>
                  Giỏ hàng trống. <Link to="/" className="font-semibold text-blue-600 hover:text-blue-800">Tiếp tục mua sắm</Link>
                </MessageBox>
              ) : (
                <ListGroup className="shadow-lg overflow-hidden">
                  {cartItems.map((item: CartItem) => (
                    <ListGroup.Item
                      key={item._id + (item.variantId ?? '')}
                      className="bg-white p-3 border-b-2 border-gray-100 
                        last:border-b-0 
                        transition-all duration-300 
                        hover:shadow-md hover:scale-[1.01]"
                    >
                      <Row className="align-items-center">

                        {/* IMAGE + NAME */}
                        <Col md={4} className="flex items-center">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-contain mr-3 border border-gray-200"
                          />
                          <div>
                            <Link
                              to={`/product/${item.slug}`}
                              className="text-base font-semibold text-gray-800 hover:text-black transition"
                            >
                              {item.name}
                            </Link>

                            {item.variant && (
                              <div className="text-gray-600 text-xs mt-1">
                                {item.variant.color} / {item.variant.storage} / {item.variant.ram}
                              </div>
                            )}
                          </div>
                        </Col>

                        {/* QUANTITY */}
                        <Col md={3} className="flex items-center">
                          <Button
                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                            variant="light"
                            disabled={item.quantity === 1}
                            className="border p-1 transition-all hover:bg-gray-200 active:scale-90"
                          >
                            <i className="fas fa-minus text-gray-700 text-xs"></i>
                          </Button>

                          <span className="mx-3 font-semibold">{item.quantity}</span>

                          <Button
                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                            variant="light"
                            disabled={item.quantity === item.countInStock}
                            className="border p-1 transition-all hover:bg-gray-200 active:scale-90"
                          >
                            <i className="fas fa-plus text-gray-700 text-xs"></i>
                          </Button>
                        </Col>

                        {/* PRICE */}
                        <Col md={3} className="font-bold text-gray-800 text-lg">
                          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Col>

                        {/* REMOVE */}
                        <Col md={2} className="text-center">
                          <Button
                            onClick={() => removeItemHandler(item)}
                            variant="light"
                            className="text-gray-500 hover:text-red-600 p-1 transition active:scale-90"
                          >
                            <i className="fas fa-trash-alt text-lg"></i>
                          </Button>
                        </Col>

                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>

            {/* RIGHT SIDE — SUMMARY */}
            <Col md={4}>
              <Card className="shadow-lg border-0 transition-all hover:shadow-xl hover:scale-[1.01]">
                <Card.Body className="p-4">
                  <ListGroup variant="flush">

                    <ListGroup.Item className="bg-white border-b-2 p-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Tóm tắt Đơn hàng</h3>

                      <div className="flex justify-between font-semibold text-gray-700">
                        <span>Tạm tính ({cartItems.reduce((a, c) => a + c.quantity, 0)} sản phẩm):</span>
                        <span className="text-black font-bold text-lg">
                          {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item className="bg-white p-3">
                      <div className="d-grid">
                        <Button
                          type="button"
                          variant="dark"
                          onClick={checkoutHandler}
                          disabled={cartItems.length === 0}
                          className="py-2 text-base font-semibold 
                            transition-all 
                            hover:bg-gray-800 active:bg-gray-900 
                            hover:scale-[1.01] active:scale-[0.98]"
                        >
                          Tiến hành Thanh toán
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

      <Footer />
    </>
  )
}
