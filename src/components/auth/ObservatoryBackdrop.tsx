'use client'

import React, { useEffect, useRef } from 'react'

interface ObservatoryBackdropProps {
  theme: 'light' | 'dark'
}

interface StarNode {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  isAccent: boolean
}

export function ObservatoryBackdrop({ theme }: ObservatoryBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const nodeCount = Math.min(64, Math.max(32, Math.floor((width * height) / 26000)))
    const nodes: StarNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: i % 4 === 0 ? 2.1 : 1.4,
      isAccent: i % 3 === 0,
    }))

    const pointer = { x: -9999, y: -9999, active: false }

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', handleResize)

    let rafId = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Update positions gently
      if (!prefersReducedMotion) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
        }
      }

      const maxDist = 165
      const cursorRadius = 190

      // Draw constellation connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > maxDist) continue

          const baseFactor = 1 - dist / maxDist
          let alpha = isDark ? 0.34 * baseFactor : 0.28 * baseFactor

          // Subtle cursor-proximity line highlighting
          if (pointer.active && !prefersReducedMotion) {
            const midX = (a.x + b.x) * 0.5
            const midY = (a.y + b.y) * 0.5
            const cursorDist = Math.hypot(midX - pointer.x, midY - pointer.y)
            if (cursorDist < cursorRadius) {
              const boost = (1 - cursorDist / cursorRadius) * 0.28
              alpha = Math.min(0.65, alpha + boost)
            }
          }

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = isDark
            ? a.isAccent || b.isAccent
              ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
              : `rgba(148, 163, 184, ${(alpha * 0.85).toFixed(3)})`
            : a.isAccent || b.isAccent
              ? `rgba(37, 99, 235, ${alpha.toFixed(3)})`
              : `rgba(30, 41, 59, ${(alpha * 0.85).toFixed(3)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Subtle cursor-to-node tethers
        if (pointer.active && !prefersReducedMotion) {
          const cDist = Math.hypot(a.x - pointer.x, a.y - pointer.y)
          if (cDist < cursorRadius * 0.85) {
            const cAlpha = (1 - cDist / (cursorRadius * 0.85)) * (isDark ? 0.36 : 0.28)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${cAlpha.toFixed(3)})`
              : `rgba(37, 99, 235, ${cAlpha.toFixed(3)})`
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }
      }

      // Draw constellation nodes
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? node.isAccent
            ? 'rgba(56, 189, 248, 0.42)'
            : 'rgba(148, 163, 184, 0.36)'
          : node.isAccent
            ? 'rgba(37, 99, 235, 0.35)'
            : 'rgba(30, 41, 59, 0.28)'
        ctx.fill()
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [isDark])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        backgroundColor: isDark ? '#0B1120' : '#F8FAFC',
      }}
    >
      {/* Full-Bleed Animated Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Right-to-Left Gradient Cover: solid behind right login card, fades out toward left */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to left, #090D16 0%, rgba(9, 13, 22, 0.92) 38%, rgba(11, 17, 32, 0.42) 66%, rgba(11, 17, 32, 0) 92%)'
            : 'linear-gradient(to left, #F1F5F9 0%, rgba(241, 245, 249, 0.92) 38%, rgba(248, 250, 252, 0.42) 66%, rgba(248, 250, 252, 0) 92%)',
        }}
      />
    </div>
  )
}
