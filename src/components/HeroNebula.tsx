'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroNebulaProps {
  className?: string;
}

export function HeroNebula({ className = '' }: HeroNebulaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isDark = document.documentElement.classList.contains('dark') || 
                 document.documentElement.getAttribute('data-theme') === 'dark';

    // Observe theme changes
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark') || 
               document.documentElement.getAttribute('data-theme') === 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      phase: number;
      speed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 140;

    // Palette colors for nebula clouds and particles
    const lightColors = [
      'rgba(235, 145, 115, ', // peach / warm amber
      'rgba(85, 175, 215, ',  // soft cyan / azure
      'rgba(165, 135, 210, ', // lavender / lilac
      'rgba(230, 185, 110, ', // golden stardust
      'rgba(70, 190, 180, ',  // mint / teal
    ];

    const darkColors = [
      'rgba(110, 180, 255, ', // cyan / electric blue
      'rgba(245, 150, 90, ',  // cosmic amber
      'rgba(215, 105, 240, ', // magenta / violet
      'rgba(65, 220, 225, ',  // aqua
      'rgba(255, 210, 140, ', // stellar gold
    ];

    for (let i = 0; i < particleCount; i++) {
      // Clustered towards an S-curve across the canvas (center-left to top-right)
      const t = Math.random();
      const baseX = width * (0.2 + 0.75 * t);
      const baseY = height * (0.15 + 0.65 * Math.sin(t * Math.PI) + (Math.random() - 0.5) * 0.45);

      particles.push({
        x: baseX,
        y: baseY,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.35,
        color: lightColors[Math.floor(Math.random() * lightColors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const colors = isDark ? darkColors : lightColors;

      // 1. Draw Organic Nebula Soft Cloud Patches
      // Cloud 1: Soft Cyan / Azure in upper-right center
      const g1 = ctx.createRadialGradient(
        width * 0.68 + Math.sin(time * 0.0006) * 25,
        height * 0.38 + Math.cos(time * 0.0007) * 20,
        10,
        width * 0.68,
        height * 0.38,
        width * 0.38
      );
      if (isDark) {
        g1.addColorStop(0, 'rgba(60, 140, 220, 0.28)');
        g1.addColorStop(0.5, 'rgba(80, 100, 200, 0.12)');
        g1.addColorStop(1, 'rgba(15, 17, 23, 0)');
      } else {
        g1.addColorStop(0, 'rgba(95, 175, 225, 0.25)');
        g1.addColorStop(0.5, 'rgba(135, 195, 235, 0.10)');
        g1.addColorStop(1, 'rgba(247, 247, 245, 0)');
      }
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Cloud 2: Warm Amber / Peach along lower-left to mid
      const g2 = ctx.createRadialGradient(
        width * 0.42 + Math.cos(time * 0.0005) * 30,
        height * 0.55 + Math.sin(time * 0.0006) * 25,
        10,
        width * 0.42,
        height * 0.55,
        width * 0.34
      );
      if (isDark) {
        g2.addColorStop(0, 'rgba(220, 120, 60, 0.24)');
        g2.addColorStop(0.5, 'rgba(180, 80, 60, 0.09)');
        g2.addColorStop(1, 'rgba(15, 17, 23, 0)');
      } else {
        g2.addColorStop(0, 'rgba(235, 155, 125, 0.24)');
        g2.addColorStop(0.5, 'rgba(245, 195, 170, 0.09)');
        g2.addColorStop(1, 'rgba(247, 247, 245, 0)');
      }
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Cloud 3: Pastel Lavender / Violet wisps
      const g3 = ctx.createRadialGradient(
        width * 0.55 + Math.sin(time * 0.0007) * 20,
        height * 0.32 + Math.cos(time * 0.0005) * 20,
        5,
        width * 0.55,
        height * 0.32,
        width * 0.28
      );
      if (isDark) {
        g3.addColorStop(0, 'rgba(170, 80, 220, 0.20)');
        g3.addColorStop(0.6, 'rgba(130, 60, 190, 0.06)');
        g3.addColorStop(1, 'rgba(15, 17, 23, 0)');
      } else {
        g3.addColorStop(0, 'rgba(185, 145, 220, 0.20)');
        g3.addColorStop(0.6, 'rgba(205, 180, 230, 0.07)');
        g3.addColorStop(1, 'rgba(247, 247, 245, 0)');
      }
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Dust Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.speed;

          // Wrap around edges gracefully within nebula region
          if (p.x < width * 0.15) p.x = width * 0.95;
          if (p.x > width * 0.98) p.x = width * 0.18;
          if (p.y < 0) p.y = height * 0.9;
          if (p.y > height) p.y = height * 0.1;
        }

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        const colorPrefix = colors[i % colors.length];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${colorPrefix}${currentAlpha})`;
        ctx.fill();

        // Optional tiny glow for larger particles
        if (p.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${currentAlpha * 0.22})`;
          ctx.fill();
        }
      }

      time++;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`relative w-full h-full pointer-events-none overflow-hidden ${className}`}>
      {/* Dynamic Canvas Nebula */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          maskImage: 'radial-gradient(ellipse at 70% 45%, black 45%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 70% 45%, black 45%, transparent 78%)',
        }}
        aria-hidden="true"
      />

      {/* Architectural Grid Layer over the nebula */}
      <div 
        className="absolute inset-0 w-full h-full architectural-grid"
        style={{
          maskImage: 'radial-gradient(ellipse at 65% 50%, black 50%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 65% 50%, black 50%, transparent 85%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
