import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FaqChat from '@/components/FaqChat';
export default function MainLayout() {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith('/admin');
    return (_jsxs("div", { className: "relative min-h-screen bg-white text-gray-800 overflow-hidden", children: [_jsx(ToastContainer, { position: "bottom-center", limit: 1 }), _jsx(Toaster, {}), !isAdmin && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed top-0 left-0 bottom-0 w-56 z-30", children: _jsx(Sidebar, {}) }), _jsx("div", { className: "fixed left-56 right-0 top-0 z-30", children: _jsx(Header, {}) })] })), _jsx("main", { className: "relative z-10", children: _jsx(Outlet, {}) }), !isAdmin && (_jsx("div", { className: "fixed right-6 bottom-6 z-40", children: _jsx(FaqChat, {}) }))] }));
}
