import React from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import OrdersPage from './pages/OrdersPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import ProductsPage from './pages/ProductsPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import UsersPage from './pages/UsersPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import AdminProtectedRoute from './components/AdminProtectedRoute.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import BlogsPage from './pages/BlogPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import VouchersPage from './pages/VouchersPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import ReportPage from './pages/ReportPage.tsx' // <-- Sửa lỗi: Thêm lại .tsx
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Ticket, 
  BookOpen,
  LogOut,
  BarChart4 // <-- ICON MỚI
} from 'lucide-react'

export default function AdminApp() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: React.ComponentType<{ size?: number }>, children: React.ReactNode }) => (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 border-l-4 text-sm font-medium
        transition duration-300 ease-in-out
        ${isActive(to)
          ? 'border-blue-600 bg-blue-50 text-blue-900'
          : 'border-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-300'
        }
      `}
    >
      <Icon size={20} />
      {children}
    </Link>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black tracking-wider">QUẢN LÝ</h2>
          <p className="text-sm text-gray-500 mt-1">Bảng Điều Khiển Quản Trị</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <NavLink to="/admin/dashboard" icon={LayoutDashboard}>
            Bảng Điều Khiển
          </NavLink>
          {/* LINK MỚI CHO BÁO CÁO */}
          <NavLink to="/admin/reports" icon={BarChart4}>
            Báo Cáo Thống Kê
          </NavLink>
          <NavLink to="/admin/orders" icon={ShoppingCart}>
            Đơn Hàng
          </NavLink>
          <NavLink to="/admin/products" icon={Package}>
            Sản Phẩm
          </NavLink>
          <NavLink to="/admin/users" icon={Users}>
            Người Dùng
          </NavLink>
          <NavLink to="/admin/vouchers" icon={Ticket}>
            Mã Giảm Giá
          </NavLink>
          <NavLink to="/admin/blogs" icon={BookOpen}>
            Bài Viết
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-300 text-sm font-medium"
          >
            <LogOut size={18} />
              Quay Lại Cửa Hàng
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportPage />} /> {/* <-- ROUTE MỚI */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="vouchers" element={<VouchersPage />} />
            <Route path="blogs" element={<BlogsPage />} />
          </Route>
          <Route 
            path="*" 
            element={
              <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-6xl font-bold text-red-600">404</div>
                <p className="text-2xl text-gray-700">Trang không tìm thấy</p>
                <Link to="/admin/dashboard" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">
                  ← Về Trang Chủ Quản Trị
                </Link>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}