import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPerformer } from '../../lib/firestore'
import { getPerformerPhotos } from '../../lib/performerPhotos'
import { getPerformerYoutubeEmbeds } from '../../lib/performerVideos'

const PLACEHOLDER = '/performer-placeholder.svg'

export default function PerformerDetail() {
  const { id } = useParams()
  const [performer, setPerformer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    setActiveIndex(0)
    getPerformer(id)
      .then(setPerformer)
      .finally(() => setLoading(false))
  }, [id])

  const photos = performer ? getPerformerPhotos(performer) : []

  useEffect(() => {
    if (photos.length < 2) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photos.length])

  if (loading) return <p className="type-body px-6 py-28 text-center text-white/40">Loading…</p>
  if (!performer) return <p className="type-body px-6 py-28 text-center text-white/40">Performer not found.</p>

  const activePhoto = photos[activeIndex] || PLACEHOLDER
  const hasCarousel = photos.length > 1
  const embedUrls = getPerformerYoutubeEmbeds(performer)

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % photos.length)
  }

  return (
    <div>
      <section className="site-shell pt-10 pb-20 sm:pt-14 sm:pb-28 lg:pt-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square w-full overflow-hidden bg-black">
              <img
                key={activePhoto}
                src={activePhoto}
                alt={performer.name}
                className="page-fade h-full w-full object-cover object-center"
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
                {photos.map((url, index) => (
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
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start lg:pt-10">
            <p className="type-label text-white/40">{performer.role}</p>
            <h1 className="type-section mt-5 text-white">{performer.name}</h1>
            <Link
              to={`/?performer=${encodeURIComponent(performer.name)}#contact`}
              className="btn btn-gold mt-12 w-fit"
            >
              Booking Required
            </Link>
          </div>
        </div>
      </section>

      {performer.bio && (
        <section className="border-t border-white/[0.06]">
          <div className="site-shell py-24 text-center sm:py-32">
            <p className="type-label text-white/35">Biography</p>
            <p className="type-body mx-auto mt-8 max-w-2xl whitespace-pre-line text-white/55">
              {performer.bio}
            </p>
          </div>
        </section>
      )}

      {embedUrls.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="site-shell py-24 sm:py-32">
            <p className="type-label text-center text-white/35">Performance</p>
            <div className="mt-10 space-y-8">
              {embedUrls.map((embedUrl, index) => (
                <div key={embedUrl} className="aspect-video overflow-hidden bg-black">
                  <iframe
                    src={embedUrl}
                    title={`${performer.name} performance video ${index + 1}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
