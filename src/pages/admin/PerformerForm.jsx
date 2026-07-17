import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPerformer, getPerformer, updatePerformer } from '../../lib/firestore'
import MultiImageUploader from '../../components/admin/MultiImageUploader'
import { getPerformerPhotos } from '../../lib/performerPhotos'
import { getPerformerYoutubeUrls } from '../../lib/performerVideos'

const emptyForm = {
  name: '',
  role: '',
  category: 'korean',
  bio: '',
  photoUrls: [],
  youtubeUrls: [''],
}

function toPayload(form) {
  const photoUrls = (form.photoUrls || []).filter(Boolean)
  const youtubeUrls = (form.youtubeUrls || []).map((u) => u.trim()).filter(Boolean)
  return {
    name: form.name,
    role: form.role,
    category: form.category,
    bio: form.bio,
    youtubeUrls,
    youtubeUrl: youtubeUrls[0] || '',
    photoUrls,
    photoUrl: photoUrls[0] || '',
  }
}

export default function PerformerForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getPerformer(id).then((data) => {
      if (data) {
        const youtubeUrls = getPerformerYoutubeUrls(data)
        setForm({
          ...emptyForm,
          ...data,
          photoUrls: getPerformerPhotos(data),
          youtubeUrls: youtubeUrls.length ? youtubeUrls : [''],
        })
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleYoutubeChange = (index, value) => {
    setForm((f) => {
      const youtubeUrls = [...f.youtubeUrls]
      youtubeUrls[index] = value
      return { ...f, youtubeUrls }
    })
  }

  const addYoutube = () => {
    setForm((f) => ({ ...f, youtubeUrls: [...f.youtubeUrls, ''] }))
  }

  const removeYoutube = (index) => {
    setForm((f) => {
      const youtubeUrls = f.youtubeUrls.filter((_, i) => i !== index)
      return { ...f, youtubeUrls: youtubeUrls.length ? youtubeUrls : [''] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = toPayload(form)
      if (isEdit) {
        await updatePerformer(id, payload)
      } else {
        await createPerformer(payload)
      }
      navigate('/admin/performers')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-neutral-900">{isEdit ? 'Edit Performer' : 'Add Performer'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Photos</label>
          <MultiImageUploader
            values={form.photoUrls}
            onChange={(photoUrls) => setForm((f) => ({ ...f, photoUrls }))}
            path="performers"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-neutral-500">Name</label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-1 block text-xs font-medium text-neutral-500">Role / Occupation</label>
            <input
              id="role"
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-medium text-neutral-500">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          >
            <option value="korean">Korean</option>
            <option value="asian">Asian</option>
          </select>
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-xs font-medium text-neutral-500">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={6}
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-xs font-medium text-neutral-500">YouTube Video URLs</label>
            <button
              type="button"
              onClick={addYoutube}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              + Add video
            </button>
          </div>
          <div className="space-y-2">
            {form.youtubeUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleYoutubeChange(index, e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeYoutube(index)}
                  className="shrink-0 rounded-md border border-neutral-300 px-3 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-red-600"
                  aria-label={`Remove video ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-neutral-400">Add as many YouTube links as you like.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/performers')}
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
