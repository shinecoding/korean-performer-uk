import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSiteContent } from '../../lib/firestore'
import { defaultContent, mergeSiteContent } from '../../lib/defaultContent'
import ContactSection from '../../components/public/ContactSection'
import { scrollToContact } from '../../lib/scroll'

export default function Home() {
  const [content, setContent] = useState(defaultContent)
  const [contentReady, setContentReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const aboutRef = useRef(null)

  useEffect(() => {
    getSiteContent()
      .then((data) => {
        if (data) setContent(mergeSiteContent(data))
      })
      .finally(() => setContentReady(true))
  }, [])

  useEffect(() => {
    if (location.hash !== '#contact') return

    let cancelled = false
    const run = (behavior) => {
      if (!cancelled) scrollToContact(behavior)
    }

    // Smooth first, then correct once layout (fonts / firestore text) has settled
    const t0 = requestAnimationFrame(() => run('smooth'))
    const t1 = setTimeout(() => run('auto'), contentReady ? 100 : 400)

    return () => {
      cancelled = true
      cancelAnimationFrame(t0)
      clearTimeout(t1)
    }
  }, [location.hash, location.search, location.key, contentReady, content])

  useEffect(() => {
    const root = aboutRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        root.classList.add('is-visible')
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const clients = content.clients

  const goToContact = (e) => {
    // Same-page hash clicks often don't re-fire navigation; scroll ourselves.
    if (location.pathname === '/') {
      e.preventDefault()
      navigate('/#contact')
      scrollToContact('smooth')
      setTimeout(() => scrollToContact('auto'), 320)
    }
  }

  return (
    <div>
      <section className="relative flex h-svh min-h-svh flex-col justify-center overflow-hidden border-b border-white/10 text-left">
        {content.heroImageUrl ? (
          <>
            <img
              src={content.heroImageUrl}
              alt={content.heroTitle}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/25" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,169,97,0.08),_transparent_60%)]" />
        )}
        <div className="site-shell animate-fade-up relative">
          <div className="flex w-full flex-col items-start lg:w-1/2">
            <h1 className="type-hero text-white">{content.heroTitle}</h1>
            <p className="animate-fade-in animate-fade-in-delay-1 type-body mt-8 text-white/60">
              {content.heroIntro}
            </p>
            <div className="animate-fade-in animate-fade-in-delay-2 mt-14 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/performers/korean" className="btn btn-gold w-full text-center">
                Meet Our Performers
              </Link>
              <Link to="/#contact" onClick={goToContact} className="btn btn-ghost w-full text-center">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="site-shell py-24 sm:py-32">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-6">
          <h2
            className={`reveal order-1 type-section text-white ${
              content.aboutImageUrl ? 'lg:order-2 lg:col-start-2' : 'text-center lg:col-span-2'
            }`}
          >
            {content.aboutTitle}
          </h2>

          {content.aboutImageUrl && (
            <div className="reveal order-2 overflow-hidden bg-white/5 lg:order-1 lg:row-span-2">
              <img
                src={content.aboutImageUrl}
                alt={content.aboutTitle}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          )}

          <p
            className={`reveal reveal-delay-1 order-3 type-body whitespace-pre-line text-white/60 ${
              content.aboutImageUrl
                ? 'lg:order-3 lg:col-start-2'
                : 'text-center lg:col-span-2'
            }`}
          >
            {content.aboutText}
          </p>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="border-t border-white/10 py-24 sm:py-28">
          <h2 className="type-section text-center text-white">Our Clients</h2>
          <div className="relative mt-12 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-32" />
            <div className="flex w-max animate-marquee items-center gap-16">
              {[...clients, ...clients].map((client, i) => (
                <div key={`${client.name}-${i}`} className="flex h-16 w-36 shrink-0 items-center justify-center">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-14 max-w-full object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                    />
                  ) : (
                    <span className="type-meta text-center text-white/50">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
    </div>
  )
}
