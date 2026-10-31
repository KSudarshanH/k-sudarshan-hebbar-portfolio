import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const fillRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const ctx = gsap.context(() => {
      const listEl = listRef.current
      const fillEl = fillRef.current
      if (!listEl) return

      // Animated vertical fill line scrubbed to scroll
      if (!prefersReducedMotion && fillEl) {
        gsap.fromTo(
          fillEl,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: listEl,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        )
      } else if (fillEl) {
        gsap.set(fillEl, { scaleY: 1 })
      }

      // Configure each timeline item's node activation and entrance fade
      itemRefs.current.forEach((itemEl) => {
        if (!itemEl) return

        // Toggle .is-on class as the fill line reaches the item
        ScrollTrigger.create({
          trigger: itemEl,
          start: 'top 65%',
          onEnter: () => itemEl.classList.add('is-on'),
          onLeaveBack: () => itemEl.classList.remove('is-on'),
        })

        // Staggered entrance from right (plays once)
        if (!prefersReducedMotion) {
          gsap.from(itemEl, {
            x: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: itemEl,
              start: 'top 85%',
              once: true,
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* LEFT: Sticky heading and section label */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
          <ScrambleText
            text="03 / Journey"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium block"
          />
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* RIGHT: Timeline ordered list */}
        <ol
          ref={listRef}
          className="relative flex flex-col gap-14 md:gap-16 list-none m-0 p-0 overflow-x-clip"
        >
          {/* Vertical base guideline */}
          <div
            className="absolute left-[7px] top-3 bottom-3 w-px bg-bone/15"
            aria-hidden="true"
          />

          {/* Vertical signal fill line */}
          <div
            ref={fillRef}
            className="absolute left-[7px] top-3 bottom-3 w-px bg-signal origin-top scale-y-0"
            aria-hidden="true"
          />

          {/* Timeline items */}
          {experience?.map((item, idx) => (
            <li
              key={`${item.period}-${item.role}`}
              ref={(el) => (itemRefs.current[idx] = el)}
              className="relative pl-8 md:pl-10 flex flex-col gap-3 transition-colors duration-300 [&.is-on_.journey-node]:bg-signal [&.is-on_.journey-node]:scale-100"
            >
              {/* 15px square node indicator centered on the line */}
              <div
                className="journey-node absolute left-0 top-1.5 w-[15px] h-[15px] border border-signal bg-ink scale-75 transition-all duration-300 pointer-events-none"
                aria-hidden="true"
              />

              {/* Entry metadata */}
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                {item.period}
              </span>

              {/* Role Title */}
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone">
                {item.role}
              </h3>

              {/* Organisation */}
              <span className="font-mono text-sm text-signal font-medium">
                {item.org}
              </span>

              {/* Description */}
              <p className="text-sm md:text-base text-bone/70 leading-relaxed max-w-xl">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
