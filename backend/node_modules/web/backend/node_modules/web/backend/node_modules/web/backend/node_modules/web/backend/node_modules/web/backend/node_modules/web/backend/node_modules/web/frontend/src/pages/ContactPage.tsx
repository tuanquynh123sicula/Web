import React from "react";
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

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      reset();
    } catch (err) {
      console.error("Lỗi gửi form liên hệ", err);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white pl-40 pr-10 pt-20 pb-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Liên hệ với chúng tôi
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Hãy gửi cho chúng tôi câu hỏi, góp ý hoặc yêu cầu hỗ trợ — chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái: Thông tin liên hệ */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-6"
            >
              {[
                {
                  title: "Hỗ trợ khách hàng",
                  content: (
                    <>
                      <p className="mt-2 text-sm text-gray-600">
                        Hotline:{" "}
                        <a href="tel:+84123456789" className="font-medium text-indigo-600 hover:underline">
                          +84 123 456 789
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Email:{" "}
                        <a href="mailto:support@techhub.com" className="font-medium text-indigo-600 hover:underline">
                          support@techhub.com
                        </a>
                      </p>
                    </>
                  ),
                },
                {
                  title: "Giờ làm việc",
                  content: (
                    <>
                      <p className="mt-2 text-sm text-gray-600">Thứ 2 - Thứ 6: 08:30 — 18:00</p>
                      <p className="mt-1 text-sm text-gray-600">Thứ 7: 09:00 — 13:00</p>
                    </>
                  ),
                },
                {
                  title: "Địa chỉ",
                  content: <p className="mt-2 text-sm text-gray-600">125/9 Nguyễn Cửu Vân, P.17, Q.Bình Thạnh, TP.HCM</p>,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.content}
                </motion.div>
              ))}
            </motion.aside>

            {/* Cột phải: Form + bản đồ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="rounded-2xl bg-white p-8 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Họ & tên", field: "name", placeholder: "Nguyễn Văn A" },
                    { label: "Email", field: "email", placeholder: "email@domain.com", type: "email" },
                    { label: "Chủ đề", field: "subject", placeholder: "Ví dụ: Vấn đề đơn hàng #1234", span: 2 },
                    { label: "Nội dung", field: "message", placeholder: "Mô tả chi tiết vấn đề hoặc câu hỏi của bạn", span: 2, textarea: true },
                  ].map(({ label, field, placeholder, type, span, textarea }) => (
                    <motion.label
                      key={field}
                      className={`flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      {textarea ? (
                        <motion.textarea
                          {...register(field as keyof ContactFormValues)}
                          aria-invalid={errors[field as keyof ContactFormValues] ? "true" : "false"}
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          className={`mt-2 min-h-[140px] rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                            errors[field as keyof ContactFormValues] ? "border-red-300" : "border-gray-200"
                          }`}
                          placeholder={placeholder}
                        />
                      ) : (
                        <motion.input
                          {...register(field as keyof ContactFormValues)}
                          aria-invalid={errors[field as keyof ContactFormValues] ? "true" : "false"}
                          type={type || "text"}
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          className={`mt-2 rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                            errors[field as keyof ContactFormValues] ? "border-red-300" : "border-gray-200"
                          }`}
                          placeholder={placeholder}
                        />
                      )}
                      {errors[field as keyof ContactFormValues] && (
                        <span role="alert" className="mt-1 text-red-600 text-sm">
                          {errors[field as keyof ContactFormValues]?.message}
                        </span>
                      )}
                    </motion.label>
                  ))}
                </div>

                <motion.div
                  className="mt-6 flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-sm text-gray-500">
                    Chúng tôi tôn trọng quyền riêng tư của bạn. Thông tin chỉ dùng để phản hồi.
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:shadow-lg disabled:opacity-60 transition-all"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
                  </motion.button>
                </motion.div>

                {isSubmitSuccessful && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-md"
                  >
                    Cảm ơn — chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ sớm.
                  </motion.p>
                )}
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <iframe
                  title="company-location"
                  className="w-full h-64 md:h-80 border-0"
                  src="https://www.google.com/maps?q=HCM&output=embed"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-3 rounded-full bg-indigo-50">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M2 12C2 7.58172 5.58172 4 10 4H14C18.4183 4 22 7.58172 22 12C22 16.4183 18.4183 20 14 20H10C5.58172 20 2 16.4183 2 12Z"
                        stroke="#6366F1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">An toàn thanh toán</p>
                    <p className="font-medium">Bảo mật SSL · Mã hóa dữ liệu</p>
                  </div>
                </motion.div>

                <div className="text-sm text-gray-600">
                  Bạn cần hỗ trợ nhanh? Gọi ngay:{" "}
                  <a href="tel:+84123456789" className="font-semibold text-indigo-600 hover:underline">
                    +84 123 456 789
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* ✅ Footer ra ngoài */}
      <Footer />
    </>
  );
}
