import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ADMIN_PAGE_SIZE, deleteGalleryItem, listGalleryPage } from '../../lib/firestore'
import { deleteImageByUrl } from '../../lib/storage'
import { formatDate } from '../../lib/date'
import { getGalleryCover, getGalleryImages } from '../../lib/galleryImages'
import Pagination from '../../components/Pagination'
import { useCursorPagination } from '../../hooks/useCursorPagination'

export default function GalleryAdmin() {
  const fetchPage = useCallback(
    (startAfterDoc) =>
      listGalleryPage({
        pageSize: ADMIN_PAGE_SIZE,
        startAfterDoc,
      }),
    [],
  )

  const { items, loading, page, hasPrev, hasNext, next, prev, reload } = useCursorPagination(
    fetchPage,
    [],
  )

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return
    await deleteGalleryItem(item.id)
    const urls = getGalleryImages(item)
    await Promise.all(urls.map((url) => deleteImageByUrl(url)))
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Gallery</h1>
        <Link
          to="/admin/gallery/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add Item
        </Link>
      </div>

      {loading && <p className="mt-8 text-sm text-neutral-400">Loading…</p>}

      {!loading && (
        <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map((item) => {
                const cover = getGalleryCover(item)
                return (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {cover ? (
                      <img src={cover} alt={item.title} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-neutral-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{item.title}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/gallery/${item.id}`} className="mr-4 text-neutral-600 hover:text-neutral-900">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
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
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                    No gallery items found.
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
