import { Link } from 'react-router-dom'

const cards = [
  { to: '/admin/performers', title: 'Performers', description: 'Manage Korean & Asian performer profiles' },
  { to: '/admin/gallery', title: 'Gallery', description: 'Manage gallery photos' },
  { to: '/admin/content', title: 'Site Content', description: 'Edit homepage & about text' },
  { to: '/admin/settings', title: 'Footer Links', description: 'Edit social links shown in the site footer' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Manage the Korean & Asian Performers UK website.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
          >
            <h2 className="font-medium text-neutral-900">{card.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
