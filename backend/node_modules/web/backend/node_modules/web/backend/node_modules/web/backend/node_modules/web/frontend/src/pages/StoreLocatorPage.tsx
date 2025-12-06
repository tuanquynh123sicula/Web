import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaClock, FaDirections } from "react-icons/fa";
import Footer from "@/components/Footer";


type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  hours: string; 
  lat: number;
  lng: number;
  image?: string;
};

const MOCK_STORES: Store[] = [
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
  const [cityFilter, setCityFilter] = useState<string | "">("");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // extract cities
  const cities = useMemo(() => {
    const s = Array.from(new Set(MOCK_STORES.map((x) => x.city)));
    return ["", ...s];
  }, []);

  // mock "open now" function — in production compute from current time + store schedule
  function isOpenNow(store: Store) {
    if (!openNowOnly) return true;
    // very naive: treat stores with opening hour before 12 as open
    return Number(store.hours.split(":")[0]) < 12 || true;
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_STORES.filter((s) => {
      if (cityFilter && s.city !== cityFilter) return false;
      if (!isOpenNow(s)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    });
  }, [query, cityFilter, openNowOnly]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pl-40 pr-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Hệ thống cửa hàng
            </h1>
            <p className="text-gray-600 mt-2">Tìm cửa hàng TechHub gần bạn — xem giờ mở cửa, địa chỉ và chỉ đường.</p>
          </motion.header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: controls + list */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
                <label className="block text-sm font-medium text-gray-700">Tìm kiếm</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tên, địa chỉ hoặc thành phố"
                    className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 hover:border-indigo-300"
                  />
                  <button
                    onClick={() => { setQuery(""); setCityFilter(""); setOpenNowOnly(false); setSelectedStore(null); }}
                    className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Reset"
                  >Làm mới</button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:border-indigo-300"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c || "Tất cả thành phố"}</option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-300">
                    <input 
                      type="checkbox" 
                      checked={openNowOnly} 
                      onChange={(e) => setOpenNowOnly(e.target.checked)}
                      className="cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-sm">Đang mở</span>
                  </label>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Kết quả ({filtered.length})</h3>
                  <div className="mt-3 space-y-3 max-h-[60vh] overflow-auto">
                    {filtered.map((s, idx) => (
                      <motion.button
                        key={s.id}
                        onClick={() => setSelectedStore(s)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left rounded-lg p-4 border transition-all duration-300 ${
                          selectedStore?.id === s.id 
                            ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{s.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{s.address}</p>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                              <FaClock className="text-indigo-500" />
                              {s.hours}
                            </p>
                          </div>
                          <div className="text-right">
                            <a 
                              href={`tel:${s.phone}`} 
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Gọi
                            </a>
                            <div className="text-xs text-gray-400 mt-1">{s.city}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}

                    {filtered.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-500 text-center py-8"
                      >
                        Không tìm thấy cửa hàng phù hợp.
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Map + details */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Map embed: center on selected store if any (Google Maps with query) */}
                <iframe
                  key={selectedStore ? selectedStore.id : 'all'}
                  title="store-map"
                  className="w-full h-96 border-0"
                  src={
                    selectedStore
                      ? `https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&z=15&output=embed`
                      : `https://www.google.com/maps?q=Vietnam&z=5&output=embed`
                  }
                  loading="lazy"
                />
              </motion.div>

              {selectedStore ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <motion.img 
                      src={selectedStore.image || '/stores/placeholder.jpg'} 
                      alt={selectedStore.name} 
                      className="w-36 h-24 object-cover rounded-md shadow-md"
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedStore.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{selectedStore.address} · {selectedStore.city}</p>
                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <motion.a 
                          href={`tel:${selectedStore.phone}`} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaPhoneAlt /> Gọi
                        </motion.a>
                        <motion.a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaDirections /> Chỉ đường
                        </motion.a>
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                          <FaClock className="text-indigo-500" /> {selectedStore.hours}
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                        Bạn có thể đến trực tiếp cửa hàng để trải nghiệm sản phẩm. Nhân viên tại cửa hàng sẽ hỗ trợ bạn tra cứu hàng tồn kho và áp dụng khuyến mãi.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Các cửa hàng nổi bật</h3>
                  <p className="text-sm text-gray-600 mt-2">Chọn một cửa hàng từ danh sách bên trái để xem chi tiết và chỉ đường.</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    {MOCK_STORES.slice(0, 4).map((s, idx) => (
                      <motion.div 
                        key={s.id} 
                        className="rounded-lg p-4 border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        onClick={() => setSelectedStore(s)}
                      >
                        <h4 className="font-semibold text-gray-900">{s.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{s.address}</p>
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <FaClock className="text-indigo-500" /> {s.hours}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="text-center text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Bản đồ là nội dung nhúng từ Google Maps. Thay đổi vị trí bằng cách chọn cửa hàng.
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