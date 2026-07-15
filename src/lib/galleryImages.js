/** Normalize cover + gallery URLs from older (`imageUrl`) and newer (`imageUrls`) docs. */
export function getGalleryImages(item) {
  const fromArray = Array.isArray(item?.imageUrls)
    ? item.imageUrls.filter(Boolean)
    : []
  if (fromArray.length) return fromArray
  if (item?.imageUrl) return [item.imageUrl]
  return []
}

export function getGalleryCover(item) {
  return getGalleryImages(item)[0] || ''
}
