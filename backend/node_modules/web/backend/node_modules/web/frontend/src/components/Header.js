import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '@/Store';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useGetWishlistQuery } from '@/hooks/wishlistHook';
function IconStore(props) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "1em", height: "1em", fill: "none", stroke: "currentColor", ...props, children: [_jsx("path", { d: "M4 10V6l2-2h12l2 2v4", strokeWidth: "1.5" }), _jsx("path", { d: "M4 10h16v10H4z", strokeWidth: "1.5" }), _jsx("path", { d: "M9 14h6v6H9z", strokeWidth: "1.5" })] }));
}
function IconSearch(props) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "1em", height: "1em", fill: "none", stroke: "currentColor", ...props, children: [_jsx("circle", { cx: "11", cy: "11", r: "7", strokeWidth: "1.5" }), _jsx("path", { d: "M20 20l-3.5-3.5", strokeWidth: "1.5" })] }));
}
function IconUser(props) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "1em", height: "1em", fill: "none", stroke: "currentColor", ...props, children: [_jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("circle", { cx: "12", cy: "7", r: "4", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
function IconCart(props) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "1em", height: "1em", fill: "none", stroke: "currentColor", ...props, children: [_jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 10a4 4 0 0 1-8 0", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
export default function Header() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const [query, setQuery] = useState('');
    const [openUser, setOpenUser] = useState(false);
    const [searchFocus, setSearchFocus] = useState(false);
    const cart = state.cart;
    const cartCount = cart.cartItems.reduce((a, c) => a + c.quantity, 0);
    const { data: wishlistData } = useGetWishlistQuery();
    const wishlistCount = wishlistData?.count || 0;
    const handleSearchSubmit = (e) => {
        if (e)
            e.preventDefault();
        const q = query.trim();
        if (q)
            navigate(`/?query=${encodeURIComponent(q)}`);
        else
            navigate(`/`);
        setSearchFocus(false);
    };
    const signoutHandler = () => {
        dispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
        navigate('/signin');
    };
    return (_jsx(motion.header, { initial: { y: -18, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }, className: "fixed left-0 right-0 ", children: _jsx("div", { className: "flex items-center justify-end gap-3 px-6 py-3", children: _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsxs(Link, { to: "/stores", className: "flex items-center gap-2 px-3 py-2 hover:bg-gray-200 transition-all duration-200 text-gray-700 font-medium hover:scale-105 active:scale-95 transform", children: [_jsx(IconStore, { className: "w-5 h-5 transition duration-200" }), _jsx("span", { children: "H\u1EC7 th\u1ED1ng c\u1EEDa h\u00E0ng" })] }), _jsxs("form", { onSubmit: handleSearchSubmit, className: "relative flex items-center", children: [_jsx(motion.input, { value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => setSearchFocus(true), onBlur: () => setTimeout(() => setSearchFocus(false), 150), placeholder: "Nh\u1EADp t\u00EAn s\u1EA3n ph\u1EA9m, th\u01B0\u01A1ng hi\u1EC7u...", className: `py-2 pl-4 pr-9 border text-gray-700 rounded-none
                ${searchFocus ? 'border-black shadow-md' : 'border-gray-300'} 
                focus:outline-none transition-all duration-300`, "aria-label": "T\u00ECm s\u1EA3n ph\u1EA9m", initial: false, animate: { width: searchFocus ? 360 : 300 }, transition: { type: 'spring', stiffness: 380, damping: 28 }, style: { width: 300 } }), _jsx("button", { type: "submit", className: "absolute right-3 text-gray-500 hover:text-black transition-colors duration-200", "aria-label": "T\u00ECm ki\u1EBFm", title: "T\u00ECm ki\u1EBFm", children: _jsx(IconSearch, { className: "w-5 h-5 transition duration-200" }) })] }), userInfo ? (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setOpenUser((v) => !v), onBlur: () => setTimeout(() => setOpenUser(false), 150), 
                                // Thêm hover:scale
                                className: "px-4 py-2 text-black flex items-center gap-2 transition-all duration-200 hover:bg-gray-200 rounded-none hover:scale-105 active:scale-95 transform", children: [_jsx(IconUser, { className: "w-5 h-5 transition duration-200" }), _jsx("span", { className: "max-w-[100px] truncate font-semibold", children: userInfo.name })] }), _jsx(AnimatePresence, { children: openUser && (_jsxs(motion.div, { initial: { opacity: 0, y: 6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 6, scale: 0.98 }, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] }, className: "absolute right-0 mt-2 w-56 bg-white border shadow-xl ring-1 ring-black/5 z-50 p-1 rounded-none", children: [_jsxs("div", { className: "px-3 py-2 text-sm font-medium text-gray-800 border-b mb-1 transition duration-200", children: ["Xin ch\u00E0o, ", userInfo.name] }), _jsx(Link, { to: "/profile", className: "block px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 rounded-none", onClick: () => setOpenUser(false), children: "H\u1ED3 s\u01A1 c\u00E1 nh\u00E2n" }), _jsx(Link, { to: "/orderhistory", className: "block px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 rounded-none", onClick: () => setOpenUser(false), children: "L\u1ECBch s\u1EED \u0111\u01A1n h\u00E0ng" }), userInfo.isAdmin && (_jsx(Link, { to: "/admin/dashboard", className: "block px-3 py-2 hover:bg-gray-50 text-red-600 font-semibold transition-colors duration-200 rounded-none", onClick: () => setOpenUser(false), children: "B\u1EA3ng \u0111i\u1EC1u khi\u1EC3n qu\u1EA3n tr\u1ECB" })), _jsx("button", { onClick: signoutHandler, className: "w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 border-t mt-1 transition-colors duration-200 rounded-none", children: "\u0110\u0103ng xu\u1EA5t" })] })) })] })) : (_jsxs(Link, { to: "/signin", className: "px-4 py-2 text-black flex items-center gap-2 transition-all duration-200 hover:bg-gray-200 font-semibold rounded-none hover:scale-105 active:scale-95 transform", children: [_jsx(IconUser, { className: "w-5 h-5 transition duration-200" }), _jsx("span", { children: "\u0110\u0103ng nh\u1EADp" })] })), _jsxs(Link, { to: "/cart", className: "relative p-2 text-black hover:bg-gray-200 transition-all duration-200 rounded-none hover:scale-105 active:scale-95 transform", "aria-label": `Giỏ hàng${cartCount ? `, ${cartCount} sản phẩm` : ''}`, title: "Gi\u1ECF h\u00E0ng", children: [_jsx(IconCart, { className: "w-6 h-6 transition duration-200" }), cartCount > 0 && (_jsx(motion.span, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 420, damping: 22 }, className: "absolute -top-1 -right-1 min-w-[20px] h-[20px] p-0.5 bg-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white rounded-none", children: cartCount }, cartCount))] }), _jsx("nav", { className: "relative p-2 text-black hover:bg-gray-200 transition-all duration-200 rounded-none hover:scale-105 active:scale-95 transform", children: _jsxs(Link, { to: "/wishlist", className: "flex items-center justify-center w-6 h-6", "aria-label": `Danh sách yêu thích${wishlistCount ? `, ${wishlistCount} sản phẩm` : ''}`, title: "Danh s\u00E1ch y\u00EAu th\u00EDch", children: [_jsx(Heart, { size: 24 }), wishlistCount > 0 && (_jsx(motion.span, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 420, damping: 22 }, className: "absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white", children: wishlistCount }, wishlistCount))] }) })] }) }) }));
}
