import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { sendContactEmail } from '../../lib/emailjs'
import Reveal from './Reveal'

export default function ContactSection() {
  const [searchParams] = useSearchParams()
  const performerName = searchParams.get('performer')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  useEffect(() => {
    if (!performerName) return
    setForm((f) => ({
      ...f,
      message: f.message || `I'd like to enquire about booking ${performerName}.`,
    }))
  }, [performerName])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContactEmail(form)
      setStatus('success')
      setForm({ firstName: '', lastName: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="flex min-h-[calc(100svh-4rem)] items-center border-t border-white/10"
    >
      <div className="site-shell w-full py-10 sm:py-12">
        <Reveal>
          <h2 className="type-section w-full text-center text-white">Contact</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="type-body mt-4 w-full text-center text-white/60">
            Tell us about your event and we'll connect you with the perfect performers.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="type-label mb-1.5 block text-white/50">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="type-body w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="type-label mb-1.5 block text-white/50">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="type-body w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="type-label mb-1.5 block text-white/50">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="type-body w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="type-label mb-1.5 block text-white/50">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="type-body w-full rounded border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-gold focus:outline-none"
              />
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn btn-gold btn-block">
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="type-meta text-center text-gold">Thank you — your message has been sent.</p>
            )}
            {status === 'error' && (
              <p className="type-meta text-center text-red-400">
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
