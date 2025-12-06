import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGetSummaryReportQuery, useExportReport, } from '../../hooks/reportHooks';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, } from '../../components/ui/table';
import { Separator } from '../../components/ui/separator';
import { formatCurrency } from '../../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Download } from 'lucide-react';
import { getAllOrders } from '../../api/adminApi';
// Helper function để xử lý Tooltip cho Recharts
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg animate-fadeIn">
//         <p className="font-semibold text-gray-800">{label}</p>
//         <p className="text-sm text-blue-600">{`Doanh số: ${formatCurrency(payload[0].value)}`}</p>
//       </div>
//     )
//   }
//   return null
// }
const ReportPage = () => {
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [isExporting, setIsExporting] = useState(false);
    const { data: summary, isLoading: isLoadingSummary, error: errorSummary, } = useGetSummaryReportQuery();
    const { exportOrders } = useExportReport();
    // Load orders to compute monthly revenue like Dashboard
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        ;
        (async () => {
            try {
                const ods = await getAllOrders();
                setOrders(Array.isArray(ods) ? ods : []);
            }
            catch (e) {
                console.error('Error loading orders for monthly chart:', e);
            }
        })();
    }, []);
    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportOrders(dateFilter.startDate, dateFilter.endDate);
        }
        finally {
            setIsExporting(false);
        }
    };
    const toDate = (d) => (d ? new Date(d) : new Date(0));
    const formatMonthLabel = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
    // Daily sales for line chart (unchanged)
    const dailySalesData = summary?.dailySales.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
    })) || [];
    // Fallback monthly sales from summary
    const monthlySalesData = summary?.monthlySales.map(m => ({ ...m })) || [];
    // Dashboard-like monthly revenue aggregation from orders
    const monthlyMap = orders.reduce((acc, o) => {
        const d = toDate(o.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + Number((o).totalPrice ?? 0);
        return acc;
    }, {});
    const chartData = orders.length > 0
        ? Object.entries(monthlyMap)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, sales]) => ({
            name: formatMonthLabel(key),
            sales,
        }))
        : monthlySalesData
            .sort((a, b) => String(a.month).localeCompare(String(b.month)))
            .map(m => ({
            name: formatMonthLabel(String(m.month)),
            sales: Number(m.sales || 0),
        }));
    if (isLoadingSummary)
        return _jsx(LoadingBox, {});
    if (errorSummary)
        return (_jsx(MessageBox, { variant: "danger", children: errorSummary.message || 'Lỗi khi tải dữ liệu báo cáo.' }));
    const totalSales = summary?.totalSales || 0;
    return (_jsxs("div", { className: "p-6 space-y-8", children: [_jsx("div", { className: "animate-slideDown", children: _jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-extrabold text-gray-800 tracking-tight", children: "B\u00E1o C\u00E1o & Th\u1ED1ng K\u00EA" }), _jsx("p", { className: "text-gray-500 mt-2", children: "T\u1ED5ng quan ho\u1EA1t \u0111\u1ED9ng kinh doanh chi ti\u1EBFt" })] }) }) }), _jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.1s' }, children: _jsx(StatCard, { title: "Doanh Thu", value: formatCurrency(totalSales), icon: _jsx(DollarSign, {}), color: "emerald" }) }), _jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.2s' }, children: _jsx(StatCard, { title: "\u0110\u01A1n H\u00E0ng", value: summary?.totalOrders, icon: _jsx(ShoppingCart, {}), color: "yellow" }) }), _jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.3s' }, children: _jsx(StatCard, { title: "Ng\u01B0\u1EDDi D\u00F9ng", value: summary?.totalUsers, icon: _jsx(Users, {}), color: "blue" }) }), _jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.4s' }, children: _jsx(StatCard, { title: "Doanh Thu TB/Th\u00E1ng", value: formatCurrency(totalSales / (monthlySalesData.length || 1)), icon: _jsx(TrendingUp, {}), color: "green" }) })] }), _jsx(Separator, { className: "my-6" }), _jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.5s' }, children: _jsxs(Card, { className: "shadow-md border transition-all duration-500 hover:shadow-lg", children: [_jsx(CardHeader, { className: "transition-all duration-300", children: _jsxs(CardTitle, { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [_jsx(LineChart, { className: "text-blue-600" }), "Doanh s\u1ED1 7 Ng\u00E0y G\u1EA7n Nh\u1EA5t"] }) }), _jsx(CardContent, { className: "h-80 pt-6", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: dailySalesData, margin: { top: 5, right: 30, left: 50, bottom: 10 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "date", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280", tickFormatter: (value) => formatCurrency(Number(value)) }), _jsx(Tooltip, { formatter: (value) => formatCurrency(Number(value)) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "sales", stroke: "#3b82f6", strokeWidth: 3, dot: { r: 5, fill: '#3b82f6' }, activeDot: { r: 8, fill: '#1e40af' }, name: "Doanh s\u1ED1 (VN\u0110)", isAnimationActive: true, animationDuration: 800 })] }) }) })] }) }), _jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.6s' }, children: _jsxs(Card, { className: "shadow-md border transition-all duration-500 hover:shadow-lg", children: [_jsx(CardHeader, { className: "transition-all duration-300", children: _jsxs(CardTitle, { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [_jsx(BarChart, { className: "text-green-600" }), "T\u1ED5ng Doanh s\u1ED1 theo Th\u00E1ng"] }) }), _jsx(CardContent, { className: "h-80 pt-6", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, margin: { top: 20, right: 30, left: 20, bottom: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "name", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280", width: 90, tickFormatter: (value) => formatCurrency(Number(value)) }), _jsx(Tooltip, { formatter: (value) => formatCurrency(Number(value)), contentStyle: { transition: 'all 0.3s ease' } }), _jsx(Bar, { dataKey: "sales", name: "Doanh s\u1ED1", fill: "#3b82f6", radius: [0, 0, 0, 0] })] }) }) })] }) }), _jsx(Separator, { className: "my-6" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "animate-slideUp", style: { animationDelay: '0.7s' }, children: _jsxs(Card, { className: "shadow-md border transition-all duration-500 hover:shadow-lg h-full", children: [_jsx(CardHeader, { className: "transition-all duration-300", children: _jsxs(CardTitle, { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [_jsx(Download, { size: 20, className: "text-indigo-600" }), "Xu\u1EA5t B\u00E1o C\u00E1o"] }) }), _jsxs(CardContent, { className: "space-y-4 pt-6", children: [_jsxs("div", { className: "space-y-2 transform transition-all duration-300 hover:scale-105", children: [_jsx("label", { htmlFor: "start-date", className: "text-sm font-semibold text-gray-700 block", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx(Input, { type: "date", id: "start-date", value: dateFilter.startDate, onChange: (e) => setDateFilter({ ...dateFilter, startDate: e.target.value }), className: "transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:scale-105 border-gray-300 hover:border-indigo-400" })] }), _jsxs("div", { className: "space-y-2 transform transition-all duration-300 hover:scale-105", children: [_jsx("label", { htmlFor: "end-date", className: "text-sm font-semibold text-gray-700 block", children: "Ng\u00E0y k\u1EBFt th\u00FAc" }), _jsx(Input, { type: "date", id: "end-date", value: dateFilter.endDate, onChange: (e) => setDateFilter({ ...dateFilter, endDate: e.target.value }), className: "transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:scale-105 border-gray-300 hover:border-indigo-400" })] }), _jsxs(Button, { onClick: handleExport, disabled: isExporting, className: "w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold", children: [_jsx(Download, { size: 18, className: "mr-2" }), isExporting ? 'Đang xuất...' : 'Xuất CSV'] }), _jsx("p", { className: "text-xs text-gray-500 transition-all duration-300 hover:text-gray-700", children: "*N\u1EBFu kh\u00F4ng ch\u1ECDn ng\u00E0y, s\u1EBD xu\u1EA5t t\u1EA5t c\u1EA3 \u0111\u01A1n h\u00E0ng" })] })] }) }), _jsx("div", { className: "lg:col-span-2 animate-slideUp", style: { animationDelay: '0.8s' }, children: _jsxs(Card, { className: "shadow-md border transition-all duration-500 hover:shadow-lg h-full", children: [_jsx(CardHeader, { className: "transition-all duration-300", children: _jsxs(CardTitle, { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [_jsx(Package, { size: 20, className: "text-emerald-600" }), "Top 5 S\u1EA3n Ph\u1EA9m B\u00E1n Ch\u1EA1y Nh\u1EA5t"] }) }), _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-gray-50/50 hover:bg-gray-100 transition-colors duration-300", children: [_jsx(TableHead, { className: "w-[50px] font-medium text-gray-600", children: "H\u1EA1ng" }), _jsx(TableHead, { className: "font-medium text-gray-600", children: "T\u00EAn S\u1EA3n Ph\u1EA9m" }), _jsx(TableHead, { className: "text-right font-medium text-gray-600", children: "SL B\u00E1n" }), _jsx(TableHead, { className: "text-right font-medium text-gray-600", children: "Doanh Thu" })] }) }), _jsx(TableBody, { children: summary?.topSellingProducts && summary.topSellingProducts.length > 0 ? (summary.topSellingProducts.map((product, index) => (_jsxs(TableRow, { className: "transition-all duration-300 hover:bg-blue-50/50 cursor-pointer border-b last:border-none", style: { animationDelay: `${index * 0.1}s` }, children: [_jsxs(TableCell, { className: "font-semibold text-gray-700", children: [index === 0 && _jsx("span", { className: "text-lg" }), index === 1 && _jsx("span", { className: "text-lg" }), index === 2 && _jsx("span", { className: "text-lg" }), index >= 3 && _jsx("span", { className: "text-lg" }), index + 1] }), _jsx(TableCell, { className: "font-medium text-gray-800 transition-colors duration-300", children: product.name }), _jsx(TableCell, { className: "text-right font-semibold text-blue-600", children: product.count }), _jsx(TableCell, { className: "text-right font-semibold text-green-700", children: formatCurrency(product.totalRevenue) })] }, product._id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, className: "text-center py-8 text-gray-500", children: "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u b\u00E1n h\u00E0ng" }) })) })] }) }) })] }) })] }), _jsx("style", { children: `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Smooth transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth hover effects */
        button {
          transition: all 0.3s ease;
        }

        button:active {
          transform: scale(0.98);
        }

        /* Table row smooth hover */
        tbody tr {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        tbody tr:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }

        /* Input focus animation */
        input {
          transition: all 0.3s ease;
        }

        input:focus {
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
      ` })] }));
};
// Component StatCard - Giống Dashboard
const StatCard = ({ title, value, icon, color, }) => {
    const colorMap = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        emerald: 'bg-emerald-100 text-emerald-600',
    };
    return (_jsxs(Card, { className: "p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer hover:-translate-y-1 border", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 transition-colors duration-300", children: title }), _jsx("div", { className: `p-2 transition-all duration-300 ${colorMap[color]} rounded-lg`, children: icon })] }), _jsx("p", { className: "text-2xl font-bold transition-colors duration-300", children: value })] }));
};
export default ReportPage;
