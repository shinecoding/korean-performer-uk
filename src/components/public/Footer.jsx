import { useEffect, useState } from 'react'
import { FaGlobe, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { getSocialSettings } from '../../lib/firestore'
import { defaultSocial } from '../../lib/defaultContent'

export default function Footer() {
  const [social, setSocial] = useState(defaultSocial)

  useEffect(() => {
    getSocialSettings().then((data) => {
      if (data) setSocial({ ...defaultSocial, ...data })
    })
  }, [])

  const icons = [
    { key: 'website', href: social.website, Icon: FaGlobe, label: 'Website' },
    { key: 'instagram', href: social.instagram, Icon: FaInstagram, label: 'Instagram' },
    { key: 'whatsapp', href: social.whatsapp, Icon: FaWhatsapp, label: 'WhatsApp' },
    { key: 'youtube', href: social.youtube, Icon: FaYoutube, label: 'YouTube' },
  ].filter((item) => item.href)

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="site-shell flex flex-col items-center gap-8 py-16 text-center sm:py-20">
        <p className="type-subhead text-white">
          Korean &amp; Asian <span className="text-gold">Performers UK</span>
        </p>

        {icons.length > 0 && (
          <div className="flex gap-5">
            {icons.map(({ key, href, Icon, label }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}

        <p className="type-meta text-white/40">
          © {new Date().getFullYear()} Korean &amp; Asian Performers UK. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
