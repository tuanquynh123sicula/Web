import { Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "./Rating"
import type { Product } from "../types/Product"
import { Store } from "../Store"
import type { CartItem } from "../types/Cart"
import { useContext } from "react"
import { convertProductToCartItem } from "../utils"
import { toast } from "react-toastify"

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
    userInfo,
  } = state

  // Hạng và giá hiển thị theo hạng
  const tier = (userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
  const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }
  const hasDiscount = rateMap[tier] > 0
  const displayPrice = hasDiscount
    ? Math.round(product.price * (1 - rateMap[tier]))
    : product.price

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock")
      return
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    })
    toast.success("Product added to the cart")
  }

  const imageSrc =
    product.image.startsWith('http')
      ? product.image
      : product.image.startsWith('/uploads/')
      ? `http://localhost:4000${product.image}`
      : product.image.startsWith('/')
      ? product.image
      : `/images/${product.image}`

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={imageSrc}
          className="card-img-top"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        {hasDiscount ? (
          <Card.Text>
            <span className="text-muted text-decoration-line-through me-2">
              {product.price.toLocaleString('vi-VN')} ₫
            </span>
            <span className="fw-bold text-danger">
              {displayPrice.toLocaleString('vi-VN')} ₫
            </span>
            <span className="badge bg-warning text-dark ms-2">{tier.toUpperCase()}</span>
          </Card.Text>
        ) : (
          <Card.Text>{product.price.toLocaleString('vi-VN')} ₫</Card.Text>
        )}

        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(convertProductToCartItem(product))}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProductItem