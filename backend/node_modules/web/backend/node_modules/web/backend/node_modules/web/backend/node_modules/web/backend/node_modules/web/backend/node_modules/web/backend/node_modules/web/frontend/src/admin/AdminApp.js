import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import OrdersPage from './pages/OrdersPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import ProductsPage from './pages/ProductsPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import UsersPage from './pages/UsersPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import AdminProtectedRoute from './components/AdminProtectedRoute.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import BlogsPage from './pages/BlogPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import VouchersPage from './pages/VouchersPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import ReportPage from './pages/ReportPage.tsx'; // <-- Sửa lỗi: Thêm lại .tsx
import { LayoutDashboard, ShoppingCart, Package, Users, Ticket, BookOpen, LogOut, BarChart4 // <-- ICON MỚI
 } from 'lucide-react';
export default function AdminApp() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const NavLink = ({ to, icon: Icon, children }) => (_jsxs(Link, { to: to, className: `
        flex items-center gap-3 px-4 py-3 border-l-4 text-sm font-medium
        transition duration-300 ease-in-out
        ${isActive(to)
            ? 'border-blue-600 bg-blue-50 text-blue-900'
            : 'border-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-300'}
      `, children: [_jsx(Icon, { size: 20 }), children] }));
    return (_jsxs("div", { className: "min-h-screen flex bg-gray-50", children: [_jsxs("aside", { className: "w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-2xl font-bold text-black tracking-wider", children: "QU\u1EA2N L\u00DD" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "B\u1EA3ng \u0110i\u1EC1u Khi\u1EC3n Qu\u1EA3n Tr\u1ECB" })] }), _jsxs("nav", { className: "flex-1 space-y-1 p-4", children: [_jsx(NavLink, { to: "/admin/dashboard", icon: LayoutDashboard, children: "B\u1EA3ng \u0110i\u1EC1u Khi\u1EC3n" }), _jsx(NavLink, { to: "/admin/reports", icon: BarChart4, children: "B\u00E1o C\u00E1o Th\u1ED1ng K\u00EA" }), _jsx(NavLink, { to: "/admin/orders", icon: ShoppingCart, children: "\u0110\u01A1n H\u00E0ng" }), _jsx(NavLink, { to: "/admin/products", icon: Package, children: "S\u1EA3n Ph\u1EA9m" }), _jsx(NavLink, { to: "/admin/users", icon: Users, children: "Ng\u01B0\u1EDDi D\u00F9ng" }), _jsx(NavLink, { to: "/admin/vouchers", icon: Ticket, children: "M\u00E3 Gi\u1EA3m Gi\u00E1" }), _jsx(NavLink, { to: "/admin/blogs", icon: BookOpen, children: "B\u00E0i Vi\u1EBFt" })] }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs(Link, { to: "/", className: "flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-300 text-sm font-medium", children: [_jsx(LogOut, { size: 18 }), "Quay L\u1EA1i C\u1EEDa H\u00E0ng"] }) })] }), _jsx("main", { className: "flex-1 p-8 overflow-auto", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) }), _jsxs(Route, { element: _jsx(AdminProtectedRoute, {}), children: [_jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "reports", element: _jsx(ReportPage, {}) }), " ", _jsx(Route, { path: "orders", element: _jsx(OrdersPage, {}) }), _jsx(Route, { path: "products", element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "users", element: _jsx(UsersPage, {}) }), _jsx(Route, { path: "vouchers", element: _jsx(VouchersPage, {}) }), _jsx(Route, { path: "blogs", element: _jsx(BlogsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen gap-4", children: [_jsx("div", { className: "text-6xl font-bold text-red-600", children: "404" }), _jsx("p", { className: "text-2xl text-gray-700", children: "Trang kh\u00F4ng t\u00ECm th\u1EA5y" }), _jsx(Link, { to: "/admin/dashboard", className: "mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700", children: "\u2190 V\u1EC1 Trang Ch\u1EE7 Qu\u1EA3n Tr\u1ECB" })] }) })] }) })] }));
}
