import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text)
  const elementRef = useRef(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return
    }

    let intervalId = null
    let timeoutId = null
    let observer = null

    const startScramble = () => {
      if (hasPlayedRef.current) return
      hasPlayedRef.current = true

      timeoutId = setTimeout(() => {
        let frame = 0
        intervalId = setInterval(() => {
          frame++
          const lockedCount = Math.floor(frame / 2)
          let result = ''

          for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
              result += ' '
            } else if (i < lockedCount) {
              result += text[i]
            } else {
              result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            }
          }

          setDisplay(result)

          if (lockedCount >= text.length) {
            clearInterval(intervalId)
            intervalId = null
            setDisplay(text)
          }
        }, speed)
      }, delay)
    }

    if (trigger === 'mount') {
      startScramble()
    } else if (trigger === 'view') {
      if (!elementRef.current) return

      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting) {
            if (observer) {
              observer.disconnect()
              observer = null
            }
            startScramble()
          }
        },
        { threshold: 0.4 },
      )

      observer.observe(elementRef.current)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [text, delay, speed, trigger])

  return (
    <Tag ref={elementRef} aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}
