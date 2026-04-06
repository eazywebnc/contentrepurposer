'use client'
import { useEffect, useRef } from 'react'

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

export function AnimatedMeshBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    // Pink / fuchsia / violet orbs
    const orbs: Orb[] = [
      { x: 0.25, y: 0.2,  vx: 0.0003,  vy: 0.0002,  r: 0.38, color: 'rgba(236,72,153,0.10)' },   // pink-500
      { x: 0.75, y: 0.25, vx: -0.0002, vy: 0.0003,  r: 0.30, color: 'rgba(217,70,239,0.09)' },   // fuchsia-500
      { x: 0.5,  y: 0.72, vx: 0.0001,  vy: -0.0002, r: 0.34, color: 'rgba(168,85,247,0.08)' },   // violet-500
      { x: 0.15, y: 0.75, vx: 0.0002,  vy: 0.0001,  r: 0.24, color: 'rgba(244,114,182,0.07)' },  // pink-400
    ]

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const orb of orbs) {
        orb.x += orb.vx
        orb.y += orb.vy
        if (orb.x < -0.2 || orb.x > 1.2) orb.vx *= -1
        if (orb.y < -0.2 || orb.y > 1.2) orb.vy *= -1
        const cx = orb.x * canvas.width
        const cy = orb.y * canvas.height
        const radius = orb.r * Math.min(canvas.width, canvas.height)
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, orb.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}
