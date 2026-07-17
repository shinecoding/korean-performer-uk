export const defaultContent = {
  faviconUrl: '/favicon.svg',
  heroImageUrl: '/hero.jpg',
  heroTitle: 'Korean & Asian Performers UK',
  heroIntro:
    'Connecting exceptional Korean and Asian performers with stages across the UK and Europe.',
  aboutTitle: 'About Us',
  aboutImageUrl: '/about.jpg',
  aboutText: `Korean & Asian performers UK is a specialist entertainment agency connecting you with outstanding live music and performers for weddings, corporate events, private functions, concerts and arts festivals.

We represent a wide network of professional Korean and Asian performers throughout the UK and Europe, including musicians, dancers, singers, Taekwondo artists, percussionists, and other cultural performers. Based on your event's theme, audience, and objectives, we handpick the perfect talent to create an unforgettable experience.

Share your event requirements, preferred style, and budget, and we'll connect you with the perfect performers. Enjoy transparent pricing, prompt communication, and a seamless booking experience.`,
  clients: [
    { name: 'EBRD (European Bank)', logoUrl: '' },
    { name: 'British Museum', logoUrl: '' },
    { name: 'V&A Museum', logoUrl: '' },
    { name: 'ITV2', logoUrl: '' },
    { name: 'Indigo2', logoUrl: '' },
    { name: '22 Bishopsgate', logoUrl: '' },
    { name: 'Hyundai', logoUrl: '' },
    { name: 'Lancaster University', logoUrl: '' },
    { name: 'Oxford University', logoUrl: '' },
    { name: 'Cardiff University', logoUrl: '' },
  ],
}

export const defaultSocial = {
  website: '',
  instagram: '',
  whatsapp: '',
  youtube: '',
}

// Older saved content may have `clients` as a plain string array — normalize either shape.
export function normalizeClients(clients) {
  if (!Array.isArray(clients)) return []
  return clients.map((c) => (typeof c === 'string' ? { name: c, logoUrl: '' } : c))
}

/** Merge Firestore site content with defaults; empty strings keep defaults for media URLs. */
export function mergeSiteContent(data) {
  const merged = { ...defaultContent, ...data }
  if (!merged.heroImageUrl) merged.heroImageUrl = defaultContent.heroImageUrl
  if (!merged.aboutImageUrl) merged.aboutImageUrl = defaultContent.aboutImageUrl
  if (!merged.faviconUrl) merged.faviconUrl = defaultContent.faviconUrl
  merged.clients = normalizeClients(merged.clients)
  // Drop legacy field if present in older Firestore docs
  delete merged.founderText
  return merged
}
