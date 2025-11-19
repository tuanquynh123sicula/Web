import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

type Item = {
  title: string
  href: string
  children?: Item[]
}

const sidebarItems: Item[] = [
  { title: 'HOME', href: '/' },
  { title: 'ABOUT US', href: '/about' },
  {
    title: 'SHOP',
    href: '/products',
    children: [
      { title: 'Điện thoại', href: '/products?category=Phone' },
      { title: 'Laptop', href: '/products?category=Laptop' },
      { title: 'Phụ kiện', href: '/products?category=Accessories' },
    ],
  },
  {
    title: 'BRANDS',
    href: '/products',
    children: [
      { title: 'Apple', href: '/products?category=Apple' },
      { title: 'Samsung', href: '/products?category=Samsung' },
      { title: 'Xiaomi', href: '/products?category=Xiaomi' },
      { title: 'Honor', href: '/products?category=Honor' },
    ],
  },
  { title: 'BLOGS', href: '/blogs' },
  { title: 'CONTACT', href: '/contact' },
]


const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: 'beforeChildren',
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
}

const submenuVariants: Variants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, x: 8, transition: { duration: 0.12 } },
}
// ...existing code...

export default function Sidebar() {
  const [openTopKey, setOpenTopKey] = useState<string | null>(null)
  const [openChildKey, setOpenChildKey] = useState<string | null>(null)

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56">
      <div className="h-full flex flex-col">
        <Link to="/" className="flex items-center gap-3 px-10 py-4">
          <img src="/logo/logo.jpg" alt="logo" className="w-20 h-auto object-contain hover:scale-105 transition-transform duration-300" />
        </Link>

        <nav className="px-4 py-4 flex-1">
          <ul className="space-y-3 text-sm font-medium">
            {sidebarItems.map((item) => {
              const isOpenTop = openTopKey === item.title
              return (
                <li
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenTopKey(item.title)}
                  onMouseLeave={() => {
                    if (item.children) {
                      setOpenTopKey(null)
                      setOpenChildKey(null)
                    }
                  }}
                >
                  <Link
                    to={item.href}
                    className="block px-3 py-2  hover:bg-gray-100 transition-colors hover:scale-90 trasition-transform duration-900 rounded"
                    aria-expanded={!!item.children && isOpenTop}
                  >
                    {item.title}
                  </Link>

                  <AnimatePresence>
                    {item.children && isOpenTop && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        className="absolute left-full top-0 ml-2 w-56 bg-white border shadow-lg ring-1 ring-black/5 z-40"
                      >
                        <ul className="p-3 space-y-2">
                          {item.children.map((c) => {
                            const hasGrand = !!c.children?.length
                            const isOpenChild = openChildKey === c.title
                            return (
                              <motion.li
                                key={c.title}
                                className="relative"
                                variants={itemVariants}
                                onMouseEnter={() => hasGrand && setOpenChildKey(c.title)}
                                onMouseLeave={() => hasGrand && setOpenChildKey(null)}
                              >
                                <Link
                                  to={c.href}
                                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                >
                                  <span>{c.title}</span>
                                  {hasGrand && (
                                    <motion.span
                                      className="text-gray-400"
                                      animate={{ x: isOpenChild ? 2 : 0 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      ›
                                    </motion.span>
                                  )}
                                </Link>

                                <AnimatePresence>
                                  {hasGrand && isOpenChild && (
                                    <motion.div
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                      variants={submenuVariants}
                                      className="absolute left-full top-0 ml-2 w-52 bg-white border rounded shadow-lg ring-1 ring-black/5 z-50"
                                    >
                                      <ul className="p-2 space-y-1">
                                        {c.children!.map((g) => (
                                          <li key={g.title}>
                                            <Link
                                              to={g.href}
                                              className="block px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                            >
                                              {g.title}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.li>
                            )
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}