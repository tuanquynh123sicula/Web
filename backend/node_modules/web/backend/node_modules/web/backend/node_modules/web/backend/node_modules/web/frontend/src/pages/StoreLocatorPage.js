import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaClock, FaDirections } from "react-icons/fa";
import Footer from "@/components/Footer";
const MOCK_STORES = [
    {
        id: "s1",
        name: "TechHub - Nguyễn Cư Trinh",
        address: "116 Lê Lai, Quận 1, TP. HCM",
        city: "Hồ Chí Minh",
        phone: "+84 934 136 198",
        hours: "08:30 - 18:30",
        lat: 10.773, lng: 106.695,
        image: "/logo/logo.jpg",
    },
    {
        id: "s2",
        name: "TechHub - Lý Tự Trọng",
        address: "26 Lý Tự Trọng, Quận 1, TP. HCM",
        city: "Hồ Chí Minh",
        phone: "+84 912 345 678",
        hours: "09:00 - 19:00",
        lat: 10.7739, lng: 106.692,
        image: "/logo/logo.jpg",
    },
    {
        id: "s3",
        name: "TechHub - Hà Nội Center",
        address: "Số 123, Đường ABC, Ba Đình, Hà Nội",
        city: "Hà Nội",
        phone: "+84 123 456 789",
        hours: "08:30 - 17:30",
        lat: 21.033, lng: 105.85,
        image: "/logo/logo.jpg",
    },
    {
        id: "s4",
        name: "TechHub - Đà Nẵng",
        address: "56 Hải Phòng, Q. Hải Châu, Đà Nẵng",
        city: "Đà Nẵng",
        phone: "+84 234 567 890",
        hours: "09:00 - 18:00",
        lat: 16.054, lng: 108.202,
        image: "/logo/logo.jpg",
    },
];
export default function StoreLocatorPage() {
    const [query, setQuery] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [openNowOnly, setOpenNowOnly] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    // extract cities
    const cities = useMemo(() => {
        const s = Array.from(new Set(MOCK_STORES.map((x) => x.city)));
        return ["", ...s];
    }, []);
    // mock "open now" function — in production compute from current time + store schedule
    function isOpenNow(store) {
        if (!openNowOnly)
            return true;
        // very naive: treat stores with opening hour before 12 as open
        return Number(store.hours.split(":")[0]) < 12 || true;
    }
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return MOCK_STORES.filter((s) => {
            if (cityFilter && s.city !== cityFilter)
                return false;
            if (!isOpenNow(s))
                return false;
            if (!q)
                return true;
            return (s.name.toLowerCase().includes(q) ||
                s.address.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q));
        });
    }, [query, cityFilter, openNowOnly]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pl-40 pr-6 pt-20 pb-16", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "max-w-7xl mx-auto", children: [_jsxs(motion.header, { className: "mb-8", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600", children: "H\u1EC7 th\u1ED1ng c\u1EEDa h\u00E0ng" }), _jsx("p", { className: "text-gray-600 mt-2", children: "T\u00ECm c\u1EEDa h\u00E0ng TechHub g\u1EA7n b\u1EA1n \u2014 xem gi\u1EDD m\u1EDF c\u1EEDa, \u0111\u1ECBa ch\u1EC9 v\u00E0 ch\u1EC9 \u0111\u01B0\u1EDDng." })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsx(motion.div, { className: "lg:col-span-1", initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.3 }, children: _jsxs("div", { className: "rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "T\u00ECm ki\u1EBFm" }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "T\u00EAn, \u0111\u1ECBa ch\u1EC9 ho\u1EB7c th\u00E0nh ph\u1ED1", className: "flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 hover:border-indigo-300" }), _jsx("button", { onClick: () => { setQuery(""); setCityFilter(""); setOpenNowOnly(false); setSelectedStore(null); }, className: "px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95", title: "Reset", children: "L\u00E0m m\u1EDBi" })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [_jsx("select", { value: cityFilter, onChange: (e) => setCityFilter(e.target.value), className: "rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:border-indigo-300", children: cities.map((c) => (_jsx("option", { value: c, children: c || "Tất cả thành phố" }, c))) }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-300", children: [_jsx("input", { type: "checkbox", checked: openNowOnly, onChange: (e) => setOpenNowOnly(e.target.checked), className: "cursor-pointer transition-transform duration-300 hover:scale-110" }), _jsx("span", { className: "text-sm", children: "\u0110ang m\u1EDF" })] })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["K\u1EBFt qu\u1EA3 (", filtered.length, ")"] }), _jsxs("div", { className: "mt-3 space-y-3 max-h-[60vh] overflow-auto", children: [filtered.map((s, idx) => (_jsx(motion.button, { onClick: () => setSelectedStore(s), initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: idx * 0.1 }, whileHover: { scale: 1.03, y: -2 }, whileTap: { scale: 0.98 }, className: `w-full text-left rounded-lg p-4 border transition-all duration-300 ${selectedStore?.id === s.id
                                                                    ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                                                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'}`, children: _jsxs("div", { className: "flex justify-between items-start gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300", children: s.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: s.address }), _jsxs("p", { className: "text-sm text-gray-500 mt-2 flex items-center gap-2", children: [_jsx(FaClock, { className: "text-indigo-500" }), s.hours] })] }), _jsxs("div", { className: "text-right", children: [_jsx("a", { href: `tel:${s.phone}`, className: "text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300", onClick: (e) => e.stopPropagation(), children: "G\u1ECDi" }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: s.city })] })] }) }, s.id))), filtered.length === 0 && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-sm text-gray-500 text-center py-8", children: "Kh\u00F4ng t\u00ECm th\u1EA5y c\u1EEDa h\u00E0ng ph\u00F9 h\u1EE3p." }))] })] })] }) }), _jsxs(motion.div, { className: "lg:col-span-2 space-y-6", initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.4 }, children: [_jsx(motion.div, { className: "rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 }, whileHover: { scale: 1.01 }, children: _jsx("iframe", { title: "store-map", className: "w-full h-96 border-0", src: selectedStore
                                                    ? `https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&z=15&output=embed`
                                                    : `https://www.google.com/maps?q=Vietnam&z=5&output=embed`, loading: "lazy" }, selectedStore ? selectedStore.id : 'all') }), selectedStore ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500", children: _jsxs("div", { className: "flex items-start gap-6", children: [_jsx(motion.img, { src: selectedStore.image || '/stores/placeholder.jpg', alt: selectedStore.name, className: "w-36 h-24 object-cover rounded-md shadow-md", whileHover: { scale: 1.05, rotate: 1 }, transition: { duration: 0.3 } }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900", children: selectedStore.name }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [selectedStore.address, " \u00B7 ", selectedStore.city] }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-3 items-center", children: [_jsxs(motion.a, { href: `tel:${selectedStore.phone}`, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300", whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, children: [_jsx(FaPhoneAlt, {}), " G\u1ECDi"] }), _jsxs(motion.a, { href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300", whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, children: [_jsx(FaDirections, {}), " Ch\u1EC9 \u0111\u01B0\u1EDDng"] }), _jsxs("div", { className: "inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg", children: [_jsx(FaClock, { className: "text-indigo-500" }), " ", selectedStore.hours] })] }), _jsx("p", { className: "mt-4 text-sm text-gray-700 leading-relaxed", children: "B\u1EA1n c\u00F3 th\u1EC3 \u0111\u1EBFn tr\u1EF1c ti\u1EBFp c\u1EEDa h\u00E0ng \u0111\u1EC3 tr\u1EA3i nghi\u1EC7m s\u1EA3n ph\u1EA9m. Nh\u00E2n vi\u00EAn t\u1EA1i c\u1EEDa h\u00E0ng s\u1EBD h\u1ED7 tr\u1EE3 b\u1EA1n tra c\u1EE9u h\u00E0ng t\u1ED3n kho v\u00E0 \u00E1p d\u1EE5ng khuy\u1EBFn m\u00E3i." })] })] }) })) : (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "C\u00E1c c\u1EEDa h\u00E0ng n\u1ED5i b\u1EADt" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Ch\u1ECDn m\u1ED9t c\u1EEDa h\u00E0ng t\u1EEB danh s\u00E1ch b\u00EAn tr\u00E1i \u0111\u1EC3 xem chi ti\u1EBFt v\u00E0 ch\u1EC9 \u0111\u01B0\u1EDDng." }), _jsx("div", { className: "mt-4 grid sm:grid-cols-2 gap-4", children: MOCK_STORES.slice(0, 4).map((s, idx) => (_jsxs(motion.div, { className: "rounded-lg p-4 border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-300", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: idx * 0.1 }, whileHover: { scale: 1.03, y: -2 }, onClick: () => setSelectedStore(s), children: [_jsx("h4", { className: "font-semibold text-gray-900", children: s.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: s.address }), _jsxs("div", { className: "mt-2 text-xs text-gray-500 flex items-center gap-1", children: [_jsx(FaClock, { className: "text-indigo-500" }), " ", s.hours] })] }, s.id))) })] })), _jsx(motion.div, { className: "text-center text-xs text-gray-400", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.8, duration: 0.5 }, children: "B\u1EA3n \u0111\u1ED3 l\u00E0 n\u1ED9i dung nh\u00FAng t\u1EEB Google Maps. Thay \u0111\u1ED5i v\u1ECB tr\u00ED b\u1EB1ng c\u00E1ch ch\u1ECDn c\u1EEDa h\u00E0ng." })] })] })] }) }), _jsx(Footer, {})] }));
}
