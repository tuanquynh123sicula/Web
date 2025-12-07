import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery, useGetRelatedProductsQuery } from "../hooks/productHooks";
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
import { useContext, useState } from "react";
import { Store } from "../Store";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import ProductItem from "@/components/ProductItem";
import { motion, AnimatePresence } from "framer-motion";
import ReviewSection from "@/components/Review";
import AddToWishlistBtn from '@/components/AddToWishlistBtn'
import AddToCompareBtn from '@/components/AddToCompareBtn'
import { ShoppingCart, Package, Shield, Truck } from 'lucide-react'

export default function ProductPage() {
    const params = useParams();
    const { slug } = params;
    const {
        data: product,
        isLoading,
        error,
    } = useGetProductDetailsBySlugQuery(slug!)

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0) 
    const [imgError, setImgError] = useState(false)

    const { 
        data: relatedProducts, 
        isLoading: loadingRelated, 
        error: errorRelated 
    } = useGetRelatedProductsQuery(
        product?.category || '', 
        product?._id || '', 
        4
    );

    const tier = (userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
    const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }
    const discountRate = rateMap[tier]
    const hasDiscount = discountRate > 0

    const getImageUrl = (src?: string) => {
        if (!src) return '/images/placeholder.png'
        if (src.startsWith('http')) return src
        if (src.startsWith('/images/')) return src
        if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
        if (src.startsWith('/')) return src
        return `/images/${src}`
    }

    const hasVariants = product?.variants && product.variants.length > 0
    const selectedVariant = hasVariants ? product.variants[selectedVariantIdx] : undefined

    const basePrice = hasVariants
        ? selectedVariant?.price ?? 0
        : product?.price ?? 0

    const displayPrice = hasDiscount
        ? Math.round(basePrice * (1 - discountRate))
        : basePrice

    const displayCountInStock = hasVariants
        ? selectedVariant?.countInStock ?? 0
        : product?.countInStock ?? 0

    const displayImage = hasVariants
        ? selectedVariant?.image
        : product?.image

    const addToCartHandler = async () => {
        try {
            const cartItem = convertProductToCartItem(
                product!,
                hasVariants && selectedVariantIdx !== -1 
                    ? product!.variants![selectedVariantIdx]
                    : undefined
            )

            if (!cartItem.price || cartItem.price <= 0) {
                toast.error('Giá sản phẩm không hợp lệ')
                return
            }

            if (cartItem.countInStock <= 0) {
                toast.error('Sản phẩm đã hết hàng')
                return
            }

            dispatch({
                type: 'CART_ADD_ITEM',
                payload: cartItem,
            })
            toast.success('Đã thêm vào giỏ hàng')
            navigate('/cart')
        } catch {
            console.error('Add to cart error:')
            toast.error('Lỗi khi thêm vào giỏ hàng')
        }
    }

    if (isLoading) return <LoadingBox />
    if (error) return <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
    if (!product) return <MessageBox variant="danger">Product Not Found</MessageBox>
    
    const allImages = hasVariants 
        ? product.variants!.map(v => v.image).filter(Boolean) as string[]
        : [product.image].filter(Boolean) as string[];

    const handleThumbnailClick = (index: number) => {
        setSelectedVariantIdx(index);
        setImgError(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pl-56 pr-6 pt-20 pb-10">
            <Helmet>
                <title>{product.name}</title>
            </Helmet>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                <Row className="max-w-7xl mx-auto">
                    {/* CỘT 1: HÌNH ẢNH SẢN PHẨM & GALLERY */}
                    <Col md={6} className="p-0 pr-6"> 
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white shadow-2xl overflow-hidden p-8 border border-gray-100 transition-all duration-500 hover:shadow-3xl"
                        >
                            {/* HÌNH ẢNH CHÍNH */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={displayImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative group"
                                >
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-auto object-contain max-h-[500px] cursor-zoom-in"
                                        src={getImageUrl(displayImage)}
                                        alt={product.name}
                                        onError={() => setImgError(true)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            </AnimatePresence>
                            
                            {imgError && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-sm mt-3"
                                >
                                    Không thể tải ảnh. Đang hiển thị ảnh thay thế.
                                </motion.p>
                            )}

                            {/* GALLERY ẢNH MINI */}
                            {allImages.length > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex gap-3 mt-6 overflow-x-auto p-2 border-t border-gray-200"
                                >
                                    {allImages.map((img, idx) => (
                                        <motion.img
                                            key={idx}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            src={getImageUrl(img)}
                                            alt={`Thumbnail ${idx + 1}`}
                                            onClick={() => handleThumbnailClick(idx)}
                                            className={`w-16 h-16 object-contain border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
                                                ${selectedVariantIdx === idx ? 'border-black shadow-lg ring-2 ring-black' : 'border-gray-200 hover:border-gray-400'}
                                            `}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    </Col>
                    
                    {/* CỘT 2: THÔNG TIN CƠ BẢN + GIỎ HÀNG */}
                    <Col md={6}>
                        <Row>
                            {/* Sub-Col 1: Thông tin cơ bản */}
                            <Col md={7}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    {/* KHỐI TIÊU ĐỀ & GIÁ */}
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <motion.h1 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-3xl font-bold text-gray-900 mb-3"
                                        >
                                            {product.name}
                                        </motion.h1>
                                        
                                        <div className="flex items-center justify-between mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Rating
                                                    rating={product.rating}
                                                    numReviews={product.numReviews}
                                                />
                                            </motion.div>
                                            
                                            <div className="flex gap-3">
                                                <motion.div 
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {product._id && <AddToWishlistBtn productId={product._id} />}
                                                </motion.div>
                                                <motion.div 
                                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {product._id && <AddToCompareBtn productId={product._id} />}
                                                </motion.div>
                                            </div>
                                        </div>
                                        
                                        {/* HIỂN THỊ GIÁ */}
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="mt-2"
                                        >
                                            <div className="text-sm font-semibold text-gray-700 mb-2">Giá:</div>
                                            {hasDiscount && basePrice > displayPrice ? (
                                                <div className="mt-1 flex items-center">
                                                    <motion.span 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-gray-400 line-through mr-3 text-base"
                                                    >
                                                        {basePrice.toLocaleString('vi-VN')} ₫
                                                    </motion.span>
                                                    <motion.span 
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring" }}
                                                        className="text-red-600 font-bold text-3xl"
                                                    >
                                                        {displayPrice.toLocaleString('vi-VN')} ₫
                                                    </motion.span>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="ml-3"
                                                    >
                                                        <Badge bg="danger" className="py-1 px-3 text-xs font-bold shadow-md">
                                                            -{Math.round(discountRate * 100)}%
                                                        </Badge>
                                                    </motion.div>
                                                </div>
                                            ) : (
                                                <motion.span 
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                    className="font-bold text-black text-3xl"
                                                >
                                                    {displayPrice.toLocaleString('vi-VN')} ₫
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* KHỐI CHỌN PHIÊN BẢN */}
                                    {hasVariants && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <ListGroup className="p-0 border-0 mb-4">
                                                <ListGroup.Item className="bg-white border-0 p-0 pb-3">
                                                    <strong className="text-gray-700 block mb-3 text-base">Chọn phiên bản:</strong>
                                                    <div className="flex flex-wrap gap-3">
                                                        {product.variants!.map((v, idx) => (
                                                            <motion.div
                                                                key={v._id ?? idx}
                                                                onClick={() => setSelectedVariantIdx(idx)}
                                                                whileHover={{ 
                                                                    scale: 1.08, 
                                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                                                    y: -5
                                                                }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className={`p-3 border cursor-pointer transition-all duration-300 min-w-[120px] text-center shadow-sm
                                                                    ${selectedVariantIdx === idx 
                                                                        ? 'border-black bg-gray-100 shadow-lg ring-2 ring-black' 
                                                                        : 'border-gray-300 hover:border-gray-500 bg-white'}
                                                                `}
                                                            >
                                                                <span className="font-semibold text-sm block">
                                                                    {v.storage} / {v.ram}
                                                                </span>
                                                                <span className="text-xs text-gray-600 block">
                                                                    {v.color}
                                                                </span>
                                                                <span className="text-sm font-bold text-red-600 mt-1 block">
                                                                    {v.price?.toLocaleString('vi-VN')} ₫
                                                                </span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </motion.div>
                                    )}

                                    {/* KHỐI MÔ TẢ NGẮN */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-4 pt-4 border-t border-gray-200"
                                    >
                                        <div className="text-lg font-semibold text-gray-700 mb-2">Thông tin cơ bản:</div>
                                        <p className="text-sm text-gray-600 line-clamp-5 leading-relaxed">{product.description}</p>
                                    </motion.div>

                                    {/* KHỐI ƯU ĐÃI */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="mt-6 grid grid-cols-2 gap-3"
                                    >
                                        {[
                                            { icon: Shield, text: 'Bảo hành chính hãng' },
                                            { icon: Truck, text: 'Miễn phí vận chuyển' },
                                            { icon: Package, text: 'Đổi trả trong 7 ngày' },
                                            { icon: ShoppingCart, text: 'Thanh toán linh hoạt' }
                                        ].map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ scale: 1.05, y: -3 }}
                                                className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 shadow-sm"
                                            >
                                                <item.icon size={18} className="text-blue-600" />
                                                <span className="text-xs text-gray-700 font-medium">{item.text}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </Col>

                            {/* Sub-Col 2: Sticky Card Giỏ hàng */}
                            <Col md={5}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <Card className="shadow-2xl border-0 sticky top-24 transition-all duration-500 hover:shadow-3xl">
                                        <Card.Body className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="p-3 bg-transparent border-b">
                                                    <div className="text-sm font-semibold text-gray-700">Tình trạng:</div>
                                                    <motion.div 
                                                        whileHover={{ scale: 1.05 }}
                                                        className="mt-2"
                                                    >
                                                        {displayCountInStock > 0 ? (
                                                            <Badge bg="success" className="p-2 text-sm shadow-md">
                                                                Còn hàng ({displayCountInStock})
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="danger" className="p-2 text-sm shadow-md">
                                                                Hết hàng
                                                            </Badge>
                                                        )}
                                                    </motion.div>
                                                </ListGroup.Item>

                                                {displayCountInStock > 0 && (
                                                    <ListGroup.Item className="p-3 bg-transparent border-0">
                                                        <div className="flex flex-col gap-3">
                                                            <motion.div
                                                                whileHover={{ scale: 1.02, y: -2 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <Button 
                                                                    onClick={addToCartHandler} 
                                                                    variant="dark"
                                                                    className="w-full hover:bg-gray-800 transition-all duration-300 py-3 font-bold text-sm shadow-xl hover:shadow-2xl" 
                                                                >
                                                                    <ShoppingCart size={18} className="inline mr-2" />
                                                                    Thêm vào Giỏ 
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                    </ListGroup.Item>
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </motion.div>
            
            {/* SECTION: ĐÁNH GIÁ VÀ SẢN PHẨM LIÊN QUAN */}
            <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200">
                <Row id="reviews">
                    <Col md={12}>
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-6 shadow-2xl border border-gray-200 transition-all duration-500 hover:shadow-3xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Đánh giá & Bình luận</h2>
                            {product._id && <ReviewSection productId={product._id} />}
                        </motion.div>
                    </Col>
                </Row>

                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-gray-900 mt-10 mb-6"
                >
                    Các sản phẩm liên quan
                </motion.h2>
                
                {loadingRelated ? (
                    <LoadingBox />
                ) : errorRelated ? (
                    <MessageBox variant="warning">Không thể tải sản phẩm liên quan.</MessageBox>
                ) : relatedProducts && relatedProducts.length > 0 ? (
                    <motion.div 
                        layout 
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {relatedProducts.map((p, idx) => (
                            <motion.div
                                key={p._id || p.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <ProductItem product={p} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <MessageBox variant="info">Không tìm thấy sản phẩm liên quan nào.</MessageBox>
                )}
            </div>
        </div>
    )
}