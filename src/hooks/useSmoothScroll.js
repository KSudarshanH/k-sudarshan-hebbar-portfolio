import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -60 })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    const handleLoad = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', handleLoad)

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 800)

    return () => {
      clearTimeout(refreshTimer)
      window.removeEventListener('load', handleLoad)
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export default useSmoothScroll

