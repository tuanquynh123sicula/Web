import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '@/Store'
import { motion, AnimatePresence} from 'framer-motion'
import { Heart } from 'lucide-react'
import { useGetWishlistQuery } from '@/hooks/wishlistHook'

function IconStore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" {...props}>
      <path d="M4 10V6l2-2h12l2 2v4" strokeWidth="1.5" />
      <path d="M4 10h16v10H4z" strokeWidth="1.5" />
      <path d="M9 14h6v6H9z" strokeWidth="1.5" />
    </svg>
  )
}
function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" strokeWidth="1.5" />
    </svg>
  )
}
function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const [query, setQuery] = useState('')
  const [openUser, setOpenUser] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const cart = state.cart
  const cartCount = cart.cartItems.reduce((a, c) => a + c.quantity, 0)
  const { data: wishlistData } = useGetWishlistQuery()
  const wishlistCount = wishlistData?.count || 0

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/?query=${encodeURIComponent(q)}`)
    else navigate(`/`)
    setSearchFocus(false)
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    navigate('/signin')
  }

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 "
    >
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        <div className="flex items-center gap-3 text-sm">
          
          {/* Button: Hệ thống cửa hàng - Thêm hover:scale */}
          <Link 
            to="/stores" 
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 transition-all duration-200 text-gray-700 font-medium hover:scale-105 active:scale-95 transform" 
          >
            <IconStore className="w-5 h-5 transition duration-200" />
            <span>Hệ thống cửa hàng</span>
          </Link>

          {/* Search with animated width */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <motion.input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
              placeholder="Nhập tên sản phẩm, thương hiệu..."
              className={`py-2 pl-4 pr-9 border text-gray-700 rounded-none
                ${searchFocus ? 'border-black shadow-md' : 'border-gray-300'} 
                focus:outline-none transition-all duration-300`}
              aria-label="Tìm sản phẩm"
              initial={false}
              animate={{ width: searchFocus ? 360 : 300 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{ width: 300 }}
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 hover:text-black transition-colors duration-200"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
            >
              <IconSearch className="w-5 h-5 transition duration-200" />
            </button>
          </form>

          {/* User Profile/Sign In */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setOpenUser((v) => !v)}
                onBlur={() => setTimeout(() => setOpenUser(false), 150)}
                // Thêm hover:scale
                className="px-4 py-2 text-black flex items-center gap-2 transition-all duration-200 hover:bg-gray-200 rounded-none hover:scale-105 active:scale-95 transform" 
              >
                <IconUser className="w-5 h-5 transition duration-200" />
                <span className="max-w-[100px] truncate font-semibold">
                    {userInfo.name}
                </span>
              </button>
              <AnimatePresence>
                {openUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-2 w-56 bg-white border shadow-xl ring-1 ring-black/5 z-50 p-1 rounded-none"
                  >
                    <div className="px-3 py-2 text-sm font-medium text-gray-800 border-b mb-1 transition duration-200">
                      Xin chào, {userInfo.name}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 rounded-none"
                      onClick={() => setOpenUser(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/orderhistory"
                      className="block px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 rounded-none"
                      onClick={() => setOpenUser(false)}
                    >
                      Lịch sử đơn hàng
                    </Link>
                    {userInfo.isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="block px-3 py-2 hover:bg-gray-50 text-red-600 font-semibold transition-colors duration-200 rounded-none"
                            onClick={() => setOpenUser(false)}
                        >
                            Bảng điều khiển quản trị
                        </Link>
                    )}
                    <button onClick={signoutHandler} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 border-t mt-1 transition-colors duration-200 rounded-none">
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/signin" className="px-4 py-2 text-black flex items-center gap-2 transition-all duration-200 hover:bg-gray-200 font-semibold rounded-none hover:scale-105 active:scale-95 transform"> 
              <IconUser className="w-5 h-5 transition duration-200" />
              <span>Đăng nhập</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative p-2 text-black hover:bg-gray-200 transition-all duration-200 rounded-none hover:scale-105 active:scale-95 transform"
            aria-label={`Giỏ hàng${cartCount ? `, ${cartCount} sản phẩm` : ''}`}
            title="Giỏ hàng"
          >
            <IconCart className="w-6 h-6 transition duration-200" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-[20px] p-0.5 bg-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white rounded-none" 
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
                    <nav className="relative p-2 text-black hover:bg-gray-200 transition-all duration-200 rounded-none hover:scale-105 active:scale-95 transform">
            <Link 
              to="/wishlist" 
              className="flex items-center justify-center w-6 h-6"
              aria-label={`Danh sách yêu thích${wishlistCount ? `, ${wishlistCount} sản phẩm` : ''}`}
              title="Danh sách yêu thích"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
          </nav>

          {/* Compare Button
          <nav className="relative p-2 text-black hover:bg-gray-200 transition-all duration-200 rounded-none hover:scale-105 active:scale-95 transform">
            <Link 
              to="/compare" 
              className="flex items-center justify-center w-6 h-6"
              aria-label={`So sánh${compareCount ? `, ${compareCount} sản phẩm` : ''}`}
              title="So sánh sản phẩm"
            >
              <Scale size={24} />
              {compareCount > 0 && (
                <motion.span
                  key={compareCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white"
                >
                  {compareCount}
                </motion.span>
              )}
            </Link>
          </nav> */}
        </div>
      </div>
    </motion.header>
  )
}