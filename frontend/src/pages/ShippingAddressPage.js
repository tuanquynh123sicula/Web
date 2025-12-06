import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Footer from '../components/Footer';
import { Store } from '../Store';
import { toast } from 'sonner';
export default function ShippingAddressPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { userInfo, cart: { shippingAddress }, } = state;
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const submitHandler = (e) => {
        e.preventDefault();
        // Validation
        if (!fullName.trim()) {
            toast.error('Vui lòng nhập họ và tên!');
            return;
        }
        if (!address.trim()) {
            toast.error('Vui lòng nhập địa chỉ chi tiết!');
            return;
        }
        if (!city.trim()) {
            toast.error('Vui lòng nhập tỉnh/thành phố!');
            return;
        }
        if (!postalCode.trim()) {
            toast.error('Vui lòng nhập mã bưu điện!');
            return;
        }
        if (!country.trim()) {
            toast.error('Vui lòng nhập quốc gia!');
            return;
        }
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
            },
        });
        localStorage.setItem('shippingAddress', JSON.stringify({
            fullName,
            address,
            city,
            postalCode,
            country,
        }));
        navigate('/payment');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all", children: [_jsx(Helmet, { children: _jsx("title", { children: "\u0110\u1ECBa ch\u1EC9 giao h\u00E0ng" }) }), _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx(CheckoutSteps, { step1: true, step2: true, step3: false, step4: false }), _jsxs("div", { className: "p-6 bg-white shadow-lg mt-4 \r\n            transition-all duration-300 hover:shadow-xl hover:scale-[1.01]", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-900", children: "\u0110\u1ECBa ch\u1EC9 giao h\u00E0ng" }), _jsxs(Form, { onSubmit: submitHandler, children: [_jsxs(Form.Group, { className: "mb-4", controlId: "fullName", children: [_jsxs(Form.Label, { className: "font-semibold text-gray-700", children: ["H\u1ECD v\u00E0 T\u00EAn ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Form.Control, { value: fullName, onChange: (e) => setFullName(e.target.value), className: "focus:border-black focus:ring-black transition-all duration-200", placeholder: "Nh\u1EADp h\u1ECD v\u00E0 t\u00EAn" })] }), _jsxs(Form.Group, { className: "mb-4", controlId: "address", children: [_jsxs(Form.Label, { className: "font-semibold text-gray-700", children: ["\u0110\u1ECBa ch\u1EC9 chi ti\u1EBFt ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Form.Control, { value: address, onChange: (e) => setAddress(e.target.value), className: "focus:border-black focus:ring-black transition-all duration-200", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 chi ti\u1EBFt" })] }), _jsxs(Form.Group, { className: "mb-4", controlId: "city", children: [_jsxs(Form.Label, { className: "font-semibold text-gray-700", children: ["T\u1EC9nh/Th\u00E0nh ph\u1ED1 ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Form.Control, { value: city, onChange: (e) => setCity(e.target.value), className: "focus:border-black focus:ring-black transition-all duration-200", placeholder: "Nh\u1EADp t\u1EC9nh/th\u00E0nh ph\u1ED1" })] }), _jsxs(Form.Group, { className: "mb-4", controlId: "postalCode", children: [_jsxs(Form.Label, { className: "font-semibold text-gray-700", children: ["M\u00E3 b\u01B0u \u0111i\u1EC7n ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Form.Control, { value: postalCode, onChange: (e) => setPostalCode(e.target.value), className: "focus:border-black focus:ring-black transition-all duration-200", placeholder: "Nh\u1EADp m\u00E3 b\u01B0u \u0111i\u1EC7n" })] }), _jsxs(Form.Group, { className: "mb-6", controlId: "country", children: [_jsxs(Form.Label, { className: "font-semibold text-gray-700", children: ["Qu\u1ED1c gia ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Form.Control, { value: country, onChange: (e) => setCountry(e.target.value), className: "focus:border-black focus:ring-black transition-all duration-200", placeholder: "Nh\u1EADp qu\u1ED1c gia" })] }), _jsx("div", { className: "mb-3", children: _jsx(Button, { variant: "dark", type: "submit", className: "py-2 px-6 font-semibold \r\n                    transition-all \r\n                    hover:bg-gray-800 active:bg-gray-900 \r\n                    hover:scale-[1.01] active:scale-[0.98]", children: "Ti\u1EBFp t\u1EE5c" }) })] })] })] })] }), _jsx(Footer, {})] }));
}
