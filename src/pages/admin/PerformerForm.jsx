import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPerformer, getPerformer, updatePerformer } from '../../lib/firestore'
import MultiImageUploader from '../../components/admin/MultiImageUploader'
import { getPerformerPhotos } from '../../lib/performerPhotos'

const emptyForm = {
  name: '',
  role: '',
  category: 'korean',
  shortIntro: '',
  bio: '',
  photoUrls: [],
  youtubeUrl: '',
}

function toPayload(form) {
  const photoUrls = (form.photoUrls || []).filter(Boolean)
  return {
    name: form.name,
    role: form.role,
    category: form.category,
    shortIntro: form.shortIntro,
    bio: form.bio,
    youtubeUrl: form.youtubeUrl,
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
        setForm({
          ...emptyForm,
          ...data,
          photoUrls: getPerformerPhotos(data),
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
          <label htmlFor="shortIntro" className="mb-1 block text-xs font-medium text-neutral-500">Short Intro</label>
          <textarea
            id="shortIntro"
            name="shortIntro"
            rows={2}
            value={form.shortIntro}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
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
          <label htmlFor="youtubeUrl" className="mb-1 block text-xs font-medium text-neutral-500">YouTube Video URL</label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            value={form.youtubeUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
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
