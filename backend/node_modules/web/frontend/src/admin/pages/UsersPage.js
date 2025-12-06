import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUserRoleTier, getUserOrders } from '@/api/adminApi';
import { toast } from 'sonner';
import { X, Shield, User as UserIcon } from 'lucide-react';
const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang vận chuyển',
    delivered: 'Đã giao hàng',
    canceled: 'Đã hủy',
};
const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    packing: 'bg-blue-100 text-blue-700',
    shipping: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700',
};
export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const load = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUsers();
            setUsers(data.map(u => ({ tier: 'regular', ...u })));
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { load(); }, []);
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá người dùng này không?'))
            return;
        try {
            setIsLoading(true);
            await deleteUser(id);
            toast.success('Xoá người dùng thành công');
            load();
        }
        catch {
            toast.error('Lỗi khi xoá người dùng');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async (u) => {
        try {
            setIsLoading(true);
            await updateUserRoleTier(u._id, { isAdmin: !!u.isAdmin, tier: u.tier ?? 'regular' });
            toast.success('Cập nhật quyền / hạng khách hàng thành công');
            load();
        }
        catch {
            toast.error('Lỗi khi cập nhật');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleViewOrders = async (u) => {
        setSelectedUser(u);
        setLoadingOrders(true);
        try {
            const data = await getUserOrders(u._id);
            setOrders(data);
        }
        catch {
            toast.error('Lỗi khi tải đơn hàng');
        }
        finally {
            setLoadingOrders(false);
        }
    };
    const updateLocal = (id, patch) => {
        setUsers(prev => prev.map(u => (u._id === id ? { ...u, ...patch } : u)));
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("style", { children: `
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      ` }), _jsxs("div", { className: "mb-6 animate-slide-down", children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Qu\u1EA3n l\u00FD ng\u01B0\u1EDDi d\u00F9ng" }), _jsxs("p", { className: "text-gray-500 mt-1", children: ["T\u1ED5ng: ", users.length, " ng\u01B0\u1EDDi d\u00F9ng"] })] }), _jsx("div", { className: "bg-white border shadow-md animate-slide-down transition-all duration-500 hover:shadow-lg overflow-x-auto", style: { animationDelay: '0.1s' }, children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b transition-colors duration-300", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "T\u00EAn" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Admin" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "H\u1EA1ng" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: users.map((u, idx) => (_jsxs("tr", { className: "border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer", style: { animationDelay: `${idx * 0.05}s` }, children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900 transition-colors duration-300", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserIcon, { size: 16, className: "text-gray-400" }), u.name] }) }), _jsx("td", { className: "px-4 py-3 text-gray-600 transition-colors duration-300", children: u.email }), _jsx("td", { className: "px-4 py-3 transition-all duration-300", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: !!u.isAdmin, onChange: e => updateLocal(u._id, { isAdmin: e.target.checked }), className: "w-4 h-4 cursor-pointer transition-all duration-300" }), u.isAdmin && _jsx(Shield, { size: 16, className: "ml-2 text-blue-600" })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("select", { className: "border px-3 py-1 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm", value: u.tier ?? 'regular', onChange: e => updateLocal(u._id, { tier: e.target.value }), children: [_jsx("option", { value: "regular", children: "Regular" }), _jsx("option", { value: "vip", children: "VIP" }), _jsx("option", { value: "new", children: "New" })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm active:scale-95 disabled:opacity-50", onClick: () => handleSave(u), disabled: isLoading, children: "L\u01B0u" }), _jsx("button", { className: "border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-400 hover:shadow-sm active:scale-95 disabled:opacity-50", onClick: () => handleViewOrders(u), disabled: isLoading, children: "\u0110\u01A1n h\u00E0ng" }), _jsx("button", { className: "border border-red-300 text-red-600 px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-sm active:scale-95 disabled:opacity-50", onClick: () => handleDelete(u._id), disabled: isLoading, children: "Xo\u00E1" })] }) })] }, u._id))) })] }) }), users.length === 0 && (_jsx("div", { className: "text-center py-12 text-gray-500", children: _jsx("p", { className: "text-lg", children: "Kh\u00F4ng c\u00F3 ng\u01B0\u1EDDi d\u00F9ng n\u00E0o" }) })), selectedUser && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in", children: _jsxs("div", { className: "bg-white p-6 w-full max-w-3xl shadow-xl animate-fade-in transform transition-all duration-300", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-2xl font-bold", children: ["\u0110\u01A1n h\u00E0ng c\u1EE7a ", selectedUser.name] }), _jsx("button", { className: "p-1 hover:bg-gray-100 transition-all duration-300 hover:scale-110", onClick: () => setSelectedUser(null), children: _jsx(X, { size: 24, className: "text-gray-600" }) })] }), loadingOrders ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500 animate-pulse", children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..." }) })) : orders.length === 0 ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500 text-lg", children: "Ng\u01B0\u1EDDi d\u00F9ng n\u00E0y ch\u01B0a c\u00F3 \u0111\u01A1n h\u00E0ng n\u00E0o" }) })) : (_jsx("div", { className: "overflow-x-auto border shadow-sm", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "ID" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Ng\u00E0y" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "T\u1ED5ng ti\u1EC1n" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Tr\u1EA1ng th\u00E1i" })] }) }), _jsx("tbody", { children: orders.map((o, idx) => (_jsxs("tr", { className: "border-b last:border-none hover:bg-gray-50 transition-colors duration-300", style: { animationDelay: `${idx * 0.05}s` }, children: [_jsxs("td", { className: "px-4 py-3 font-mono text-gray-600", children: [String(o._id).slice(0, 8), "..."] }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: new Date(o.createdAt).toLocaleDateString('vi-VN') }), _jsxs("td", { className: "px-4 py-3 font-semibold text-blue-600", children: [Number(o.totalPrice).toLocaleString('vi-VN'), " \u20AB"] }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `inline-block px-2 py-1 text-xs font-medium transition-all duration-300 ${STATUS_COLORS[o.status ?? 'pending']}`, children: STATUS_LABELS[o.status ?? 'pending'] }) })] }, o._id))) })] }) })), _jsx("div", { className: "flex justify-end gap-3 mt-6", children: _jsx("button", { className: "border px-6 py-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-95", onClick: () => setSelectedUser(null), children: "\u0110\u00F3ng" }) })] }) }))] }));
}
