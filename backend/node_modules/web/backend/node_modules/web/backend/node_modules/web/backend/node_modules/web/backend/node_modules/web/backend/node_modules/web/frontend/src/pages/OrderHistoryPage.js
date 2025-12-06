import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { useGetOrderHistoryQuery, useDeleteOrderMutation, useDeleteAllOrdersMutation, } from '../hooks/orderHooks';
import { toast } from 'sonner';
const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang vận chuyển',
    delivered: 'Đã giao hàng',
    canceled: 'Đã hủy',
};
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'delivered':
            return 'bg-success text-white';
        case 'shipping':
        case 'packing':
            return 'bg-primary text-white';
        case 'canceled':
            return 'bg-danger text-white';
        case 'pending':
        default:
            return 'bg-warning text-dark';
    }
};
export default function OrderHistoryPage() {
    const navigate = useNavigate();
    const { data: orders, isPending, error, refetch } = useGetOrderHistoryQuery();
    const deleteOrder = useDeleteOrderMutation();
    const deleteAllOrders = useDeleteAllOrdersMutation();
    const handleDelete = async (id) => {
        // Giữ nguyên logic xóa (chỉ xóa khi đã HỦY, theo logic đã sửa)
        if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?'))
            return;
        try {
            await deleteOrder.mutateAsync(id);
            toast.success('Đã xóa đơn hàng');
            refetch();
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    const handleDeleteAll = async () => {
        if (!window.confirm('⚠ Bạn có chắc muốn xóa TẤT CẢ đơn hàng?'))
            return;
        try {
            await deleteAllOrders.mutateAsync();
            toast.success('Đã xóa tất cả đơn hàng');
            refetch();
        }
        catch (err) {
            toast.error(getError(err));
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx(Helmet, { children: _jsx("title", { children: "L\u1ECBch s\u1EED \u0110\u01A1n h\u00E0ng" }) }), _jsxs("div", { className: "d-flex justify-content-between align-items-center mb-5", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 m-0", children: "L\u1ECBch s\u1EED \u0110\u01A1n h\u00E0ng" }), _jsx(Button, { variant: "danger", onClick: handleDeleteAll, disabled: deleteAllOrders.isPending || (orders?.length || 0) === 0, className: "py-2 px-4 font-semibold hover:bg-red-700 transition-colors", children: "X\u00F3a t\u1EA5t c\u1EA3" })] }), isPending ? (_jsx(LoadingBox, {})) : error ? (_jsx(MessageBox, { variant: "danger", children: getError(error) })) : (_jsx("div", { className: "bg-white p-4 rounded-lg shadow-lg overflow-x-auto", children: _jsxs(Table, { striped: true, hover: true, responsive: true, className: "text-sm", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-gray-700", children: "M\u00C3 \u0110H" }), _jsx("th", { className: "text-gray-700", children: "NG\u00C0Y" }), _jsx("th", { className: "text-gray-700", children: "T\u1ED4NG TI\u1EC0N" }), _jsx("th", { className: "text-gray-700", children: "TT. THANH TO\u00C1N" }), _jsx("th", { className: "text-gray-700", children: "TT. GIAO H\u00C0NG" }), _jsx("th", { className: "text-gray-700", children: "TR\u1EA0NG TH\u00C1I" }), _jsx("th", { className: "text-gray-700", children: "CHI TI\u1EBET" }), _jsx("th", { className: "text-gray-700", children: "H\u00C0NH \u0110\u1ED8NG" })] }) }), _jsx("tbody", { children: orders.map((order) => {
                                    const status = order.status ??
                                        (order.isDelivered ? 'delivered' : 'pending');
                                    // Cho phép xóa nếu trạng thái là đã HỦY (canceled)
                                    const canDelete = status === 'canceled';
                                    return (_jsxs("tr", { children: [_jsx("td", { className: "font-medium", children: order._id.slice(-6).toUpperCase() }), _jsx("td", { children: new Date(order.createdAt).toLocaleDateString('vi-VN') }), _jsxs("td", { className: "font-semibold text-gray-800", children: [Number(order.totalPrice).toLocaleString('vi-VN'), " \u20AB"] }), _jsx("td", { children: order.isPaid ? (_jsx("span", { className: "badge bg-success", children: "\u0110\u00E3 Thanh To\u00E1n" })) : (_jsx("span", { className: "badge bg-danger", children: "Ch\u01B0a Thanh To\u00E1n" })) }), _jsx("td", { children: order.isDelivered ? (_jsx("span", { className: "badge bg-success", children: "\u0110\u00E3 Giao" })) : (_jsx("span", { className: "badge bg-warning text-dark", children: "Ch\u01B0a Giao" })) }), _jsx("td", { children: _jsx("span", { className: `badge ${getStatusBadgeClass(status)} text-xs p-2`, children: STATUS_LABELS[status] }) }), _jsx("td", { children: _jsx(Button, { type: "button", variant: "gray-100", size: "sm", onClick: () => navigate(`/order/${order._id}`), className: "py-1 px-3 font-semibold text-black hover:bg-gray-100 transition-colors", children: "Xem" }) }), _jsx("td", { children: _jsx(Button, { type: "button", variant: "danger", size: "sm", onClick: () => handleDelete(order._id), disabled: deleteOrder.isPending || !canDelete, children: "X\u00F3a" }) })] }, order._id));
                                }) })] }) }))] }) }));
}
