/** Shrink/grow font so single-line text fills the element's content-box width. */
export function fitTextToWidth(el, { min = 12, max = 72 } = {}) {
  if (!el?.parentElement) return

  const parent = el.parentElement
  const style = getComputedStyle(parent)
  const available =
    parent.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0')
  if (available <= 0) return

  el.style.whiteSpace = 'nowrap'
  el.style.display = 'block'
  el.style.width = 'max-content'
  el.style.maxWidth = 'none'

  let lo = min
  let hi = max
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    el.style.fontSize = `${mid}px`
    if (el.scrollWidth > available) hi = mid
    else lo = mid
  }

  el.style.fontSize = `${lo}px`
  el.style.width = '100%'
}
