import { useCallback } from 'react'
import { listGalleryPage, PUBLIC_PAGE_SIZE } from '../../lib/firestore'
import GalleryCard from '../../components/public/GalleryCard'
import Reveal from '../../components/public/Reveal'
import Pagination from '../../components/Pagination'
import { useCursorPagination } from '../../hooks/useCursorPagination'

export default function Gallery() {
  const fetchPage = useCallback(
    (startAfterDoc) =>
      listGalleryPage({
        pageSize: PUBLIC_PAGE_SIZE,
        startAfterDoc,
      }),
    [],
  )

  const { items, loading, page, hasPrev, hasNext, next, prev } = useCursorPagination(fetchPage, [])

  return (
    <div className="site-shell py-28 sm:py-32">
      <h1 className="animate-fade-up type-section text-center text-white">Gallery</h1>

      {loading && (
        <p className="animate-fade-in type-body mt-16 text-center text-white/40">Loading…</p>
      )}

      {!loading && items.length === 0 && (
        <p className="animate-fade-in type-body mt-16 text-center text-white/40">
          No gallery items yet.
        </p>
      )}

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {items.map((item, index) => (
          <Reveal key={`${item.id}-${page}`} delay={(index % 3) * 100}>
            <GalleryCard item={item} />
          </Reveal>
        ))}
      </div>

      <Pagination
        page={page}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={prev}
        onNext={next}
        loading={loading}
        variant="public"
      />
    </div>
  )
}
