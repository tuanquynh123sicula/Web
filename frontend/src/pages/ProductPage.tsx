import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery } from "../hooks/productHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import type { ApiError } from "../types/ApiError";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { Store } from "../Store";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 


export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const {
          data: product,
          isLoading,
          error,
        } = useGetProductDetailsBySlugQuery(slug!)

  const { state, dispatch } = useContext(Store)
      const { cart } = state
      const navigate = useNavigate()
      const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product!._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        if (product!.countInStock < quantity) {
          toast.warn('Sorry. Product is out of stock')
          return
        }
        dispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...convertProductToCartItem(product!), quantity },
        })
        toast.success('Product added to the cart')
        navigate('/cart')
      }

      const imageUrl = (src?: string) => {
    if (!src) return '/images/placeholder.png'
    if (src.startsWith('http')) return src
    if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
    if (src.startsWith('/')) return src
    return `/images/${src}`
  }

  return isLoading ? (
          <LoadingBox />
        ) : error   ? (
          <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
        ) : !product ? (
          <MessageBox variant="danger">Product Not Found</MessageBox>
        ): (
    <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
        <Helmet>
          <title>Product Page</title>
        </Helmet>
        <Row>
              <Col md={6}>
                <img
                  className="large"
                  src={imageUrl(product.image)}
                  alt={product.name}
                ></img>
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Helmet>
                      <title>{product.name}</title>
                    </Helmet>
                    <h1>{product.name}</h1>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    ></Rating>
                  </ListGroup.Item>
                  <ListGroup.Item>Price : {product.price.toLocaleString('vi-VN')} ₫</ListGroup.Item>
                  <ListGroup.Item>
                    Description:
                    <p>{product.description}</p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>{product.price.toLocaleString('vi-VN')} ₫</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Status:</Col>
                          <Col>
                            {product.countInStock > 0 ? (
                              <Badge bg="success">In Stock</Badge>
                            ) : (
                              <Badge bg="danger">Unavailable</Badge>
                            )}
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <div className="d-grid">
                            <Button onClick={addToCartHandler} variant="primary">
                            Add to Cart
                            </Button>
                          </div>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
    </div>
  )
}
