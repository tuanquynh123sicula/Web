import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
function Footer() {
    const PAYMENT_LOGOS = [
        { name: 'VNPAY', img: '/logo/vnpay.png' },
        { name: 'Visa', img: '/logo/visa.png' },
    ];
    const SHIPPING_LOGOS = [
        { name: 'SPX', img: '/logo/spx.png' },
        { name: 'Viettel Post', img: '/logo/viettelpost.png' },
        { name: 'J&T Express', img: '/logo/jnt.png' },
        { name: 'Ahamove', img: '/logo/ahamove.png' },
    ];
    return (_jsxs("footer", { className: "bg-gray-900 text-gray-300 w-screen -mx-[calc(50vw-50%)] mb-0 border-t border-gray-700", children: [_jsx("div", { className: "w-full px-6 md:px-16 py-12", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-10 max-w-7xl mx-auto", children: [_jsxs("div", { children: [_jsx("img", { src: "/logo/logo1.png", alt: "Logo", className: "h-12 mb-4" }), _jsxs("h3", { className: "font-bold text-lg flex items-center gap-2 text-white transition-colors duration-200", children: [_jsx(FaHome, {}), " C\u00D4NG TY TNHH TECHHUB"] }), _jsxs("p", { className: "text-sm mt-2 leading-relaxed text-gray-400", children: ["MST: 0316098640 ", _jsx("br", {}), "\u0110\u1ECBa ch\u1EC9: 125/9 Nguy\u1EC5n C\u1EEDu V\u00E2n, P.17, Q.B\u00ECnh Th\u1EA1nh, TP.HCM"] }), _jsxs("div", { className: "mt-4 space-y-2 text-sm", children: [_jsxs("p", { className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200", children: [_jsx(FaPhoneAlt, {}), " 0123 456 789"] }), _jsxs("p", { className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200", children: [_jsx(FaEnvelope, {}), " contact@techhub.com"] })] }), _jsx("h3", { className: "font-semibold text-lg mt-6 mb-4 text-white", children: "Theo d\u00F5i ch\u00FAng t\u00F4i" }), _jsx("div", { className: "flex gap-4", children: [
                                        { Icon: FaFacebook, href: "https://facebook.com/techhub" },
                                        { Icon: FaInstagram, href: "https://instagram.com/techhub" },
                                        { Icon: FaYoutube, href: "https://youtube.com/techhub" },
                                    ].map((item, index) => (_jsx(motion.a, { href: item.href, target: "_blank", rel: "noopener noreferrer", whileHover: { scale: 1.2, rotate: 5, color: "#fff" }, transition: { type: "spring", stiffness: 300 }, className: "text-2xl text-gray-400 hover:text-white transition duration-200", children: _jsx(item.Icon, {}) }, index))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg mb-4 text-white", children: "D\u1ECACH V\u1EE4 KH\u00C1CH H\u00C0NG" }), _jsx("ul", { className: "space-y-2", children: [
                                        { title: "Chính sách đổi trả", href: "#" },
                                        { title: "Chính sách bảo hành", href: "#" },
                                        { title: "Chính sách bảo mật", href: "#" },
                                        { title: "Hướng dẫn mua hàng", href: "#" },
                                        { title: "Chính sách giao hàng", href: "#" },
                                        { title: "Hướng dẫn thanh toán", href: "#" },
                                        { title: "Chính sách kiểm hàng", href: "#" },
                                    ].map((item, index) => (_jsx(motion.li, { whileHover: { x: 8, color: "#fff" }, transition: { type: "spring", stiffness: 200 }, children: _jsx("a", { href: item.href, className: "cursor-pointer hover:text-white text-gray-400 transition-colors duration-200", children: item.title }) }, index))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg mb-4 text-white", children: "DANH M\u1EE4C S\u1EA2N PH\u1EA8M" }), _jsx("ul", { className: "space-y-2", children: [
                                        { title: "Tất cả sản phẩm", href: "/products" },
                                        { title: "Điện thoại", href: "/products?category=Phone" },
                                        { title: "Laptop", href: "/products?category=Laptop" },
                                        { title: "Phụ kiện", href: "/products?category=Accessories" },
                                        { title: "iPhone", href: "/products?category=Apple" },
                                        { title: "Samsung", href: "/products?category=Samsung" },
                                        { title: "Xiaomi", href: "/products?category=Xiaomi" },
                                        { title: "Honor", href: "/products?category=Honor" },
                                    ].map((item, index) => (_jsx(motion.li, { whileHover: { x: 8, color: "#fff" }, transition: { type: "spring", stiffness: 200 }, children: _jsx(Link, { to: item.href, className: "cursor-pointer hover:text-white text-gray-400 transition-colors duration-200", children: item.title }) }, index))) })] }), _jsxs("div", { className: "flex flex-col items-center md:items-start", children: [_jsx("h3", { className: "font-semibold text-lg mb-4 text-white text-center md:text-left", children: "PH\u01AF\u01A0NG TH\u1EE8C THANH TO\u00C1N" }), _jsx("div", { className: "flex flex-wrap gap-3 mb-6 justify-center md:justify-start max-w-xs", children: PAYMENT_LOGOS.map((item, index) => (_jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, className: "w-16 h-10 border border-gray-700 bg-white p-1 shadow-md cursor-pointer flex items-center justify-center transition", children: _jsx("img", { src: item.img, alt: item.name, className: "w-full h-auto object-contain" }) }, index))) }), _jsx("h3", { className: "font-semibold text-lg mb-4 text-white text-center md:text-left", children: "\u0110\u01A0N V\u1ECA V\u1EACN CHUY\u1EC2N" }), _jsx("div", { className: "flex flex-wrap gap-3 justify-center md:justify-start max-w-xs", children: SHIPPING_LOGOS.map((item, index) => (_jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, className: "w-16 h-10 border border-gray-700 bg-white p-1 shadow-md cursor-pointer flex items-center justify-center transition", children: _jsx("img", { src: item.img, alt: item.name, className: "w-full h-auto object-contain" }) }, index))) })] })] }) }), _jsx("div", { className: "text-center text-gray-400 text-sm border-t border-gray-700 py-6 w-screen -mx-[calc(50vw-50%)] bg-black m-0", children: "\u00A9 2025 by TECHHUB. All rights reserved." })] }));
}
export default Footer;
