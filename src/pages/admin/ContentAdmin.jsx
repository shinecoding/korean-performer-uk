import { useEffect, useState } from 'react'
import { getSiteContent, saveSiteContent } from '../../lib/firestore'
import { defaultContent, mergeSiteContent } from '../../lib/defaultContent'
import ImageUploader from '../../components/admin/ImageUploader'

export default function ContentAdmin() {
  const [form, setForm] = useState(defaultContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSiteContent()
      .then((data) => {
        setForm(data ? mergeSiteContent(data) : defaultContent)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const updateClient = (index, field, value) => {
    setForm((f) => ({
      ...f,
      clients: f.clients.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }))
  }

  const addClient = () => {
    setForm((f) => ({ ...f, clients: [...f.clients, { name: '', logoUrl: '' }] }))
  }

  const removeClient = (index) => {
    setForm((f) => ({ ...f, clients: f.clients.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const clients = form.clients.filter((c) => c.name.trim())
      const { founderText: _omit, ...rest } = form
      await saveSiteContent({ ...rest, clients, founderText: '' })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Site Content</h1>
      <p className="mt-1 text-sm text-neutral-500">Edit the homepage and About Us text.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">
            Homepage Banner Image (배너 이미지)
          </label>
          <ImageUploader
            value={form.heroImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))}
            path="content"
          />
          <p className="mt-1 text-xs text-neutral-400">
            권장 비율은 가로로 넓은 사진(예: 1920x1080)입니다. 모바일/데스크톱 모두 화면 너비에 꽉 차게 자동으로 잘려서 표시됩니다.
          </p>
        </div>

        <div>
          <label htmlFor="heroTitle" className="mb-1 block text-xs font-medium text-neutral-500">Homepage Title</label>
          <input
            id="heroTitle"
            name="heroTitle"
            value={form.heroTitle}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="heroIntro" className="mb-1 block text-xs font-medium text-neutral-500">Homepage Intro</label>
          <textarea
            id="heroIntro"
            name="heroIntro"
            rows={5}
            value={form.heroIntro}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="aboutTitle" className="mb-1 block text-xs font-medium text-neutral-500">About Section Title</label>
          <input
            id="aboutTitle"
            name="aboutTitle"
            value={form.aboutTitle}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">About Section Image</label>
          <ImageUploader
            value={form.aboutImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, aboutImageUrl: url }))}
            path="content"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Portrait photo works best (e.g. 4:5). Shown beside the About text — not as a background.
          </p>
        </div>

        <div>
          <label htmlFor="aboutText" className="mb-1 block text-xs font-medium text-neutral-500">About Us Text</label>
          <textarea
            id="aboutText"
            name="aboutText"
            rows={8}
            value={form.aboutText}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-500">
            Our Clients (로고 이미지 + 이름 — 홈페이지에서 좌우로 흐르는 형태로 표시됩니다)
          </label>
          <div className="space-y-3">
            {form.clients.map((client, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
                <ImageUploader
                  value={client.logoUrl}
                  onChange={(url) => updateClient(index, 'logoUrl', url)}
                  path="clients"
                  compact
                />
                <input
                  value={client.name}
                  onChange={(e) => updateClient(index, 'name', e.target.value)}
                  placeholder="Client name"
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeClient(index)}
                  className="shrink-0 text-sm text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addClient}
            className="mt-3 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            + 클라이언트 추가
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-green-600">Saved.</span>}
        </div>
      </form>
    </div>
  )
}
