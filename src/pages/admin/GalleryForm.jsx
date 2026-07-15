import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGalleryItem, getGalleryItem, updateGalleryItem } from '../../lib/firestore'
import MultiImageUploader from '../../components/admin/MultiImageUploader'
import { getGalleryImages } from '../../lib/galleryImages'

const emptyForm = { title: '', imageUrls: [], description: '' }

function toPayload(form) {
  const imageUrls = (form.imageUrls || []).filter(Boolean)
  return {
    title: form.title,
    description: form.description,
    imageUrls,
    imageUrl: imageUrls[0] || '',
  }
}

export default function GalleryForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getGalleryItem(id).then((data) => {
      if (data) {
        setForm({
          ...emptyForm,
          ...data,
          imageUrls: getGalleryImages(data),
        })
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = toPayload(form)
      if (isEdit) {
        await updateGalleryItem(id, payload)
      } else {
        await createGalleryItem(payload)
      }
      navigate('/admin/gallery')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-neutral-900">{isEdit ? 'Edit Gallery Item' : 'Add Gallery Item'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Photos</label>
          <MultiImageUploader
            values={form.imageUrls}
            onChange={(imageUrls) => setForm((f) => ({ ...f, imageUrls }))}
            path="gallery"
          />
        </div>

        <div>
          <label htmlFor="title" className="mb-1 block text-xs font-medium text-neutral-500">Title</label>
          <input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-xs font-medium text-neutral-500">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || form.imageUrls.filter(Boolean).length === 0}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
