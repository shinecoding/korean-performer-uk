import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="type-section text-white">404</h1>
      <p className="type-body mt-4 text-white/60">Page not found.</p>
      <Link to="/" className="type-label mt-8 text-gold transition-colors hover:text-gold-light">
        Back to Home
      </Link>
    </div>
  )
}
