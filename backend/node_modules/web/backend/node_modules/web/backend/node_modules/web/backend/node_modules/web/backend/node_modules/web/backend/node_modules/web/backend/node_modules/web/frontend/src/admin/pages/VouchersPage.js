import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Store } from '@/Store';
import { getError } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
const LoadingBox = () => (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "\u0110ang t\u1EA3i..." })] }) }));
const MessageBox = ({ children }) => (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4", children: children }));
const API_BASE_URL = 'http://localhost:4000/api/vouchers';
export default function VouchersPage() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxUsage: 0,
        expiryDate: '',
    });
    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(API_BASE_URL, {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            });
            setVouchers(data);
            setError(null);
        }
        catch (err) {
            setError(getError(err));
            toast.error('Lỗi tải danh sách voucher.');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            setError('Bạn không có quyền truy cập trang này.');
            setIsLoading(false);
            return;
        }
        fetchVouchers();
    }, [userInfo]);
    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 0,
            minOrderValue: 0,
            maxUsage: 0,
            expiryDate: '',
        });
        setEditingId(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!formData.code.trim()) {
            toast.error('Vui lòng nhập mã voucher!');
            return;
        }
        if (!formData.discountValue || formData.discountValue <= 0) {
            toast.error('Vui lòng nhập giá trị giảm hợp lệ!');
            return;
        }
        if (!formData.maxUsage || formData.maxUsage <= 0) {
            toast.error('Vui lòng nhập số lần sử dụng tối đa!');
            return;
        }
        if (!formData.expiryDate) {
            toast.error('Vui lòng chọn ngày hết hạn!');
            return;
        }
        setIsSubmitting(true);
        const payload = {
            ...formData,
            discountValue: parseFloat(formData.discountValue.toString()),
            minOrderValue: parseFloat(formData.minOrderValue.toString()),
            maxUsage: parseInt(formData.maxUsage.toString()),
            code: formData.code.toUpperCase(),
        };
        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                });
                toast.success('Cập nhật voucher thành công.');
            }
            else {
                await axios.post(API_BASE_URL, payload, {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                });
                toast.success('Tạo voucher mới thành công.');
            }
            fetchVouchers();
            resetForm();
            setShowForm(false);
        }
        catch (err) {
            const errorMsg = getError(err);
            toast.error(`Lỗi: ${errorMsg}`);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleEdit = (voucher) => {
        setFormData({
            code: voucher.code,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minOrderValue: voucher.minOrderValue,
            maxUsage: voucher.maxUsage,
            expiryDate: voucher.expiryDate.split('T')[0],
        });
        setEditingId(voucher._id);
        setShowForm(true);
    };
    const handleDelete = async (id, code) => {
        if (!confirm(`Bạn có chắc muốn xóa voucher ${code}?`))
            return;
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            });
            toast.success(`Xóa voucher ${code} thành công.`);
            fetchVouchers();
        }
        catch (err) {
            const errorMsg = getError(err);
            toast.error(`Lỗi xóa: ${errorMsg}`);
        }
    };
    const handleToggleActive = async (voucher) => {
        try {
            await axios.patch(`${API_BASE_URL}/${voucher._id}`, { isActive: !voucher.isActive }, { headers: { Authorization: `Bearer ${userInfo?.token}` } });
            toast.success(`Cập nhật trạng thái ${voucher.code} thành công.`);
            fetchVouchers();
        }
        catch (err) {
            const errorMsg = getError(err);
            toast.error(`Lỗi cập nhật trạng thái: ${errorMsg}`);
        }
    };
    if (error)
        return _jsx(MessageBox, { children: error });
    if (isLoading)
        return _jsx(LoadingBox, {});
    return (_jsxs("div", { className: "p-6 bg-gray-50 min-h-screen", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight text-gray-900", children: "Qu\u1EA3n l\u00FD Voucher" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["T\u1ED5ng: ", _jsx("span", { className: "font-semibold text-blue-600", children: vouchers.length }), " voucher"] })] }), _jsxs(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, onClick: () => {
                            resetForm();
                            setShowForm(!showForm);
                        }, className: "bg-blue-600 text-white px-6 py-3 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700", children: [showForm ? _jsx(X, { size: 20 }) : _jsx(Plus, { size: 20 }), showForm ? 'Đóng' : 'Tạo Voucher'] })] }), _jsx(AnimatePresence, { children: showForm && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "bg-white border shadow-md p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-gray-900", children: editingId ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["M\u00E3 Voucher ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", placeholder: "VD: SUMMER20, SAVE50", value: formData.code, onChange: (e) => setFormData({ ...formData, code: e.target.value }), className: "w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Lo\u1EA1i Gi\u1EA3m Gi\u00E1 ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: formData.discountType, onChange: (e) => setFormData({ ...formData, discountType: e.target.value }), className: "w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm", children: [_jsx("option", { value: "percentage", children: "Ph\u1EA7n tr\u0103m (%)" }), _jsx("option", { value: "fixed", children: "Gi\u00E1 c\u1ED1 \u0111\u1ECBnh (\u20AB)" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Gi\u00E1 Tr\u1ECB Gi\u1EA3m ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "number", placeholder: formData.discountType === 'percentage' ? 'VD: 20' : 'VD: 100000', value: formData.discountValue || '', onChange: (e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 }), className: "flex-1 border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm" }), _jsx("div", { className: "bg-gray-100 border border-l-0 px-3 py-2 font-semibold text-gray-700", children: formData.discountType === 'percentage' ? '%' : '₫' })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Gi\u00E1 Tr\u1ECB \u0110\u01A1n H\u00E0ng T\u1ED1i Thi\u1EC3u" }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "number", placeholder: "VD: 500000", value: formData.minOrderValue || '', onChange: (e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) || 0 }), className: "flex-1 border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm" }), _jsx("div", { className: "bg-gray-100 border border-l-0 px-3 py-2 font-semibold text-gray-700", children: "\u20AB" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["S\u1ED1 L\u1EA7n S\u1EED D\u1EE5ng T\u1ED1i \u0110a ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "number", placeholder: "VD: 100", value: formData.maxUsage || '', onChange: (e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) || 0 }), className: "w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm", min: "1" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Ng\u00E0y H\u1EBFt H\u1EA1n ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: formData.expiryDate, onChange: (e) => setFormData({ ...formData, expiryDate: e.target.value }), className: "w-full border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4 border-t", children: [_jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, type: "submit", disabled: isSubmitting, className: `bg-blue-600 text-white px-6 py-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`, children: isSubmitting ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Tạo Voucher' }), _jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, type: "button", onClick: () => {
                                                resetForm();
                                                setShowForm(false);
                                            }, className: "bg-gray-300 text-black px-6 py-2 font-semibold hover:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg", children: "H\u1EE7y" })] })] })] })) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "bg-white border shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg", children: _jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "M\u00E3 Voucher" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "Lo\u1EA1i Gi\u1EA3m" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "Gi\u00E1 Tr\u1ECB" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "L\u01B0\u1EE3t D\u00F9ng" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "H\u1EBFt h\u1EA1n" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-800", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "px-6 py-4 text-center text-sm font-semibold text-gray-800", children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: _jsx(AnimatePresence, { children: vouchers.map((voucher, idx) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3, delay: idx * 0.05 }, className: "border-b last:border-none transition-all duration-300 hover:bg-blue-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: voucher.code }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: voucher.discountType === 'percentage' ? 'Phần trăm' : 'Cố định' }), _jsxs("td", { className: "px-6 py-4 text-sm font-semibold text-blue-600", children: [voucher.discountValue.toLocaleString('vi-VN'), voucher.discountType === 'percentage' ? '%' : '₫'] }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-600", children: [voucher.usageCount, " / ", voucher.maxUsage] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: voucher.expiryDate.split('T')[0] }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => handleToggleActive(voucher), className: `px-3 py-1 text-xs font-semibold transition-all duration-300 ${voucher.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'}`, children: voucher.isActive ? 'Hoạt động' : 'Tắt' }) }), _jsxs("td", { className: "px-6 py-4 text-center text-sm space-x-2", children: [_jsxs(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, onClick: () => handleEdit(voucher), className: "text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors duration-300", children: [_jsx(Edit, { size: 16 }), " S\u1EEDa"] }), _jsxs(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, onClick: () => handleDelete(voucher._id, voucher.code), className: "text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1 transition-colors duration-300", children: [_jsx(Trash2, { size: 16 }), " X\u00F3a"] })] })] }, voucher._id))) }) })] }), vouchers.length === 0 && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "p-6 text-center text-gray-500", children: "Kh\u00F4ng c\u00F3 voucher n\u00E0o \u0111\u01B0\u1EE3c t\u1EA1o." }))] }) })] }));
}
