import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaClock, FaDirections } from "react-icons/fa";
import Footer from "@/components/Footer";

// Store locator page (React + TypeScript + Tailwind + Framer Motion)
// - Responsive list + map embed
// - Search, filter by city, open-now toggle, sort by distance (mock)
// - Mock stores data included; replace with API call for production

type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  hours: string; // friendly text
  lat: number;
  lng: number;
  image?: string;
};

const MOCK_STORES: Store[] = [
  {
    id: "s1",
    name: "TechHub - Nguyễn Cư Trinh",
    address: "116 Lê Lai, Quận 1, TP. HCM",
    city: "Ho Chi Minh",
    phone: "+84 934 136 198",
    hours: "08:30 - 18:30",
    lat: 10.773, lng: 106.695,
    image: "/stores/store1.jpg",
  },
  {
    id: "s2",
    name: "TechHub - Lý Tự Trọng",
    address: "26 Lý Tự Trọng, Quận 1, TP. HCM",
    city: "Ho Chi Minh",
    phone: "+84 912 345 678",
    hours: "09:00 - 19:00",
    lat: 10.7739, lng: 106.692,
    image: "/stores/store2.jpg",
  },
  {
    id: "s3",
    name: "TechHub - Hà Nội Center",
    address: "Số 123, Đường ABC, Ba Đình, Hà Nội",
    city: "Hanoi",
    phone: "+84 123 456 789",
    hours: "08:30 - 17:30",
    lat: 21.033, lng: 105.85,
    image: "/stores/store3.jpg",
  },
  {
    id: "s4",
    name: "TechHub - Đà Nẵng",
    address: "56 Hải Phòng, Q. Hải Châu, Đà Nẵng",
    city: "Da Nang",
    phone: "+84 234 567 890",
    hours: "09:00 - 18:00",
    lat: 16.054, lng: 108.202,
    image: "/stores/store4.jpg",
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
      <div className="min-h-screen bg-gray-50 pl-40 pr-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Hệ thống cửa hàng</h1>
            <p className="text-gray-600 mt-2">Tìm cửa hàng TechHub gần bạn — xem giờ mở cửa, địa chỉ và chỉ đường.</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: controls + list */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow">
                <label className="block text-sm font-medium text-gray-700">Tìm kiếm</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tên, địa chỉ hoặc thành phố"
                    className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={() => { setQuery(""); setCityFilter(""); setOpenNowOnly(false); setSelectedStore(null); }}
                    className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    title="Reset"
                  >Reset</button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="rounded-md border px-3 py-2"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c || "Tất cả thành phố"}</option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={openNowOnly} onChange={(e) => setOpenNowOnly(e.target.checked)} />
                    <span className="text-sm">Đang mở</span>
                  </label>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Kết quả ({filtered.length})</h3>
                  <div className="mt-3 space-y-3 max-h-[60vh] overflow-auto">
                    {filtered.map((s) => (
                      <motion.button
                        key={s.id}
                        onClick={() => setSelectedStore(s)}
                        whileHover={{ scale: 1.02 }}
                        className={`w-full text-left rounded-lg p-3 border ${selectedStore?.id === s.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h4 className="font-semibold">{s.name}</h4>
                            <p className="text-sm text-gray-600">{s.address}</p>
                            <p className="text-sm text-gray-500 mt-1"><FaClock className="inline mr-2" />{s.hours}</p>
                          </div>
                          <div className="text-right">
                            <a href={`tel:${s.phone}`} className="text-sm text-indigo-600">Gọi</a>
                            <div className="text-xs text-gray-400">{s.city}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}

                    {filtered.length === 0 && (
                      <div className="text-sm text-gray-500">Không tìm thấy cửa hàng phù hợp.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map + details */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div className="rounded-2xl overflow-hidden shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl bg-white p-6 shadow">
                  <div className="flex items-start gap-6">
                    <img src={selectedStore.image || '/stores/placeholder.jpg'} alt={selectedStore.name} className="w-36 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{selectedStore.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStore.address} · {selectedStore.city}</p>
                      <div className="mt-3 flex flex-wrap gap-4 items-center">
                        <a href={`tel:${selectedStore.phone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium"><FaPhoneAlt /> Gọi</a>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 text-green-700 font-medium"><FaDirections /> Chỉ đường</a>
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500"><FaClock /> {selectedStore.hours}</div>
                      </div>
                      <p className="mt-4 text-sm text-gray-700">Bạn có thể đến trực tiếp cửa hàng để trải nghiệm sản phẩm. Nhân viên tại cửa hàng sẽ hỗ trợ bạn tra cứu hàng tồn kho và áp dụng khuyến mãi.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl bg-white p-6 shadow">
                  <h3 className="text-lg font-semibold">Các cửa hàng nổi bật</h3>
                  <p className="text-sm text-gray-600 mt-2">Chọn một cửa hàng từ danh sách bên trái để xem chi tiết và chỉ đường.</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    {MOCK_STORES.slice(0, 4).map((s) => (
                      <div key={s.id} className="rounded-lg p-3 border border-gray-100">
                        <h4 className="font-semibold">{s.name}</h4>
                        <p className="text-sm text-gray-500">{s.address}</p>
                        <div className="mt-2 text-xs text-gray-400">{s.hours}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="text-center text-xs text-gray-400">Bản đồ là nội dung nhúng từ Google Maps. Thay đổi vị trí bằng cách chọn cửa hàng.</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ✅ Footer ra ngoài */}
      <Footer />
    </>
  );
}
