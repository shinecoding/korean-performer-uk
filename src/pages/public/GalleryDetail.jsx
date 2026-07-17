import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGalleryItem } from '../../lib/firestore'
import { formatDate } from '../../lib/date'
import { getGalleryImages } from '../../lib/galleryImages'

const PLACEHOLDER = '/gallery-placeholder.svg'
const SWIPE_THRESHOLD = 48

export default function GalleryDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(null)

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

  const onTouchStart = (e) => {
    if (!hasCarousel) return
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (!hasCarousel || touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    if (dx < 0) goNext()
    else goPrev()
  }

  return (
    <div className="site-shell py-16 sm:py-20 lg:py-24">
      <div
        className="relative touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={activeImage}
          src={activeImage}
          alt={item.title}
          draggable={false}
          className="page-fade block h-auto w-full object-contain"
        />

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 sm:left-3 sm:h-14 sm:w-14"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 sm:right-3 sm:h-14 sm:w-14"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 px-3 py-1 type-meta text-white/80">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {hasCarousel && (
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-2.5 w-2.5 transition-colors ${
                index === activeIndex ? 'bg-gold' : 'bg-white/30 hover:bg-white/55'
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
