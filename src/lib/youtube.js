export function getYoutubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}
