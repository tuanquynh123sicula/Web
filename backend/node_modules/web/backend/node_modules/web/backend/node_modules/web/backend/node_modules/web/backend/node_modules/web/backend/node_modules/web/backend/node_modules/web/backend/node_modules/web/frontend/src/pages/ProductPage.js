import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery, useGetRelatedProductsQuery } from "../hooks/productHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
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
import AddToWishlistBtn from '@/components/AddToWishlistBtn';
import AddToCompareBtn from '@/components/AddToCompareBtn';
import { ShoppingCart, Package, Shield, Truck } from 'lucide-react';
export default function ProductPage() {
    const params = useParams();
    const { slug } = params;
    const { data: product, isLoading, error, } = useGetProductDetailsBySlugQuery(slug);
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [imgError, setImgError] = useState(false);
    const { data: relatedProducts, isLoading: loadingRelated, error: errorRelated } = useGetRelatedProductsQuery(product?.category || '', product?._id || '', 4);
    const tier = userInfo?.tier ?? 'regular';
    const rateMap = { regular: 0, new: 0.02, vip: 0.1 };
    const discountRate = rateMap[tier];
    const hasDiscount = discountRate > 0;
    const imageUrl = (src) => {
        if (!src)
            return '/images/placeholder.png';
        if (src.startsWith('http'))
            return src;
        if (src.startsWith('/images/'))
            return src;
        if (src.startsWith('/uploads/'))
            return `http://localhost:4000${src}`;
        if (src.startsWith('/'))
            return src;
        return `/images/${src}`;
    };
    const hasVariants = product?.variants && product.variants.length > 0;
    const selectedVariant = hasVariants ? product.variants[selectedVariantIdx] : undefined;
    const basePrice = hasVariants
        ? selectedVariant?.price ?? 0
        : product?.price ?? 0;
    const displayPrice = hasDiscount
        ? Math.round(basePrice * (1 - discountRate))
        : basePrice;
    const displayCountInStock = hasVariants
        ? selectedVariant?.countInStock ?? 0
        : product?.countInStock ?? 0;
    const displayImage = hasVariants
        ? selectedVariant?.image
        : product?.image;
    const addToCartHandler = async () => {
        try {
            const cartItem = convertProductToCartItem(product, hasVariants && selectedVariantIdx !== -1
                ? product.variants[selectedVariantIdx]
                : undefined);
            if (!cartItem.price || cartItem.price <= 0) {
                toast.error('Giá sản phẩm không hợp lệ');
                return;
            }
            if (cartItem.countInStock <= 0) {
                toast.error('Sản phẩm đã hết hàng');
                return;
            }
            dispatch({
                type: 'CART_ADD_ITEM',
                payload: cartItem,
            });
            toast.success('Đã thêm vào giỏ hàng');
            navigate('/cart');
        }
        catch {
            console.error('Add to cart error:');
            toast.error('Lỗi khi thêm vào giỏ hàng');
        }
    };
    if (isLoading)
        return _jsx(LoadingBox, {});
    if (error)
        return _jsx(MessageBox, { variant: "danger", children: getError(error) });
    if (!product)
        return _jsx(MessageBox, { variant: "danger", children: "Product Not Found" });
    const allImages = hasVariants
        ? product.variants.map(v => v.image).filter(Boolean)
        : [product.image].filter(Boolean);
    const handleThumbnailClick = (index) => {
        setSelectedVariantIdx(index);
        setImgError(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pl-56 pr-6 pt-20 pb-10", children: [_jsx(Helmet, { children: _jsx("title", { children: product.name }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "max-w-7xl mx-auto", children: _jsxs(Row, { className: "max-w-7xl mx-auto", children: [_jsx(Col, { md: 6, className: "p-0 pr-6", children: _jsxs(motion.div, { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.1 }, className: "bg-white shadow-2xl overflow-hidden p-8 border border-gray-100 transition-all duration-500 hover:shadow-3xl", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 }, transition: { duration: 0.4 }, className: "relative group", children: [_jsx(motion.img, { whileHover: { scale: 1.05 }, transition: { duration: 0.3 }, className: "w-full h-auto object-contain max-h-[500px] cursor-zoom-in", src: imageUrl(displayImage), alt: product.name, onError: () => setImgError(true) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })] }, displayImage) }), imgError && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-red-500 text-sm mt-3", children: "Kh\u00F4ng th\u1EC3 t\u1EA3i \u1EA3nh. \u0110ang hi\u1EC3n th\u1ECB \u1EA3nh thay th\u1EBF." })), allImages.length > 1 && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "flex gap-3 mt-6 overflow-x-auto p-2 border-t border-gray-200", children: allImages.map((img, idx) => (_jsx(motion.img, { whileHover: { scale: 1.1, y: -5 }, whileTap: { scale: 0.95 }, src: imageUrl(img), alt: `Thumbnail ${idx + 1}`, onClick: () => handleThumbnailClick(idx), className: `w-16 h-16 object-contain border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
                                                ${selectedVariantIdx === idx ? 'border-black shadow-lg ring-2 ring-black' : 'border-gray-200 hover:border-gray-400'}
                                            ` }, idx))) }))] }) }), _jsx(Col, { md: 6, children: _jsxs(Row, { children: [_jsx(Col, { md: 7, children: _jsxs(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 }, children: [_jsxs("div", { className: "mb-4 pb-4 border-b border-gray-200", children: [_jsx(motion.h1, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "text-3xl font-bold text-gray-900 mb-3", children: product.name }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, children: _jsx(Rating, { rating: product.rating, numReviews: product.numReviews }) }), _jsxs("div", { className: "flex gap-3", children: [_jsx(motion.div, { whileHover: { scale: 1.1, rotate: 5 }, whileTap: { scale: 0.9 }, children: product._id && _jsx(AddToWishlistBtn, { productId: product._id }) }), _jsx(motion.div, { whileHover: { scale: 1.1, rotate: -5 }, whileTap: { scale: 0.9 }, children: product._id && _jsx(AddToCompareBtn, { productId: product._id }) })] })] }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, className: "mt-2", children: [_jsx("div", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Gi\u00E1:" }), hasDiscount && basePrice > displayPrice ? (_jsxs("div", { className: "mt-1 flex items-center", children: [_jsxs(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-gray-400 line-through mr-3 text-base", children: [basePrice.toLocaleString('vi-VN'), " \u20AB"] }), _jsxs(motion.span, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: { type: "spring" }, className: "text-red-600 font-bold text-3xl", children: [displayPrice.toLocaleString('vi-VN'), " \u20AB"] }), _jsx(motion.div, { whileHover: { scale: 1.1 }, className: "ml-3", children: _jsxs(Badge, { bg: "danger", className: "py-1 px-3 text-xs font-bold shadow-md", children: ["-", Math.round(discountRate * 100), "%"] }) })] })) : (_jsxs(motion.span, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: { type: "spring" }, className: "font-bold text-black text-3xl", children: [displayPrice.toLocaleString('vi-VN'), " \u20AB"] }))] })] }), hasVariants && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: _jsx(ListGroup, { className: "p-0 border-0 mb-4", children: _jsxs(ListGroup.Item, { className: "bg-white border-0 p-0 pb-3", children: [_jsx("strong", { className: "text-gray-700 block mb-3 text-base", children: "Ch\u1ECDn phi\u00EAn b\u1EA3n:" }), _jsx("div", { className: "flex flex-wrap gap-3", children: product.variants.map((v, idx) => (_jsxs(motion.div, { onClick: () => setSelectedVariantIdx(idx), whileHover: {
                                                                            scale: 1.08,
                                                                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                                                            y: -5
                                                                        }, whileTap: { scale: 0.95 }, className: `p-3 border cursor-pointer transition-all duration-300 min-w-[120px] text-center shadow-sm
                                                                    ${selectedVariantIdx === idx
                                                                            ? 'border-black bg-gray-100 shadow-lg ring-2 ring-black'
                                                                            : 'border-gray-300 hover:border-gray-500 bg-white'}
                                                                `, children: [_jsxs("span", { className: "font-semibold text-sm block", children: [v.storage, " / ", v.ram] }), _jsx("span", { className: "text-xs text-gray-600 block", children: v.color }), _jsxs("span", { className: "text-sm font-bold text-red-600 mt-1 block", children: [v.price?.toLocaleString('vi-VN'), " \u20AB"] })] }, v._id ?? idx))) })] }) }) })), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "mt-4 pt-4 border-t border-gray-200", children: [_jsx("div", { className: "text-lg font-semibold text-gray-700 mb-2", children: "Th\u00F4ng tin c\u01A1 b\u1EA3n:" }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-5 leading-relaxed", children: product.description })] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.7 }, className: "mt-6 grid grid-cols-2 gap-3", children: [
                                                        { icon: Shield, text: 'Bảo hành chính hãng' },
                                                        { icon: Truck, text: 'Miễn phí vận chuyển' },
                                                        { icon: Package, text: 'Đổi trả trong 7 ngày' },
                                                        { icon: ShoppingCart, text: 'Thanh toán linh hoạt' }
                                                    ].map((item, idx) => (_jsxs(motion.div, { whileHover: { scale: 1.05, y: -3 }, className: "flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 shadow-sm", children: [_jsx(item.icon, { size: 18, className: "text-blue-600" }), _jsx("span", { className: "text-xs text-gray-700 font-medium", children: item.text })] }, idx))) })] }) }), _jsx(Col, { md: 5, children: _jsx(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.3 }, children: _jsx(Card, { className: "shadow-2xl border-0 sticky top-24 transition-all duration-500 hover:shadow-3xl", children: _jsx(Card.Body, { className: "p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200", children: _jsxs(ListGroup, { variant: "flush", children: [_jsxs(ListGroup.Item, { className: "p-3 bg-transparent border-b", children: [_jsx("div", { className: "text-sm font-semibold text-gray-700", children: "T\u00ECnh tr\u1EA1ng:" }), _jsx(motion.div, { whileHover: { scale: 1.05 }, className: "mt-2", children: displayCountInStock > 0 ? (_jsxs(Badge, { bg: "success", className: "p-2 text-sm shadow-md", children: ["C\u00F2n h\u00E0ng (", displayCountInStock, ")"] })) : (_jsx(Badge, { bg: "danger", className: "p-2 text-sm shadow-md", children: "H\u1EBFt h\u00E0ng" })) })] }), displayCountInStock > 0 && (_jsx(ListGroup.Item, { className: "p-3 bg-transparent border-0", children: _jsx("div", { className: "flex flex-col gap-3", children: _jsx(motion.div, { whileHover: { scale: 1.02, y: -2 }, whileTap: { scale: 0.98 }, children: _jsxs(Button, { onClick: addToCartHandler, variant: "dark", className: "w-full hover:bg-gray-800 transition-all duration-300 py-3 font-bold text-sm shadow-xl hover:shadow-2xl", children: [_jsx(ShoppingCart, { size: 18, className: "inline mr-2" }), "Th\u00EAm v\u00E0o Gi\u1ECF"] }) }) }) }))] }) }) }) }) })] }) })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200", children: [_jsx(Row, { id: "reviews", children: _jsx(Col, { md: 12, children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "bg-white p-6 shadow-2xl border border-gray-200 transition-all duration-500 hover:shadow-3xl", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6 border-b pb-2", children: "\u0110\u00E1nh gi\u00E1 & B\u00ECnh lu\u1EADn" }), product._id && _jsx(ReviewSection, { productId: product._id })] }) }) }), _jsx(motion.h2, { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, className: "text-2xl font-bold text-gray-900 mt-10 mb-6", children: "C\u00E1c s\u1EA3n ph\u1EA9m li\u00EAn quan" }), loadingRelated ? (_jsx(LoadingBox, {})) : errorRelated ? (_jsx(MessageBox, { variant: "warning", children: "Kh\u00F4ng th\u1EC3 t\u1EA3i s\u1EA3n ph\u1EA9m li\u00EAn quan." })) : relatedProducts && relatedProducts.length > 0 ? (_jsx(motion.div, { layout: true, className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: relatedProducts.map((p, idx) => (_jsx(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: idx * 0.1 }, children: _jsx(ProductItem, { product: p }) }, p._id || p.slug))) })) : (_jsx(MessageBox, { variant: "info", children: "Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m li\u00EAn quan n\u00E0o." }))] })] }));
}
