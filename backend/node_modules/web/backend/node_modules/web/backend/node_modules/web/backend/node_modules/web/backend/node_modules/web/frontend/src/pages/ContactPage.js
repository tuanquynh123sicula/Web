import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
const contactSchema = z.object({
    name: z.string().min(2, "Vui lòng nhập tên (ít nhất 2 ký tự)"),
    email: z.string().email("Email không hợp lệ"),
    subject: z.string().min(3, "Chủ đề quá ngắn"),
    message: z.string().min(10, "Nội dung quá ngắn"),
});
export default function ContactPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" },
    });
    async function onSubmit(data) {
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            reset();
        }
        catch (err) {
            console.error("Lỗi gửi form liên hệ", err);
        }
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "min-h-screen bg-white pl-40 pr-10 pt-20 pb-10 overflow-hidden", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "max-w-7xl mx-auto", children: [_jsxs(motion.header, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 }, className: "mb-8 text-center", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-gray-900", children: "Li\u00EAn h\u1EC7 v\u1EDBi ch\u00FAng t\u00F4i" }), _jsx("p", { className: "mt-2 text-gray-600 max-w-2xl mx-auto", children: "H\u00E3y g\u1EEDi cho ch\u00FAng t\u00F4i c\u00E2u h\u1ECFi, g\u00F3p \u00FD ho\u1EB7c y\u00EAu c\u1EA7u h\u1ED7 tr\u1EE3 \u2014 ch\u00FAng t\u00F4i s\u1EBD ph\u1EA3n h\u1ED3i trong v\u00F2ng 24 gi\u1EDD l\u00E0m vi\u1EC7c." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx(motion.aside, { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.15 }, className: "space-y-6", children: [
                                        {
                                            title: "Hỗ trợ khách hàng",
                                            content: (_jsxs(_Fragment, { children: [_jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Hotline:", " ", _jsx("a", { href: "tel:+84123456789", className: "font-medium text-indigo-600 hover:underline", children: "+84 123 456 789" })] }), _jsxs("p", { className: "mt-1 text-sm text-gray-600", children: ["Email:", " ", _jsx("a", { href: "mailto:support@techhub.com", className: "font-medium text-indigo-600 hover:underline", children: "support@techhub.com" })] })] })),
                                        },
                                        {
                                            title: "Giờ làm việc",
                                            content: (_jsxs(_Fragment, { children: [_jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Th\u1EE9 2 - Th\u1EE9 6: 08:30 \u2014 18:00" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Th\u1EE9 7: 09:00 \u2014 13:00" })] })),
                                        },
                                        {
                                            title: "Địa chỉ",
                                            content: _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "125/9 Nguy\u1EC5n C\u1EEDu V\u00E2n, P.17, Q.B\u00ECnh Th\u1EA1nh, TP.HCM" }),
                                        },
                                    ].map((item, index) => (_jsxs(motion.div, { whileHover: { scale: 1.03, y: -2 }, transition: { type: "spring", stiffness: 200 }, className: "rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: item.title }), item.content] }, index))) }), _jsxs(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.2 }, className: "lg:col-span-2 space-y-6", children: [_jsxs(motion.form, { onSubmit: handleSubmit(onSubmit), initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.3 }, className: "rounded-2xl bg-white p-8 shadow-lg", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                                                        { label: "Họ & tên", field: "name", placeholder: "Nguyễn Văn A" },
                                                        { label: "Email", field: "email", placeholder: "email@domain.com", type: "email" },
                                                        { label: "Chủ đề", field: "subject", placeholder: "Ví dụ: Vấn đề đơn hàng #1234", span: 2 },
                                                        { label: "Nội dung", field: "message", placeholder: "Mô tả chi tiết vấn đề hoặc câu hỏi của bạn", span: 2, textarea: true },
                                                    ].map(({ label, field, placeholder, type, span, textarea }) => (_jsxs(motion.label, { className: `flex flex-col ${span === 2 ? "md:col-span-2" : ""}`, initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, viewport: { once: true }, children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: label }), textarea ? (_jsx(motion.textarea, { ...register(field), "aria-invalid": errors[field] ? "true" : "false", whileFocus: { scale: 1.01 }, transition: { duration: 0.2 }, className: `mt-2 min-h-[140px] rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors[field] ? "border-red-300" : "border-gray-200"}`, placeholder: placeholder })) : (_jsx(motion.input, { ...register(field), "aria-invalid": errors[field] ? "true" : "false", type: type || "text", whileFocus: { scale: 1.01 }, transition: { duration: 0.2 }, className: `mt-2 rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors[field] ? "border-red-300" : "border-gray-200"}`, placeholder: placeholder })), errors[field] && (_jsx("span", { role: "alert", className: "mt-1 text-red-600 text-sm", children: errors[field]?.message }))] }, field))) }), _jsxs(motion.div, { className: "mt-6 flex items-center justify-between", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.4 }, children: [_jsx("div", { className: "text-sm text-gray-500", children: "Ch\u00FAng t\u00F4i t\u00F4n tr\u1ECDng quy\u1EC1n ri\u00EAng t\u01B0 c\u1EE7a b\u1EA1n. Th\u00F4ng tin ch\u1EC9 d\u00F9ng \u0111\u1EC3 ph\u1EA3n h\u1ED3i." }), _jsx(motion.button, { type: "submit", whileHover: { scale: 1.05 }, whileTap: { scale: 0.97 }, disabled: isSubmitting, className: "inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:shadow-lg disabled:opacity-60 transition-all", children: isSubmitting ? "Đang gửi..." : "Gửi liên hệ" })] }), isSubmitSuccessful && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-md", children: "C\u1EA3m \u01A1n \u2014 ch\u00FAng t\u00F4i \u0111\u00E3 nh\u1EADn \u0111\u01B0\u1EE3c th\u00F4ng tin c\u1EE7a b\u1EA1n v\u00E0 s\u1EBD li\u00EAn h\u1EC7 s\u1EDBm." }))] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.3 }, whileHover: { scale: 1.01 }, className: "rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all", children: _jsx("iframe", { title: "company-location", className: "w-full h-64 md:h-80 border-0", src: "https://www.google.com/maps?q=HCM&output=embed", loading: "lazy" }) }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 0.35 }, className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 250 }, className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 rounded-full bg-indigo-50", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: _jsx("path", { d: "M2 12C2 7.58172 5.58172 4 10 4H14C18.4183 4 22 7.58172 22 12C22 16.4183 18.4183 20 14 20H10C5.58172 20 2 16.4183 2 12Z", stroke: "#6366F1", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "An to\u00E0n thanh to\u00E1n" }), _jsx("p", { className: "font-medium", children: "B\u1EA3o m\u1EADt SSL \u00B7 M\u00E3 h\u00F3a d\u1EEF li\u1EC7u" })] })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["B\u1EA1n c\u1EA7n h\u1ED7 tr\u1EE3 nhanh? G\u1ECDi ngay:", " ", _jsx("a", { href: "tel:+84123456789", className: "font-semibold text-indigo-600 hover:underline", children: "+84 123 456 789" })] })] })] })] })] }) }), _jsx(Footer, {})] }));
}
