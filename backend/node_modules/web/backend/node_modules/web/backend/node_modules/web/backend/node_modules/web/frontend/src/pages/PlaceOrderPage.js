import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, ListGroup, Row, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useCreateOrderMutation } from '../hooks/orderHooks';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';
import { FaTag } from 'react-icons/fa';
import apiClient from '@/apiClient';
export default function PlaceOrderPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    // ✅ Kiểm tra cơ bản
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
            return;
        }
        if (!cart.paymentMethod) {
            navigate('/payment');
            return;
        }
        // ⭐ CHỈ REDIRECT NẾU GIỎ HÀNG RỖNG VÀ KHÔNG CÓ SHIPPING ADDRESS
        // (Nghĩa là user chưa bao giờ đặt hàng, không phải đang quay lại từ OrderPage)
        if (cart.cartItems.length === 0 && !cart.shippingAddress.address) {
            toast.info('Giỏ hàng của bạn đang trống.');
            navigate('/');
            return;
        }
    }, [cart.paymentMethod, userInfo, navigate]);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [resolvedTier, setResolvedTier] = useState((userInfo?.tier ?? 'regular'));
    useEffect(() => {
        let mounted = true;
        if (!userInfo) {
            navigate('/signin');
            return;
        }
        const storedUserInfo = localStorage.getItem('userInfo');
        console.log('Stored userInfo:', storedUserInfo);
        console.log('Context userInfo:', userInfo);
        apiClient
            .get('/api/users/profile')
            .then((res) => {
            if (mounted) {
                const t = res.data?.tier ?? 'regular';
                setResolvedTier(t);
            }
        })
            .catch((err) => {
            console.error('Failed to fetch user profile:', err.response?.status, err.message);
            setResolvedTier('regular');
        });
        return () => {
            mounted = false;
        };
    }, [userInfo, navigate]);
    const tier = resolvedTier;
    const rateMap = { regular: 0, new: 0.02, vip: 0.1 };
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const itemsPrice = useMemo(() => round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)), [cart.cartItems]);
    const tierDiscount = useMemo(() => Math.round(itemsPrice * rateMap[tier]), [itemsPrice, tier]);
    const shippingPrice = useMemo(() => (itemsPrice - tierDiscount >= 1_000_000 || tier === 'vip' ? 0 : 30000), [itemsPrice, tierDiscount, tier]);
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice - tierDiscount - couponDiscount;
    cart.itemsPrice = itemsPrice;
    cart.shippingPrice = shippingPrice;
    cart.taxPrice = taxPrice;
    cart.totalPrice = totalPrice;
    const { mutateAsync: createOrder, isPending } = useCreateOrderMutation();
    // ✅ CẬP NHẬT: ÁP DỤNG VOUCHER TỪ API
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        const code = couponCode.toUpperCase().trim();
        if (!code) {
            toast.error('Vui lòng nhập mã giảm giá.');
            return;
        }
        if (appliedCoupon?.code === code) {
            toast.info('Mã này đã được áp dụng.');
            return;
        }
        setIsValidatingCoupon(true);
        try {
            // ⭐ LỜI GỌI API THỰC TẾ ĐỂ XÁC THỰC VOUCHER ⭐
            const { data } = await axios.post('http://localhost:4000/api/vouchers/validate', {
                code,
                orderTotal: itemsPrice // Truyền tổng giá trị sản phẩm để backend kiểm tra minOrderValue
            });
            const voucher = data.voucher;
            // Tính toán giảm giá dựa trên dữ liệu voucher hợp lệ từ server
            let discountValue = 0;
            if (voucher.discountType === 'fixed') {
                discountValue = voucher.discountValue;
            }
            else if (voucher.discountType === 'percentage') {
                discountValue = Math.round(itemsPrice * (voucher.discountValue / 100));
            }
            // Giảm giá tối đa bằng tổng giá trị sản phẩm
            discountValue = Math.min(discountValue, itemsPrice);
            setCouponDiscount(discountValue);
            setAppliedCoupon(voucher);
            toast.success(`Áp dụng mã ${code} thành công! Giảm ${discountValue.toLocaleString('vi-VN')} ₫`);
        }
        catch (err) {
            setCouponDiscount(0);
            setAppliedCoupon(null);
            // Lấy lỗi chi tiết từ server (ví dụ: "Voucher đã hết hạn" hoặc "Đơn hàng tối thiểu...")
            const errorMsg = getError(err);
            toast.error(errorMsg);
        }
        finally {
            setIsValidatingCoupon(false);
        }
    };
    // ✅ HỦY VOUCHER
    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setAppliedCoupon(null);
        toast.info('Đã hủy áp dụng voucher.');
    };
    const handleVNPayPayment = async () => {
        if (!cart.shippingAddress.address) {
            toast.error('Vui lòng quay lại bước 2 để chọn địa chỉ giao hàng.');
            return;
        }
        // ✅ KIỂM TRA GIỎ HÀNG RỖNG TRƯỚC KHI ĐẶT HÀNG
        if (cart.cartItems.length === 0) {
            toast.error('Giỏ hàng của bạn đang trống!');
            navigate('/cart');
            return;
        }
        try {
            const data = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                discount: tierDiscount,
                couponDiscount: couponDiscount,
                totalPrice,
                voucherId: appliedCoupon?._id,
            });
            localStorage.removeItem('cartItems');
            dispatch({ type: 'CART_CLEAR' });
            if (cart.paymentMethod === 'VNPAY') {
                const response = await axios.post('http://localhost:4000/api/vnpay/create_payment_url', {
                    amount: data.order.totalPrice,
                    orderId: data.order._id,
                });
                localStorage.removeItem('shippingAddress');
                localStorage.removeItem('paymentMethod');
                window.location.href = response.data.paymentUrl;
            }
            else {
                localStorage.removeItem('shippingAddress');
                localStorage.removeItem('paymentMethod');
                navigate(`/order/${data.order._id}`);
            }
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    const imageUrl = (src) => {
        if (!src)
            return '/images/placeholder.png';
        if (src.startsWith('http'))
            return src;
        if (src.startsWith('/uploads/'))
            return `http://localhost:4000${src}`;
        if (src.startsWith('/'))
            return src;
        return `/images/${src}`;
    };
    // ✅ CHO PHÉP HIỂN THỊ TRANG NẾU CÓ SHIPPING ADDRESS (User đang quay lại xem)
    if (cart.cartItems.length === 0 && !cart.shippingAddress.address) {
        return _jsx(LoadingBox, {});
    }
    // ✅ NẾU GIỎ HÀNG RỖNG NHƯNG CÓ SHIPPING ADDRESS - CHO PHÉP XEM
    // Nhưng DISABLE NÚT ĐẶT HÀNG
    const canPlaceOrder = cart.cartItems.length > 0;
    return (_jsx("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx(CheckoutSteps, { step1: true, step2: true, step3: true, step4: true }), _jsx(Helmet, { children: _jsx("title", { children: "\u0110\u1EB7t h\u00E0ng" }) }), _jsx("h1", { className: "text-3xl font-bold my-4 text-gray-900", children: "X\u00E1c nh\u1EADn \u0111\u01A1n h\u00E0ng" }), !canPlaceOrder && (_jsxs("div", { className: "bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 mb-4 shadow-md", children: [_jsx("p", { className: "font-semibold", children: "\u26A0\uFE0F \u0110\u01A1n h\u00E0ng \u0111\u00E3 \u0111\u01B0\u1EE3c \u0111\u1EB7t. Gi\u1ECF h\u00E0ng hi\u1EC7n t\u1EA1i \u0111ang tr\u1ED1ng." }), _jsx("p", { className: "text-sm mt-1", children: _jsx(Link, { to: "/orderhistory", className: "text-blue-600 hover:underline font-medium", children: "Xem l\u1ECBch s\u1EED \u0111\u01A1n h\u00E0ng" }) })] })), _jsxs(Row, { className: 'g-4', children: [_jsxs(Col, { md: 8, children: [_jsx(Card, { className: "mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1", children: _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800", children: "\u0110\u1ECBa ch\u1EC9 giao h\u00E0ng" }), _jsxs(Card.Text, { className: "text-gray-600 mt-2", children: [_jsx("strong", { children: "T\u00EAn:" }), " ", cart.shippingAddress.fullName, " ", _jsx("br", {}), _jsx("strong", { children: "\u0110\u1ECBa ch\u1EC9:" }), " ", cart.shippingAddress.address, ", ", cart.shippingAddress.city, ",", ' ', cart.shippingAddress.postalCode, ", ", cart.shippingAddress.country] }), _jsx(Link, { to: "/shipping", className: "text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200", children: "Ch\u1EC9nh s\u1EEDa" })] }) }), _jsx(Card, { className: "mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1", children: _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800", children: "Ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n" }), _jsxs(Card.Text, { className: "text-gray-600 mt-2", children: [_jsx("strong", { children: "H\u00ECnh th\u1EE9c:" }), " ", _jsx("span", { className: 'font-semibold', children: cart.paymentMethod })] }), _jsx(Link, { to: "/payment", className: "text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200", children: "Ch\u1EC9nh s\u1EEDa" })] }) }), _jsx(Card, { className: "mb-4 hover:bg-gray-50 hover:shadow-xl border-md border-1", children: _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800 mb-3", children: "S\u1EA3n ph\u1EA9m" }), cart.cartItems.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("p", { className: "text-lg font-semibold mb-2", children: "Gi\u1ECF h\u00E0ng tr\u1ED1ng" }), _jsx("p", { className: "text-sm", children: "\u0110\u01A1n h\u00E0ng \u0111\u00E3 \u0111\u01B0\u1EE3c \u0111\u1EB7t th\u00E0nh c\u00F4ng." })] })) : (_jsx(ListGroup, { variant: "flush", className: "border-t border-gray-200", children: cart.cartItems.map((item) => (_jsx(ListGroup.Item, { className: "bg-white px-0 py-3 border-b", children: _jsxs(Row, { className: "align-items-center", children: [_jsxs(Col, { md: 6, className: "flex items-center", children: [_jsx("img", { src: imageUrl(item.image), alt: item.name, className: "w-16 h-16 object-contain rounded-none mr-3", style: { border: '1px solid #e0e0e0' } }), _jsxs("div", { children: [_jsx(Link, { to: `/product/${item.slug ?? item._id}`, className: "font-semibold text-gray-700 hover:text-black transition-colors duration-200", children: item.name }), item.variant && (_jsxs("div", { className: "text-muted text-xs mt-1", children: [item.variant.color, " / ", item.variant.storage, " / ", item.variant.ram] }))] })] }), _jsx(Col, { md: 3, className: "text-center font-semibold text-gray-700 transition-colors duration-200", children: item.quantity }), _jsxs(Col, { md: 3, className: "text-right font-bold text-gray-800 transition-colors duration-200", children: [(item.price * item.quantity).toLocaleString('vi-VN'), " \u20AB"] })] }) }, item._id))) })), _jsx(Link, { to: "/cart", className: "text-blue-600 hover:text-blue-800 font-medium mt-3 block transition-colors duration-300", children: "Ch\u1EC9nh s\u1EEDa gi\u1ECF h\u00E0ng" })] }) })] }), _jsx(Col, { md: 4, children: _jsx(Card, { className: "mb-3 hover:bg-gray-50 hover:shadow-xl border-md border-1", children: _jsxs(Card.Body, { className: 'p-4', children: [_jsx(Card.Title, { className: 'text-2xl font-bold text-gray-900 mb-3', children: "T\u1ED5ng \u0111\u01A1n h\u00E0ng" }), _jsxs(ListGroup, { variant: "flush", children: [!appliedCoupon ? (_jsx(ListGroup.Item, { className: 'bg-white border-0 p-0 mb-3', children: _jsx(Form, { onSubmit: handleApplyCoupon, className: 'p-3', children: _jsxs("div", { className: 'flex gap-2', children: [_jsx(Form.Control, { type: "text", placeholder: "Nh\u1EADp m\u00E3 gi\u1EA3m gi\u00E1", value: couponCode, onChange: (e) => setCouponCode(e.target.value), disabled: isValidatingCoupon, className: "flex-1 border px-3 py-2" }), _jsx(Button, { variant: "dark", type: "submit", disabled: isValidatingCoupon, className: 'px-4 py-2 font-semibold hover:bg-gray-800', children: isValidatingCoupon ? (_jsxs(_Fragment, { children: [_jsx("span", { className: 'inline-block animate-spin mr-2', children: "\u23F3" }), "Ki\u1EC3m tra"] })) : (_jsxs(_Fragment, { children: [_jsx(FaTag, { className: 'inline mr-2' }), "\u00C1p d\u1EE5ng"] })) })] }) }) })) : (_jsx(ListGroup.Item, { className: 'bg-green-50 border border-green-300 rounded p-3 mb-3', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("span", { className: 'text-green-600 text-xl font-bold', children: "\u2713" }), _jsxs("div", { children: [_jsxs("p", { className: 'text-green-700 font-bold text-sm m-0', children: ["M\u00E3 ", _jsx("span", { className: 'text-green-900', children: appliedCoupon.code }), " \u0111\u00E3 \u0111\u01B0\u1EE3c \u00E1p d\u1EE5ng"] }), _jsxs("p", { className: 'text-green-600 text-xs m-0', children: ["Ti\u1EBFt ki\u1EC7m: ", couponDiscount.toLocaleString('vi-VN'), " \u20AB"] })] })] }), _jsx(Button, { type: "button", onClick: handleRemoveCoupon, className: 'bg-red-600 hover:bg-red-700 border-0 px-3 py-1 text-sm font-semibold', children: "\u2715 H\u1EE7y" })] }) })), _jsxs(ListGroup.Item, { className: 'bg-white p-2 flex justify-between transition-colors duration-200', children: [_jsxs("span", { className: 'text-gray-700', children: ["T\u1EA1m t\u00EDnh (", cart.cartItems.length, " s\u1EA3n ph\u1EA9m)"] }), _jsxs("span", { className: 'font-semibold', children: [itemsPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs(ListGroup.Item, { className: 'bg-white p-2 flex justify-between transition-colors duration-200', children: [_jsxs("span", { className: 'text-gray-700', children: ["Gi\u1EA3m theo h\u1EA1ng", ' ', _jsx("span", { className: `badge bg-warning text-dark font-semibold text-xs`, children: tier.toUpperCase() })] }), _jsxs("span", { className: 'font-semibold text-red-600', children: ["- ", tierDiscount.toLocaleString('vi-VN'), " \u20AB"] })] }), couponDiscount > 0 && (_jsxs(ListGroup.Item, { className: 'bg-white p-2 flex justify-between transition-colors duration-200', children: [_jsx("span", { className: 'text-gray-700 font-bold', children: "Gi\u1EA3m gi\u00E1 Voucher" }), _jsxs("span", { className: 'font-bold text-red-600', children: ["- ", couponDiscount.toLocaleString('vi-VN'), " \u20AB"] })] })), _jsxs(ListGroup.Item, { className: 'bg-white p-2 flex justify-between transition-colors duration-200', children: [_jsx("span", { className: 'text-gray-700', children: "Ph\u00ED v\u1EADn chuy\u1EC3n" }), _jsxs("span", { className: 'font-semibold', children: [shippingPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs(ListGroup.Item, { className: 'bg-white p-2 flex justify-between transition-colors duration-200', children: [_jsx("span", { className: 'text-gray-700', children: "Thu\u1EBF" }), _jsxs("span", { className: 'font-semibold', children: [taxPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsxs(ListGroup.Item, { className: 'bg-white p-2 mt-2 pt-3 border-t-2 border-gray-300 flex justify-between transition-colors duration-200', children: [_jsx("span", { className: 'text-xl font-bold text-gray-900', children: "T\u1ED5ng c\u1ED9ng" }), _jsxs("span", { className: 'text-xl font-bold text-red-600', children: [totalPrice.toLocaleString('vi-VN'), " \u20AB"] })] }), _jsx(ListGroup.Item, { className: 'bg-white p-2 border-0', children: _jsx("div", { className: "d-grid mt-3", children: _jsx(Button, { type: "button", variant: "dark", onClick: handleVNPayPayment, disabled: !canPlaceOrder || isPending, className: "py-2 text-base font-semibold hover:bg-gray-800 active:bg-gray-900 hover:scale-105 transition-transform", children: isPending ? (_jsx(LoadingBox, {})) : !canPlaceOrder ? ('✓ Đơn hàng đã được đặt') : (cart.paymentMethod === 'VNPAY'
                                                                ? '🛒 Đặt hàng và Thanh toán VNPay'
                                                                : '🛒 Đặt hàng (Thanh toán khi nhận)') }) }) })] })] }) }) })] })] }) }));
}
