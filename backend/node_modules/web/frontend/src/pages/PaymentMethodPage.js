import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import Footer from '../components/Footer';
import { toast } from 'sonner';
export default function PaymentMethodPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { cart: { shippingAddress }, } = state;
    const [paymentMethodName, setPaymentMethodName] = useState('');
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);
    const submitHandler = (e) => {
        e.preventDefault();
        // Validation
        if (!paymentMethodName) {
            toast.error('Vui lòng chọn phương thức thanh toán!');
            return;
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx(CheckoutSteps, { step1: true, step2: true, step3: true, step4: false }), _jsxs("div", { className: "p-6 bg-white shadow-lg mt-4 \r\n            transition-all duration-300 hover:shadow-xl hover:scale-[1.01]", children: [_jsx(Helmet, { children: _jsx("title", { children: "Ph\u01B0\u01A1ng th\u1EE9c Thanh to\u00E1n" }) }), _jsxs("h1", { className: "text-3xl font-bold my-4 text-gray-900", children: ["Ph\u01B0\u01A1ng th\u1EE9c Thanh to\u00E1n ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs(Form, { onSubmit: submitHandler, children: [_jsx("div", { className: "mb-4 p-3 border border-gray-300 flex items-center \r\n                transition-all duration-200 hover:border-black hover:bg-gray-50 cursor-pointer", onClick: () => setPaymentMethodName('Cash'), children: _jsx(Form.Check, { type: "radio", id: "Cash", label: "Thanh to\u00E1n khi nh\u1EADn h\u00E0ng (COD)", value: "Cash", checked: paymentMethodName === 'Cash', onChange: (e) => setPaymentMethodName(e.target.value), className: "scale-125 cursor-pointer" }) }), _jsx("div", { className: "mb-4 p-3 border border-gray-300 flex items-center \r\n                transition-all duration-200 hover:border-black hover:bg-gray-50 cursor-pointer", onClick: () => setPaymentMethodName('VNPAY'), children: _jsx(Form.Check, { type: "radio", id: "VNPAY", label: "Thanh to\u00E1n qua VNPAY", value: "VNPAY", checked: paymentMethodName === 'VNPAY', onChange: (e) => setPaymentMethodName(e.target.value), className: "scale-125 cursor-pointer" }) }), _jsx("div", { className: "mb-3 mt-4", children: _jsx(Button, { type: "submit", variant: "dark", className: "py-2 px-6 font-semibold \r\n                    transition-all \r\n                    hover:bg-gray-800 active:bg-gray-900 \r\n                    hover:scale-[1.01] active:scale-[0.98]", children: "Ti\u1EBFp t\u1EE5c" }) })] })] })] }) }), _jsx(Footer, {})] }));
}
