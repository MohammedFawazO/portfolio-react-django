import { useState } from 'react'
import contactService from '../../services/contactService'
import showToast from '../ui/Toast'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await contactService.send(formData)
      showToast.success('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
    } catch (error) {
      showToast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-medium text-[#59636E] mb-1 uppercase tracking-[0.182em] font-[family-name:var(--font-mono)]">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-[8px] border bg-[#0B0F13] text-[#F2F5F7] placeholder-[#59636E] transition-colors duration-200 focus:outline-none focus:border-[#6FE7FF] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
        />
        {errors.name && <p className="mt-1 text-[12px] text-[#8D98A4]">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-[12px] font-medium text-[#59636E] mb-1 uppercase tracking-[0.182em] font-[family-name:var(--font-mono)]">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-[8px] border bg-[#0B0F13] text-[#F2F5F7] placeholder-[#59636E] transition-colors duration-200 focus:outline-none focus:border-[#6FE7FF] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
        />
        {errors.email && <p className="mt-1 text-[12px] text-[#8D98A4]">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-[12px] font-medium text-[#59636E] mb-1 uppercase tracking-[0.182em] font-[family-name:var(--font-mono)]">
          Message
        </label>
        <textarea
          name="message"
          placeholder="Your message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-[8px] border bg-[#0B0F13] text-[#F2F5F7] placeholder-[#59636E] transition-colors duration-200 resize-none focus:outline-none focus:border-[#6FE7FF] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
        />
        {errors.message && <p className="mt-1 text-[12px] text-[#8D98A4]">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[#6FE7FF] text-[#07090B] rounded-[8px] font-medium text-[16px] transition-all duration-200 hover:bg-[#35C9E8] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

export default ContactForm
