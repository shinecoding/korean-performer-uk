import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGalleryItem } from '../../lib/firestore'
import { formatDate } from '../../lib/date'
import { getGalleryImages } from '../../lib/galleryImages'

const PLACEHOLDER = '/gallery-placeholder.svg'

export default function GalleryDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    setActiveIndex(0)
    getGalleryItem(id)
      .then(setItem)
      .finally(() => setLoading(false))
  }, [id])

  const images = item ? getGalleryImages(item) : []

  useEffect(() => {
    if (images.length < 2) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  if (loading) return <p className="type-body px-6 py-28 text-center text-white/40">Loading…</p>
  if (!item) return <p className="type-body px-6 py-28 text-center text-white/40">Item not found.</p>

  const activeImage = images[activeIndex] || PLACEHOLDER
  const hasCarousel = images.length > 1

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length)
  }

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % images.length)
  }

  return (
    <div className="site-shell py-16 sm:py-20 lg:py-24">
      <div className="relative">
        <img
          key={activeImage}
          src={activeImage}
          alt={item.title}
          className="page-fade block h-auto w-full object-contain"
        />

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-6 text-2xl text-white/50 transition-colors hover:text-white sm:px-4"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-6 text-2xl text-white/50 transition-colors hover:text-white sm:px-4"
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasCarousel && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-1.5 w-1.5 transition-colors ${
                index === activeIndex ? 'bg-gold' : 'bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="mt-10 text-center sm:mt-12">
        <h1 className="type-section text-white">{item.title}</h1>
        <p className="type-label mt-3 text-white/40">{formatDate(item.createdAt)}</p>
        {item.description && (
          <p className="type-body mx-auto mt-8 max-w-2xl whitespace-pre-line text-white/70">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}
