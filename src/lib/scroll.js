/** Scroll so the target's top border sits flush under the sticky header. */
export function scrollToId(id, behavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return false

  const header = document.querySelector('header')
  const headerOffset = header ? Math.round(header.getBoundingClientRect().height) : 0
  const top = Math.round(el.getBoundingClientRect().top + window.scrollY - headerOffset)

  window.scrollTo({ top: Math.max(0, top), behavior })
  return true
}

export function scrollToContact(behavior = 'smooth') {
  return scrollToId('contact', behavior)
}
