import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
const sidebarItems = [
    { title: 'Trang chủ', href: '/' },
    { title: 'Về chúng tôi', href: '/about' },
    {
        title: 'Cửa hàng',
        href: '/products',
        children: [
            { title: 'Điện thoại', href: '/products?category=Phone' },
            { title: 'Máy tính xách tay', href: '/products?category=Laptop' },
            { title: 'Phụ kiện', href: '/products?category=Accessories' },
        ],
    },
    {
        title: 'Thương hiệu',
        href: '/products',
        children: [
            { title: 'Apple', href: '/products?category=Apple' },
            { title: 'Samsung', href: '/products?category=Samsung' },
            { title: 'Xiaomi', href: '/products?category=Xiaomi' },
            { title: 'Honor', href: '/products?category=Honor' },
        ],
    },
    { title: 'Bài viết', href: '/blogs' },
    { title: 'Liên hệ', href: '/contact' },
];
const dropdownVariants = {
    hidden: { opacity: 0, y: 6, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.16,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.03,
        },
    },
    exit: {
        opacity: 0,
        y: 6,
        scale: 0.98,
        transition: { duration: 0.12, ease: 'easeIn' },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};
const submenuVariants = {
    hidden: { opacity: 0, x: 8 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.15,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: { opacity: 0, x: 8, transition: { duration: 0.12 } },
};
// ...existing code...
export default function Sidebar() {
    const [openTopKey, setOpenTopKey] = useState(null);
    const [openChildKey, setOpenChildKey] = useState(null);
    return (_jsx("aside", { className: "fixed left-0 top-0 bottom-0 w-56", children: _jsxs("div", { className: "h-full flex flex-col", children: [_jsx(Link, { to: "/", className: "flex items-center gap-3 px-10 py-4", children: _jsx("img", { src: "/logo/logo.jpg", alt: "logo", className: "w-20 h-auto object-contain hover:scale-105 transition-transform duration-300" }) }), _jsx("nav", { className: "px-4 py-4 flex-1", children: _jsx("ul", { className: "space-y-3 text-sm font-medium", children: sidebarItems.map((item) => {
                            const isOpenTop = openTopKey === item.title;
                            return (_jsxs("li", { className: "relative", onMouseEnter: () => item.children && setOpenTopKey(item.title), onMouseLeave: () => {
                                    if (item.children) {
                                        setOpenTopKey(null);
                                        setOpenChildKey(null);
                                    }
                                }, children: [_jsx(Link, { to: item.href, className: "block px-3 py-2  hover:bg-gray-100 transition-colors hover:scale-90 trasition-transform duration-900 rounded", "aria-expanded": !!item.children && isOpenTop, children: item.title }), _jsx(AnimatePresence, { children: item.children && isOpenTop && (_jsx(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: dropdownVariants, className: "absolute left-full top-0 ml-2 w-56 bg-white border shadow-lg ring-1 ring-black/5 z-40", children: _jsx("ul", { className: "p-3 space-y-2", children: item.children.map((c) => {
                                                    const hasGrand = !!c.children?.length;
                                                    const isOpenChild = openChildKey === c.title;
                                                    return (_jsxs(motion.li, { className: "relative", variants: itemVariants, onMouseEnter: () => hasGrand && setOpenChildKey(c.title), onMouseLeave: () => hasGrand && setOpenChildKey(null), children: [_jsxs(Link, { to: c.href, className: "flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 transition-colors", children: [_jsx("span", { children: c.title }), hasGrand && (_jsx(motion.span, { className: "text-gray-400", animate: { x: isOpenChild ? 2 : 0 }, transition: { duration: 0.15 }, children: "\u203A" }))] }), _jsx(AnimatePresence, { children: hasGrand && isOpenChild && (_jsx(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: submenuVariants, className: "absolute left-full top-0 ml-2 w-52 bg-white border rounded shadow-lg ring-1 ring-black/5 z-50", children: _jsx("ul", { className: "p-2 space-y-1", children: c.children.map((g) => (_jsx("li", { children: _jsx(Link, { to: g.href, className: "block px-2 py-1 rounded hover:bg-gray-100 transition-colors", children: g.title }) }, g.title))) }) })) })] }, c.title));
                                                }) }) })) })] }, item.title));
                        }) }) })] }) }));
}
