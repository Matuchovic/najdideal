'use client'
import { useState, useEffect, useRef } from 'react'

export default function ScannerStatus() {
  const [count, setCount] = useState(0)
  const [pct, setPct] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 2400, start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(ease * 2341))
      setPct(Math.round(ease * 94))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started])
  return (
    <div ref={ref} style={{position:'absolute',bottom:-48,left:0,right:0,background:'rgba(2,2,8,.95)',backdropFilter:'blur(24px)',border:'1px solid rgba(240,180,41,.2)',borderRadius:12,padding:'14px 18px',zIndex:12,display:'flex',alignItems:'center',gap:12,boxShadow:'0 8px 40px rgba(0,0,0,.6)'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:'#00E676',flexShrink:0,boxShadow:'0 0 8px #00E676',animation:'nodeGlow 1.5s ease-in-out infinite'}} />
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:'#00E676',letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>AI Scanner · Live</div>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:'rgba(240,235,225,.7)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          Analyzuji <span style={{color:'#F0B429',fontWeight:700}}>{count.toLocaleString('cs-CZ')}</span> nabídek_
        </div>
      </div>
      <div style={{textAlign:'center',flexShrink:0}}>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,color:'#F0B429',letterSpacing:1,lineHeight:1,textShadow:'0 0 20px rgba(240,180,41,.5)'}}>{pct}%</div>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:7,color:'rgba(240,235,225,.3)',letterSpacing:1,textTransform:'uppercase'}}>Confidence</div>
      </div>
    </div>
  )
}

