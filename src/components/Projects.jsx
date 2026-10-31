import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Dynamically discover all project cover images
const projectImageModules = import.meta.glob(
  '../assets/projects/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' },
)

function getProjectImage(projectId) {
  const match = Object.keys(projectImageModules).find((key) =>
    key.includes(`/${projectId}.`),
  )
  return match ? projectImageModules[match] : null
}

function ProjectCard({ project }) {
  const coverImage = getProjectImage(project.id)

  return (
    <article
      data-cursor="hot"
      className="group w-full md:w-[min(560px,42vw)] shrink-0 border border-bone/10 bg-panel/60 flex flex-col justify-between transition-colors duration-300 hover:border-bone/25"
    >
      {/* Top Cover Area */}
      <div className="relative aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out"
          />
        ) : (
          <div className="hud-grid w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim select-none">
            [{project.id}]
          </div>
        )}

        {/* Tactical Badge */}
        <div className="absolute top-3 left-3 bg-ink/80 px-2.5 py-1 border border-bone/10 font-mono text-[10px] uppercase tracking-[0.25em] text-signal select-none z-10">
          {project.number} / {project.year}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone group-hover:text-signal transition-colors">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-bone/70 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2.5">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim select-none"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-signal text-ink hover:bg-bone transition-colors font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 inline-flex items-center gap-1.5 focus:outline-none"
                >
                  Live ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 inline-flex items-center gap-1.5 focus:outline-none"
                >
                  Code ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const track = trackRef.current
        const section = sectionRef.current
        const progressLine = progressRef.current
        if (!track || !section) return

        const getDistance = () => {
          const naturalDist = track.scrollWidth - window.innerWidth + 80
          return Math.max(window.innerWidth * 0.45, naturalDist)
        }

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressLine) {
                gsap.set(progressLine, { scaleX: self.progress })
              }
            },
          },
        })

        return () => {
          tween.kill()
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6"
    >
      {/* Header Row */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <ScrambleText
            text="02 / Selected work"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium block mb-2"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>

        <div className="hidden md:block font-mono text-xs text-dim uppercase tracking-[0.2em]">
          {projects.length} projects · scroll →
        </div>
      </div>

      {/* Cards Track */}
      <div className="w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-5 md:flex-row md:w-max md:gap-8 md:px-10 md:pr-[25vw]"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Progress Line (md+ only) */}
      <div className="hidden md:block w-full max-w-[1440px] mx-auto px-10 mt-8">
        <div className="w-full h-0.5 bg-bone/10 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-signal origin-left scale-x-0"
          />
        </div>
      </div>
    </section>
  )
}

