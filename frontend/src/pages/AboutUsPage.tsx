import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaTruckFast, FaTags, FaHeart } from "react-icons/fa6";
import Footer from "@/components/Footer";

export default function AboutUsPage() {
  return (
    <>
      <div className="bg-white min-h-[calc(100vh-4rem)] ml-56 pr-6 pt-20">
        {/* About Section */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Về Chúng Tôi</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chào mừng bạn đến với{" "}
            <span className="font-semibold text-blue-600">TechZone</span> – nơi
            mang đến trải nghiệm mua sắm điện tử tuyệt vời nhất với sản phẩm
            chất lượng, giá cả cạnh tranh và dịch vụ tận tâm.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="grid md:grid-cols-2 gap-10 items-center mb-20"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/banner/banner1.png"
            alt="About us"
            className="rounded-2xl shadow-md w-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-gray-700 leading-relaxed">
              Tại TechZone, chúng tôi không chỉ bán sản phẩm – chúng tôi mang đến
              giá trị, niềm tin và trải nghiệm mua sắm khác biệt...
            </p>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-semibold mb-10">
            Giá Trị Cốt Lõi Của Chúng Tôi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHandshake />,
                title: "Uy Tín & Niềm Tin",
                desc: "Chúng tôi luôn đặt sự hài lòng và tin tưởng của khách hàng lên hàng đầu.",
              },
              {
                icon: <FaTruckFast />,
                title: "Giao Hàng Nhanh",
                desc: "Dịch vụ vận chuyển toàn quốc nhanh chóng và an toàn tuyệt đối.",
              },
              {
                icon: <FaTags />,
                title: "Giá Cả Hợp Lý",
                desc: "Cung cấp sản phẩm chất lượng với mức giá cạnh tranh nhất thị trường.",
              },
              {
                icon: <FaHeart />,
                title: "Tận Tâm Phục Vụ",
                desc: "Luôn đồng hành và hỗ trợ khách hàng 24/7 với tinh thần nhiệt huyết.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-md transition"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-blue-600 text-4xl mb-4 mx-auto">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ✅ Footer ra ngoài để không bị flexbox ảnh hưởng */}
      <Footer />
    </>
  );
}
