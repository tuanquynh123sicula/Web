import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAllProducts, getAllOrders, getAllUsers } from "@/api/adminApi";
export default function DashboardPage() {
    const [usersCount, setUsersCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            try {
                const [users, products, ordersData] = await Promise.all([getAllUsers(), getAllProducts(), getAllOrders()]);
                setUsersCount(Array.isArray(users) ? users.length : 0);
                setProductsCount(Array.isArray(products) ? products.length : 0);
                const ods = (ordersData ?? []);
                setOrders(ods);
                setRevenue(ods.reduce((sum, o) => sum + Number(o.totalPrice ?? 0), 0));
            }
            catch (err) {
                console.error("Error loading dashboard:", err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    const toDate = (d) => (d ? new Date(d) : new Date(0));
    const formatVND = (n) => `${Number(n).toLocaleString("vi-VN")} ₫`;
    // Doanh thu theo tháng (YYYY-MM) -> sort tăng dần
    const monthlyMap = orders.reduce((acc, o) => {
        const d = toDate(o.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + Number(o.totalPrice ?? 0);
        return acc;
    }, {});
    const chartData = Object.entries(monthlyMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, sales]) => ({
        name: new Date(`${key}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
        sales,
    }));
    const recentOrders = [...orders]
        .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
        .slice(0, 5);
    if (loading)
        return _jsx("div", { className: "text-center mt-20 text-muted-foreground animate-pulse", children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..." });
    return (_jsxs("div", { className: "space-y-8 p-6", children: [_jsx("style", { children: `
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-down {
          animation: slideInDown 0.6s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
      ` }), _jsxs("div", { className: "flex justify-between items-center animate-slide-in-down", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Admin Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: "T\u1ED5ng quan ho\u1EA1t \u0111\u1ED9ng kinh doanh" })] }), _jsx(Button, { onClick: () => window.location.reload(), className: "transition-all duration-300 hover:scale-105 active:scale-95", children: "L\u00E0m m\u1EDBi" })] }), _jsxs("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx("div", { className: "animate-slide-in-up", style: { animationDelay: "0.1s" }, children: _jsx(StatCard, { title: "Ng\u01B0\u1EDDi d\u00F9ng", value: usersCount, icon: _jsx(Users, {}), color: "blue" }) }), _jsx("div", { className: "animate-slide-in-up", style: { animationDelay: "0.2s" }, children: _jsx(StatCard, { title: "S\u1EA3n ph\u1EA9m", value: productsCount, icon: _jsx(Package, {}), color: "green" }) }), _jsx("div", { className: "animate-slide-in-up", style: { animationDelay: "0.3s" }, children: _jsx(StatCard, { title: "\u0110\u01A1n h\u00E0ng", value: orders.length, icon: _jsx(ShoppingCart, {}), color: "yellow" }) }), _jsx("div", { className: "animate-slide-in-up", style: { animationDelay: "0.4s" }, children: _jsx(StatCard, { title: "Doanh thu", value: formatVND(revenue), icon: _jsx(DollarSign, {}), color: "emerald" }) })] }), _jsxs(Card, { className: "shadow-md border animate-slide-in-up transition-all duration-500 hover:shadow-lg", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold", children: "Doanh thu theo th\u00E1ng" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(BarChart, { data: chartData, margin: { top: 20, right: 30, left: 10, bottom: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "name", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280", width: 90 }), _jsx(Tooltip, { formatter: (value) => formatVND(Number(value)), contentStyle: { transition: "all 0.3s ease" } }), _jsx(Bar, { dataKey: "sales", name: "Doanh thu", fill: "#3b82f6", radius: [0, 0, 0, 0] })] }) }) })] }), _jsxs(Card, { className: "shadow-md border animate-slide-in-up transition-all duration-500 hover:shadow-lg", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold", children: "\u0110\u01A1n h\u00E0ng g\u1EA7n \u0111\u00E2y" }) }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "text-gray-500 border-b bg-gray-50/50 transition-colors duration-300", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4 text-left font-medium", children: "Order ID" }), _jsx("th", { className: "py-3 px-4 text-left font-medium", children: "Date" }), _jsx("th", { className: "py-3 px-4 text-left font-medium", children: "User" }), _jsx("th", { className: "py-3 px-4 text-left font-medium", children: "Total" }), _jsx("th", { className: "py-3 px-4 text-left font-medium", children: "Status" })] }) }), _jsx("tbody", { children: recentOrders.map((o, idx) => (_jsxs("tr", { className: "border-b last:border-none transition-all duration-300 hover:bg-blue-50/50 cursor-pointer", style: { animationDelay: `${idx * 0.1}s` }, children: [_jsxs("td", { className: "py-3 px-4 transition-colors duration-300", children: [String(o._id).slice(0, 6), "..."] }), _jsx("td", { className: "py-3 px-4 transition-colors duration-300", children: o.createdAt ? toDate(o.createdAt).toLocaleDateString("vi-VN") : "-" }), _jsx("td", { className: "py-3 px-4 transition-colors duration-300", children: o.user?.name ?? "Unknown" }), _jsx("td", { className: "py-3 px-4 font-semibold transition-colors duration-300", children: formatVND(Number(o.totalPrice ?? 0)) }), _jsx("td", { className: "py-3 px-4", children: _jsx(StatusBadge, { order: o }) })] }, o._id))) })] }) }) })] })] }));
}
function StatCard({ title, value, icon, color, }) {
    const colorMap = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        emerald: "bg-emerald-100 text-emerald-600",
    };
    return (_jsxs(Card, { className: "p-4 border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer hover:-translate-y-1", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 transition-colors duration-300", children: title }), _jsx("div", { className: `p-2 transition-all duration-300 ${colorMap[color]}`, children: icon })] }), _jsx("p", { className: "text-2xl font-bold transition-colors duration-300", children: value })] }));
}
function StatusBadge({ order }) {
    const base = "px-2 py-1 text-xs font-medium transition-all duration-300 inline-block";
    const status = order.status ?? (order.isDelivered ? "delivered" : "pending");
    const map = {
        pending: { text: "Chờ xác nhận", cls: `${base} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:scale-110` },
        packing: { text: "Đang đóng gói", cls: `${base} bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-110` },
        shipping: { text: "Đang vận chuyển", cls: `${base} bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:scale-110` },
        delivered: { text: "Đã giao hàng", cls: `${base} bg-green-100 text-green-700 hover:bg-green-200 hover:scale-110` },
        canceled: { text: "Đã hủy", cls: `${base} bg-red-100 text-red-700 hover:bg-red-200 hover:scale-110` },
    };
    return _jsx("span", { className: map[status].cls, children: map[status].text });
}
