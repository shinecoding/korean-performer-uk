import { useState } from 'react'
import { deleteImageByUrl, uploadImage } from '../../lib/storage'

export default function MultiImageUploader({ values = [], onChange, path, preview = 'cover' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (e) => {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return

    setUploading(true)
    setError('')
    try {
      const urls = []
      for (const file of files) {
        urls.push(await uploadImage(path, file))
      }
      onChange([...values, ...urls])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeAt = async (index) => {
    const url = values[index]
    const next = values.filter((_, i) => i !== index)
    onChange(next)
    if (url) await deleteImageByUrl(url)
  }

  const makeCover = (index) => {
    if (index === 0) return
    const next = [...values]
    const [selected] = next.splice(index, 1)
    next.unshift(selected)
    onChange(next)
  }

  const natural = preview === 'natural'

  return (
    <div>
      {values.length > 0 && (
        <div className={`mb-3 grid gap-3 ${natural ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'}`}>
          {values.map((url, index) => (
            <div
              key={url}
              className={`group relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 ${
                natural ? '' : 'aspect-[3/4]'
              }`}
            >
              <img
                src={url}
                alt=""
                className={
                  natural
                    ? 'mx-auto block h-auto max-h-56 w-full object-contain'
                    : 'h-full w-full object-cover'
                }
              />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-neutral-900/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    className="flex-1 rounded bg-white/90 px-1 py-1 text-[10px] font-medium text-neutral-800"
                  >
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="flex-1 rounded bg-white/90 px-1 py-1 text-[10px] font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={uploading}
        className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
      />
      <p className="mt-1 text-xs text-neutral-400">
        You can select multiple images. The first photo is used as the cover on the list.
      </p>
      {uploading && <p className="mt-2 text-xs text-neutral-400">Uploading…</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}
