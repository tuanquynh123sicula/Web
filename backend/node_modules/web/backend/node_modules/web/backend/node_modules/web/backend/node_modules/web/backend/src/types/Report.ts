// Định nghĩa kiểu dữ liệu cho báo cáo tổng quan
export interface ReportSummary {
  dailySales: {
    date: string;
    sales: number;
  }[];
  monthlySales: {
    month: string;
    sales: number;
  }[];
  
  // Tổng hợp chung
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  
  // Dữ liệu Top
  topSellingProducts: {
    _id: string;
    name: string;
    category: string;
    count: number;
    totalRevenue: number;
  }[];
}