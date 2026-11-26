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

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const nodeCount = Math.min(72, Math.max(36, Math.floor((width * height) / 22000)))
    const nodes: StarNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: i % 5 === 0 ? 2.4 : i % 2 === 0 ? 1.7 : 1.2,
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

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', resizeCanvas)

    let rafId = 0

    const drawPolarReticle = () => {
      const cx = width >= 1024 ? width * 0.32 : width * 0.5
      const cy = height * 0.5
      const maxR = Math.max(width, height) * 0.65
      const ringCount = 6

      ctx.save()
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.10)'
      ctx.lineWidth = 1

      for (let i = 1; i <= ringCount; i++) {
        const radius = (maxR / ringCount) * i
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Subtle radial degree spokes (12 spokes = 30 deg increments)
      const spokeCount = 12
      for (let s = 0; s < spokeCount; s++) {
        const angle = (Math.PI * 2 * s) / spokeCount
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * (maxR / ringCount), cy + Math.sin(angle) * (maxR / ringCount))
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
        ctx.stroke()
      }
      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Concentric Polar Reticle
      drawPolarReticle()

      // 2. Drift constellation nodes
      if (!prefersReducedMotion) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
        }
      }

      const maxDist = 170
      const cursorRadius = 195

      // 3. Subtle triangle meshes + constellation lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const distAB = Math.hypot(a.x - b.x, a.y - b.y)
          if (distAB > maxDist) continue

          const factor = 1 - distAB / maxDist
          let alpha = isDark ? 0.44 * factor : 0.40 * factor

          if (pointer.active && !prefersReducedMotion) {
            const midX = (a.x + b.x) * 0.5
            const midY = (a.y + b.y) * 0.5
            const cursorDist = Math.hypot(midX - pointer.x, midY - pointer.y)
            if (cursorDist < cursorRadius) {
              alpha = Math.min(0.75, alpha + (1 - cursorDist / cursorRadius) * 0.25)
            }
          }

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = isDark
            ? a.isAccent || b.isAccent
              ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
              : `rgba(147, 197, 253, ${(alpha * 0.85).toFixed(3)})`
            : a.isAccent || b.isAccent
              ? `rgba(37, 99, 235, ${alpha.toFixed(3)})`
              : `rgba(30, 58, 138, ${(alpha * 0.85).toFixed(3)})`
          ctx.lineWidth = 1
          ctx.stroke()

          // Subtle triangle mesh fill with third nearby node
          for (let k = j + 1; k < nodes.length; k++) {
            const c = nodes[k]
            if (Math.hypot(a.x - c.x, a.y - c.y) < maxDist * 0.78 && Math.hypot(b.x - c.x, b.y - c.y) < maxDist * 0.78) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.lineTo(c.x, c.y)
              ctx.closePath()
              ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.035)' : 'rgba(37, 99, 235, 0.035)'
              ctx.fill()
              break
            }
          }
        }

        // Cursor-reactive tether
        if (pointer.active && !prefersReducedMotion) {
          const cDist = Math.hypot(a.x - pointer.x, a.y - pointer.y)
          if (cDist < cursorRadius * 0.85) {
            const cAlpha = (1 - cDist / (cursorRadius * 0.85)) * (isDark ? 0.45 : 0.35)
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

      // 4. Glowing star cores
      for (const node of nodes) {
        if (node.r >= 1.7) {
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4.5)
          if (isDark) {
            grad.addColorStop(0, node.isAccent ? 'rgba(56, 189, 248, 0.45)' : 'rgba(147, 197, 253, 0.35)')
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)')
          } else {
            grad.addColorStop(0, node.isAccent ? 'rgba(37, 99, 235, 0.32)' : 'rgba(30, 58, 138, 0.24)')
            grad.addColorStop(1, 'rgba(37, 99, 235, 0)')
          }
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.r * 4.5, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? node.isAccent
            ? 'rgba(56, 189, 248, 0.55)'
            : 'rgba(147, 197, 253, 0.50)'
          : node.isAccent
            ? 'rgba(37, 99, 235, 0.50)'
            : 'rgba(30, 58, 138, 0.42)'
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
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDark])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: isDark ? '#060A12' : '#F8FAFC',
      }}
    >
      {/* Full-Viewport Polar Reticle + Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Soft Right-to-Left Gradient Cover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: isDark
            ? 'linear-gradient(to left, #060A12 0%, rgba(6, 10, 18, 0.94) 34%, rgba(6, 10, 18, 0.35) 56%, rgba(6, 10, 18, 0) 76%)'
            : 'linear-gradient(to left, #F1F5F9 0%, rgba(241, 245, 249, 0.92) 32%, rgba(248, 250, 252, 0.30) 52%, rgba(248, 250, 252, 0) 72%)',
        }}
      />
    </div>
  )
}
