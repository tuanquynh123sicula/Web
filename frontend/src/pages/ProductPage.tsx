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
import { motion } from "framer-motion";
import ReviewSection from "@/components/Review";
import AddToWishlistBtn from '@/components/AddToWishlistBtn'
import AddToCompareBtn from '@/components/AddToCompareBtn'


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

    // SỬ DỤNG HOOK SẢN PHẨM LIÊN QUAN
    const { 
        data: relatedProducts, 
        isLoading: loadingRelated, 
        error: errorRelated 
    } = useGetRelatedProductsQuery(
        product?.category || '', 
        product?._id || '', 
        4
    );

    // --- LOGIC DISCOUNT ---
    const tier = (userInfo?.tier as 'regular' | 'vip' | 'new' | undefined) ?? 'regular'
    const rateMap: Record<'regular' | 'vip' | 'new', number> = { regular: 0, new: 0.02, vip: 0.1 }
    const discountRate = rateMap[tier]
    const hasDiscount = discountRate > 0
    

    const imageUrl = (src?: string) => {
        if (!src) return '/images/placeholder.png'
        if (src.startsWith('http')) return src
        if (src.startsWith('/images/')) return src
        if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
        if (src.startsWith('/')) return src
        return `/images/${src}`
    }

    // Nếu có biến thể
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
        // ✅ FIX: Xử lý trường hợp không có variant
        const cartItem = convertProductToCartItem(
          product!,
          hasVariants && selectedVariantIdx !== -1 
            ? product!.variants![selectedVariantIdx]
            : undefined
        )
    
        // ✅ Validate dữ liệu
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
    
    // Tạo danh sách ảnh mini (cả variant và ảnh gốc)
    const allImages = hasVariants 
        ? product.variants!.map(v => v.image).filter(Boolean) as string[]
        : [product.image].filter(Boolean) as string[];

    const handleThumbnailClick = (index: number) => {
        setSelectedVariantIdx(index);
        setImgError(false); // Reset lỗi ảnh khi đổi variant
    };


    return (
        <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
            <Helmet>
                <title>{product.name}</title>
            </Helmet>
            
            <Row className="max-w-7xl mx-auto">
                {/* =================================================


    return (
        <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
            <Helmet>
                <title>{product.name}</title>
            </Helmet>
            
            <Row className="max-w-7xl mx-auto">
                {/* ==========================================================
                CỘT 1: HÌNH ẢNH SẢN PHẨM & GALLERY (MD=6)
                ==========================================================
                */}
                <Col md={6} className="p-0 pr-6"> 
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 border border-gray-100">
                        
                        {/* HÌNH ẢNH CHÍNH */}
                        <motion.div
                            key={displayImage} // Key thay đổi để kích hoạt transition
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                className="w-full h-auto object-contain max-h-[500px] transition-transform duration-500"
                                src={imageUrl(displayImage)}
                                alt={product.name}
                                onError={() => setImgError(true)}
                            />
                        </motion.div>
                        
                        {imgError && <p className="text-danger text-sm mt-3">Không thể tải ảnh. Đang hiển thị ảnh thay thế.</p>}

                        {/* GALLERY ẢNH MINI */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 mt-6 overflow-x-auto p-2 border-t border-gray-200">
                                {allImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={imageUrl(img)}
                                        alt={`Thumbnail ${idx + 1}`}
                                        onClick={() => handleThumbnailClick(idx)}
                                        className={`w-16 h-16 object-contain border cursor-pointer transition-all duration-200
                                            ${selectedVariantIdx === idx ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-400'}
                                        `}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Col>
                
                {/* ==========================================================
                CỘT 2: THÔNG TIN CƠ BẢN + GIỎ HÀNG (MD=6)
                ==========================================================
                */}
                <Col md={6}>
                    <Row>
                        {/* Sub-Col 1 (7/12): Thông tin cơ bản và mô tả */}
                        <Col md={7}>
                            {/* KHỐI TIÊU ĐỀ & GIÁ */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
                                <div className="flex items-center justify-between mb-3">
                                    <Rating
                                        rating={product.rating}
                                        numReviews={product.numReviews}
                                    ></Rating>
                                    {/* Nút yêu thích và so sánh icon nhỏ trên cùng */}
                                    <div className="flex gap-2 hover:scale-105 transition-transform pl-5">
                                         {product._id && <AddToWishlistBtn productId={product._id} />}
                                    </div>     
                                    <div className="flex gap-2 hover:scale-105 transition-transform">
                                         {product._id && <AddToCompareBtn productId={product._id} />}
                                    </div>
                                </div>
                                
                                {/* HIỂN THỊ GIÁ */}
                                <div className="mt-2">
                                    <div className="text-sm font-semibold text-gray-700">Giá:</div>
                                    {hasDiscount && basePrice > displayPrice ? (
                                        <div className="mt-1 flex items-center">
                                            <span className="text-gray-400 line-through mr-3 text-base">
                                                {basePrice.toLocaleString('vi-VN')} ₫
                                            </span>
                                            <span className="text-black font-bold text-3xl">
                                                {displayPrice.toLocaleString('vi-VN')} ₫
                                            </span>
                                            <Badge bg="danger" className="ml-3 py-1 px-3 text-xs font-bold">
                                                -{Math.round(discountRate * 100)}%
                                            </Badge>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-black text-3xl">
                                            {displayPrice.toLocaleString('vi-VN')} ₫
                                        </span>
                                    )}
                                </div>
                            </div>
                            

                            {/* KHỐI CHỌN PHIÊN BẢN */}
                            {hasVariants && (
                            <ListGroup className="p-0 border-0 mb-4">
                                <ListGroup.Item className="bg-white border-0 p-0 pb-3 ">
                                    <strong className="text-gray-700 block mb-3 text-base">Chọn phiên bản:</strong>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants!.map((v, idx) => (
                                            <motion.div
                                                key={v._id ?? idx}
                                                onClick={() => setSelectedVariantIdx(idx)}
                                                whileHover={{ scale: 1.05, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                                className={`p-3 border cursor-pointer transition-all duration-200 min-w-[120px] text-center hover:scale-105 transition-transform
                                                    ${selectedVariantIdx === idx ? 'border-black bg-gray-100 shadow-md' : 'border-gray-300 hover:border-gray-500'}
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
                            )}

                             {/* KHỐI MÔ TẢ NGẮN */}
                             <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="text-lg font-semibold text-gray-700 mb-2">Thông tin cơ bản:</div>
                                <p className="text-sm text-gray-600 line-clamp-5 leading-relaxed">{product.description}</p>
                            </div>

                        </Col>

                        {/* Sub-Col 2 (5/12): Sticky Card Giỏ hàng */}
                        <Col md={5}>
                            <Card className="shadow-xl border-0 sticky top-24 transition duration-300">
                                <Card.Body className="p-4 bg-gray-50 border border-gray-200">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="p-3 bg-gray-50 border-b">
                                            <div className="text-sm font-semibold text-gray-700">Tình trạng:</div>
                                            <div className="mt-2">
                                                {displayCountInStock > 0 ? (
                                                    <Badge bg="success" className="p-2 text-sm">Còn hàng ({displayCountInStock})</Badge>
                                                ) : (
                                                    <Badge bg="danger" className="p-2 text-sm">Hết hàng</Badge>
                                                )}
                                            </div>
                                        </ListGroup.Item>

                                        {displayCountInStock > 0 && (
                                            <ListGroup.Item className="p-3 bg-gray-50 border-0">
                                                <div className="flex flex-col gap-3">
                                                    
                                                    {/* Nút Thêm vào Giỏ (Nổi bật) */}
                                                    <Button 
                                                        onClick={addToCartHandler} 
                                                        variant="dark"
                                                        className="w-full hover:bg-gray-800 transition-colors py-3 font-bold text-sm shadow-lg hover:scale-105 transition-transform" 
                                                    >
                                                    🛒 Thêm vào Giỏ 
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            {/* ==========================================================
            SECTION: ĐÁNH GIÁ VÀ SẢN PHẨM LIÊN QUAN (Full Width)
            ==========================================================
            */}
            <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200">
                <Row id="reviews">
                    <Col md={12}>
                        <div className="bg-white p-6 shadow-xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Đánh giá & Bình luận</h2>
                            {product._id && <ReviewSection productId={product._id} />}
                        </div>
                    </Col>
                </Row>


                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Các sản phẩm liên quan</h2>
                
                {loadingRelated ? (
                    <LoadingBox />
                ) : errorRelated ? (
                    <MessageBox variant="warning">Không thể tải sản phẩm liên quan.</MessageBox>
                ) : relatedProducts && relatedProducts.length > 0 ? (
                    <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductItem key={p._id || p.slug} product={p} />
                        ))}
                    </motion.div>
                ) : (
                    <MessageBox variant="info">Không tìm thấy sản phẩm liên quan nào.</MessageBox>
                )}
            </div>
        </div>
    )
}