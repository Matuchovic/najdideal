'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – MarketplaceCursor
//  Přepíše starý soubor:
//    cp ~/Downloads/LuxuryCursor.tsx src/components/ui/LuxuryCursor.tsx
//  Layout.tsx zůstává stejný – <LuxuryCursor /> tam už je
// ══════════════════════════════════════════════════════════

type Particle = {
  id: number; x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  emoji: string; scale: number
  rotate: number; rotateV: number
}

type Coin = {
  id: number; x: number; y: number
  vx: number; vy: number
  life: number; char: string; color: string
}

type Badge = {
  id: number; x: number; y: number
  text: string; life: number
}

const EMOJIS  = ['📱','💻','🚗','🏠','⌚','🎮','👟','💰','🔄','🏎️','💎','🎧','👜','🌀']
const PROFITS = ['+7 200 Kč','+3 300 Kč','+8 990 Kč','+4 800 Kč','+12 000 Kč','+2 790 Kč','AI 97%','HOT DEAL','VIP DEAL','+15 000 Kč','AI 94%','+5 500 Kč']
const COINS   = ['$','€','Kč','💰','⚡','★','✦']

let pid = 0, cid = 0, bid = 0

export default function LuxuryCursor() {
  const dotRef    = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const labelRef  = useRef<HTMLDivElement>(null)
  const pos       = useRef({ x: -200, y: -200 })
  const ringPos   = useRef({ x: -200, y: -200 })
  const rafRef    = useRef<number>(0)
  const lastEmoji = useRef(0)

  const [particles, setParticles] = useState<Particle[]>([])
  const [coins,     setCoins]     = useState<Coin[]>([])
  const [badges,    setBadges]    = useState<Badge[]>([])
  const [clicking,  setClicking]  = useState(false)
  const [hovering,  setHovering]  = useState(false)
  const [hidden,    setHidden]    = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const spawnEmoji = useCallback((x: number, y: number) => {
    const now = Date.now()
    if (now - lastEmoji.current < 110) return
    lastEmoji.current = now
    setParticles(p => [...p.slice(-20), {
      id: pid++, x, y,
      vx: (Math.random() - .5) * 2.8,
      vy: -(Math.random() * 2.2 + .8),
      life: 1, maxLife: 1,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      scale: .65 + Math.random() * .6,
      rotate: Math.random() * 30 - 15,
      rotateV: (Math.random() - .5) * 5,
    }])
  }, [])

  const explode = useCallback((x: number, y: number) => {
    setCoins(p => [...p.slice(-32), ...Array.from({ length: 16 }, () => ({
      id: cid++, x, y,
      vx: (Math.random() - .5) * 16,
      vy: -(Math.random() * 13 + 4),
      life: 1,
      char:  COINS[Math.floor(Math.random() * COINS.length)],
      color: Math.random() > .5 ? '#F0B429' : '#00E676',
    }))])
    setBadges(p => [...p.slice(-6), {
      id: bid++, x: x + 22, y: y - 18,
      text: PROFITS[Math.floor(Math.random() * PROFITS.length)],
      life: 1,
    }])
  }, [])

  useEffect(() => {
    if (isMobile) return
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
      spawnEmoji(e.clientX, e.clientY)
    }
    const onDown  = (e: MouseEvent) => { setClicking(true);  explode(e.clientX, e.clientY) }
    const onUp    = () => setClicking(false)
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)
    const onOver  = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!(t.closest('a')||t.closest('button')||t.closest('[role="button"]')||t.closest('input')||t.closest('textarea')))
    }

    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1)
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1)
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px)`
      if (labelRef.current) {
        labelRef.current.style.left = `${ringPos.current.x + 28}px`
        labelRef.current.style.top  = `${ringPos.current.y + 28}px`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const physics = setInterval(() => {
      setParticles(p => p.map(pt => ({
        ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy,
        vy: pt.vy + .09, vx: pt.vx * .97,
        life: pt.life - .026, rotate: pt.rotate + pt.rotateV,
      })).filter(pt => pt.life > 0))

      setCoins(c => c.map(cn => ({
        ...cn, x: cn.x + cn.vx, y: cn.y + cn.vy,
        vy: cn.vy + .58, vx: cn.vx * .93,
        life: cn.life - .032,
      })).filter(cn => cn.life > 0))

      setBadges(b => b.map(bd => ({
        ...bd, life: bd.life - .02, y: bd.y - .8,
      })).filter(bd => bd.life > 0))
    }, 16)

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover',  onOver)

    return () => {
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(rafRef.current)
      clearInterval(physics)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover',  onOver)
    }
  }, [isMobile, spawnEmoji, explode])

  if (isMobile) return null

  const rs = hovering ? 58 : clicking ? 30 : 46

  return (
    <>
      <style>{`
        @keyframes ndSpin    { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes ndSpinRev { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes ndBadge   { from{opacity:0;transform:translate(-50%,-50%) scale(.7)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        * { cursor: none !important; }
      `}</style>

      {/* ── EMOJI TRAIL ── */}
      {particles.map(pt => (
        <div key={pt.id} style={{
          position:'fixed', left:pt.x, top:pt.y,
          fontSize:`${pt.scale*15}px`, opacity:Math.min(pt.life,.85),
          pointerEvents:'none', zIndex:999988,
          transform:`translate(-50%,-50%) rotate(${pt.rotate}deg)`,
          userSelect:'none', lineHeight:1,
        }}>{pt.emoji}</div>
      ))}

      {/* ── COINS ── */}
      {coins.map(cn => (
        <div key={cn.id} style={{
          position:'fixed', left:cn.x, top:cn.y,
          fontFamily:'Bebas Neue,sans-serif', fontSize:14, fontWeight:700,
          color:cn.color, opacity:cn.life,
          pointerEvents:'none', zIndex:999990,
          transform:'translate(-50%,-50%)',
          textShadow:`0 0 8px ${cn.color}`,
          userSelect:'none',
        }}>{cn.char}</div>
      ))}

      {/* ── PROFIT BADGES ── */}
      {badges.map(bd => (
        <div key={bd.id} style={{
          position:'fixed', left:bd.x, top:bd.y,
          fontFamily:'Syne Mono,monospace', fontSize:10, fontWeight:700,
          letterSpacing:'1px', textTransform:'uppercase',
          color:'#000', background:'#F0B429',
          padding:'4px 10px', borderRadius:6,
          opacity:bd.life, pointerEvents:'none', zIndex:999991,
          transform:'translate(-50%,-50%)',
          whiteSpace:'nowrap',
          boxShadow:'0 4px 18px rgba(240,180,41,.55)',
          animation:'ndBadge .14s ease',
          userSelect:'none',
        }}>{bd.text}</div>
      ))}

      {/* ── RING ── */}
      <div ref={ringRef} style={{
        position:'fixed', top:0, left:0,
        width:rs, height:rs, marginLeft:-(rs/2), marginTop:-(rs/2),
        pointerEvents:'none', zIndex:999995,
        willChange:'transform',
        opacity: hidden ? 0 : 1,
        transition:'width .28s cubic-bezier(.34,1.56,.64,1),height .28s cubic-bezier(.34,1.56,.64,1),margin .28s cubic-bezier(.34,1.56,.64,1),opacity .3s',
      }}>
        {/* outer border */}
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          border: hovering ? '2px solid #F0B429' : clicking ? '2px solid #00E676' : '1.5px solid rgba(240,180,41,.65)',
          boxShadow: hovering
            ? '0 0 22px rgba(240,180,41,.65),inset 0 0 14px rgba(240,180,41,.07)'
            : clicking
            ? '0 0 28px rgba(0,230,118,.75)'
            : '0 0 12px rgba(240,180,41,.28)',
          background: hovering
            ? 'conic-gradient(rgba(240,180,41,.14) 0deg,transparent 80deg,rgba(240,180,41,.07) 180deg,transparent 260deg)'
            : 'transparent',
          animation: hovering ? 'ndSpin 2s linear infinite' : 'none',
          transition:'border-color .2s,box-shadow .2s',
        }}/>

        {/* center symbol */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily: clicking ? 'Syne,sans-serif' : 'Bebas Neue,sans-serif',
          fontSize: hovering ? 18 : 13,
          color: hovering ? '#F0B429' : clicking ? '#00E676' : 'rgba(240,180,41,.55)',
          userSelect:'none',
          textShadow: hovering ? '0 0 12px rgba(240,180,41,.9)' : clicking ? '0 0 12px rgba(0,230,118,.9)' : 'none',
          transition:'font-size .25s,color .2s',
          animation:'ndSpinRev 4s linear infinite',
        }}>
          {clicking ? '💥' : hovering ? '★' : '$'}
        </div>

        {/* orbit dot gold */}
        <div style={{
          position:'absolute', width:5, height:5, borderRadius:'50%',
          background:'#F0B429', boxShadow:'0 0 7px #F0B429',
          top:'50%', left:'50%', marginLeft:-2.5, marginTop:-2.5,
          transformOrigin:`${-(rs/2-2)}px 0px`,
          animation:'ndSpin 1.1s linear infinite',
        }}/>

        {/* orbit dot green */}
        <div style={{
          position:'absolute', width:4, height:4, borderRadius:'50%',
          background:'#00E676', boxShadow:'0 0 6px #00E676',
          top:'50%', left:'50%', marginLeft:-2, marginTop:-2,
          transformOrigin:`${-(rs/2-5)}px 0px`,
          animation:'ndSpinRev 1.7s linear infinite',
        }}/>

        {/* third orbit dot blue */}
        <div style={{
          position:'absolute', width:3, height:3, borderRadius:'50%',
          background:'#4D9FFF', boxShadow:'0 0 5px #4D9FFF',
          top:'50%', left:'50%', marginLeft:-1.5, marginTop:-1.5,
          transformOrigin:`${-(rs/2-8)}px 0px`,
          animation:'ndSpin 2.3s linear infinite',
          opacity: hovering ? 1 : .6,
        }}/>
      </div>

      {/* ── DOT ── */}
      <div ref={dotRef} style={{
        position:'fixed', top:0, left:0,
        width: hovering ? 5 : clicking ? 16 : 8,
        height: hovering ? 5 : clicking ? 16 : 8,
        marginLeft: hovering ? -2.5 : clicking ? -8 : -4,
        marginTop:  hovering ? -2.5 : clicking ? -8 : -4,
        borderRadius:'50%',
        background: clicking ? '#00E676' : '#F0B429',
        boxShadow: clicking
          ? '0 0 18px #00E676,0 0 36px rgba(0,230,118,.5)'
          : '0 0 10px #F0B429,0 0 22px rgba(240,180,41,.45)',
        pointerEvents:'none', zIndex:999999,
        willChange:'transform', opacity: hidden ? 0 : 1,
        transition:'width .18s cubic-bezier(.34,1.56,.64,1),height .18s cubic-bezier(.34,1.56,.64,1),margin .18s cubic-bezier(.34,1.56,.64,1),background .15s,box-shadow .15s,opacity .3s',
      }}/>

      {/* ── HOVER LABEL ── */}
      {hovering && !hidden && (
        <div ref={labelRef} style={{
          position:'fixed',
          fontFamily:'Syne Mono,monospace', fontSize:9, fontWeight:700,
          letterSpacing:'2px', textTransform:'uppercase',
          color:'#F0B429', background:'rgba(240,180,41,.09)',
          border:'1px solid rgba(240,180,41,.22)',
          borderRadius:5, padding:'3px 8px',
          pointerEvents:'none', zIndex:999997,
          whiteSpace:'nowrap', userSelect:'none',
        }}>kliknout</div>
      )}
    </>
  )
}
