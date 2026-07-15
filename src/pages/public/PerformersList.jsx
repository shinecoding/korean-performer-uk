import { useCallback } from 'react'
import { listPerformersPage, PUBLIC_PAGE_SIZE } from '../../lib/firestore'
import PerformerCard from '../../components/public/PerformerCard'
import Reveal from '../../components/public/Reveal'
import Pagination from '../../components/Pagination'
import { useCursorPagination } from '../../hooks/useCursorPagination'

const titles = {
  korean: 'Korean Performers',
  asian: 'Asian Performers',
}

export default function PerformersList({ category }) {
  const fetchPage = useCallback(
    (startAfterDoc) =>
      listPerformersPage({
        category,
        pageSize: PUBLIC_PAGE_SIZE,
        startAfterDoc,
      }),
    [category],
  )

  const { items, loading, page, hasPrev, hasNext, next, prev } = useCursorPagination(fetchPage, [
    category,
  ])

  return (
    <div className="site-shell py-28 sm:py-32">
      <h1 key={category} className="animate-fade-up type-section text-center text-white">
        {titles[category]}
      </h1>

      {loading && (
        <p className="animate-fade-in type-body mt-16 text-center text-white/40">Loading…</p>
      )}

      {!loading && items.length === 0 && (
        <p className="animate-fade-in type-body mt-16 text-center text-white/40">
          No performers added yet.
        </p>
      )}

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {items.map((performer, index) => (
          <Reveal key={`${category}-${performer.id}-${page}`} delay={(index % 3) * 100}>
            <PerformerCard performer={performer} />
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
