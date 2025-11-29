import React from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import UsersPage from './pages/UsersPage'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import BlogsPage from './pages/BlogPage'
import VouchersPage from './pages/VouchersPage'

export default function AdminApp() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
    <Link
      to={to}
      className={`
        block px-3 py-3 border-l-4 text-sm font-medium
        transition duration-300 ease-in-out
        ${isActive(to)
          ? 'border-black bg-gray-100 text-black'
          : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      {children}
    </Link>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black tracking-wider">ADMIN PANEL</h2>
          <p className="text-sm text-gray-500">Minimalist Management</p>
        </div>
        <nav className="space-y-1">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/vouchers">Vouchers</NavLink>
          <NavLink to="/admin/blogs">Blogs</NavLink>
        </nav>
        <div className="mt-12 pt-4 border-t border-gray-200">
          <Link
            to="/"
            className="text-gray-600 hover:text-black transition duration-300 ease-in-out flex items-center gap-1 text-sm font-medium"
          >
            <span className="text-lg">←</span> Back to shop
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="vouchers" element={<VouchersPage />} />
            <Route path="blogs" element={<BlogsPage />} />
          </Route>
          <Route path="*" element={<div className="text-3xl font-bold text-red-600">404 | Page not found</div>} />
        </Routes>
      </main>
    </div>
  )
}