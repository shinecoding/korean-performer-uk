import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/performers', label: 'Performers' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/content', label: 'Site Content' },
  { to: '/admin/settings', label: 'Footer Links' },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-5">
          <Link to="/" className="text-sm font-semibold tracking-wide hover:text-neutral-600">
            KAP UK Admin
          </Link>
          <p className="mt-1 truncate text-xs text-neutral-400">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
