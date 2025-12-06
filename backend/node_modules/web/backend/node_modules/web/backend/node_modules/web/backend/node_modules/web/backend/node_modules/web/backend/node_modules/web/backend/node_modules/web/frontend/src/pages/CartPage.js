import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// --- GIỮ NGUYÊN IMPORTS ---
import { Helmet } from 'react-helmet-async';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
export default function CartPage() {
    const navigate = useNavigate();
    const { state: { cart: { cartItems }, }, dispatch, } = useContext(Store);
    const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
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
    const updateCartHandler = (item, quantity) => {
        if (item.countInStock < quantity) {
            toast.warn('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    };
    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    };
    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all", children: [_jsx(Helmet, { children: _jsx("title", { children: "Shopping Cart" }) }), _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-900", children: "Gi\u1ECF H\u00E0ng C\u1EE7a B\u1EA1n" }), _jsxs(Row, { className: "g-4", children: [_jsx(Col, { md: 8, children: cartItems.length === 0 ? (_jsxs(MessageBox, { children: ["Gi\u1ECF h\u00E0ng tr\u1ED1ng. ", _jsx(Link, { to: "/", className: "font-semibold text-blue-600 hover:text-blue-800", children: "Ti\u1EBFp t\u1EE5c mua s\u1EAFm" })] })) : (_jsx(ListGroup, { className: "shadow-lg overflow-hidden", children: cartItems.map((item) => (_jsx(ListGroup.Item, { className: "bg-white p-3 border-b-2 border-gray-100 \r\n                        last:border-b-0 \r\n                        transition-all duration-300 \r\n                        hover:shadow-md hover:scale-[1.01]", children: _jsxs(Row, { className: "align-items-center", children: [_jsxs(Col, { md: 4, className: "flex items-center", children: [_jsx("img", { src: imageUrl(item.image), alt: item.name, className: "w-16 h-16 object-contain mr-3 border border-gray-200" }), _jsxs("div", { children: [_jsx(Link, { to: `/product/${item.slug}`, className: "text-base font-semibold text-gray-800 hover:text-black transition", children: item.name }), item.variant && (_jsxs("div", { className: "text-gray-600 text-xs mt-1", children: [item.variant.color, " / ", item.variant.storage, " / ", item.variant.ram] }))] })] }), _jsxs(Col, { md: 3, className: "flex items-center", children: [_jsx(Button, { onClick: () => updateCartHandler(item, item.quantity - 1), variant: "light", disabled: item.quantity === 1, className: "border p-1 transition-all hover:bg-gray-200 active:scale-90", children: _jsx("i", { className: "fas fa-minus text-gray-700 text-xs" }) }), _jsx("span", { className: "mx-3 font-semibold", children: item.quantity }), _jsx(Button, { onClick: () => updateCartHandler(item, item.quantity + 1), variant: "light", disabled: item.quantity === item.countInStock, className: "border p-1 transition-all hover:bg-gray-200 active:scale-90", children: _jsx("i", { className: "fas fa-plus text-gray-700 text-xs" }) })] }), _jsx(Col, { md: 3, className: "font-bold text-gray-800 text-lg", children: item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }), _jsx(Col, { md: 2, className: "text-center", children: _jsx(Button, { onClick: () => removeItemHandler(item), variant: "light", className: "text-gray-500 hover:text-red-600 p-1 transition active:scale-90", children: _jsx("i", { className: "fas fa-trash-alt text-lg" }) }) })] }) }, item._id + (item.variantId ?? '')))) })) }), _jsx(Col, { md: 4, children: _jsx(Card, { className: "shadow-lg border-0 transition-all hover:shadow-xl hover:scale-[1.01]", children: _jsx(Card.Body, { className: "p-4", children: _jsxs(ListGroup, { variant: "flush", children: [_jsxs(ListGroup.Item, { className: "bg-white border-b-2 p-3", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "T\u00F3m t\u1EAFt \u0110\u01A1n h\u00E0ng" }), _jsxs("div", { className: "flex justify-between font-semibold text-gray-700", children: [_jsxs("span", { children: ["T\u1EA1m t\u00EDnh (", cartItems.reduce((a, c) => a + c.quantity, 0), " s\u1EA3n ph\u1EA9m):"] }), _jsx("span", { className: "text-black font-bold text-lg", children: subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) })] })] }), _jsx(ListGroup.Item, { className: "bg-white p-3", children: _jsx("div", { className: "d-grid", children: _jsx(Button, { type: "button", variant: "dark", onClick: checkoutHandler, disabled: cartItems.length === 0, className: "py-2 text-base font-semibold \r\n                            transition-all \r\n                            hover:bg-gray-800 active:bg-gray-900 \r\n                            hover:scale-[1.01] active:scale-[0.98]", children: "Ti\u1EBFn h\u00E0nh Thanh to\u00E1n" }) }) })] }) }) }) })] })] })] }), _jsx(Footer, {})] }));
}
