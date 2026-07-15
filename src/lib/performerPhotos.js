/** Normalize cover + gallery URLs from older (`photoUrl`) and newer (`photoUrls`) docs. */
export function getPerformerPhotos(performer) {
  const fromArray = Array.isArray(performer?.photoUrls)
    ? performer.photoUrls.filter(Boolean)
    : []
  if (fromArray.length) return fromArray
  if (performer?.photoUrl) return [performer.photoUrl]
  return []
}

export function getPerformerCover(performer) {
  return getPerformerPhotos(performer)[0] || ''
}
