'use client'

import { useEffect, useRef } from 'react'

export function CursorProvider() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const posRef    = useRef({ x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }

    let raf: number
    const animate = () => {
      posRef.current.rx += (posRef.current.x - posRef.current.rx) * 0.1
      posRef.current.ry += (posRef.current.y - posRef.current.ry) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = posRef.current.rx + 'px'
        ringRef.current.style.top  = posRef.current.ry + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const addHover = () => document.body.classList.add('cursor-hover')
    const rmHover  = () => document.body.classList.remove('cursor-hover')
    const addClick = () => { document.body.classList.add('cursor-click'); setTimeout(() => document.body.classList.remove('cursor-click'), 150) }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', addClick)
    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
    })

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a,button,[role="button"]').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', rmHover)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', addClick)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cursor" ref={cursorRef} className="hidden md:block fixed pointer-events-none z-[9999] w-2.5 h-2.5 bg-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height] duration-200" />
      <div id="cursor-ring" ref={ringRef} className="hidden md:block fixed pointer-events-none z-[9998] w-9 h-9 border border-gold-500/40 rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-300" />
    </>
  )
}
