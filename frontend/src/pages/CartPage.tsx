import { Helmet } from 'react-helmet-async'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap'
import MessageBox from '../components/MessageBox'
import { toast } from 'react-toastify'
import type { CartItem } from '../types/Cart'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = async (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }
    return (
      // Shift content away from fixed Sidebar/Header
      <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
        <Helmet>
          <title>Shopping Cart</title>
        </Helmet>
  
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-3">Shopping Cart</h1>
          <Row className="g-3">
            <Col md={8}>
              {cartItems.length === 0 ? (
                <MessageBox>
                  Cart is empty. <Link to="/">Go Shopping</Link>
                </MessageBox>
              ) : (
                <ListGroup>
                  {cartItems.map((item: CartItem) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={4}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />{' '}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <Button
                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                            variant={mode}
                            disabled={item.quantity === 1}
                          >
                            <i className="fas fa-minus-circle"></i>
                          </Button>{' '}
                          <span>{item.quantity}</span>{' '}
                          <Button
                            variant={mode}
                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                            disabled={item.quantity === item.countInStock}
                          >
                            <i className="fas fa-plus-circle"></i>
                          </Button>
                        </Col>
                        <Col md={3}>
                          {item.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </Col>
                        <Col md={2}>
                          <Button onClick={() => removeItemHandler(item)} variant={mode}>
                            <i className="fas fa-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
  
            <Col md={4}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3>
                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) :{' '}
                        {cartItems
                          .reduce((a, c) => a + c.price * c.quantity, 0)
                          .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={checkoutHandler}
                          disabled={cartItems.length === 0}
                        >
                          Proceed to Checkout
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