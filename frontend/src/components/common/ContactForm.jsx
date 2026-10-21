import { useState } from 'react'
import contactService from '../../services/contactService'
import showToast from '../ui/Toast'

const PROJECT_TYPES = [
  'New website',
  'Web application',
  'Django / Python backend',
  'React frontend',
  'API or integration',
  'Bug fix / maintenance',
  'Full-time role',
  'Something else',
]

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  const validate = () => {
    const newErrors = {}
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Editing clears a stale banner so the message always describes what just happened.
  const update = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (status) setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields and try again.' })
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      const res = await contactService.send(formData)
      const viaMailto = res?.delivered === 'mailto'
      showToast.success(viaMailto ? 'Opening your mail app…' : 'Message sent successfully!')
      setStatus({
        type: 'success',
        message: viaMailto
          ? 'Your mail client opened with the message ready to send.'
          : 'Thanks - your message is in. I usually reply within 24-48 hours.',
      })
      setFormData({ name: '', email: '', projectType: '', message: '' })
      setErrors({})
    } catch {
      showToast.error('Failed to send message. Please try again.')
      setStatus({
        type: 'error',
        message: 'That did not go through. Please email me directly and I will pick it up.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ct-form" noValidate>
      <div>
        <label htmlFor="contact-name" className="ct-label">Name</label>
        <input
          id="contact-name"
          className="ct-input"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={update('name')}
        />
        {errors.name && <p className="ct-error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="ct-label">Email</label>
        <input
          id="contact-email"
          className="ct-input"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={update('email')}
        />
        {errors.email && <p className="ct-error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-project" className="ct-label">
          Project type <span className="normal-case tracking-normal text-[#666]">(optional)</span>
        </label>
        <div className="relative">
          <select
            id="contact-project"
            className="ct-input"
            name="projectType"
            value={formData.projectType}
            onChange={update('projectType')}
          >
            <option value="">Select a project type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#323232]"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="ct-label">Message</label>
        <textarea
          id="contact-message"
          className="ct-input"
          name="message"
          placeholder="What are you building?"
          rows={5}
          value={formData.message}
          onChange={update('message')}
        />
        {errors.message && <p className="ct-error">{errors.message}</p>}
      </div>

<button type="submit" disabled={loading} className="ct-btn">
          {loading ? 'Sending…' : 'Send Message'}
        </button>

      {/* explicit result state, announced to screen readers */}
      <div aria-live="polite" className={status ? '' : 'sr-only'}>
        {status && (
          <p className={`ct-status ${status.type === 'success' ? 'ct-status--ok' : 'ct-status--err'}`}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  )
}

export default ContactForm