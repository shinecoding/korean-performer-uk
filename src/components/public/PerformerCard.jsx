import { Link } from 'react-router-dom'
import { getPerformerCover } from '../../lib/performerPhotos'

const PLACEHOLDER = '/performer-placeholder.svg'

export default function PerformerCard({ performer }) {
  const cover = getPerformerCover(performer) || PLACEHOLDER

  return (
    <Link to={`/performers/${performer.id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-white/5">
        <img
          src={cover}
          alt={performer.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5">
        <h3 className="type-subhead text-white transition-colors group-hover:text-gold">{performer.name}</h3>
        <p className="type-label mt-2 text-gold/90">{performer.role}</p>
        {performer.shortIntro && (
          <p className="type-body mt-3 line-clamp-2 text-white/50">{performer.shortIntro}</p>
        )}
      </div>
    </Link>
  )
}
