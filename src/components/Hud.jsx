import { useEffect, useState } from 'react'
import {
  personalInfo,
  navLinks,
  heroContent,
} from '../data/portfolioData'

function formatTime(timezone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())
  } catch {
    return new Date().toLocaleTimeString('en-GB', { hour12: false })
  }
}

export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [timeString, setTimeString] = useState(() =>
    formatTime(personalInfo.timezone),
  )

  const initials =
    personalInfo.brandName
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase() || 'SH'

  // Scroll threshold listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Status line cycler (every 3.5s)
  useEffect(() => {
    const statusLines = heroContent.statusLines || []
    if (statusLines.length <= 1) return

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusLines.length)
    }, 3500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Live 24h timezone clock (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(formatTime(personalInfo.timezone))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const currentStatus =
    heroContent.statusLines?.[statusIndex] || 'System Active'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">
        {/* Left: Home link with square badge and brand name */}
        <a
          href="#home"
          aria-label={`${personalInfo.brandName} — Home`}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-8 h-8 flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-colors group-hover:bg-signal group-hover:text-ink">
            {initials}
          </div>
          <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-[0.2em] text-bone/90 group-hover:text-bone transition-colors">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre (lg+): Pulsing signal dot and status rotator */}
        <div
          aria-live="polite"
          className="hidden lg:flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
          </span>
          <span>{currentStatus}</span>
        </div>

        {/* Right (md+): Nav links and live clock */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="h-4 w-px bg-bone/10" aria-hidden="true" />

          <span
            className="font-mono text-xs uppercase tracking-[0.18em] text-dim tabular-nums"
            title={personalInfo.timezone}
          >
            {timeString}
          </span>
        </div>

        {/* Mobile (below md): Menu toggle button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="hud-mobile-menu"
          className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-signal transition-colors py-2 px-1 focus:outline-none"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        id="hud-mobile-menu"
        className={`md:hidden fixed inset-x-0 top-16 bg-ink/95 backdrop-blur-xl border-b border-bone/10 transition-all duration-300 ease-in-out px-6 overflow-hidden ${
          mobileMenuOpen
            ? 'max-h-[calc(100vh-4rem)] py-6 opacity-100 pointer-events-auto'
            : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-semibold text-bone hover:text-signal transition-colors py-4 border-b border-bone/10"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="pt-6 pb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-dim">
          <span>{personalInfo.city}</span>
          <span className="tabular-nums" title={personalInfo.timezone}>
            {timeString}
          </span>
        </div>
      </div>
    </header>
  )
}
