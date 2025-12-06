import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Store } from '@/Store';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/hooks/wishlistHook';
import { toast } from 'react-toastify';
import LoadingBox from '@/components/LoadingBox';
import MessageBox from '@/components/MessageBox';
// Hàm xử lý đường dẫn ảnh (giữ nguyên)
const imageUrl = (src) => {
    if (!src)
        return '/images/placeholder.png';
    if (src.startsWith('http'))
        return src;
    // Để nguyên đường dẫn /images/xxx, React sẽ tìm trong public
    if (src.startsWith('/images/'))
        return src;
    if (src.startsWith('/uploads/'))
        return `http://localhost:4000${src}`;
    if (src.startsWith('/'))
        return src;
    return `/images/${src}`;
};
export default function WishlistPage() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const { data: wishlistData, isLoading } = useGetWishlistQuery();
    const { mutateAsync: removeFromWishlist, isPending } = useRemoveFromWishlistMutation();
    if (!userInfo) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center pl-56 pr-6", children: _jsx(MessageBox, { variant: "danger", children: "Vui l\u00F2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 xem danh s\u00E1ch y\u00EAu th\u00EDch" }) }));
    }
    const handleRemove = async (wishlistId) => {
        try {
            await removeFromWishlist(wishlistId);
            toast.success('Đã xóa khỏi danh sách yêu thích');
        }
        catch {
            toast.error('Lỗi khi xóa');
        }
    };
    const handleAddToCart = (item) => {
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: {
                _id: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.productPrice,
                slug: item.productSlug,
                countInStock: item.productCountInStock || 0,
                quantity: 1,
            },
        });
        toast.success('Đã thêm vào giỏ hàng');
        navigate('/cart'); // Chuyển hướng sau khi thêm thành công
    };
    if (isLoading)
        return _jsx(LoadingBox, {});
    const typedData = wishlistData;
    const wishlist = typedData?.wishlist || [];
    return (_jsxs("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: [_jsx(Helmet, { children: _jsx("title", { children: "Danh s\u00E1ch y\u00EAu th\u00EDch" }) }), _jsxs("div", { className: "max-w-7xl mx-auto p-4 bg-white shadow-lg border border-gray-200", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300 flex items-center gap-2", children: [_jsx(Heart, { size: 32, className: "text-red-600" }), "DANH S\u00C1CH Y\u00CAU TH\u00CDCH (", wishlist.length, ")"] }), wishlist.length === 0 ? (_jsxs("div", { className: "bg-gray-50 p-12 text-center border border-dashed border-gray-400 transition duration-300 hover:shadow-inner", children: [_jsx(Heart, { size: 64, className: "mx-auto text-gray-400 mb-4" }), _jsx("p", { className: "text-lg text-gray-600 mb-6 font-medium", children: "Danh s\u00E1ch y\u00EAu th\u00EDch c\u1EE7a b\u1EA1n \u0111ang tr\u1ED1ng." }), _jsx("button", { onClick: () => navigate('/'), className: "px-8 py-3 bg-black text-white border border-black hover:bg-gray-800 transition duration-300 font-semibold shadow-md", children: "B\u1EAET \u0110\u1EA6U MUA S\u1EAEM" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: wishlist.map((item) => (_jsxs("div", { className: "bg-white overflow-hidden shadow-md border border-gray-200 transition duration-300 hover:shadow-xl hover:-translate-y-0.5", children: [_jsx("div", { className: "relative overflow-hidden bg-gray-50 h-56", children: _jsx("img", { src: imageUrl(item.productImage), alt: item.productName, className: "w-full h-full object-contain transition duration-500 cursor-pointer", onClick: () => navigate(`/product/${item.productSlug}`) }) }), _jsxs("div", { className: "p-4 flex flex-col justify-between h-[calc(100%-14rem)]", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-gray-900 cursor-pointer hover:text-black hover:underline transition line-clamp-2 mb-2", onClick: () => navigate(`/product/${item.productSlug}`), children: item.productName }), _jsxs("div", { className: "text-xl font-extrabold text-black mb-4", children: [item.productPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("button", { onClick: () => handleAddToCart(item), className: "text-sm text-gray-700 hover:text-black hover:scale-105 transition p-1 font-bold", children: "+ Th\u00EAm v\u00E0o gi\u1ECF h\u00E0ng" }), _jsx("button", { onClick: () => handleRemove(item._id), disabled: isPending, className: "text-sm text-red-500 hover:text-red-700 hover:scale-105 transition p-1 font-bold", children: "- X\u00F3a" })] })] })] }, item._id))) }))] })] }));
}
