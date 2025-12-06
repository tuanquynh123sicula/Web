import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import { getPublicBlogs } from "@/api/adminApi";
const categories = ["Tất cả", "Đánh giá", "Tin tức", "Mẹo sử dụng", "So sánh"];
// 🆕 Mock data - Dùng ảnh thực từ public/images
const mockBlogs = [
    {
        _id: 'mock-1',
        title: 'Top 5 laptop gaming đáng mua nhất năm 2025',
        category: 'Đánh giá',
        description: 'Cùng điểm qua những mẫu laptop gaming được cộng đồng yêu thích nhất với cấu hình khủng và giá tương đối hợp lý.',
        content: 'Năm 2025 chứng kiến sự bùng nổ của laptop gaming với cấu hình khủng, màn hình tần số quét cao và thiết kế mỏng nhẹ...',
        image: '/images/laptop/macbookairm2_16gb_256gb_bac.jpg',
        date: '15/11/2025',
    },
    {
        _id: 'mock-2',
        title: 'Apple M4 Pro chính thức ra mắt – Hiệu năng vượt xa kỳ vọng',
        category: 'Tin tức',
        description: 'Apple vừa công bố thế hệ chip M4 Pro mới với hiệu năng tăng 40% so với M3, hứa hẹn sẽ thay đổi thị trường máy tính cá nhân.',
        content: 'Chip M4 Pro được trang bị 12 lõi CPU và 20 lõi GPU, mang lại hiệu suất xử lý video 4K mượt mà...',
        image: '/images/laptop/macbookairm2_16gb_256gb_trangvang.jpg',
        date: '14/11/2025',
    },
    {
        _id: 'mock-3',
        title: 'Mẹo bảo quản tai nghe không dây để kéo dài tuổi thọ',
        category: 'Mẹo sử dụng',
        description: 'Hướng dẫn chi tiết cách bảo quản tai nghe TWS để chúng hoạt động bền bỉ và hiệu suất không giảm theo thời gian.',
        content: 'Tai nghe không dây đang trở thành phụ kiện không thể thiếu, nhưng chúng cần được bảo quản cẩn thận...',
        image: '/images/phukien/tainghe/tai-nghe-tws-xiaomi-redmi-buds-6-251224-104719-335-600x600.jpg',
        date: '13/11/2025',
    },
    {
        _id: 'mock-4',
        title: 'Xu hướng smartphone 2025: AI và pin siêu khủng',
        category: 'Tin tức',
        description: 'Thị trường smartphone 2025 được dự báo sẽ tập trung vào AI tích hợp và công nghệ pin mới đột phá.',
        content: 'Các nhà sản xuất smartphone đang đồng loạt tích hợp các tính năng AI vào các thiết bị của họ...',
        image: '/images/iphone/ip17px_cam.jpg',
        date: '11/11/2025',
    },
    {
        _id: 'mock-5',
        title: 'Tai nghe không dây premium - So sánh chi tiết',
        category: 'So sánh',
        description: 'So sánh các dòng tai nghe Bluetooth cao cấp từ Samsung Galaxy Buds 3 Pro đến Oppo Enco Buds 3.',
        content: 'Những chiếc tai nghe không dây premium hiện nay cung cấp chất lượng âm thanh đỉnh cao...',
        image: '/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-pro-r630n-100724-082455-600x600-1-600x600.jpg',
        date: '10/11/2025',
    },
    {
        _id: 'mock-6',
        title: 'Sạc nhanh 100W - Công nghệ tương lai bây giờ',
        category: 'Đánh giá',
        description: 'Đánh giá chi tiết công nghệ sạc siêu nhanh 100W và tác động của nó lên pin smartphone.',
        content: 'Công nghệ sạc nhanh đã phát triển nhanh chóng trong những năm gần đây...',
        image: '/images/phukien/sacduphong/pin-sac-du-phong-25000mah-type-c-pd-qc-3-0-165w-anker-zolo-a1695-kem-cap-thumb-638942197395592306-600x600.jpg',
        date: '09/11/2025',
    },
];
export default function BlogPage() {
    const [blogs, setBlogs] = useState([...mockBlogs]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        loadBlogs();
    }, []);
    const loadBlogs = async () => {
        try {
            setIsLoading(true);
            const data = await getPublicBlogs();
            setBlogs([...mockBlogs, ...(data || [])]);
        }
        catch {
            setBlogs([...mockBlogs]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredPosts = blogs.filter((post) => (selectedCategory === "Tất cả" || post.category === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "min-h-screen bg-white pl-56 pr-6 pt-20 pb-10", children: [_jsx(Helmet, { children: _jsx("title", { children: "Blog - TECHHUB" }) }), _jsxs("div", { className: "max-w-7xl mx-auto text-center mb-12", children: [_jsx(motion.h2, { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-4xl font-bold text-gray-800 mb-4", children: "BLOG C\u00D4NG NGH\u1EC6" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "C\u1EADp nh\u1EADt xu h\u01B0\u1EDBng c\u00F4ng ngh\u1EC7, \u0111\u00E1nh gi\u00E1 s\u1EA3n ph\u1EA9m v\u00E0 m\u1EB9o s\u1EED d\u1EE5ng thi\u1EBFt b\u1ECB \u0111i\u1EC7n t\u1EED m\u1EDBi nh\u1EA5t." })] }), _jsxs("div", { className: "max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10", children: [_jsxs("div", { className: "flex items-center bg-white shadow rounded-full px-4 py-2 w-full md:w-1/2", children: [_jsx(FaSearch, { className: "text-gray-400 mr-2" }), _jsx("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm b\u00E0i vi\u1EBFt...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full focus:outline-none text-gray-700" })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-2", children: categories.map((cat) => (_jsx(motion.button, { whileHover: { scale: 1.1 }, onClick: () => setSelectedCategory(cat), className: `px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-200"}`, children: cat }, cat))) })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-10 max-w-7xl mx-auto", children: isLoading ? (_jsx("div", { className: "col-span-3 text-center py-20", children: _jsx("p", { className: "text-gray-500 text-lg animate-pulse", children: "\u0110ang t\u1EA3i b\u00E0i vi\u1EBFt..." }) })) : filteredPosts.length > 0 ? (filteredPosts.map((post, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, whileHover: { scale: 1.03 }, className: "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition", children: [_jsx(Link, { to: `/blog/${post._id || post.id}`, children: _jsx("img", { src: post.image.startsWith('http') ? post.image : post.image, alt: post.title, className: "w-full h-56 object-cover hover:scale-110 transition-transform duration-500", onError: (e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                                        } }) }), _jsxs("div", { className: "p-6 text-left", children: [_jsxs("span", { className: "text-xs uppercase text-blue-600 font-medium", children: [post.category, " \u2022 ", post.date] }), _jsx("h3", { className: "font-semibold text-xl mt-2 mb-2 text-gray-800 hover:text-blue-600 transition line-clamp-2", children: post.title }), _jsx("p", { className: "text-gray-600 line-clamp-3", children: post.description }), _jsx(Link, { to: `/blog/${post._id || post.id}`, className: "text-blue-500 mt-4 inline-block hover:text-blue-700 transition", children: "\u0110\u1ECDc th\u00EAm \u2192" })] })] }, post._id || post.id)))) : (_jsx("div", { className: "col-span-3 text-center text-gray-500 text-lg py-20", children: "Kh\u00F4ng t\u00ECm th\u1EA5y b\u00E0i vi\u1EBFt n\u00E0o ph\u00F9 h\u1EE3p." })) })] }), _jsx(Footer, {})] }));
}
