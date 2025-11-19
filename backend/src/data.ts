import bcrypt from 'bcryptjs'
import { Product } from "./models/productModel";
import type { User } from "./models/userModel";


export const sampleProducts: Product[] = [
  // ===== iPhone =====
  {
    name: "iPhone 17 Pro Max",
    slug: "iphone-17-pro-max",
    brand: "Apple",
    category: "iPhone",
    description: "iPhone 17 Pro Max mới nhất, camera siêu nét, pin trâu.",
    image: "/images/iphone/ip17px_white.jpg",
    rating: 4.5,
    numReviews: 128,
    price: 29990000,
    countInStock: 10,
    variants: [
      {
        color: "Trắng",
        storage: "128GB",
        ram: "8GB",
        price: 29990000,
        countInStock: 10,
        image: "/images/iphone/ip17px_white.jpg"
      },
      {
        color: "Cam",
        storage: "256GB",
        ram: "12GB",
        price: 32990000,
        countInStock: 8,
        image: "/images/iphone/ip17px_cam.jpg"
      },
      {
        color: "Xanh",
        storage: "512GB",
        ram: "16GB",
        price: 37990000,
        countInStock: 5,
        image: "/images/iphone/ip17px_xanh.jpg"
      }
    ]
  },

  {
    name: "iPhone 17",
    slug: "iphone-17",
    brand: "Apple",
    category: "iPhone",
    description: "iPhone 17 mới nhất với chip A18 Pro mạnh mẽ.",
    image: "/images/iphone/ip17_black.jpg",
    rating: 4.3,
    numReviews: 95,
    price: 24990000,
    countInStock: 15,
    variants: [
      {
        color: "Đen",
        storage: "128GB",
        ram: "8GB",
        price: 24990000,
        countInStock: 15,
        image: "/images/iphone/ip17_black.jpg"
      },
      {
        color: "Xanh",
        storage: "256GB",
        ram: "12GB",
        price: 27990000,
        countInStock: 12,
        image: "/images/iphone/ip17_xanh.jpg"
      },
      {
        color: "Xanh Đậm",
        storage: "512GB",
        ram: "12GB",
        price: 31990000,
        countInStock: 8,
        image: "/images/iphone/ip17_xanhdam.jpg"
      }
    ]
  },

  {
    name: "iPhone Air",
    slug: "iphone-air",
    brand: "Apple",
    category: "iPhone",
    description: "iPhone Air với design mỏng nhẹ, hiệu năng cao.",
    image: "/images/iphone/ipair_white.jpg",
    rating: 4.4,
    numReviews: 110,
    price: 21990000,
    countInStock: 20,
    variants: [
      {
        color: "Trắng",
        storage: "128GB",
        ram: "8GB",
        price: 21990000,
        countInStock: 20,
        image: "/images/iphone/ipair_white.jpg"
      },
      {
        color: "Đen",
        storage: "256GB",
        ram: "12GB",
        price: 24990000,
        countInStock: 18,
        image: "/images/iphone/ipair_den.jpg"
      },
      {
        color: "Ngọc",
        storage: "512GB",
        ram: "12GB",
        price: 28990000,
        countInStock: 10,
        image: "/images/iphone/ipair_ngoc.jpg"
      }
    ]
  },

  // ===== Honor =====
  {
    name: "Honor Magic V5",
    slug: "honor-magic-v5",
    brand: "Honor",
    category: "Honor",
    description: "Honor Magic V5 - điện thoại gập 5G cao cấp.",
    image: "/images/honor/hnormgv5_den.jpg",
    rating: 4.2,
    numReviews: 85,
    price: 19990000,
    countInStock: 12,
    variants: [
      {
        color: "Đen",
        storage: "256GB",
        ram: "12GB",
        price: 19990000,
        countInStock: 12,
        image: "/images/honor/hnormgv5_den.jpg"
      },
      {
        color: "Trắng Vàng",
        storage: "512GB",
        ram: "12GB",
        price: 22990000,
        countInStock: 8,
        image: "/images/honor/hnormgv5_trangvang.jpg"
      }
    ]
  },

  {
    name: "Honor 400 Pro",
    slug: "honor-400-pro",
    brand: "Honor",
    category: "Honor",
    description: "Honor 400 Pro với camera 200MP siêu nét.",
    image: "/images/honor/hnor400pro_xam.jpg",
    rating: 4.1,
    numReviews: 72,
    price: 17990000,
    countInStock: 14,
    variants: [
      {
        color: "Xám",
        storage: "256GB",
        ram: "12GB",
        price: 17990000,
        countInStock: 14,
        image: "/images/honor/hnor400pro_xam.jpg"
      },
      {
        color: "Đen",
        storage: "512GB",
        ram: "12GB",
        price: 20990000,
        countInStock: 10,
        image: "/images/honor/hnor400pr_den.jpg"
      }
    ]
  },

  {
    name: "Honor X8c",
    slug: "honor-x8c",
    brand: "Honor",
    category: "Honor",
    description: "Honor X8c - smartphone phổ thông với giá tốt.",
    image: "/images/honor/honorx8c.jpg",
    rating: 3.9,
    numReviews: 58,
    price: 9990000,
    countInStock: 25,
    variants: [
      {
        color: "Xanh",
        storage: "128GB",
        ram: "8GB",
        price: 9990000,
        countInStock: 25,
        image: "/images/honor/honorx8c.jpg"
      }
    ]
  },

  // ===== Samsung =====
  {
    name: "Samsung Galaxy Z Fold 7",
    slug: "samsung-galaxy-z-fold7",
    brand: "Samsung",
    category: "Samsung",
    description: "Samsung Galaxy Z Fold 7 - smartphone gập flagship.",
    image: "/images/samsung/fold7_den.jpg",
    rating: 4.6,
    numReviews: 140,
    price: 39990000,
    countInStock: 8,
    variants: [
      {
        color: "Đen",
        storage: "256GB",
        ram: "12GB",
        price: 39990000,
        countInStock: 8,
        image: "/images/samsung/fold7_den.jpg"
      },
      {
        color: "Xám",
        storage: "512GB",
        ram: "12GB",
        price: 42990000,
        countInStock: 5,
        image: "/images/samsung/fold7_xam.jpg"
      },
      {
        color: "Xanh",
        storage: "1TB",
        ram: "16GB",
        price: 46990000,
        countInStock: 3,
        image: "/images/samsung/fold7_xanh.jpg"
      }
    ]
  },

  {
    name: "Samsung Galaxy Z Flip 7",
    slug: "samsung-galaxy-z-flip7",
    brand: "Samsung",
    category: "Samsung",
    description: "Samsung Galaxy Z Flip 7 - smartphone gập nhỏ gọn.",
    image: "/images/samsung/zflip7_xanh.jpg",
    rating: 4.4,
    numReviews: 115,
    price: 29990000,
    countInStock: 12,
    variants: [
      {
        color: "Xanh",
        storage: "256GB",
        ram: "12GB",
        price: 29990000,
        countInStock: 12,
        image: "/images/samsung/zflip7_xanh.jpg"
      },
      {
        color: "Đỏ",
        storage: "512GB",
        ram: "12GB",
        price: 32990000,
        countInStock: 8,
        image: "/images/samsung/zflip7_do.jpg"
      }
    ]
  },

  // ===== Xiaomi =====
  {
    name: "Xiaomi 15 Pro",
    slug: "xiaomi-15-pro",
    brand: "Xiaomi",
    category: "Xiaomi",
    description: "Xiaomi 15 Pro với chip Snapdragon 8 Gen 3.",
    image: "/images/xiaomi/xm15tpro_gold.jpg",
    rating: 4.3,
    numReviews: 98,
    price: 16990000,
    countInStock: 16,
    variants: [
      {
        color: "Gold",
        storage: "256GB",
        ram: "12GB",
        price: 16990000,
        countInStock: 16,
        image: "/images/xiaomi/xm15tpro_gold.jpg"
      },
      {
        color: "Xám",
        storage: "512GB",
        ram: "12GB",
        price: 19990000,
        countInStock: 12,
        image: "/images/xiaomi/xm15tpro_xam.jpg"
      }
    ]
  },

  {
    name: "Xiaomi 15 Ultra",
    slug: "xiaomi-15-ultra",
    brand: "Xiaomi",
    category: "Xiaomi",
    description: "Xiaomi 15 Ultra - camera 50MP, design premium.",
    image: "/images/xiaomi/xm15u_trang.jpg",
    rating: 4.2,
    numReviews: 86,
    price: 18990000,
    countInStock: 14,
    variants: [
      {
        color: "Trắng",
        storage: "256GB",
        ram: "12GB",
        price: 18990000,
        countInStock: 14,
        image: "/images/xiaomi/xm15u_trang.jpg"
      },
      {
        color: "Đen Trắng",
        storage: "512GB",
        ram: "12GB",
        price: 21990000,
        countInStock: 10,
        image: "/images/xiaomi/xm15u_dentrang.jpg"
      }
    ]
  },

  {
    name: "Xiaomi 14 Plus",
    slug: "xiaomi-14-plus",
    brand: "Xiaomi",
    category: "Xiaomi",
    description: "Xiaomi 14 Plus - pin lâu 5000mAh.",
    image: "/images/xiaomi/14p+_den.jpg",
    rating: 4.1,
    numReviews: 79,
    price: 13990000,
    countInStock: 18,
    variants: [
      {
        color: "Đen",
        storage: "256GB",
        ram: "12GB",
        price: 13990000,
        countInStock: 18,
        image: "/images/xiaomi/14p+_den.jpg"
      },
      {
        color: "Tím",
        storage: "512GB",
        ram: "12GB",
        price: 16990000,
        countInStock: 14,
        image: "/images/xiaomi/14p+_tim.jpg"
      },
      {
        color: "Vàng",
        storage: "256GB",
        ram: "8GB",
        price: 12990000,
        countInStock: 20,
        image: "/images/xiaomi/14p+_vang.jpg"
      }
    ]
  },

  // ===== Laptop =====
  {
    name: "MacBook Air M2",
    slug: "macbook-air-m2",
    brand: "Apple",
    category: "Laptop",
    description: "MacBook Air M2 - mỏng nhẹ, hiệu năng mạnh.",
    image: "/images/laptop/macbookairm2_16gb_256gb_bac.jpg",
    rating: 4.7,
    numReviews: 156,
    price: 32990000,
    countInStock: 6,
    variants: [
      {
        color: "Bạc",
        storage: "256GB",
        ram: "16GB",
        price: 32990000,
        countInStock: 6,
        image: "/images/laptop/macbookairm2_16gb_256gb_bac.jpg"
      },
      {
        color: "Trắng Vàng",
        storage: "512GB",
        ram: "16GB",
        price: 38990000,
        countInStock: 4,
        image: "/images/laptop/macbookairm2_16gb_256gb_trangvang.jpg"
      }
    ]
  },

  {
    name: "HP 240 G10",
    slug: "hp-240-g10",
    brand: "HP",
    category: "Laptop",
    description: "HP 240 G10 - laptop văn phòng đáng tin cậy.",
    image: "/images/laptop/hp-240-g10-i5-9h2e4pt-170225-105517-942-600x600.jpg",
    rating: 3.8,
    numReviews: 64,
    price: 12990000,
    countInStock: 10,
    variants: [
      {
        color: "Bạc",
        storage: "256GB",
        ram: "8GB",
        price: 12990000,
        countInStock: 10,
        image: "/images/laptop/hp-240-g10-i5-9h2e4pt-170225-105517-942-600x600.jpg"
      }
    ]
  },

  {
    name: "Lenovo IdeaPad Slim 3",
    slug: "lenovo-ideapad-slim3",
    brand: "Lenovo",
    category: "Laptop",
    description: "Lenovo IdeaPad Slim 3 - laptop nhẹ, pin lâu.",
    image: "/images/laptop/lenovoideapadslim3_xám.jpg",
    rating: 3.9,
    numReviews: 71,
    price: 11990000,
    countInStock: 12,
    variants: [
      {
        color: "Xám",
        storage: "256GB",
        ram: "8GB",
        price: 11990000,
        countInStock: 12,
        image: "/images/laptop/lenovoideapadslim3_xám.jpg"
      }
    ]
  },

  // ===== Phụ Kiện =====
  {
    name: "Tai Nghe TWS Xiaomi Redmi Buds 6",
    slug: "tai-nghe-xiaomi-redmi-buds-6",
    brand: "Xiaomi",
    category: "Accessories",
    description: "Tai nghe không dây Xiaomi Redmi Buds 6 chất lượng cao.",
    image: "/images/phukien/tainghe/tai-nghe-tws-xiaomi-redmi-buds-6-251224-104719-335-600x600.jpg",
    rating: 1.0,
    numReviews: 68,
    price: 2990000,
    countInStock: 30,
    variants: [
      {
        color: "Đen",
        storage: "Single",
        ram: "N/A",
        price: 2990000,
        countInStock: 30,
        image: "/images/phukien/tainghe/tai-nghe-tws-xiaomi-redmi-buds-6-251224-104719-335-600x600.jpg"
      }
    ]
  },

  {
    name: "Tai Nghe Samsung Galaxy Buds 3 Pro",
    slug: "tai-nghe-samsung-galaxy-buds-3-pro",
    brand: "Samsung",
    category: "Accessories",
    description: "Tai nghe Samsung Galaxy Buds 3 Pro với ANC tốt.",
    image: "/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-pro-r630n-100724-082455-600x600-1-600x600.jpg",
    rating: 4.2,
    numReviews: 89,
    price: 5990000,
    countInStock: 20,
    variants: [
      {
        color: "Trắng",
        storage: "Single",
        ram: "N/A",
        price: 5990000,
        countInStock: 20,
        image: "/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-pro-r630n-100724-082455-600x600-1-600x600.jpg"
      }
    ]
  },

  {
    name: "Tai Nghe Oppo Enco Buds 3",
    slug: "tai-nghe-oppo-enco-buds-3",
    brand: "Oppo",
    category: "Accessories",
    description: "Tai nghe Oppo Enco Buds 3 - âm thanh chuẩn.",
    image: "/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-oppo-enco-buds-3-eteg1-thumb-2-638960566326933296-600x600.jpg",
    rating: 3.9,
    numReviews: 55,
    price: 3990000,
    countInStock: 25,
    variants: [
      {
        color: "Đen",
        storage: "Single",
        ram: "N/A",
        price: 3990000,
        countInStock: 25,
        image: "/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-oppo-enco-buds-3-eteg1-thumb-2-638960566326933296-600x600.jpg"
      }
    ]
  },

  {
    name: "Loa Bluetooth Marshall Kilburn III",
    slug: "loa-marshall-kilburn-iii",
    brand: "Marshall",
    category: "Accessories",
    description: "Loa Bluetooth Marshall Kilburn III - âm thanh rock chuẩn.",
    image: "/images/phukien/loa/loa-bluetooth-marshall-kilburn-iii-thumb-638935318908374494-600x600.jpg",
    rating: 4.3,
    numReviews: 92,
    price: 8990000,
    countInStock: 10,
    variants: [
      {
        color: "Đen",
        storage: "Portable",
        ram: "N/A",
        price: 8990000,
        countInStock: 10,
        image: "/images/phukien/loa/loa-bluetooth-marshall-kilburn-iii-thumb-638935318908374494-600x600.jpg"
      }
    ]
  },

  {
    name: "Loa Bluetooth JBL Charge 6",
    slug: "loa-jbl-charge-6",
    brand: "JBL",
    category: "Accessories",
    description: "Loa JBL Charge 6 - âm thanh 360 độ, pin 24h.",
    image: "/images/phukien/loa/loa-bluetooth-jbl-charge-6-070525-042114-655-600x600.jpg",
    rating: 4.1,
    numReviews: 78,
    price: 5990000,
    countInStock: 15,
    variants: [
      {
        color: "Xanh",
        storage: "Portable",
        ram: "N/A",
        price: 5990000,
        countInStock: 15,
        image: "/images/phukien/loa/loa-bluetooth-jbl-charge-6-070525-042114-655-600x600.jpg"
      }
    ]
  },

  {
    name: "Loa Harman Kardon SoundSticks 5",
    slug: "loa-harman-kardon-soundsticks-5",
    brand: "Harman Kardon",
    category: "Accessories",
    description: "Loa Harman Kardon SoundSticks 5 - design tuyệt đẹp.",
    image: "/images/phukien/loa/loa-bluetooth-harman-kardon-soundsticks-5-thumb-638972593300217715-600x600.jpg",
    rating: 4.4,
    numReviews: 105,
    price: 9990000,
    countInStock: 8,
    variants: [
      {
        color: "Trắng",
        storage: "Desktop",
        ram: "N/A",
        price: 9990000,
        countInStock: 8,
        image: "/images/phukien/loa/loa-bluetooth-harman-kardon-soundsticks-5-thumb-638972593300217715-600x600.jpg"
      }
    ]
  },

  {
    name: "Sạc Pin Dự Phòng Xiaomi 10000mAh",
    slug: "sac-pin-du-phong-xiaomi-10000mah",
    brand: "Xiaomi",
    category: "Accessories",
    description: "Sạc dự phòng Xiaomi 10000mAh 22.5W - sạc nhanh.",
    image: "/images/phukien/sacduphong/sac-pin-du-phong-xiaomi-10000mah-22-5w.jpg",
    rating: 4.0,
    numReviews: 65,
    price: 1490000,
    countInStock: 50,
    variants: [
      {
        color: "Đen",
        storage: "10000mAh",
        ram: "N/A",
        price: 1490000,
        countInStock: 50,
        image: "/images/phukien/sacduphong/sac-pin-du-phong-xiaomi-10000mah-22-5w.jpg"
      }
    ]
  },

  {
    name: "Pin Sạc Dự Phòng Anker Zolo 25000mAh",
    slug: "pin-sac-du-phong-anker-zolo-25000mah",
    brand: "Anker",
    category: "Accessories",
    description: "Pin sạc 25000mAh 165W - sạc cực nhanh.",
    image: "/images/phukien/sacduphong/pin-sac-du-phong-25000mah-type-c-pd-qc-3-0-165w-anker-zolo-a1695-kem-cap-thumb-638942197395592306-600x600.jpg",
    rating: 4.2,
    numReviews: 88,
    price: 1990000,
    countInStock: 35,
    variants: [
      {
        color: "Xám",
        storage: "25000mAh",
        ram: "N/A",
        price: 1990000,
        countInStock: 35,
        image: "/images/phukien/sacduphong/pin-sac-du-phong-25000mah-type-c-pd-qc-3-0-165w-anker-zolo-a1695-kem-cap-thumb-638942197395592306-600x600.jpg"
      }
    ]
  },

  {
    name: "Sạc Dự Phòng Từ Tính XMobile 15000mAh",
    slug: "sac-du-phong-tu-tinh-xmobile-15000mah",
    brand: "XMobile",
    category: "Accessories",
    description: "Sạc dự phòng 15000mAh không dây từ tính.",
    image: "/images/phukien/sacduphong/sac-du-phong-15000mah-khong-day-magnetic-100w-xmobile-jp339-thumb2-638949110436600522-600x600.jpg",
    rating: 3.9,
    numReviews: 72,
    price: 1290000,
    countInStock: 40,
    variants: [
      {
        color: "Đen",
        storage: "15000mAh",
        ram: "N/A",
        price: 1290000,
        countInStock: 40,
        image: "/images/phukien/sacduphong/sac-du-phong-15000mah-khong-day-magnetic-100w-xmobile-jp339-thumb2-638949110436600522-600x600.jpg"
      }
    ]
  },

  {
    name: "Adapter Sạc Anker 140W",
    slug: "adapter-sac-anker-140w",
    brand: "Anker",
    category: "Accessories",
    description: "Adapter sạc 4 cổng USB Type-C 140W.",
    image: "/images/phukien/capsac/adapter-sac-4-cong-usb-type-c-iq3-gan-140w-ai-led-display-anker-zolo-b2697-thumb3-638907886956924599-600x600.jpg",
    rating: 4.1,
    numReviews: 81,
    price: 1890000,
    countInStock: 28,
    variants: [
      {
        color: "Đen",
        storage: "4 Port",
        ram: "N/A",
        price: 1890000,
        countInStock: 28,
        image: "/images/phukien/capsac/adapter-sac-4-cong-usb-type-c-iq3-gan-140w-ai-led-display-anker-zolo-b2697-thumb3-638907886956924599-600x600.jpg"
      }
    ]
  },

  {
    name: "Adapter Sạc UGREEN 30W",
    slug: "adapter-sac-ugreen-30w",
    brand: "UGREEN",
    category: "Accessories",
    description: "Adapter sạc Type-C PD 30W - nhỏ gọn, nhanh.",
    image: "/images/phukien/capsac/adapter-sac-type-c-pd-gan-30w-ugreen-robot-uno-cd359-15550-thumb-638943079923012712-600x600.jpg",
    rating: 4.0,
    numReviews: 69,
    price: 590000,
    countInStock: 45,
    variants: [
      {
        color: "Trắng",
        storage: "1 Port",
        ram: "N/A",
        price: 590000,
        countInStock: 45,
        image: "/images/phukien/capsac/adapter-sac-type-c-pd-gan-30w-ugreen-robot-uno-cd359-15550-thumb-638943079923012712-600x600.jpg"
      }
    ]
  },

  {
    name: "Cáp 3 Đầu Baseus Flash Series 2",
    slug: "cap-3-dau-baseus-flash-series-2",
    brand: "Baseus",
    category: "Accessories",
    description: "Cáp 3 đầu (Type-C, Lightning, Micro) 1.5m.",
    image: "/images/phukien/capsac/cap-3-dau-type-c-type-c-lightning-micro-1-5m-baseus-flash-series-2-cb000004-thumb-638639098779367618-600x600.jpg",
    rating: 3.8,
    numReviews: 54,
    price: 290000,
    countInStock: 60,
    variants: [
      {
        color: "Đen",
        storage: "1.5m",
        ram: "N/A",
        price: 290000,
        countInStock: 60,
        image: "/images/phukien/capsac/cap-3-dau-type-c-type-c-lightning-micro-1-5m-baseus-flash-series-2-cb000004-thumb-638639098779367618-600x600.jpg"
      }
    ]
  }
]

export const sampleUsers: User[] = [
  {
    name: 'Joe',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
    tier: 'vip'
  },
]