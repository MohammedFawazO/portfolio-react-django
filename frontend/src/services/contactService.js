// Backend-free contact handler.
// Primary: Web3Forms (free, no server needed) — get a key at https://web3forms.com
// Fallback: opens the visitor's mail client so messages still reach you.

const WEB3FORMS_ACCESS_KEY = '' // TODO: paste your Web3Forms access key here
const CONTACT_EMAIL = 'fawaz@example.com' // TODO: replace with your real email

const contactService = {
  send: async (data) => {
    if (WEB3FORMS_ACCESS_KEY) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio message from ${data.name}`,
          ...data,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error('Failed to send')
      return json
    }

    const subject = encodeURIComponent(`Portfolio message from ${data.name}`)
    const body = encodeURIComponent(
      `${data.message}\n\n— ${data.name} (${data.email})`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    return { success: true }
  },
}

export default contactService
