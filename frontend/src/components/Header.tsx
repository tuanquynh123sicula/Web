// ...existing code...
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '@/Store'
import { motion, AnimatePresence} from 'framer-motion'

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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" />
      <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
    </svg>
  )
}
function IconCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" {...props}>
      <path d="M6 6h15l-1.5 9h-12L6 6z" strokeWidth="1.5" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
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
  // const [scrolled, setScrolled] = useState(false)
  // const { scrollY } = useScroll()
  // useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 8))

  const cart = state.cart
  const cartCount = cart.cartItems.reduce((a, c) => a + c.quantity, 0)

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/?query=${encodeURIComponent(q)}`)
    else navigate(`/`)
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
      className="fixed left-56 right-0 top-0 z-30"
      // style={{
      //   backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
      //   backdropFilter: scrolled ? 'saturate(180%) blur(10px)' : 'none',
      //   boxShadow: scrolled ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
      //   borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '0px solid transparent',
      //   transition: 'background-color .25s, box-shadow .25s, border-color .25s, backdrop-filter .25s',
      // }}
    >
      <div className="flex items-center justify-end gap-4 px-6 py-3">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/stores" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition-colors">
            <IconStore />
            <span>Hệ thống cửa hàng</span>
          </Link>

          {/* Search with animated width */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <motion.input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Tìm sản phẩm..."
              className="py-2 pl-3 pr-9 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Tìm sản phẩm"
              initial={false}
              animate={{ width: searchFocus ? 320 : 256 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{ width: 256 }}
            />
            <button
              type="submit"
              className="absolute right-2 text-gray-600 hover:text-gray-900"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
            >
              <IconSearch />
            </button>
          </form>

          {/* User */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setOpenUser((v) => !v)}
                onBlur={() => setTimeout(() => setOpenUser(false), 150)}
                className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <IconUser />
                <span className="max-w-[140px] truncate">{userInfo.name}</span>
              </button>
              <AnimatePresence>
                {openUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50"
                  >
                    <div className="px-3 py-2 text-xs text-gray-500">Xin chào, {userInfo.name}</div>
                    <div className="border-t" />
                    <Link
                      to="/orderhistory"
                      className="block px-3 py-2 hover:bg-gray-50"
                      onClick={() => setOpenUser(false)}
                    >
                      Lịch sử đơn hàng
                    </Link>
                    <button onClick={signoutHandler} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/signin" className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors">
              <IconUser />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Cart with animated badge */}
          <Link
            to="/cart"
            className="relative px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors"
            aria-label={`Giỏ hàng${cartCount ? `, ${cartCount} sản phẩm` : ''}`}
          >
            <IconCart />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
// ...existing code...