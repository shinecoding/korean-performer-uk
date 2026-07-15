import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/date'
import { getGalleryCover } from '../../lib/galleryImages'

const PLACEHOLDER = '/gallery-placeholder.svg'

export default function GalleryCard({ item }) {
  const cover = getGalleryCover(item) || PLACEHOLDER

  return (
    <Link to={`/gallery/${item.id}`} className="group block">
      <div className="aspect-square overflow-hidden bg-white/5">
        <img
          src={cover}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5">
        <h3 className="type-subhead text-white transition-colors group-hover:text-gold">{item.title}</h3>
        <p className="type-label mt-2 text-white/40">{formatDate(item.createdAt)}</p>
      </div>
    </Link>
  )
}
