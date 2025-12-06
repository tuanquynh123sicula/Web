import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect } from 'react';
import { Card, Col, ListGroup, Row, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../hooks/orderHooks';
import { Store } from '../Store';
import { getError } from '../utils';
export default function OrderPage() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const params = useParams();
    const { id: orderId } = params;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const paymentSuccess = searchParams.get('success') === 'true';
    const { data: order, isPending, error, refetch, } = useGetOrderDetailsQuery(orderId, userInfo);
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
    const payOrder = usePayOrderMutation();
    // ✅ Khi VNPay redirect về → cập nhật trạng thái đơn hàng & xóa giỏ hàng
    useEffect(() => {
        if (window.location.search.includes('vnp_') && order && !order.isPaid) {
            const confirmPayment = async () => {
                try {
                    console.log('🔄 Đang cập nhật thanh toán cho đơn:', orderId);
                    await payOrder.mutateAsync({
                        orderId: orderId,
                        token: userInfo.token,
                        paymentResult: { status: 'Paid' },
                    });
                    // Xóa giỏ hàng khi thanh toán thành công
                    dispatch({ type: 'CART_CLEAR' });
                    localStorage.removeItem('cartItems');
                    await refetch();
                    // Dọn URL để tránh lặp lại
                    window.history.replaceState({}, '', `/order/${orderId}?success=true`);
                }
                catch (err) {
                    console.error('❌ Lỗi khi cập nhật thanh toán:', err);
                }
            };
            confirmPayment();
        }
    }, [order, payOrder, orderId, userInfo, dispatch, refetch]);
    // ✅ Khi người dùng chọn thanh toán Cash thủ công
    const handlePaymentSuccess = async () => {
        try {
            await payOrder.mutateAsync({
                orderId: orderId,
                token: userInfo.token,
                paymentResult: { status: 'Paid' },
            });
            dispatch({ type: 'CART_CLEAR' });
            localStorage.removeItem('cartItems');
            await refetch();
            window.history.replaceState({}, '', `/order/${orderId}?success=true`);
        }
        catch {
            alert('Lỗi khi cập nhật trạng thái thanh toán');
        }
    };
    return isPending ? (_jsx(LoadingBox, {})) : error ? (_jsx(MessageBox, { variant: "danger", children: getError(error) })) : !order ? (_jsx(MessageBox, { variant: "danger", children: "Order Not Found" })) : (_jsx("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Order ", orderId] }) }), paymentSuccess && (_jsx("div", { className: "mb-4", children: _jsx(MessageBox, { variant: "success", children: "\uD83C\uDF89 \u0110\u01A1n h\u00E0ng c\u1EE7a b\u1EA1n \u0111\u00E3 \u0111\u01B0\u1EE3c \u0111\u1EB7t th\u00E0nh c\u00F4ng! C\u1EA3m \u01A1n b\u1EA1n \u0111\u00E3 mua h\u00E0ng." }) })), _jsxs("h1", { className: "text-3xl font-bold mb-4 text-gray-900", children: ["\u0110\u01A1n h\u00E0ng #", _jsx("span", { className: "text-red-600", children: orderId?.slice(0, 8).toUpperCase() }), _jsxs("small", { className: "text-base text-gray-500 ml-3 font-normal", children: ["Ng\u00E0y \u0111\u1EB7t: ", new Date(order.createdAt).toLocaleDateString()] })] }), _jsxs(Row, { className: "g-4", children: [_jsxs(Col, { md: 8, children: [_jsx(Card, { className: "mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1", children: _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800", children: "Th\u00F4ng tin giao h\u00E0ng" }), _jsxs(Card.Text, { className: "text-gray-600 mt-2 transition-colors duration-200", children: [_jsx("strong", { children: "T\u00EAn:" }), " ", order.shippingAddress.fullName, " ", _jsx("br", {}), _jsx("strong", { children: "\u0110\u1ECBa ch\u1EC9:" }), " ", order.shippingAddress.address, ", ", order.shippingAddress.city, ",", ' ', order.shippingAddress.postalCode, ", ", order.shippingAddress.country] }), order.isDelivered ? (_jsxs(MessageBox, { variant: "success", children: ["\u0110\u00E3 giao h\u00E0ng l\u00FAc ", order.deliveredAt] })) : (_jsx(MessageBox, { variant: "warning", children: "Ch\u01B0a giao h\u00E0ng" }))] }) }), _jsxs(Card, { className: "mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1  ", children: [" ", _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800", children: "Th\u00F4ng tin thanh to\u00E1n" }), _jsxs(Card.Text, { className: "text-gray-600 mt-2 transition-colors duration-200", children: [_jsx("strong", { children: "Ph\u01B0\u01A1ng th\u1EE9c:" }), " ", _jsx("span", { className: "font-semibold", children: order.paymentMethod })] }), order.isPaid ? (_jsxs(MessageBox, { variant: "success", children: ["\u0110\u00E3 thanh to\u00E1n l\u00FAc", ' ', order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Không xác định thời gian'] })) : (_jsxs("div", { children: [_jsx(MessageBox, { variant: "warning", children: "Ch\u01B0a thanh to\u00E1n" }), order.paymentMethod === 'Cash' && (_jsx(Button, { variant: "dark", onClick: handlePaymentSuccess, disabled: payOrder.isPending, className: "mt-2 py-2 px-6 font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200", children: "X\u00E1c nh\u1EADn Thanh to\u00E1n (Th\u1EE7 c\u00F4ng)" }))] }))] })] }), _jsxs(Card, { className: "mb-4 hover:bg-gray-50  hover:shadow-xl border-md  border-1 ", children: [" ", _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800 mb-3", children: "S\u1EA3n ph\u1EA9m" }), _jsx(ListGroup, { variant: "flush", className: "border-t border-gray-200", children: order.orderItems.map((item) => (_jsx(ListGroup.Item, { className: "bg-white px-0 py-3 border-b", children: _jsxs(Row, { className: "align-items-center", children: [_jsxs(Col, { md: 6, className: "flex items-center", children: [_jsx("img", { src: imageUrl(item.image), alt: item.name, className: "w-16 h-16 object-contain mr-3 transition-transform duration-200", style: { border: '1px solid #e0e0e0' } }), _jsxs("div", { children: [_jsx(Link, { to: `/product/${item.slug ?? item._id}`, className: "font-semibold text-gray-700 hover:text-black transition-colors duration-200", children: item.name }), item.variant && (_jsxs("div", { className: "text-muted text-xs mt-1 transition-colors duration-200", children: [item.variant.color, " / ", item.variant.storage, " / ", item.variant.ram] }))] })] }), _jsxs(Col, { md: 3, className: "text-center font-semibold text-gray-700 transition-colors duration-200", children: ["SL: ", item.quantity] }), _jsxs(Col, { md: 3, className: "text-right font-bold text-gray-800 transition-colors duration-200", children: [(item.price * item.quantity).toLocaleString('vi-VN'), " \u20AB"] })] }) }, item._id))) })] })] })] }), _jsx(Col, { md: 4, children: _jsxs(Card, { className: "mb-3 hover:scale-105", children: [" ", _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-2xl font-bold text-gray-900 mb-3", children: "T\u1ED5ng \u0111\u01A1n h\u00E0ng" }), _jsxs(ListGroup, { variant: "flush", children: [_jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-between transition-colors duration-200", children: [_jsx("span", { className: "text-gray-700", children: "T\u1ED5ng ti\u1EC1n h\u00E0ng" }), _jsxs("span", { className: "font-semibold", children: [order.itemsPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), order.discount && order.discount > 0 && (_jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-between transition-colors duration-200", children: [_jsx("span", { className: "text-gray-700", children: "Gi\u1EA3m gi\u00E1 (H\u1EA1ng)" }), _jsxs("span", { className: "font-semibold text-red-600", children: ["- ", order.discount.toLocaleString('vi-VN'), " \u20AB"] })] })), _jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-between transition-colors duration-200", children: [_jsx("span", { className: "text-gray-700", children: "Ph\u00ED v\u1EADn chuy\u1EC3n" }), _jsxs("span", { className: "font-semibold", children: [order.shippingPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-between transition-colors duration-200", children: [_jsx("span", { className: "text-gray-700", children: "Thu\u1EBF" }), _jsxs("span", { className: "font-semibold", children: [order.taxPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs(ListGroup.Item, { className: "bg-white p-2 mt-2 pt-3 border-t-2 border-gray-300 flex justify-between transition-colors duration-200", children: [_jsx("span", { className: "text-xl font-bold text-gray-900", children: "T\u1ED5ng c\u1ED9ng" }), _jsxs("span", { className: "text-xl font-bold text-red-600", children: [order.totalPrice.toLocaleString('vi-VN'), " \u20AB"] })] })] })] })] }) })] })] }) }));
}
