import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'
import MainLayout from './layouts/MainLayout'

import './index.css'

// pages
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './admin/AdminApp'
import AccessDeniedPage from './pages/AccessDeniedPage'
import AboutUsPage from './pages/AboutUsPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ContactPage from './pages/ContactPage'
import StoreLocatorPage from './pages/StoreLocatorPage'
import ProfilePage from './pages/ProfilePage'
import WishlistPage from './pages/WishlistPage'
import ComparePage from './pages/ComparePage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<MainLayout />}>   
      <Route index element={<HomePage />} />
      <Route path="products" element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="products" element={<ProductPage />} />  
      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="blogs" element={<BlogsPage />} />
      <Route path='contact' element={<ContactPage />} />
      <Route path="stores" element={<StoreLocatorPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="wishlist" element={<WishlistPage />} />
      <Route path="/compare" element={<ComparePage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="order/:id" element={<OrderPage />} />
        <Route path="orderhistory" element={<OrderHistoryPage />} />
        <Route path="admin/*" element={<AdminApp />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
      </Route>
      <Route path="403" element={<AccessDeniedPage />} />
    </Route>
  )
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)
