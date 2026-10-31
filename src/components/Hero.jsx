import { Suspense, lazy, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  const heroRef = useRef(null)
  const dividerRef = useRef(null)

  const nameParts = personalInfo.name?.trim().split(' ') || []
  const firstName = nameParts[0] || personalInfo.name || 'DEVELOPER'
  const restOfName = nameParts.slice(1).join(' ') || ''

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from('[data-hero="fade"]', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.3,
      })

      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'power3.inOut',
            delay: 0.3,
          },
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
        {/* LEFT column */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <div data-hero="fade">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium">
              {heroContent.eyebrow}
            </span>
          </div>

          {/* Heading with split name */}
          <h1
            data-hero="fade"
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] select-none"
          >
            <ScrambleText
              text={firstName}
              trigger="mount"
              delay={200}
              className="block text-bone"
            />
            {restOfName && (
              <ScrambleText
                text={restOfName}
                trigger="mount"
                delay={500}
                className="block text-transparent [-webkit-text-stroke:1.5px_#e8e6df]"
              />
            )}
          </h1>

          {/* Animated divider line */}
          <div
            ref={dividerRef}
            className="h-px max-w-xl bg-bone/25 origin-left"
            aria-hidden="true"
          />

          {/* Role and Intro sentence */}
          <div data-hero="fade" className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed max-w-xl font-normal">
              {heroContent.intro}
            </p>
          </div>

          {/* Action buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="group inline-flex items-center gap-2 bg-signal text-ink hover:bg-bone transition-colors font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="inline-flex items-center justify-center border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* RIGHT column: 3D scene in HUD frame */}
        <div data-hero="fade" className="w-full">
          <div className="hud-frame relative w-full border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] flex items-center justify-center overflow-hidden">
            <span className="absolute top-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
              core.view — drag to rotate
            </span>

            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>

            <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
              {personalInfo.city}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        data-hero="fade"
        className="max-w-[1440px] w-full mx-auto mt-10 border-t border-bone/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-dim flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-signal"
            aria-hidden="true"
          />
          <span>{personalInfo.availability}</span>
        </div>
        <span className="hidden sm:inline-block">Scroll ↓</span>
      </div>
    </section>
  )
}

