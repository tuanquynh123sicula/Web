import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import UsersPage from './pages/UsersPage'
import AdminProtectedRoute from './components/AdminProtectedRoute'

export default function AdminApp() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <p className="text-sm text-gray-500">Manage your store</p>
        </div>
        <nav className="space-y-1">
          <Link to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-100">Orders</Link>
          <Link to="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-100">Products</Link>
          <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Users</Link>
        </nav>
        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:underline">← Back to shop</Link>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  )
}
