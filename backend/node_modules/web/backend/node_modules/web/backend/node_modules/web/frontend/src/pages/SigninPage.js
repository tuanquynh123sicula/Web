import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSigninMutation } from "../hooks/userHooks";
import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
export default function SigninPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get("redirect");
    const redirect = redirectInUrl ? redirectInUrl : "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const { mutateAsync: signin, isPending } = useSigninMutation();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await signin({ email, password });
            dispatch({ type: "USER_SIGNIN", payload: data });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate(redirect || "/");
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    useEffect(() => {
        if (userInfo)
            navigate(redirect);
    }, [navigate, userInfo, redirect]);
    const isFormValid = email && password;
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#f5f5f5] py-10", children: [_jsx(Helmet, { children: _jsx("title", { children: "\u0110\u0103ng nh\u1EADp" }) }), _jsxs("div", { className: "w-full max-w-md p-8 bg-white shadow-lg transition-all duration-500 ease-in-out", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6 text-gray-900 text-center", children: "\u0110\u0103ng nh\u1EADp" }), _jsxs("form", { onSubmit: submitHandler, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-1", children: "M\u1EADt kh\u1EA9u" }), _jsx("input", { id: "password", type: "password", required: true, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]" })] }), _jsx("div", { className: "mb-6 flex justify-center", children: _jsx("button", { className: `
                ${isFormValid ? 'hover:bg-gray-100' : 'bg-gray-100 cursor-not-allowed'} border border-black
                text-black py-3 px-6 font-bold transition-all duration-300 transform 
                disabled:opacity-70 disabled:hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]
                w-full
              `, disabled: !isFormValid || isPending, type: "submit", style: { minWidth: '160px' }, children: isPending ? _jsx(LoadingBox, {}) : 'Đăng nhập' }) }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: ["Kh\u00E1ch h\u00E0ng m\u1EDBi?", " ", _jsx(Link, { to: `/signup?redirect=${redirect}`, className: "text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300", children: "T\u1EA1o t\u00E0i kho\u1EA3n" })] })] })] })] }));
}
