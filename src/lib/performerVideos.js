import { getYoutubeEmbedUrl } from './youtube'

/** Normalize video URLs from older (`youtubeUrl`) and newer (`youtubeUrls`) docs. */
export function getPerformerYoutubeUrls(performer) {
  const fromArray = Array.isArray(performer?.youtubeUrls)
    ? performer.youtubeUrls.filter(Boolean)
    : []
  if (fromArray.length) return fromArray
  if (performer?.youtubeUrl) return [performer.youtubeUrl]
  return []
}

export function getPerformerYoutubeEmbeds(performer) {
  return getPerformerYoutubeUrls(performer)
    .map((url) => getYoutubeEmbedUrl(url))
    .filter(Boolean)
}
