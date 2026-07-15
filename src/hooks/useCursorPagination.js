import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Cursor pagination for Firestore list*Page helpers.
 * @param {(startAfterDoc: unknown) => Promise<{ items: unknown[], lastDoc: unknown, hasMore: boolean }>} fetchPage
 * @param {unknown[]} resetDeps - when these change, reset to page 1
 */
export function useCursorPagination(fetchPage, resetDeps = []) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [cursors, setCursors] = useState([null])
  const [hasMore, setHasMore] = useState(false)
  const fetchRef = useRef(fetchPage)
  fetchRef.current = fetchPage

  const loadPage = useCallback(async (index, cursorList) => {
    setLoading(true)
    setError(null)
    try {
      const startAfterDoc = cursorList[index] ?? null
      const result = await fetchRef.current(startAfterDoc)
      setItems(result.items)
      setHasMore(result.hasMore)
      setPageIndex(index)

      const nextCursors = cursorList.slice(0, index + 1)
      if (result.hasMore && result.lastDoc) {
        nextCursors[index + 1] = result.lastDoc
      }
      setCursors(nextCursors)
    } catch (err) {
      console.error(err)
      setError(err)
      setItems([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPage(0, [null])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  const next = () => {
    if (!hasMore || loading) return
    const nextIndex = pageIndex + 1
    if (nextIndex > 0 && !cursors[nextIndex]) return
    loadPage(nextIndex, cursors)
  }

  const prev = () => {
    if (pageIndex <= 0 || loading) return
    loadPage(pageIndex - 1, cursors)
  }

  const reload = () => loadPage(0, [null])

  return {
    items,
    loading,
    error,
    page: pageIndex + 1,
    hasPrev: pageIndex > 0,
    hasNext: hasMore,
    next,
    prev,
    reload,
  }
}
