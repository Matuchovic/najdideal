'use client'
import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(240,235,225,.4)',cursor:'pointer',padding:'7px 12px',border:'1px solid rgba(255,255,255,.07)',borderRadius:6,background:'rgba(255,255,255,.03)',whiteSpace:'nowrap',flexShrink:0,transition:'all .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.color='#F0B429';(e.currentTarget as any).style.borderColor='rgba(240,180,41,.25)'}} onMouseLeave={e=>{(e.currentTarget as any).style.color='rgba(240,235,225,.4)';(e.currentTarget as any).style.borderColor='rgba(255,255,255,.07)'}}>
      ← Zpět
    </button>
  )
}