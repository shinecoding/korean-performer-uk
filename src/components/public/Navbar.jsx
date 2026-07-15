import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { scrollToContact } from '../../lib/scroll'

const links = [
  { to: '/performers/korean', label: 'Korean Performers' },
  { to: '/performers/asian', label: 'Asian Performers' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/#contact', label: 'Contact', hash: 'contact' },
]

function linkClass(active) {
  return [
    'text-[11px] uppercase transition-[letter-spacing,color,opacity] duration-300',
    active
      ? 'tracking-[0.28em] text-white'
      : 'tracking-[0.14em] text-white/45 hover:tracking-[0.2em] hover:text-white/80',
  ].join(' ')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const isLinkActive = (link, isActive) => {
    if (link.hash) {
      return location.pathname === '/' && location.hash === `#${link.hash}`
    }
    return isActive
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname === '/') {
      navigate('/#contact')
      scrollToContact('smooth')
      setTimeout(() => scrollToContact('auto'), 320)
    } else {
      navigate('/#contact')
    }
  }

  const handleBrandClick = (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname !== '/' || location.hash) {
      navigate('/')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 120)
  }

  const barSolid = scrolled || open

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ${
        barSolid
          ? 'border-b border-white/[0.06] bg-black/50 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="site-shell flex items-center justify-between py-3.5">
        <Link
          to="/"
          className="type-subhead relative z-10 text-white"
          onClick={handleBrandClick}
        >
          Korean &amp; Asian <span className="text-gold">Performers UK</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) =>
            link.hash ? (
              <a
                key={link.to}
                href="/#contact"
                onClick={handleContactClick}
                className={linkClass(isLinkActive(link, false))}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => linkClass(isLinkActive(link, isActive))}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <button
          type="button"
          className="text-white/80 transition-colors hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="site-shell flex flex-col gap-1 border-t border-white/[0.06] py-5 md:hidden">
          {links.map((link) =>
            link.hash ? (
              <a
                key={link.to}
                href="/#contact"
                onClick={handleContactClick}
                className={`py-2.5 ${linkClass(isLinkActive(link, false))}`}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `py-2.5 ${linkClass(isLinkActive(link, isActive))}`}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
