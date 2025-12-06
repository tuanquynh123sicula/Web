import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useSignupMutation } from '../hooks/userHooks';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
// Không cần import các component Bootstrap nữa
export default function SignupPage() {
    const navigate = useNavigate(); // Đã sửa lỗi chính tả naviagate -> navigate
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);
    const { mutateAsync: signup, isPending } = useSignupMutation();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        try {
            const data = await signup({ name, email, password });
            dispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    const isFormValid = name && email && password && confirmPassword && (password === confirmPassword);
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#f5f5f5] py-10", children: [_jsx(Helmet, { children: _jsx("title", { children: "\u0110\u0103ng k\u00FD" }) }), _jsxs("div", { className: "w-full max-w-md p-8 bg-white shadow-lg transition-all duration-500 ease-in-out", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6 text-gray-900 text-center", children: "\u0110\u0103ng k\u00FD" }), _jsxs("form", { onSubmit: submitHandler, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-semibold text-gray-700 mb-1", children: "T\u00EAn" }), _jsx("input", { id: "name", type: "text", required: true, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-1", children: "M\u1EADt kh\u1EA9u" }), _jsx("input", { id: "password", type: "password", required: true, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-semibold text-gray-700 mb-1", children: "X\u00E1c nh\u1EADn M\u1EADt kh\u1EA9u" }), _jsx("input", { id: "confirmPassword", type: "password", required: true, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsx("div", { className: "mb-4", children: _jsx("button", { type: "submit", disabled: isPending || !isFormValid, className: `w-full py-3 px-6 font-bold transition duration-300 transform border border-black
                                ${isFormValid ? 'hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-400 cursor-not-allowed'} 
                                text-black disabled:opacity-70 disabled:hover:bg-gray-400`, children: isPending ? _jsx(LoadingBox, {}) : 'Đăng ký' }) }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: ["\u0110\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?", ' ', _jsx(Link, { to: `/signin?redirect=${redirect}`, className: "text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300", children: "\u0110\u0103ng nh\u1EADp" })] })] })] })] }));
}
