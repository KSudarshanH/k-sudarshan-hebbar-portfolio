import {
  personalInfo,
  socialLinks,
  navLinks,
  footerContent,
  academy,
} from '../data/portfolioData'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const socialItems = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url))

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Three Columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-14">
          {/* Column 1: Navigate */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Navigate
            </span>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-bone/75 hover:text-signal transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2.5">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.18em] text-bone/75 hover:text-signal transition-colors w-fit"
                >
                  {item.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Say hello (right-aligned on md+) */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Say hello
            </span>
            <div className="flex flex-col gap-2.5">
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-mono text-xs text-bone/75 hover:text-signal transition-colors break-all"
              >
                {personalInfo.email}
              </a>
              <span className="font-mono text-xs text-dim uppercase tracking-[0.18em]">
                {personalInfo.city}
              </span>
            </div>
          </div>
        </div>

        {/* Giant Watermark scaled to display the entire full name */}
        <div
          aria-hidden="true"
          className="w-full select-none py-4 md:py-6 pointer-events-none flex justify-center items-center overflow-hidden"
        >
          <svg
            viewBox="0 0 1200 110"
            className="w-full max-w-[1440px] h-auto overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-sans font-bold fill-[#e8e6df]/[0.07] uppercase"
              letterSpacing="-0.04em"
              fontSize="86"
            >
              {personalInfo.brandName}
            </text>
          </svg>
        </div>

        {/* Bottom row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </span>
          <span>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-signal transition-colors"
            >
              {academy.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
