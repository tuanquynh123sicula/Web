import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { getAllOrders } from '@/api/adminApi';
import apiClient from '@/apiClient';
import { toast } from 'sonner';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang vận chuyển',
    delivered: 'Đã giao hàng',
    canceled: 'Đã hủy',
};
const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    packing: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    shipping: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    delivered: 'bg-green-100 text-green-700 hover:bg-green-200',
    canceled: 'bg-red-100 text-red-700 hover:bg-red-200',
};
export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [filters, setFilters] = useState({
        status: '',
        customer: '',
        dateFrom: '',
        dateTo: '',
        minTotal: '',
        maxTotal: '',
    });
    const [selected, setSelected] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    useEffect(() => {
        getAllOrders().then((data) => {
            const normalized = data.map((o) => ({
                ...o,
                status: (o.status ?? (o.isDelivered ? 'delivered' : 'pending')),
            }));
            setOrders(normalized);
        });
    }, []);
    const filtered = useMemo(() => {
        return orders.filter((o) => {
            if (filters.status && (o.status ?? 'pending') !== filters.status)
                return false;
            if (filters.customer && !o.user?.name?.toLowerCase().includes(filters.customer.toLowerCase()))
                return false;
            if (filters.dateFrom && new Date(o.createdAt ?? 0) < new Date(filters.dateFrom))
                return false;
            if (filters.dateTo && new Date(o.createdAt ?? 0) > new Date(filters.dateTo + 'T23:59:59'))
                return false;
            if (filters.minTotal && Number(o.totalPrice) < Number(filters.minTotal))
                return false;
            if (filters.maxTotal && Number(o.totalPrice) > Number(filters.maxTotal))
                return false;
            return true;
        });
    }, [orders, filters]);
    useEffect(() => {
        setPage(1);
    }, [filters]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);
    const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));
    const pageNumbers = useMemo(() => {
        const maxBtns = 5;
        let start = Math.max(1, page - Math.floor(maxBtns / 2));
        const end = Math.min(totalPages, start + maxBtns - 1);
        start = Math.max(1, Math.min(start, end - maxBtns + 1));
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages]);
    const resetFilters = () => setFilters({ status: '', customer: '', dateFrom: '', dateTo: '', minTotal: '', maxTotal: '' });
    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            await apiClient.patch(`/api/admin/orders/${id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
            toast.success('Cập nhật trạng thái đơn hàng thành công');
            if (selected?._id === id)
                setSelected((s) => (s ? { ...s, status } : s));
        }
        catch {
            toast.error('Không thể cập nhật trạng thái');
        }
        finally {
            setUpdatingId(null);
        }
    };
    return (_jsxs("div", { className: "p-6 bg-gray-50 min-h-screen", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight text-gray-900", children: "Qu\u1EA3n l\u00FD \u0111\u01A1n h\u00E0ng" }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["T\u1ED5ng: ", _jsx("span", { className: "font-semibold text-blue-600", children: filtered.length }), " \u0111\u01A1n h\u00E0ng \u2022 Trang ", _jsx("span", { className: "font-semibold", children: page }), "/", _jsx("span", { className: "font-semibold", children: totalPages })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white border shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg", children: _jsxs("div", { className: "grid grid-cols-6 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-sm font-semibold mb-2 text-gray-700", children: "Kh\u00E1ch h\u00E0ng" }), _jsx("input", { value: filters.customer, onChange: (e) => setFilters((f) => ({ ...f, customer: e.target.value })), className: "border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300", placeholder: "T\u00EAn kh\u00E1ch h\u00E0ng" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2 text-gray-700", children: "Tr\u1EA1ng th\u00E1i" }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters((f) => ({ ...f, status: e.target.value })), className: "border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300", children: [_jsx("option", { value: "", children: "T\u1EA5t c\u1EA3" }), Object.entries(STATUS_LABELS).map(([key, label]) => (_jsx("option", { value: key, children: label }, key)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2 text-gray-700", children: "T\u1EEB ng\u00E0y" }), _jsx("input", { type: "date", value: filters.dateFrom, onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value })), className: "border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2 text-gray-700", children: "\u0110\u1EBFn ng\u00E0y" }), _jsx("input", { type: "date", value: filters.dateTo, onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value })), className: "border w-full px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300" })] }), _jsx("div", { className: "col-span-6 flex gap-3", children: _jsx(motion.button, { whileHover: { scale: 1.02, y: -2 }, whileTap: { scale: 0.98 }, onClick: resetFilters, className: "bg-gray-200 px-6 py-2 font-medium transition-all duration-300 hover:shadow-md active:shadow-sm hover:bg-gray-300", children: "X\u00F3a b\u1ED9 l\u1ECDc" }) })] }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "bg-white border shadow-md transition-all duration-500 hover:shadow-lg overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Kh\u00E1ch h\u00E0ng" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Ng\u00E0y" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "T\u1ED5ng ti\u1EC1n" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Thanh to\u00E1n" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Giao h\u00E0ng" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: _jsx(AnimatePresence, { mode: "wait", children: pageData.map((o, idx) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3, delay: idx * 0.05 }, className: "border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer", children: [_jsx("td", { className: "px-6 py-4 font-medium", children: o.user?.name ?? 'Khách' }), _jsx("td", { className: "px-6 py-4 text-gray-600", children: o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '-' }), _jsxs("td", { className: "px-6 py-4 font-semibold text-blue-600", children: [Number(o.totalPrice).toLocaleString('vi-VN'), " \u20AB"] }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `text-lg ${o.isPaid ? 'animate-pulse' : ''}`, children: o.isPaid ? '✅' : '❌' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `text-lg ${o.isDelivered ? 'animate-pulse' : ''}`, children: o.isDelivered ? '✅' : '❌' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(motion.span, { whileHover: { scale: 1.05 }, className: `inline-block px-3 py-1 text-xs font-semibold transition-all duration-300 ${STATUS_COLORS[o.status ?? 'pending']}`, children: STATUS_LABELS[o.status ?? 'pending'] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, className: "bg-blue-600 text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700", onClick: () => setSelected(o), children: "Xem" }) })] }, o._id))) }) })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t bg-gray-50", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Hi\u1EC3n th\u1ECB", ' ', _jsxs("span", { className: "font-bold text-blue-600", children: [filtered.length === 0 ? 0 : (page - 1) * pageSize + 1, ' - ', Math.min(page * pageSize, filtered.length)] }), ' ', "trong t\u1ED5ng s\u1ED1 ", _jsx("span", { className: "font-bold text-blue-600", children: filtered.length }), " \u0111\u01A1n h\u00E0ng"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md", onClick: () => goto(1), disabled: page === 1, title: "Trang \u0111\u1EA7u", children: _jsx(ChevronsLeft, { size: 18 }) }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md", onClick: () => goto(page - 1), disabled: page === 1, title: "Trang tr\u01B0\u1EDBc", children: _jsx(ChevronLeft, { size: 18 }) }), pageNumbers.map((p) => (_jsx(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, className: `px-4 py-2 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md ${p === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border bg-white hover:bg-gray-50'}`, onClick: () => goto(p), children: p }, p))), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md", onClick: () => goto(page + 1), disabled: page === totalPages, title: "Trang sau", children: _jsx(ChevronRight, { size: 18 }) }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "border px-3 py-2 hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md", onClick: () => goto(totalPages), disabled: page === totalPages, title: "Trang cu\u1ED1i", children: _jsx(ChevronsRight, { size: 18 }) })] })] })] }), _jsx(AnimatePresence, { children: selected && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: () => setSelected(null), children: _jsxs(motion.div, { initial: { scale: 0.9, y: 20 }, animate: { scale: 1, y: 0 }, exit: { scale: 0.9, y: 20 }, transition: { type: "spring", duration: 0.5 }, className: "bg-white border p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900", children: "Chi ti\u1EBFt \u0111\u01A1n h\u00E0ng" }), _jsx(motion.button, { whileHover: { scale: 1.1, rotate: 90 }, whileTap: { scale: 0.9 }, className: "p-2 hover:bg-gray-100 transition-all duration-300", onClick: () => setSelected(null), children: _jsx(X, { size: 24, className: "text-gray-600" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-8 mb-8 pb-8 border-b", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, children: [_jsx("div", { className: "font-semibold text-gray-900 mb-3 text-lg", children: "Kh\u00E1ch h\u00E0ng" }), _jsx("div", { className: "text-gray-700 text-lg", children: selected.user?.name ?? 'Khách' }), _jsx("div", { className: "font-semibold text-gray-900 mt-6 mb-3 text-lg", children: "Th\u00F4ng tin v\u1EADn chuy\u1EC3n" }), _jsxs("div", { className: "text-sm text-gray-600 space-y-2 bg-gray-50 p-4 border", children: [_jsx("div", { className: "font-medium", children: selected.shippingAddress?.fullName }), _jsxs("div", { children: [selected.shippingAddress?.address, ", ", selected.shippingAddress?.city] }), _jsxs("div", { children: [selected.shippingAddress?.postalCode, ", ", selected.shippingAddress?.country] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: [_jsx("div", { className: "font-semibold text-gray-900 mb-3 text-lg", children: "Tr\u1EA1ng th\u00E1i" }), _jsx(motion.span, { whileHover: { scale: 1.05 }, className: `inline-block px-4 py-2 text-sm font-semibold shadow-md ${STATUS_COLORS[selected.status ?? 'pending']}`, children: STATUS_LABELS[selected.status ?? 'pending'] }), _jsx("div", { className: "font-semibold text-gray-900 mt-6 mb-3 text-lg", children: "T\u1ED5ng ti\u1EC1n" }), _jsxs("div", { className: "text-3xl font-bold text-blue-600", children: [Number(selected.totalPrice).toLocaleString('vi-VN'), " \u20AB"] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-3", children: "C\u1EADp nh\u1EADt tr\u1EA1ng th\u00E1i" }), _jsx("select", { className: "border w-full px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-blue-300 bg-white shadow-sm", value: selected.status ?? 'pending', onChange: (e) => updateStatus(selected._id, e.target.value), disabled: updatingId === selected._id, children: Object.keys(STATUS_LABELS).map((k) => (_jsx("option", { value: k, children: STATUS_LABELS[k] }, k))) })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: [_jsx("div", { className: "font-semibold text-gray-900 mb-4 text-lg", children: "S\u1EA3n ph\u1EA9m" }), _jsx("div", { className: "max-h-80 overflow-auto border shadow-sm", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100 border-b sticky top-0", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "T\u00EAn s\u1EA3n ph\u1EA9m" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "SL" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Gi\u00E1" }), _jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-800", children: "Th\u00E0nh ti\u1EC1n" })] }) }), _jsx("tbody", { children: (selected.orderItems ?? []).map((it, idx) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4 + idx * 0.05 }, className: "border-b last:border-none hover:bg-blue-50 transition-colors duration-300", children: [_jsx("td", { className: "px-6 py-4 font-medium", children: it.name }), _jsx("td", { className: "px-6 py-4 font-semibold text-blue-600", children: it.quantity }), _jsxs("td", { className: "px-6 py-4", children: [Number(it.price).toLocaleString('vi-VN'), " \u20AB"] }), _jsxs("td", { className: "px-6 py-4 font-bold text-blue-600", children: [(Number(it.price) * Number(it.quantity)).toLocaleString('vi-VN'), " \u20AB"] })] }, it._id))) })] }) })] }), _jsx("div", { className: "flex justify-end gap-4 mt-8", children: _jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, className: "bg-gray-300 px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-400", onClick: () => setSelected(null), children: "\u0110\u00F3ng" }) })] }) })) })] }));
}
