import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button, Card, Col, Row, ListGroup } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { useUpdateProfileMutation } from '@/hooks/userHooks';
import { useGetRecentOrdersQuery } from '@/hooks/orderHooks';
import LoadingBox from '@/components/LoadingBox';
import Footer from '@/components/Footer';
import { FaHistory } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
const TIER_LABELS = {
    regular: { label: 'Thành viên thường', color: 'bg-info', discount: '0%' },
    new: { label: 'Thành viên mới', color: 'bg-success', discount: '2%' },
    vip: { label: 'Thành viên VIP', color: 'bg-warning text-dark', discount: '10%' },
};
const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
};
export default function ProfilePage() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
        }
    }, [userInfo, navigate]);
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tier, setTier] = useState(userInfo?.tier || 'regular');
    const { data: recentOrders, isLoading: loadingOrders } = useGetRecentOrdersQuery(3);
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfileMutation();
    useEffect(() => {
        if (!userInfo?.token)
            return;
        const fetchTier = async () => {
            try {
                const { data } = await axios.get('http://localhost:4000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                        'Content-Type': 'application/json'
                    },
                });
                setTier(data.tier || 'regular');
            }
            catch (err) {
                console.error('Fetch profile error:', err);
            }
        };
        fetchTier();
    }, [userInfo?.token]);
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp.');
            return;
        }
        try {
            const data = await updateProfile({
                name,
                email,
                password: password || undefined,
            });
            dispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Cập nhật hồ sơ thành công!');
            setPassword('');
            setConfirmPassword('');
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    const currentTierInfo = TIER_LABELS[tier];
    return (_jsxs(_Fragment, { children: [_jsx(Helmet, { children: _jsx("title", { children: "H\u1ED3 s\u01A1 c\u00E1 nh\u00E2n" }) }), _jsx("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: _jsxs("div", { className: "max-w-7xl mx-auto ", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-900", children: "H\u1ED3 s\u01A1 c\u00E1 nh\u00E2n" }), _jsxs(Row, { className: "g-4", children: [_jsx(Col, { md: 8, children: _jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300 mr-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-800", children: "C\u1EADp nh\u1EADt th\u00F4ng tin" }), _jsxs(Form, { onSubmit: submitHandler, children: [_jsxs(Form.Group, { className: "mb-3", controlId: "name", children: [_jsx(Form.Label, { className: "font-semibold text-gray-700", children: "T\u00EAn" }), _jsx(Form.Control, { value: name, onChange: (e) => setName(e.target.value), required: true, className: "focus:border-black focus:ring-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300" })] }), _jsxs(Form.Group, { className: "mb-3", controlId: "email", children: [_jsx(Form.Label, { className: "font-semibold text-gray-700", children: "Email" }), _jsx(Form.Control, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "focus:border-black focus:ring-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300" })] }), _jsxs(Form.Group, { className: "mb-3", controlId: "password", children: [_jsx(Form.Label, { className: "font-semibold text-gray-700", children: "M\u1EADt kh\u1EA9u m\u1EDBi (B\u1ECF tr\u1ED1ng n\u1EBFu kh\u00F4ng \u0111\u1ED5i)" }), _jsx(Form.Control, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "focus:border-black focus:ring-black" })] }), _jsxs(Form.Group, { className: "mb-3", controlId: "confirmPassword", children: [_jsx(Form.Label, { className: "font-semibold text-gray-700", children: "X\u00E1c nh\u1EADn M\u1EADt kh\u1EA9u m\u1EDBi" }), _jsx(Form.Control, { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "focus:border-black focus:ring-black " })] }), _jsx("div", { className: "mb-3", children: _jsx(Button, { variant: "white", type: "submit", disabled: isUpdatingProfile, className: "py-2 px-6 border border-gray font-semibold hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300", children: isUpdatingProfile ? _jsx(LoadingBox, {}) : 'Cập nhật' }) })] })] }) }), _jsxs(Col, { md: 4, className: 'space-y-4', children: [_jsx(Card, { className: "shadow-lg border-0 rounded-lg hover:scale-105 transition-transform duration-300 mb-16", children: _jsxs(Card.Body, { className: "p-4", children: [_jsx(Card.Title, { className: "text-xl font-bold text-gray-800 mb-3", children: "H\u1EA1ng Th\u00E0nh vi\u00EAn" }), _jsxs(ListGroup, { variant: "flush", children: [_jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-content-between items-center", children: [_jsx("span", { className: "text-gray-700 font-medium", children: "H\u1EA1ng hi\u1EC7n t\u1EA1i:" }), _jsx("span", { className: `badge ${currentTierInfo.color} text-lg py-2 px-3 font-bold`, children: currentTierInfo.label })] }), _jsxs(ListGroup.Item, { className: "bg-white p-2 flex justify-content-between", children: [_jsx("span", { className: "text-gray-700 font-medium", children: "\u01AFu \u0111\u00E3i gi\u1EA3m gi\u00E1:" }), _jsx("span", { className: "text-red-600 font-bold", children: currentTierInfo.discount })] }), _jsx(ListGroup.Item, { className: "bg-white p-2 text-sm text-gray-500", children: "Li\u00EAn h\u1EC7 h\u1ED7 tr\u1EE3 \u0111\u1EC3 n\u00E2ng c\u1EA5p h\u1EA1ng th\u00E0nh vi\u00EAn." })] })] }) }), _jsx(Card, { className: "shadow-lg border-0 rounded-lg hover:scale-105 transition-transform duration-300  ", children: _jsxs(Card.Body, { className: "p-4", children: [_jsxs(Card.Title, { className: "text-xl font-bold text-gray-800 mb-3 flex items-center ", children: [_jsx(FaHistory, { className: "me-2 text-gray-600" }), " \u0110\u01A1n h\u00E0ng g\u1EA7n \u0111\u00E2y"] }), loadingOrders ? (_jsx(LoadingBox, {})) : recentOrders && recentOrders.length > 0 ? (_jsx(ListGroup, { variant: "flush", children: recentOrders.map((order) => (_jsxs(ListGroup.Item, { className: "d-flex justify-content-between align-items-center", children: [_jsxs("div", { children: [_jsxs("p", { className: "mb-0 font-semibold", children: ["M\u00E3: #", order.orderNumber || order._id?.slice(-5)] }), _jsxs("small", { className: "text-muted", children: ["Ng\u00E0y: ", new Date(order.createdAt).toLocaleDateString('vi-VN')] })] }), _jsxs("div", { className: "text-end", children: [_jsx("p", { className: "mb-0 text-success font-bold", children: formatCurrency(order.totalPrice) }), _jsx("span", { className: `badge ${order.isDelivered ? 'bg-primary' : order.isPaid ? 'bg-success' : 'bg-warning text-dark'}`, children: order.isDelivered ? 'Đã giao' : order.isPaid ? 'Đã thanh toán' : 'Đang chờ' })] })] }, order._id))) })) : (_jsx("p", { className: "text-center text-muted", children: "B\u1EA1n ch\u01B0a c\u00F3 \u0111\u01A1n h\u00E0ng n\u00E0o g\u1EA7n \u0111\u00E2y." })), _jsx("div", { className: "mt-3 text-center", children: _jsx(Link, { to: "/orderhistory", children: _jsx(Button, { variant: "white", className: "py-1 px-4 text-sm border border-gray font-semibold hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300", children: "Xem t\u1EA5t c\u1EA3 \u0111\u01A1n h\u00E0ng" }) }) })] }) })] })] })] }) }), _jsx(Footer, {})] }));
}
