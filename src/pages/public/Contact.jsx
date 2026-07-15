import { Navigate, useSearchParams } from 'react-router-dom'

/** Legacy /contact route — send people to the homepage contact section. */
export default function Contact() {
  const [searchParams] = useSearchParams()
  const qs = searchParams.toString()
  return <Navigate to={`/${qs ? `?${qs}` : ''}#contact`} replace />
}
