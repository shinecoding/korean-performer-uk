import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ADMIN_PAGE_SIZE,
  deletePerformer,
  listPerformersPage,
} from '../../lib/firestore'
import { deleteImageByUrl } from '../../lib/storage'
import { getPerformerCover, getPerformerPhotos } from '../../lib/performerPhotos'
import Pagination from '../../components/Pagination'
import { useCursorPagination } from '../../hooks/useCursorPagination'

export default function PerformersAdmin() {
  const [filter, setFilter] = useState('all')

  const fetchPage = useCallback(
    (startAfterDoc) =>
      listPerformersPage({
        category: filter === 'all' ? undefined : filter,
        pageSize: ADMIN_PAGE_SIZE,
        startAfterDoc,
      }),
    [filter],
  )

  const { items, loading, page, hasPrev, hasNext, next, prev, reload } = useCursorPagination(
    fetchPage,
    [filter],
  )

  const handleDelete = async (performer) => {
    if (!confirm(`Delete ${performer.name}?`)) return
    await deletePerformer(performer.id)
    const photos = getPerformerPhotos(performer)
    await Promise.all(photos.map((url) => deleteImageByUrl(url)))
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Performers</h1>
        <Link
          to="/admin/performers/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add Performer
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        {['all', 'korean', 'asian'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === key ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-sm text-neutral-400">Loading…</p>}

      {!loading && (
        <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map((performer) => {
                const cover = getPerformerCover(performer)
                return (
                  <tr key={performer.id}>
                    <td className="px-4 py-3">
                      {cover ? (
                        <img src={cover} alt={performer.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-neutral-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{performer.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{performer.role}</td>
                    <td className="px-4 py-3 capitalize text-neutral-600">{performer.category}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/performers/${performer.id}`} className="mr-4 text-neutral-600 hover:text-neutral-900">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(performer)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                    No performers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={prev}
        onNext={next}
        loading={loading}
        variant="admin"
      />
    </div>
  )
}
