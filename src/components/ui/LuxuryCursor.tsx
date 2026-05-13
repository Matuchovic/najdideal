'use client'
import { useEffect, useRef, useState } from 'react'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – LuxuryCursor
//  Vlož do src/components/ui/LuxuryCursor.tsx
//  Pak přidej do src/app/layout.tsx:
//    import LuxuryCursor from '@/components/ui/LuxuryCursor'
//    <LuxuryCursor />  ← před </body>
// ══════════════════════════════════════════════════════════

export default function LuxuryCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement[]>([])
  const pos      = useRef({ x: -100, y: -100 })
  const ring     = useRef({ x: -100, y: -100 })
  const rafRef   = useRef<number>(0)

  const [clicking, setClicking]   = useState(false)
  const [hovering, setHovering]   = useState(false)
  const [hidden,   setHidden]     = useState(false)

  useEffect(() => {
    // hide default cursor globally
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      // update dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
      }
      // update trail dots
      trailRef.current.forEach((el, i) => {
        if (!el) return
        setTimeout(() => {
          el.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
          el.style.opacity   = String(0.12 - i * 0.018)
        }, i * 18)
      })
    }

    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    // detect hoverable elements
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const isHov = !!(
        t.closest('a') ||
        t.closest('button') ||
        t.closest('[role="button"]') ||
        t.closest('input') ||
        t.closest('textarea') ||
        t.closest('[data-cursor="hover"]')
      )
      setHovering(isHov)
    }

    // smooth ring follow via RAF
    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x}px,${ring.current.y}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover',  onOver)

    return () => {
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover',  onOver)
    }
  }, [])

  const TRAIL_COUNT = 6

  return (
    <>
      <style>{`
        @keyframes ndRingPulse {
          0%,100% { opacity:.55; }
          50%      { opacity:1; }
        }
        @keyframes ndRingSpin {
          from { rotate: 0deg; }
          to   { rotate: 360deg; }
        }
        @keyframes ndClickBurst {
          0%   { transform: translate(var(--cx),var(--cy)) scale(1);   opacity:.8; }
          100% { transform: translate(var(--cx),var(--cy)) scale(2.8); opacity:0; }
        }
        * { cursor: none !important; }
      `}</style>

      {/* ── TRAIL dots ── */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRef.current[i] = el }}
          style={{
            position:      'fixed',
            top:           0,
            left:          0,
            width:         6 - i * 0.6,
            height:        6 - i * 0.6,
            borderRadius:  '50%',
            background:    i % 2 === 0 ? '#F0B429' : '#00E676',
            opacity:       0,
            pointerEvents: 'none',
            zIndex:        999990,
            willChange:    'transform',
            marginLeft:    -(3 - i * 0.3),
            marginTop:     -(3 - i * 0.3),
            transition:    `opacity .3s`,
            display:       hidden ? 'none' : 'block',
          }}
        />
      ))}

      {/* ── OUTER RING ── */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         hovering ? 52 : clicking ? 28 : 40,
          height:        hovering ? 52 : clicking ? 28 : 40,
          marginLeft:    hovering ? -26 : clicking ? -14 : -20,
          marginTop:     hovering ? -26 : clicking ? -14 : -20,
          borderRadius:  '50%',
          border:        hovering
            ? '1.5px solid #F0B429'
            : clicking
            ? '1.5px solid #00E676'
            : '1.5px solid rgba(240,180,41,.6)',
          boxShadow:     hovering
            ? '0 0 18px rgba(240,180,41,.5), inset 0 0 10px rgba(240,180,41,.08)'
            : clicking
            ? '0 0 20px rgba(0,230,118,.6)'
            : '0 0 10px rgba(240,180,41,.25)',
          pointerEvents: 'none',
          zIndex:        999995,
          willChange:    'transform',
          opacity:       hidden ? 0 : 1,
          transition:    'width .25s cubic-bezier(.34,1.56,.64,1), height .25s cubic-bezier(.34,1.56,.64,1), margin .25s cubic-bezier(.34,1.56,.64,1), border-color .2s, box-shadow .2s, opacity .3s',
          // spinning dashed arc on hover
          background:    hovering
            ? 'conic-gradient(rgba(240,180,41,.15) 0deg, transparent 120deg, rgba(240,180,41,.08) 240deg, transparent 360deg)'
            : 'transparent',
          animation:     hovering ? 'ndRingSpin 3s linear infinite' : 'none',
        }}
      />

      {/* ── INNER DOT ── */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         hovering ? 6 : clicking ? 12 : 8,
          height:        hovering ? 6 : clicking ? 12 : 8,
          marginLeft:    hovering ? -3 : clicking ? -6 : -4,
          marginTop:     hovering ? -3 : clicking ? -6 : -4,
          borderRadius:  '50%',
          background:    clicking
            ? '#00E676'
            : hovering
            ? '#F0B429'
            : '#F0B429',
          boxShadow:     clicking
            ? '0 0 14px #00E676, 0 0 28px rgba(0,230,118,.4)'
            : hovering
            ? '0 0 10px #F0B429, 0 0 20px rgba(240,180,41,.4)'
            : '0 0 8px rgba(240,180,41,.6)',
          pointerEvents: 'none',
          zIndex:        999999,
          willChange:    'transform',
          opacity:       hidden ? 0 : 1,
          transition:    'width .18s cubic-bezier(.34,1.56,.64,1), height .18s cubic-bezier(.34,1.56,.64,1), margin .18s cubic-bezier(.34,1.56,.64,1), background .15s, box-shadow .15s, opacity .3s',
        }}
      />

      {/* ── HOVER LABEL (shows "→" on buttons/links) ── */}
      {hovering && !hidden && (
        <div
          style={{
            position:      'fixed',
            top:           ring.current.y + 22,
            left:          ring.current.x + 22,
            fontFamily:    'Syne Mono, monospace',
            fontSize:      9,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color:         '#F0B429',
            pointerEvents: 'none',
            zIndex:        999998,
            whiteSpace:    'nowrap',
            opacity:       .75,
            transition:    'opacity .2s',
          }}
        >
          klik
        </div>
      )}
    </>
  )
}
