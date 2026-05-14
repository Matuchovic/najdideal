'use client'
import { useEffect, useRef, useState } from 'react'

type Spark = { id: number; x: number; y: number; vx: number; vy: number; life: number; text: string; color: string }
let sid = 0

export default function LuxuryCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })
  const ringPos = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>(0)
  const physRef = useRef<number>(0)
  const [clicking,  setClicking]  = useState(false)
  const [hovering,  setHovering]  = useState(false)
  const [hidden,    setHidden]    = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)
  const [sparks,    setSparks]    = useState<Spark[]>([])

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isMobile) return
    document.documentElement.style.cursor = 'none'

    const WORDS = ['Kč', 'Kč', 'Kč', 'NAJDIDEAL']
    const COLORS = ['#F0B429', '#F0B429', '#00E676', '#F0B429']

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
    }
    const onDown = (e: MouseEvent) => {
      setClicking(true)
      const burst = Array.from({ length: 6 }, (_, i) => {
        const idx = Math.floor(Math.random() * WORDS.length)
        const angle = (i / 6) * Math.PI * 2
        return {
          id: sid++, x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * (2 + Math.random() * 3),
          vy: Math.sin(angle) * (2 + Math.random() * 3) - 2,
          life: 1,
          text: WORDS[idx],
          color: COLORS[idx],
        }
      })
      setSparks(s => [...s.slice(-30), ...burst])
    }
    const onUp    = () => setClicking(false)
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)
    const onOver  = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!(t.closest('a')||t.closest('button')||t.closest('[role="button"]')||t.closest('input')||t.closest('textarea')))
    }

    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12)
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px)`
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    physRef.current = window.setInterval(() => {
      setSparks(s => s
        .map(sp => ({ ...sp, x: sp.x + sp.vx, y: sp.y + sp.vy, vy: sp.vy + 0.15, life: sp.life - 0.04 }))
        .filter(sp => sp.life > 0)
      )
    }, 16)

    window.addEventListener('mousemove',  onMove, { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover',  onOver, { passive: true })

    return () => {
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(rafRef.current)
      clearInterval(physRef.current)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover',  onOver)
    }
  }, [isMobile])

  if (isMobile) return null

  const rs = hovering ? 52 : clicking ? 28 : 40

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {sparks.map(sp => (
        <div key={sp.id} style={{
          position: 'fixed', left: sp.x, top: sp.y,
          transform: 'translate(-50%,-50%)',
          fontFamily: sp.text === 'NAJDIDEAL' ? "'Bebas Neue',sans-serif" : "'Syne Mono',monospace",
          fontSize: sp.text === 'NAJDIDEAL' ? 11 : 13,
          fontWeight: 700, letterSpacing: sp.text === 'NAJDIDEAL' ? 2 : 1,
          color: sp.color, opacity: sp.life,
          pointerEvents: 'none', zIndex: 999990,
          textShadow: `0 0 8px ${sp.color}`,
          userSelect: 'none', whiteSpace: 'nowrap',
        }}>{sp.text}</div>
      ))}

      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: rs, height: rs,
        marginLeft: -(rs/2), marginTop: -(rs/2),
        pointerEvents: 'none', zIndex: 999995,
        willChange: 'transform',
        opacity: hidden ? 0 : 1,
        transition: 'width .22s cubic-bezier(.34,1.56,.64,1),height .22s cubic-bezier(.34,1.56,.64,1),margin .22s cubic-bezier(.34,1.56,.64,1),opacity .3s',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: hovering ? '2px solid #F0B429' : clicking ? '2px solid #00E676' : '1.5px solid rgba(240,180,41,.6)',
          boxShadow: hovering ? '0 0 20px rgba(240,180,41,.6)' : clicking ? '0 0 24px rgba(0,230,118,.7)' : '0 0 10px rgba(240,180,41,.25)',
          transition: 'border-color .2s,box-shadow .2s',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 13,
          color: hovering ? '#F0B429' : clicking ? '#00E676' : 'rgba(240,180,41,.5)',
          userSelect: 'none', transition: 'color .2s',
        }}>
          {clicking ? '✦' : hovering ? '★' : '$'}
        </div>
      </div>

      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: clicking ? 14 : 7,
        height: clicking ? 14 : 7,
        marginLeft: clicking ? -7 : -3.5,
        marginTop: clicking ? -7 : -3.5,
        borderRadius: '50%',
        background: clicking ? '#00E676' : '#F0B429',
        boxShadow: clicking ? '0 0 14px #00E676' : '0 0 8px #F0B429',
        pointerEvents: 'none', zIndex: 999999,
        willChange: 'transform', opacity: hidden ? 0 : 1,
        transition: 'width .15s,height .15s,margin .15s,background .15s,opacity .3s',
      }}/>
    </>
  )
}
