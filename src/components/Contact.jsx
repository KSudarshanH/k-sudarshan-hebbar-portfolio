import { useRef, useState } from 'react'
import {
  personalInfo,
  socialLinks,
  contactContent,
  emailjsConfig,
} from '../data/portfolioData'
import ScrambleText from './ScrambleText'

export default function Contact() {
  const formRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  const firstName = personalInfo.name?.split(' ')[0]?.toLowerCase() || 'sudarshan'

  const socialItems = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url))

  const isConfigured =
    Boolean(emailjsConfig.serviceId) &&
    Boolean(emailjsConfig.templateId) &&
    Boolean(emailjsConfig.publicKey) &&
    emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
    emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
    emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formRef.current) return

    setIsSubmitting(true)
    setStatus(null)

    if (!isConfigured) {
      // Fallback: Mailto client
      const formData = new FormData(formRef.current)
      const name = formData.get('user_name') || ''
      const email = formData.get('user_email') || ''
      const message = formData.get('message') || ''

      const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        'Portfolio contact',
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      )}`

      window.open(mailtoUrl, '_blank')
      formRef.current.reset()
      setStatus('success')
      setIsSubmitting(false)
      setTimeout(() => setStatus(null), 4000)
      return
    }

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey,
      )
      formRef.current.reset()
      setStatus('success')
    } catch (err) {
      console.error('EmailJS submit error:', err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <section id="contact" className="hud-grid px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT COLUMN: Heading & Contact Info */}
        <div className="flex flex-col gap-6">
          <ScrambleText
            text={contactContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium block"
          />

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md leading-relaxed">
            {contactContent.note}
          </p>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-lg md:text-2xl text-bone hover:text-signal transition-colors underline decoration-signal decoration-2 underline-offset-8 block w-fit"
            >
              {personalInfo.email}
            </a>

            {personalInfo.phone && (
              <p className="font-mono text-sm text-dim">{personalInfo.phone}</p>
            )}
          </div>

          {/* Social links */}
          {socialItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 pt-6">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors focus:outline-none"
                >
                  {item.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Terminal-Style Form in HUD Frame */}
        <div className="w-full">
          <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10 flex flex-col gap-8">
            {/* Terminal prompt header line */}
            <div className="font-mono text-xs text-dim flex items-center gap-2 select-none">
              <span className="text-signal">$</span>
              <span>new message --to {firstName}</span>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-7"
            >
              {/* Field 1: Name */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                  &gt; name
                </label>
                <input
                  name="user_name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2.5 px-0 rounded-none outline-none transition-colors"
                />
              </div>

              {/* Field 2: Email */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                  &gt; email
                </label>
                <input
                  name="user_email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2.5 px-0 rounded-none outline-none transition-colors"
                />
              </div>

              {/* Field 3: Message */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                  &gt; message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the role or project…"
                  className="w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-dim/50 font-mono text-sm py-2.5 px-0 rounded-none outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-signal text-ink hover:bg-bone disabled:opacity-60 disabled:cursor-not-allowed font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between transition-colors rounded-none focus:outline-none"
              >
                <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                <span aria-hidden="true">→</span>
              </button>

              {/* Status Message Line */}
              <p role="status" className="font-mono text-xs min-h-[1.25rem]">
                {status === 'success' && (
                  <span className="text-emerald-400">
                    ✓ Message sent. Talk soon.
                  </span>
                )}
                {status === 'error' && (
                  <span className="text-red-400">
                    ✕ Something went wrong. Please try again.
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

