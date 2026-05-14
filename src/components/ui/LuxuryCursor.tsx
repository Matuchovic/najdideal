'use client'
import { useEffect, useRef, useState } from 'react'

export default function LuxuryCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })
  const ringPos = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>(0)
  const [clicking,  setClicking]  = useState(false)
  const [hovering,  setHovering]  = useState(false)
  const [hidden,    setHidden]    = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isMobile) return
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
    }
    const onDown  = () => setClicking(true)
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

    window.addEventListener('mousemove',  onMove, { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover',  onOver, { passive: true })

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
  }, [isMobile])

  if (isMobile) return null

  const rs = hovering ? 52 : clicking ? 28 : 40

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <div ref={ringRef} style={{
        position:'fixed', top:0, left:0,
        width:rs, height:rs,
        marginLeft:-(rs/2), marginTop:-(rs/2),
        pointerEvents:'none', zIndex:999995,
        willChange:'transform',
        opacity: hidden ? 0 : 1,
        transition:'width .22s cubic-bezier(.34,1.56,.64,1),height .22s cubic-bezier(.34,1.56,.64,1),margin .22s cubic-bezier(.34,1.56,.64,1),opacity .3s',
      }}>
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          border: hovering ? '2px solid #F0B429' : clicking ? '2px solid #00E676' : '1.5px solid rgba(240,180,41,.6)',
          boxShadow: hovering ? '0 0 20px rgba(240,180,41,.6)' : clicking ? '0 0 24px rgba(0,230,118,.7)' : '0 0 10px rgba(240,180,41,.25)',
          transition:'border-color .2s,box-shadow .2s',
        }}/>
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Bebas Neue,sans-serif', fontSize:13,
          color: hovering ? '#F0B429' : clicking ? '#00E676' : 'rgba(240,180,41,.5)',
          userSelect:'none', transition:'color .2s',
        }}>
          {clicking ? '✦' : hovering ? '★' : '$'}
        </div>
      </div>

      <div ref={dotRef} style={{
        position:'fixed', top:0, left:0,
        width: clicking ? 14 : 7,
        height: clicking ? 14 : 7,
        marginLeft: clicking ? -7 : -3.5,
        marginTop:  clicking ? -7 : -3.5,
        borderRadius:'50%',
        background: clicking ? '#00E676' : '#F0B429',
        boxShadow: clicking ? '0 0 14px #00E676' : '0 0 8px #F0B429',
        pointerEvents:'none', zIndex:999999,
        willChange:'transform', opacity: hidden ? 0 : 1,
        transition:'width .15s,height .15s,margin .15s,background .15s,opacity .3s',
      }}/>
    </>
  )
}
