import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import LoadingBox from '@/components/LoadingBox';
import MessageBox from '@/components/MessageBox';
import ProductItem from '@/components/ProductItem';
import { useGetProductsQuery } from '@/hooks/productHooks';
import { ArrowLeftRight } from 'lucide-react';
import { useGetCompareQuery } from '@/hooks/compareHooks';
import { getError } from '@/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
const CATEGORIES = [
    { name: 'iPhone', img: '/logo/iphone.png' },
    { name: 'Samsung', img: '/logo/samsung.png' },
    { name: 'Xiaomi', img: '/logo/xiaomi.png' },
    { name: 'Honor', img: '/logo/honor.png' },
    { name: 'Laptop', img: '/logo/laptop.png' },
    { name: 'Accessories', img: '/logo/accessories.png' },
];
const CATEGORIES_TO_SHOW = CATEGORIES.slice(0, 6);
const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    },
};
export default function HomePage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const query = params.get('query') || '';
    const urlCategory = params.get('category') || '';
    const normalized = query.trim().toLowerCase();
    const [currentPage, setCurrentPage] = useState(0);
    const PRODUCTS_PER_PAGE = 8;
    const [filters, setFilters] = useState({
        category: urlCategory || undefined,
        minPrice: 0,
        maxPrice: 100000000,
        sortBy: 'newest',
        inStock: false,
    });
    React.useEffect(() => {
        setFilters(prev => {
            if (prev.category !== urlCategory) {
                return { ...prev, category: urlCategory || undefined };
            }
            return prev;
        });
    }, [urlCategory]);
    const { data: products, isLoading, error } = useGetProductsQuery({
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        sortBy: filters.sortBy,
        inStock: filters.inStock,
    });
    const { data: compareData } = useGetCompareQuery();
    const compareCount = compareData?.count || 0;
    const banners = [
        '/banner/IMG_20251106_175224.png',
        '/banner/banner3.png',
        '/banner/IMG_20251106_174944.png',
        '/banner/IMG_20251106_175148.png',
    ];
    const filteredProducts = products
        ?.filter((p) => {
        if (normalized) {
            const haystack = `${p.name ?? ''} ${p.brand ?? ''} ${p.category ?? ''} ${p.description ?? ''}`.toLowerCase();
            if (!haystack.includes(normalized))
                return false;
        }
        if (filters.rating) {
            if (typeof p.rating !== 'number' || p.rating < filters.rating)
                return false;
        }
        if (filters.inStock && p.countInStock <= 0)
            return false;
        return true;
    })
        .sort((a, b) => {
        if (filters.sortBy === 'price-low') {
            return (a.price || 0) - (b.price || 0);
        }
        if (filters.sortBy === 'price-high') {
            return (b.price || 0) - (a.price || 0);
        }
        return (b.rating || 0) - (a.rating || 0);
    }) ?? [];
    const handleCategoryChange = (cat) => setFilters((prev) => ({ ...prev, category: prev.category === cat ? undefined : cat }));
    const handleReset = () => setFilters({ minPrice: 0, maxPrice: 100000000, sortBy: 'newest', inStock: false });
    const featured = filteredProducts.slice(0, 4);
    const newArrivals = filteredProducts.slice(4, 12);
    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const navigate = useNavigate();
    return (_jsxs("div", { className: "bg-white text-gray-800 ", children: [_jsx("section", { className: "relative max-w-10xl mx-auto shadow-lg overflow-hidden transition-shadow duration-500", children: _jsx(Swiper, { modules: [Autoplay, Pagination], slidesPerView: 1, pagination: { clickable: true }, autoplay: { delay: 4000, disableOnInteraction: false }, loop: true, className: "rounded-none", children: banners.map((b, i) => (_jsx(SwiperSlide, { children: _jsx("div", { className: "relative h-100 w-full", children: _jsx("img", { src: b, alt: `Banner ${i + 1}`, className: "w-full h-full object-cover transition-transform duration-1000 ease-out", style: { transform: i === 0 ? 'scale(1.03)' : 'scale(1)' } }) }) }, i))) }) }), _jsxs(motion.section, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, className: "mx-auto px-4 py-8 max-w-[900px] scale-[0.90] origin-top bg-white shadow-xl border-t border-b", children: [_jsx("h2", { className: "text-2xl font-extrabold uppercase mb-6 text-center tracking-tight text-black", children: "Kh\u00E1m ph\u00E1 S\u1EA3n ph\u1EA9m" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-3 text-black border-b border-gray-300 pb-2", children: "Danh M\u1EE5c Ch\u00EDnh" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: CATEGORIES_TO_SHOW.map((cat) => (_jsxs(motion.div, { whileHover: { scale: 1.05, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }, transition: { duration: 0.2 }, onClick: () => handleCategoryChange(cat.name), className: `border p-2 h-20 flex flex-col items-center justify-center 
                    cursor-pointer group transition-all duration-300
                    ${filters.category === cat.name
                                                ? 'border-black bg-gray-100 shadow-md'
                                                : 'border-gray-300 bg-white hover:border-black'}`, children: [_jsx("img", { src: cat.img, alt: cat.name, className: "w-auto h-10 object-contain mb-1 group-hover:scale-105 transition-transform duration-300" }), _jsx("span", { className: "text-black text-xs font-medium leading-none text-center", children: cat.name })] }, cat.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold mb-3 text-black border-b border-gray-300 pb-2", children: "B\u1ED9 L\u1ECDc Chi Ti\u1EBFt" }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 mb-1 font-semibold text-xs", children: "Gi\u00E1 t\u1ED1i thi\u1EC3u" }), _jsx("input", { type: "number", value: filters.minPrice ?? '', onChange: (e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) })), className: "border border-gray-400 px-2 h-9 text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200", placeholder: "0" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 mb-1 font-semibold text-xs", children: "Gi\u00E1 t\u1ED1i \u0111a" }), _jsx("input", { type: "number", value: filters.maxPrice ?? '', onChange: (e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) })), className: "border border-gray-400 px-2 h-9 text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200", placeholder: "100000000" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 mb-1 font-semibold text-xs", children: "S\u1EAFp x\u1EBFp" }), _jsxs("select", { value: filters.sortBy, onChange: (e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value })), className: "border border-gray-400 px-2 h-9 bg-white text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200", children: [_jsx("option", { value: "newest", children: "M\u1EDBi nh\u1EA5t" }), _jsx("option", { value: "price-low", children: "Gi\u00E1 th\u1EA5p \u2192 cao" }), _jsx("option", { value: "price-high", children: "Gi\u00E1 cao \u2192 th\u1EA5p" })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 mb-1 font-semibold text-xs", children: "\u0110\u00E1nh gi\u00E1 sao" }), _jsxs("select", { value: filters.rating ?? '', onChange: (e) => setFilters((prev) => ({
                                                            ...prev,
                                                            rating: Number(e.target.value) || undefined,
                                                        })), className: "border border-gray-400 px-2 h-9 bg-white text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200", children: [_jsx("option", { value: "", children: "T\u1EA5t c\u1EA3" }), _jsx("option", { value: "4", children: "T\u1EEB 4 sao" }), _jsx("option", { value: "3", children: "T\u1EEB 3 sao" }), _jsx("option", { value: "2", children: "T\u1EEB 2 sao" }), _jsx("option", { value: "1", children: "T\u1EEB 1 sao" })] })] }), _jsxs("div", { className: "flex items-end pb-1 col-span-2", children: [_jsx("input", { type: "checkbox", checked: filters.inStock, onChange: () => setFilters((prev) => ({ ...prev, inStock: !prev.inStock })), id: "inStock", className: "w-4 h-4 accent-black transition duration-200" }), _jsx("label", { htmlFor: "inStock", className: "ml-2 text-black text-sm font-medium cursor-pointer hover:text-gray-700 transition duration-200", children: "C\u00F2n h\u00E0ng" })] })] }), _jsx(motion.button, { whileHover: { scale: 1.03 }, transition: { duration: 0.2 }, onClick: handleReset, className: "mt-4 px-5 py-2 text-xs uppercase font-bold text-black hover:bg-gray-100 shadow-md active:bg-gray-900 transition-colors duration-200", children: "\u0110\u1EB7t l\u1EA1i B\u1ED9 L\u1ECDc" })] })] })] }), featured.length > 0 && (_jsxs(motion.section, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, variants: sectionVariants, className: "pb-12 border-t border-gray-200 pt-8 pl-40 pr-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 tracking-tight text-gray-900", children: "\uD83D\uDD25 S\u1EA3n ph\u1EA9m n\u1ED5i b\u1EADt" }), _jsx(motion.div, { layout: true, className: "grid grid-cols-2 lg:grid-cols-4 gap-6 ", children: (showAllFeatured ? filteredProducts : featured).map((p) => (_jsx(ProductItem, { product: p }, p._id || p.slug))) }), filteredProducts.length > 4 && !showAllFeatured && (_jsx("div", { className: "flex justify-center mt-6", children: _jsx(motion.button, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, onClick: () => setShowAllFeatured(true), className: "px-6 py-2 bg-gray-100 text-black font-semibold uppercase shadow hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200", children: "Xem th\u00EAm c\u00E1c s\u1EA3n ph\u1EA9m" }) })), showAllFeatured && (_jsx("div", { className: "flex justify-center mt-4", children: _jsx(motion.button, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, onClick: () => setShowAllFeatured(false), className: "px-6 py-2 bg-gray-100 text-black font-semibold uppercase shadow hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200", children: "Thu g\u1ECDn" }) }))] })), _jsx(motion.section, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, variants: sectionVariants, className: "pb-12 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 pl-40 pr-10 ", children: ['/banner/banner5.png', '/banner/banner6.png', '/banner/banner7.png'].map((b, i) => (_jsxs("div", { className: "relative h-48 overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" // Loại bỏ rounded-xl
                    , children: [_jsx("img", { src: b, alt: `Mini Banner ${i + 1}`, className: "w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out" // Tăng tốc độ scale
                         }), _jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: "Gi\u1EA3m Gi\u00E1" })] }, i))) }), newArrivals.length > 0 && (_jsxs(motion.section, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, variants: sectionVariants, className: "pb-12 border-t border-gray-200 pt-8 pl-40 pr-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 tracking-tight text-gray-900", children: "\u2728 S\u1EA3n ph\u1EA9m m\u1EDBi v\u1EC1" }), _jsx(motion.div, { layout: true, className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: newArrivals.map((p) => (_jsx(ProductItem, { product: p }, p._id || p.slug))) })] })), _jsxs(motion.section, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, variants: sectionVariants, className: "pb-12 border-t border-gray-200 pt-8 pl-40 pr-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 tracking-tight text-gray-900", children: query ? '🔎 Kết quả tìm kiếm' : '🛒 Tất cả sản phẩm' }), isLoading ? (_jsx(LoadingBox, {})) : error ? (_jsx(MessageBox, { variant: "danger", children: getError(error) })) : filteredProducts.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 text-lg py-10 border bg-white shadow-sm transition-shadow duration-300", children: "Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m ph\u00F9 h\u1EE3p v\u1EDBi ti\u00EAu ch\u00ED c\u1EE7a b\u1EA1n." })) : (_jsxs(_Fragment, { children: [_jsx(motion.div, { layout: true, className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: filteredProducts
                                    .slice(currentPage * PRODUCTS_PER_PAGE, (currentPage + 1) * PRODUCTS_PER_PAGE)
                                    .map((p) => (_jsx(ProductItem, { product: p }, p.slug || p._id))) }), _jsxs("div", { className: "flex justify-center items-center gap-4 mt-8", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, onClick: () => setCurrentPage(Math.max(0, currentPage - 1)), disabled: currentPage === 0, className: "px-6 py-2 text-black font-semibold uppercase shadow hover:bg-gray-100 disabled:bg-white disabled:cursor-not-allowed active:bg-gray-200 transition-colors duration-200", children: "\u2190 Tr\u01B0\u1EDBc" }), _jsxs("span", { className: "text-gray-700 font-semibold", children: ["Trang ", currentPage + 1, " / ", Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, onClick: () => setCurrentPage(currentPage + 1), disabled: (currentPage + 1) * PRODUCTS_PER_PAGE >= filteredProducts.length, className: "px-6 py-2 text-black font-semibold uppercase shadow hover:bg-gray-100 disabled:bg-white disabled:cursor-not-allowed active:bg-gray-200 transition-colors duration-200", children: "Sau \u2192" })] })] }))] }), _jsx(motion.button, { onClick: () => navigate('/compare'), whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, 
                // Giữ nguyên kiểu dáng chung của nút
                className: "fixed bottom-8 right-8 w-[150px] h-12 bg-white text-blue-600 border border-gray-300 rounded-full shadow-lg flex items-center justify-center gap-2 hover:border-black hover:shadow-xl transition-all duration-200 z-50", title: "So s\u00E1nh s\u1EA3n ph\u1EA9m", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(ArrowLeftRight, { size: 20, className: "text-blue-600" }), _jsx("span", { className: "font-semibold text-blue-600 text-sm", children: "So s\u00E1nh" }), compareCount > 0 && (_jsx(motion.span, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 420, damping: 22 }, className: "bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold", children: compareCount }))] }) }), _jsx(Footer, {})] }));
}
