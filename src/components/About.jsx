import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  personalInfo,
  aboutContent,
  skillGroups,
} from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Load portrait asset dynamically
const portraitModules = import.meta.glob(
  '../assets/about/about-portrait.{png,jpg,jpeg,webp}',
  { eager: true, import: 'default' },
)
const portraitSrc = Object.values(portraitModules)[0] || null

export default function About() {
  const sectionRef = useRef(null)
  const statsContainerRef = useRef(null)
  const statRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Reveal staggered entrance for section elements
      gsap.from('[data-about="reveal"]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      // Count up animation for stats
      aboutContent.stats?.forEach((stat, index) => {
        const targetEl = statRefs.current[index]
        if (!targetEl) return

        const counter = { value: 0 }
        gsap.to(counter, {
          value: stat.value,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsContainerRef.current || targetEl,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            targetEl.textContent = Math.round(counter.value)
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section label */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium"
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Portrait in HUD frame */}
          <div data-about="reveal" className="w-full flex justify-center lg:justify-start">
            <div className="hud-frame relative aspect-[4/5] w-full max-w-[420px] border border-bone/10 bg-panel overflow-hidden">
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt={`${personalInfo.name} — ${personalInfo.role}`}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-dim">
                  [Portrait Missing]
                </div>
              )}

              {/* Signal orange multiply tint */}
              <div
                className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                aria-hidden="true"
              />

              {/* Identification label */}
              <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* RIGHT: Heading, Bio paragraph, Animated stats & Skill matrix */}
          <div className="flex flex-col gap-8">
            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-normal"
            >
              {aboutContent.paragraph}
            </p>

            {/* Stats counter list */}
            <dl
              ref={statsContainerRef}
              data-about="reveal"
              className="grid grid-cols-3 gap-4 border-y border-bone/10 py-8 my-2"
            >
              {aboutContent.stats?.map((stat, idx) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dd className="text-4xl md:text-6xl font-bold text-bone">
                    <span ref={(el) => (statRefs.current[idx] = el)}>
                      0
                    </span>
                    {stat.suffix && (
                      <span className="text-signal">{stat.suffix}</span>
                    )}
                  </dd>
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Skill modules matrix */}
            <div
              data-about="reveal"
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10 overflow-hidden"
            >
              {skillGroups?.map((group, idx) => (
                <div
                  key={group.title}
                  className="bg-ink hover:bg-panel transition-colors duration-200 p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                      {group.title}
                    </span>
                    <span className="font-mono text-[11px] text-dim">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/90 select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

