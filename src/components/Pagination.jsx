export default function Pagination({ page, hasPrev, hasNext, onPrev, onNext, loading, variant = 'public' }) {
  if (!hasPrev && !hasNext) return null

  const isPublic = variant === 'public'

  const btnBase = isPublic
    ? 'btn min-w-[7rem] text-center disabled:opacity-30'
    : 'rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-40'

  const prevClass = isPublic
    ? `${btnBase} btn-ghost`
    : `${btnBase} border-neutral-300 text-neutral-600 hover:bg-neutral-100`

  const nextClass = isPublic
    ? `${btnBase} btn-gold`
    : `${btnBase} border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700`

  const pageClass = isPublic
    ? 'type-label text-white/40'
    : 'text-sm text-neutral-500'

  return (
    <div
      className={`flex items-center justify-center gap-4 ${
        isPublic ? 'mt-16' : 'mt-6'
      }`}
    >
      <button type="button" onClick={onPrev} disabled={!hasPrev || loading} className={prevClass}>
        Previous
      </button>
      <span className={pageClass}>Page {page}</span>
      <button type="button" onClick={onNext} disabled={!hasNext || loading} className={nextClass}>
        Next
      </button>
    </div>
  )
}
