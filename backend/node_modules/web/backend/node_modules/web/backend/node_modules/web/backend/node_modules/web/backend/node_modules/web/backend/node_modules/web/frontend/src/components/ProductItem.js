import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { convertProductToCartItem } from "../utils";
import AddToWishlistBtn from "@/components/AddToWishlistBtn";
import { useAddToCompareMutation, useRemoveByProductIdMutation } from '@/hooks/compareHooks';
function ProductItem({ product }) {
    const [imgError, setImgError] = useState(false);
    const [inCompare, setInCompare] = useState(false);
    const { state, dispatch } = useContext(Store);
    const { mutateAsync: addToCompare } = useAddToCompareMutation();
    const { mutateAsync: removeFromCompare } = useRemoveByProductIdMutation();
    if (!product)
        return null;
    const { cart: { cartItems }, userInfo, } = state;
    const tier = userInfo?.tier ?? 'regular';
    const rateMap = { regular: 0, new: 0.02, vip: 0.1 };
    const hasDiscount = rateMap[tier] > 0;
    const displayPrice = hasDiscount
        ? Math.round((product.price ?? 0) * (1 - rateMap[tier]))
        : (product.price ?? 0);
    const addToCartHandler = (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if ((product.countInStock ?? 0) < quantity) {
            toast.warn("Sản phẩm đã hết hàng");
            return;
        }
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...item, quantity },
        });
        toast.success("Đã thêm vào giỏ hàng");
    };
    // Hàm xử lý So Sánh
    const handleToggleCompare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo) {
            toast.error('Vui lòng đăng nhập');
            return;
        }
        try {
            if (inCompare) {
                setInCompare(false);
                await removeFromCompare(product._id);
                toast.success('Đã xóa khỏi danh sách so sánh');
            }
            else {
                setInCompare(true);
                await addToCompare({
                    productId: product._id,
                    variantIndex: 0
                });
                toast.success('Đã thêm vào danh sách so sánh');
            }
        }
        catch (err) {
            setInCompare(!inCompare);
            console.error('Compare error:', err);
            toast.error('Lỗi khi cập nhật danh sách so sánh');
        }
    };
    const imageSrc = (() => {
        const img = product.variants?.[0]?.image || product.image;
        if (!img || typeof img !== "string" || img.trim() === "")
            return null;
        if (img.startsWith("http"))
            return img;
        if (img.startsWith("/images/"))
            return img;
        if (img.startsWith("/uploads/"))
            return `http://localhost:4000${img}`;
        if (!img.startsWith("/"))
            return `http://localhost:4000/uploads/${img}`;
        return `http://localhost:4000${img}`;
    })();
    return (_jsxs(motion.div, { whileHover: { y: -3 }, className: "bg-white border border-gray-100 shadow-md rounded-none overflow-hidden transition group flex flex-col" // 💡 Cấu trúc cột để căn chỉnh dưới cùng
        , children: [_jsxs("div", { className: "relative", children: [_jsx(Link, { to: `/product/${product.slug ?? ''}`, className: "block", children: imgError || !imageSrc ? (_jsx("div", { className: "bg-gray-200 flex items-center justify-center h-[320px] text-gray-400 text-sm", children: "No image" })) : (_jsx("img", { src: imageSrc, alt: product.name ?? "product", onError: () => setImgError(true), className: "w-full h-[320px] object-contain bg-white transition-opacity duration-300 group-hover:opacity-90" })) }), product._id && (_jsx("div", { className: "absolute top-3 right-3 z-10 flex flex-col gap-2", children: _jsx("div", { className: "transition duration-300 opacity-80 hover:opacity-100 hover:scale-110", children: _jsx(AddToWishlistBtn, { productId: product._id }) }) }))] }), _jsxs("div", { className: "p-4 text-left bg-[#f5f5f5] flex flex-col flex-grow", children: [_jsxs("div", { className: "flex-grow", children: [_jsx(Link, { to: `/product/${product.slug ?? ''}`, children: _jsx("h3", { className: "text-base font-semibold text-gray-900 mb-1 hover:underline line-clamp-2 min-h-[3rem]", children: product.name }) }), product.rating && (_jsxs("p", { className: "text-sm text-gray-500 mb-2", children: [product.rating, " \u2B50 (", product.numReviews ?? 0, " reviews)"] }))] }), _jsx("div", { className: "mb-2", children: hasDiscount ? (_jsxs("div", { children: [_jsxs("span", { className: "text-gray-400 line-through mr-2 text-sm", children: [(product.price ?? 0).toLocaleString('vi-VN'), " \u20AB"] }), _jsxs("span", { className: "text-black font-bold text-base", children: [displayPrice.toLocaleString('vi-VN'), " \u20AB"] })] })) : (_jsxs("span", { className: "font-semibold text-black text-base", children: [(product.price ?? 0).toLocaleString('vi-VN'), " \u20AB"] })) }), _jsxs("div", { className: "flex justify-start gap-3 items-center mt-2", children: [product._id && (_jsx("button", { onClick: handleToggleCompare, disabled: false, className: `text-sm transition p-1 text-blue-500 ${inCompare
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-blue-500 hover:text-blue-900'}`, children: "+ So s\u00E1nh" })), _jsx("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCartHandler(convertProductToCartItem(product));
                                }, className: "text-sm text-gray-700 hover:text-black transition p-1", children: "+ Th\u00EAm v\u00E0o gi\u1ECF h\u00E0ng" })] })] })] }));
}
export default ProductItem;
