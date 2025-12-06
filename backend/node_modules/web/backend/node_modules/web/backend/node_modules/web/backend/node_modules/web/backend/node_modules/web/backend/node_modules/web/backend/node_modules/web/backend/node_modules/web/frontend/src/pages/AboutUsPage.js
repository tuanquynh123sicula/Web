import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { FaHandshake, FaTruckFast, FaTags, FaHeart } from "react-icons/fa6";
import Footer from "@/components/Footer";
export default function AboutUsPage() {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white min-h-[calc(100vh-4rem)] ml-56 pr-6 pt-20", children: [_jsxs(motion.section, { className: "text-center mb-16", initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "V\u1EC1 Ch\u00FAng T\u00F4i" }), _jsxs("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: ["Ch\u00E0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi", " ", _jsx("span", { className: "font-semibold text-blue-600", children: "TechHub" }), " \u2013 n\u01A1i mang \u0111\u1EBFn tr\u1EA3i nghi\u1EC7m mua s\u1EAFm \u0111i\u1EC7n t\u1EED tuy\u1EC7t v\u1EDDi nh\u1EA5t v\u1EDBi s\u1EA3n ph\u1EA9m ch\u1EA5t l\u01B0\u1EE3ng, gi\u00E1 c\u1EA3 c\u1EA1nh tranh v\u00E0 d\u1ECBch v\u1EE5 t\u1EADn t\u00E2m."] })] }), _jsxs(motion.section, { className: "grid md:grid-cols-2 gap-10 items-center mb-20", initial: { opacity: 0, x: -60 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("img", { src: "/banner/banner1.png", alt: "About us", className: "rounded-2xl shadow-md w-full object-cover" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "S\u1EE9 M\u1EC7nh C\u1EE7a Ch\u00FAng T\u00F4i" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: "T\u1EA1i TechHub, ch\u00FAng t\u00F4i kh\u00F4ng ch\u1EC9 b\u00E1n s\u1EA3n ph\u1EA9m \u2013 ch\u00FAng t\u00F4i mang \u0111\u1EBFn gi\u00E1 tr\u1ECB, ni\u1EC1m tin v\u00E0 tr\u1EA3i nghi\u1EC7m mua s\u1EAFm kh\u00E1c bi\u1EC7t..." })] })] }), _jsxs(motion.section, { className: "text-center mb-20", initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 }, children: [_jsx("h2", { className: "text-2xl font-semibold mb-10", children: "Gi\u00E1 Tr\u1ECB C\u1ED1t L\u00F5i C\u1EE7a Ch\u00FAng T\u00F4i" }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-8", children: [
                                    {
                                        icon: _jsx(FaHandshake, {}),
                                        title: "Uy Tín & Niềm Tin",
                                        desc: "Chúng tôi luôn đặt sự hài lòng và tin tưởng của khách hàng lên hàng đầu.",
                                    },
                                    {
                                        icon: _jsx(FaTruckFast, {}),
                                        title: "Giao Hàng Nhanh",
                                        desc: "Dịch vụ vận chuyển toàn quốc nhanh chóng và an toàn tuyệt đối.",
                                    },
                                    {
                                        icon: _jsx(FaTags, {}),
                                        title: "Giá Cả Hợp Lý",
                                        desc: "Cung cấp sản phẩm chất lượng với mức giá cạnh tranh nhất thị trường.",
                                    },
                                    {
                                        icon: _jsx(FaHeart, {}),
                                        title: "Tận Tâm Phục Vụ",
                                        desc: "Luôn đồng hành và hỗ trợ khách hàng 24/7 với tinh thần nhiệt huyết.",
                                    },
                                ].map((item, index) => (_jsxs(motion.div, { className: "bg-white shadow-sm rounded-2xl p-6 hover:shadow-md transition", whileHover: { scale: 1.05 }, children: [_jsx("div", { className: "text-blue-600 text-4xl mb-4 mx-auto", children: item.icon }), _jsx("h3", { className: "font-semibold text-lg mb-2", children: item.title }), _jsx("p", { className: "text-gray-600 text-sm", children: item.desc })] }, index))) })] })] }), _jsx(Footer, {})] }));
}
