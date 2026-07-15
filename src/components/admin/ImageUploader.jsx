import { useState } from 'react'
import { uploadImage } from '../../lib/storage'

export default function ImageUploader({ value, onChange, path, compact = false }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(path, file)
      onChange(url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (compact) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        {value ? (
          <img src={value} alt="Preview" className="h-12 w-12 rounded-md border border-neutral-200 object-contain" />
        ) : (
          <div className="h-12 w-12 rounded-md border border-dashed border-neutral-300" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="w-28 text-xs text-neutral-600 file:mr-2 file:rounded-md file:border-0 file:bg-neutral-900 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-neutral-700"
        />
        {uploading && <p className="text-xs text-neutral-400">Uploading…</p>}
        {error && <p className="text-xs text-red-500">Failed</p>}
      </div>
    )
  }

  return (
    <div>
      {value && (
        <img src={value} alt="Preview" className="mb-3 h-40 w-40 rounded-md border border-neutral-200 object-cover" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
      />
      {uploading && <p className="mt-2 text-xs text-neutral-400">Uploading…</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}
