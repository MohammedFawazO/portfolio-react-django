// Contact delivery, no server required.
//
// Chain, in order:
//   1. Web3Forms   - only if VITE_WEB3FORMS_KEY is set in frontend/.env
//   2. FormSubmit  - keyless, posts straight to the mailbox
//   3. mailto      - last resort when the network is unavailable
//
// FormSubmit needs a one-time activation email on the very first submission
// from a new address; until that link is clicked the API rejects the post and
// we fall through to the mailto.
import { profile } from '../data/content'

const WEB3FORMS_ACCESS_KEY = import.meta.env?.VITE_WEB3FORMS_KEY || ''
const CONTACT_EMAIL = profile.email
const TIMEOUT_MS = 12000

const postJson = async (url, body) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

const openMailto = (data, subject, projectLine) => {
  const body = encodeURIComponent(
    `${data.message}${projectLine}\n\n- ${data.name} (${data.email})`
  )
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`
  return { success: true, delivered: 'mailto' }
}

const contactService = {
  send: async (data) => {
    const subject = `Portfolio message from ${data.name}`
    const projectLine = data.projectType ? `\nProject type: ${data.projectType}` : ''
    const message = `${data.message}${projectLine}`

    if (WEB3FORMS_ACCESS_KEY) {
      const res = await postJson('https://api.web3forms.com/submit', {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: data.name,
        reply_to: data.email,
        message,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) throw new Error(json?.message || 'Failed to send')
      return { ...json, delivered: 'web3forms' }
    }

    // No key configured: FormSubmit needs none, so the form still delivers
    // instead of dumping the visitor into their mail client.
    try {
      const res = await postJson(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        name: data.name,
        email: data.email,
        subject,
        message,
        _template: 'table',
        _captcha: 'false',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) !== 'true') {
        throw new Error(json?.message || 'Form delivery rejected')
      }
      return { ...json, delivered: 'formsubmit' }
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn('[contact] delivery failed, falling back to mailto:', error)
      }
      return openMailto(data, subject, projectLine)
    }
  },
}

export default contactService