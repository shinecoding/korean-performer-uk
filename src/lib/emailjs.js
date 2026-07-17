import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function assertEmailConfig() {
  const missing = []
  if (!SERVICE_ID) missing.push('VITE_EMAILJS_SERVICE_ID')
  if (!TEMPLATE_ID) missing.push('VITE_EMAILJS_TEMPLATE_ID')
  if (!PUBLIC_KEY) missing.push('VITE_EMAILJS_PUBLIC_KEY')
  if (missing.length) {
    throw new Error(`EmailJS is not configured. Missing: ${missing.join(', ')}`)
  }
}

export function sendContactEmail({ firstName, lastName, email, message }) {
  assertEmailConfig()

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      first_name: firstName,
      last_name: lastName,
      from_email: email,
      reply_to: email,
      message,
    },
    { publicKey: PUBLIC_KEY },
  )
}
