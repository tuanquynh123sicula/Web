export interface ReportSummary {
    dailySales: {
        date: string;
        sales: number;
    }[];
    monthlySales: {
        month: string;
        sales: number;
    }[];
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    topSellingProducts: {
        _id: string;
        name: string;
        category: string;
        count: number;
        totalRevenue: number;
    }[];
}
//# sourceMappingURL=Report.d.ts.map