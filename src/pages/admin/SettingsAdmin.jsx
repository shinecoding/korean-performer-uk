import { useEffect, useState } from 'react'
import { getSocialSettings, saveSocialSettings } from '../../lib/firestore'
import { defaultSocial } from '../../lib/defaultContent'

const fields = [
  { name: 'website', label: 'Website URL', placeholder: 'https://...' },
  { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { name: 'whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/...' },
  { name: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
]

export default function SettingsAdmin() {
  const [form, setForm] = useState(defaultSocial)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSocialSettings()
      .then((data) => {
        setForm({ ...defaultSocial, ...data })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await saveSocialSettings(form)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Footer Links</h1>
      <p className="mt-1 text-sm text-neutral-500">Edit the social media links shown in the footer.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block text-xs font-medium text-neutral-500">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
        ))}

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
