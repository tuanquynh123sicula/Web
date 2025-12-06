import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
export default function AccessDeniedPage() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4", children: _jsxs("div", { className: "bg-white shadow-md rounded-2xl p-10 max-w-md", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "bg-red-100 p-4 rounded-full", children: _jsx(LockIcon, { className: "h-12 w-12 text-red-500" }) }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-3", children: "Access Denied" }), _jsx("p", { className: "text-gray-600 mb-8", children: "You do not have permission to access this page." }), _jsx(Button, { onClick: () => navigate('/'), children: "Go Back Home" })] }) }));
}
