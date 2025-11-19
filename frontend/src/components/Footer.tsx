import { motion } from "framer-motion"
import { FaFacebook, FaInstagram, FaYoutube, FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa"
import { Link } from "react-router-dom"

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

  return (
    <footer className="bg-gray-900 text-gray-300 w-screen -mx-[calc(50vw-50%)] mb-0 border-t border-gray-700"> 
      <div className="w-full px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-7xl mx-auto">
          
          {/* Cột 1: Thông tin công ty & Follow Us (Đã gộp) */}
          <div>
            <img
              src="/logo/logo1.png"
              alt="Logo"
              className="h-12 mb-4"
            />
            <h3 className="font-bold text-lg flex items-center gap-2 text-white transition-colors duration-200">
              <FaHome /> CÔNG TY TNHH TECHHUB
            </h3>
            <p className="text-sm mt-2 leading-relaxed text-gray-400">
              MST: 0316098640 <br />
              Địa chỉ: 125/9 Nguyễn Cửu Vân, P.17, Q.Bình Thạnh, TP.HCM
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
                <FaPhoneAlt /> 0934 136 198
              </p>
              <p className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
                <FaEnvelope /> contact@techhub.com
              </p>
            </div>

                {/* FOLLOW US (Gộp từ cột 4 cũ) */}
                <h3 className="font-semibold text-lg mt-6 mb-4 text-white">
                    FOLLOW US
                </h3>
                <div className="flex gap-4">
                    {[
                       { Icon: FaFacebook, href: "https://facebook.com/techhub" },
                       { Icon: FaInstagram, href: "https://instagram.com/techhub" },
                       { Icon: FaYoutube, href: "https://youtube.com/techhub" },
                    ].map((item, index) => (
                       <motion.a
                           key={index}
                           href={item.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           whileHover={{ scale: 1.2, rotate: 5, color: "#fff" }}
                           transition={{ type: "spring", stiffness: 300 }}
                           className="text-2xl text-gray-400 hover:text-white transition duration-200"
                       >
                           <item.Icon />
                       </motion.a>
                    ))}
                </div>
          </div>

          {/* Cột 2: Dịch vụ khách hàng */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">DỊCH VỤ KHÁCH HÀNG</h3>
            <ul className="space-y-2">
              {[
                { title: "Chính sách đổi trả", href: "#" },
                { title: "Chính sách bảo hành", href: "#" },
                { title: "Chính sách bảo mật", href: "#" },
                { title: "Hướng dẫn mua hàng", href: "#" },
                { title: "Chính sách giao hàng", href: "#" },
                { title: "Hướng dẫn thanh toán", href: "#" },
                { title: "Chính sách kiểm hàng", href: "#" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 8, color: "#fff" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <a href={item.href} className="cursor-pointer hover:text-white text-gray-400 transition-colors duration-200">
                    {item.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Danh mục sản phẩm */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">DANH MỤC SẢN PHẨM</h3>
            <ul className="space-y-2">
              {[
                { title: "Tất cả sản phẩm", href: "/products" },
                { title: "Điện thoại", href: "/products?category=Phone" },
                { title: "Laptop", href: "/products?category=Laptop" },
                { title: "Phụ kiện", href: "/products?category=Accessories" },
                { title: "iPhone", href: "/products?category=Apple" },
                { title: "Samsung", href: "/products?category=Samsung" },
                { title: "Xiaomi", href: "/products?category=Xiaomi" },
                { title: "Honor", href: "/products?category=Honor" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 8, color: "#fff" }} 
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link to={item.href} className="cursor-pointer hover:text-white text-gray-400 transition-colors duration-200">
                    {item.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Thanh toán & Vận chuyển (MỚI) */}
          <div className="flex flex-col items-center md:items-start">
            
                {/* PHƯƠNG THỨC THANH TOÁN */}
            <h3 className="font-semibold text-lg mb-4 text-white text-center md:text-left">
              PHƯƠNG THỨC THANH TOÁN
            </h3>
            <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start max-w-xs">
              {PAYMENT_LOGOS.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-10 border border-gray-700 bg-white p-1 shadow-md cursor-pointer flex items-center justify-center transition"
                >
                  <img src={item.img} alt={item.name} className="w-full h-auto object-contain" />
                </motion.div>
              ))}
            </div>

                {/* ĐƠN VỊ VẬN CHUYỂN */}
                <h3 className="font-semibold text-lg mb-4 text-white text-center md:text-left">
                    ĐƠN VỊ VẬN CHUYỂN
                </h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start max-w-xs">
              {SHIPPING_LOGOS.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-10 border border-gray-700 bg-white p-1 shadow-md cursor-pointer flex items-center justify-center transition"
                >
                  <img src={item.img} alt={item.name} className="w-full h-auto object-contain" />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Dòng cuối - Đảm bảo vuông góc và nền đen */}
      <div className="text-center text-gray-400 text-sm border-t border-gray-700 py-6 w-screen -mx-[calc(50vw-50%)] bg-black m-0">
        © 2025 by TECHHUB. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer