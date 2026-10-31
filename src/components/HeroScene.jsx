import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // Dimensions
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 7

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    container.appendChild(renderer.domElement)

    // Core Group
    const coreGroup = new THREE.Group()
    scene.add(coreGroup)

    // (1) Outer shell: Edges of IcosahedronGeometry(1.9, 1)
    const shellGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const edgesGeo = new THREE.EdgesGeometry(shellGeo)
    const shellMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0,
    })
    const shell = new THREE.LineSegments(edgesGeo, shellMat)
    coreGroup.add(shell)

    // (2) Inner core: Points of IcosahedronGeometry(1.15, 4)
    const corePointsGeo = new THREE.IcosahedronGeometry(1.15, 4)
    const corePointsMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    })
    const corePoints = new THREE.Points(corePointsGeo, corePointsMat)
    coreGroup.add(corePoints)

    // (3) Orbit ring: LineLoop through 128 points of EllipseCurve radius 2.7
    const curve = new THREE.EllipseCurve(
      0,
      0,
      2.7,
      2.7,
      0,
      2 * Math.PI,
      false,
      0,
    )
    const ringPoints2D = curve.getPoints(128)
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints2D)
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const ring = new THREE.LineLoop(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.4
    coreGroup.add(ring)

    // Interaction variables
    let targetTiltX = 0
    let targetTiltY = 0
    let currentTiltX = 0
    let currentTiltY = 0
    let extraSpinX = 0
    let extraSpinY = 0

    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0

    // Tilt tracking relative to window
    const handleWindowPointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      targetTiltY = normX * 0.4
      targetTiltX = normY * 0.25
    }

    // Drag interaction on canvas
    const handleCanvasPointerDown = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }

    const handleWindowPointerDrag = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevPointerX
      const deltaY = e.clientY - prevPointerY
      prevPointerX = e.clientX
      prevPointerY = e.clientY

      extraSpinY += deltaX * 0.01
      extraSpinX += deltaY * 0.01
    }

    const handleWindowPointerUp = () => {
      isDragging = false
    }

    window.addEventListener('pointermove', handleWindowPointerMove)
    renderer.domElement.addEventListener('pointerdown', handleCanvasPointerDown)
    window.addEventListener('pointermove', handleWindowPointerDrag)
    window.addEventListener('pointerup', handleWindowPointerUp)

    // Resize handling
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return

      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }

    window.addEventListener('resize', handleResize)

    // Materialisation timing
    const introStartTime = performance.now()
    const clock = new THREE.Clock()
    let animationFrameId = null
    let isVisible = true

    // Animation Loop
    const animate = () => {
      if (!isVisible) {
        animationFrameId = null
        return
      }

      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Materialisation on load (over ~1 second)
      if (!prefersReducedMotion) {
        const elapsedIntro = (performance.now() - introStartTime) / 1000
        const progress = Math.min(elapsedIntro, 1)
        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3)

        const currentScale = 0.6 + 0.4 * easeOut
        coreGroup.scale.set(currentScale, currentScale, currentScale)
        shellMat.opacity = 0.9 * easeOut

        // Slow auto-spin on Y
        extraSpinY += 0.0025
      } else {
        coreGroup.scale.set(1, 1, 1)
        shellMat.opacity = 0.9
      }

      // Inner points counter-rotation
      corePoints.rotation.y = -elapsedTime * 0.15

      // Group eases toward target rotation (factor 0.06)
      currentTiltX += (targetTiltX - currentTiltX) * 0.06
      currentTiltY += (targetTiltY - currentTiltY) * 0.06

      coreGroup.rotation.x = currentTiltX + extraSpinX
      coreGroup.rotation.y = currentTiltY + extraSpinY

      renderer.render(scene, camera)
    }

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animationFrameId) {
          animate()
        }
      },
      { threshold: 0 },
    )

    observer.observe(container)

    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      observer.disconnect()

      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handleWindowPointerMove)
      renderer.domElement.removeEventListener(
        'pointerdown',
        handleCanvasPointerDown,
      )
      window.removeEventListener('pointermove', handleWindowPointerDrag)
      window.removeEventListener('pointerup', handleWindowPointerUp)

      shellGeo.dispose()
      edgesGeo.dispose()
      shellMat.dispose()

      corePointsGeo.dispose()
      corePointsMat.dispose()

      ringGeo.dispose()
      ringMat.dispose()

      renderer.dispose()
      renderer.forceContextLoss()

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  )
}

