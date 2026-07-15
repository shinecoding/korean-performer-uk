import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function sendContactEmail({ firstName, lastName, email, message }) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      first_name: firstName,
      last_name: lastName,
      from_email: email,
      message,
    },
    { publicKey: PUBLIC_KEY },
  )
}
