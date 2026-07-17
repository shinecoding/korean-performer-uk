import { useEffect } from 'react'
import { getSiteContent } from '../lib/firestore'
import { defaultContent, mergeSiteContent } from '../lib/defaultContent'

const DEFAULT_FAVICON = '/favicon.svg'

export function applyFavicon(url) {
  const href = url || DEFAULT_FAVICON
  const type = href.toLowerCase().includes('.svg') ? 'image/svg+xml' : undefined

  const ensureLink = (rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    link.href = href
    if (type) link.type = type
    else link.removeAttribute('type')
  }

  ensureLink('icon')
  ensureLink('apple-touch-icon')
}

/** Loads site favicon from Firestore and applies it to the document head. */
export default function FaviconSync() {
  useEffect(() => {
    let cancelled = false
    getSiteContent()
      .then((data) => {
        if (cancelled) return
        const content = data ? mergeSiteContent(data) : defaultContent
        applyFavicon(content.faviconUrl)
      })
      .catch(() => {
        if (!cancelled) applyFavicon(DEFAULT_FAVICON)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
