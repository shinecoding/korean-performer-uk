import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="page-fade">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
