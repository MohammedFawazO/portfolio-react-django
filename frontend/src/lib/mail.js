import showToast from '../components/ui/Toast'
import { profile } from '../data/content'

// Gmail's web compose view. A plain mailto: is unreliable here: when no app
// handles the scheme a mobile browser resolves it as a relative path and the
// SPA catch-all route then renders the 404 page, and where a client does exist
// the visitor just gets bounced into whatever mail app they happen to have.
// Hitting the compose view directly always lands in a compose window with the
// recipient already filled in, and Gmail hands off to the native app on mobile
// when one is installed.
const GMAIL_COMPOSE = 'https://mail.google.com/mail/?'

export function composeUrl(email = profile.email, subject = '', body = '') {
  const params = new URLSearchParams({ view: 'cm', to: email })
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `${GMAIL_COMPOSE}${params.toString()}`
}

export async function copyEmail(email = profile.email) {
  try {
    await navigator.clipboard.writeText(email)
    showToast.success('Email address copied')
    return true
  } catch {
    showToast.error('Could not copy - long-press the address instead.')
    return false
  }
}