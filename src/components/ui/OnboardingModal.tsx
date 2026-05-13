'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const STEPS = [
  {
    id: 'welcome',
    emoji: '👋',
    title: 'Vítej v NajdiDeal',
    subtitle: 'Nejchytřejší marketplace v ČR a SK',
    question: 'Co tě přivádí?',
    options: [
      { id: 'buy', emoji: '🛒', label: 'Nakupuji výhodněji', desc: 'Hledám dobré nabídky a ušetřím' },
      { id: 'sell', emoji: '📦', label: 'Prodávám věci', desc: 'Chci prodat rychle a za dobrou cenu' },
      { id: 'flip', emoji: '💰', label: 'Hledám příležitosti', desc: 'Flipuji a vydělávám na rozdílech' },
      { id: 'all', emoji: '⚡', label: 'Všechno z toho', desc: 'Chci maximum z platformy' },
    ]
  },
  {
    id: 'interests',
    emoji: '🎯',
    title: 'Co tě zajímá?',
    subtitle: 'Přizpůsobíme nabídky přesně pro tebe',
    question: 'Vyber kategorie (lze více)',
    options: [
      { id: 'nemovitosti', emoji: '🏠', label: 'Nemovitosti', desc: 'Byty, domy, chaty' },
      { id: 'auta', emoji: '🚗', label: 'Auta & Motorky', desc: 'Osobní, SUV, moto' },
      { id: 'elektronika', emoji: '📱', label: 'Elektronika', desc: 'Telefony, notebooky' },
      { id: 'obleceni', emoji: '👗', label: 'Oblečení & Móda', desc: 'Značkové, vintage' },
      { id: 'nabytek', emoji: '🛋', label: 'Nábytek & Dům', desc: 'Dekorace, zahrada' },
      { id: 'ostatni', emoji: '🛒', label: 'Ostatní', desc: 'Vše ostatní' },
    ],
    multi: true
  },
  {
    id: 'notifications',
    emoji: '🔔',
    title: 'Kdy tě upozornit?',
    subtitle: 'Dobré nabídky zmizí rychle',
    question: 'Jak chceš dostávat upozornění?',
    options: [
      { id: 'instant', emoji: '⚡', label: 'Okamžitě', desc: 'Dostanu alert jakmile přibyde nabídka' },
      { id: 'daily', emoji: '📅', label: 'Denní souhrn', desc: 'Každý den ráno přehled nejlepších' },
      { id: 'weekly', emoji: '📊', label: 'Týdenní přehled', desc: 'Nejlepší nabídky jednou týdně' },
    ]
  },
]

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Record<string, string | string[]>>({})
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [closing, setClosing] = useState(false)
  const router = useRouter()

  const currentStep = STEPS[step]
  const isMulti = currentStep.multi
  const currentSelected = selected[currentStep.id]
  const hasSelection = isMulti 
    ? Array.isArray(currentSelected) && currentSelected.length > 0
    : !!currentSelected

  const select = (id: string) => {
    if (isMulti) {
      const arr = (selected[currentStep.id] as string[]) || []
      const next = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]
      setSelected(p => ({ ...p, [currentStep.id]: next }))
    } else {
      setSelected(p => ({ ...p, [currentStep.id]: id }))
    }
  }

  const goNext = async () => {
    if (step < STEPS.length - 1) {
      setAnimating(true)
      setDirection('forward')
      setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 350)
    } else {
      await complete()
    }
  }

  const goBack = () => {
    if (step > 0) {
      setAnimating(true)
      setDirection('back')
      setTimeout(() => { setStep(s => s - 1); setAnimating(false) }, 350)
    }
  }

  const complete = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        onboarding_completed: true,
        interests: selected.interests || [],
        notification_preference: selected.notifications || 'instant',
      }).eq('id', user.id)
    }
    setClosing(true)
    setTimeout(() => onComplete(), 600)
  }

  const skip = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id)
    setClosing(true)
    setTimeout(() => onComplete(), 600)
  }

  const progress = ((step) / STEPS.length) * 100

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: 'clamp(12px,4vw,40px)',
      overflowY: 'auto',
      background: closing ? 'rgba(2,2,8,0)' : 'rgba(2,2,8,.92)',
      backdropFilter: closing ? 'blur(0px)' : 'blur(24px)',
      transition: 'all .6s ease',
    }}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:translateY(40px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes slideOutLeft{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-60px)}}
        @keyframes slideOutRight{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(60px)}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}}
        @keyframes emojiPop{0%{transform:scale(0) rotate(-20deg)}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0deg)}}
        @keyframes progressFill{from{width:0}to{width:100%}}
        @keyframes glow{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(0,230,118,.5)}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .opt-card:hover{transform:translateY(-4px) scale(1.02) !important}
        @media(max-width:600px){
          .onb-modal{border-radius:20px !important;max-height:none !important;overflow-y:visible !important;margin:12px auto !important}
          .onb-content{padding:20px 18px 24px !important}
          .onb-grid-2{grid-template-columns:1fr 1fr !important}
          .onb-grid-multi{grid-template-columns:1fr 1fr !important}
          .onb-emoji{font-size:36px !important;margin-bottom:10px !important}
          .onb-title{font-size:28px !important}
          .onb-actions{flex-direction:column-reverse !important}
          .onb-next{width:100% !important}
          .onb-back{width:100% !important;justify-content:center}
        }
        @media(max-width:380px){
          .onb-grid-2{grid-template-columns:1fr !important}
          .onb-grid-multi{grid-template-columns:1fr 1fr !important}
        }
      `}</style>

      {/* AMBIENT ORBS */}
      <div style={{position:'absolute',top:'-10%',right:'-5%',width:400,height:400,background:'radial-gradient(circle,rgba(240,180,41,.08) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(60px)',animation:'float 8s ease-in-out infinite',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:'-10%',left:'-5%',width:350,height:350,background:'radial-gradient(circle,rgba(77,159,255,.06) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(60px)',animation:'float 10s ease-in-out infinite 2s',pointerEvents:'none'}} />

      {/* MODAL */}
      <div style={{
        width: '100%', maxWidth: 580,
        background: 'linear-gradient(135deg,rgba(12,12,20,.98) 0%,rgba(6,6,14,.98) 100%)',
        border: `1px solid ${G.br}`,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        animation: closing ? 'none' : 'modalIn .5s cubic-bezier(.34,1.56,.64,1) both',
        transform: closing ? 'translateY(40px) scale(.95)' : undefined,
        opacity: closing ? 0 : undefined,
        transition: closing ? 'all .5s ease' : undefined,
        boxShadow: '0 40px 120px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06)',
      }} className="onb-modal">

        {/* TOP GLOW LINE */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.5),transparent)',animation:'glow 3s ease-in-out infinite'}} />

        {/* PROGRESS BAR */}
        <div style={{height:2,background:'rgba(255,255,255,.06)'}}>
          <div style={{height:'100%',background:`linear-gradient(90deg,${G.gold},#FFD97D)`,width:`${progress}%`,transition:'width .5s cubic-bezier(.34,1.56,.64,1)',boxShadow:`0 0 12px ${G.gold}88`}} />
        </div>

        {/* HEADER */}
        <div style={{padding:'24px 28px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {STEPS.map((_,i) => (
              <div key={i} style={{width:i===step?20:6,height:6,borderRadius:3,background:i<=step?G.gold:'rgba(255,255,255,.1)',transition:'all .4s cubic-bezier(.34,1.56,.64,1)',boxShadow:i===step?`0 0 8px ${G.gold}`:''}} />
            ))}
          </div>
          <button onClick={skip} style={{background:'none',border:'none',cursor:'pointer',fontFamily:'Syne Mono, monospace',fontSize:9,color:G.mut,letterSpacing:2,textTransform:'uppercase',padding:'6px 10px',borderRadius:6,transition:'color .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.color=G.wht}} onMouseLeave={e=>{(e.currentTarget as any).style.color=G.mut}}>
            Přeskočit →
          </button>
        </div>

        {/* CONTENT */}
        <div className="onb-content" style={{padding:'28px 28px 32px',animation:animating?(direction==='forward'?'slideOutLeft .35s ease forwards':'slideOutRight .35s ease forwards'):(direction==='forward'?'slideInRight .35s ease both':'slideInLeft .35s ease both')}}>

          {/* EMOJI */}
          <div className="onb-emoji" style={{fontSize:52,marginBottom:16,display:'inline-block',animation:'emojiPop .5s cubic-bezier(.34,1.56,.64,1) both'}}>{currentStep.emoji}</div>

          {/* TITLE */}
          <h2 className="onb-title" style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(28px,5vw,44px)',letterSpacing:3,color:G.wht,lineHeight:1,marginBottom:6}}>{currentStep.title}</h2>
          <p style={{fontSize:13,color:G.mut,fontWeight:300,marginBottom:8}}>{currentStep.subtitle}</p>

          {/* LIVE BADGE */}
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'4px 12px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.15)',marginBottom:24}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:G.grn,display:'inline-block',animation:'ping 2s infinite'}} />
            <span style={{fontFamily:'Syne Mono, monospace',fontSize:8,letterSpacing:2,textTransform:'uppercase',color:G.grn}}>Krok {step+1} z {STEPS.length}</span>
          </div>

          <p style={{fontFamily:'Syne Mono, monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:14}}>{currentStep.question}</p>

          {/* OPTIONS */}
          <div className={currentStep.options.length > 4 ? 'onb-grid-multi' : 'onb-grid-2'} style={{display:'grid',gridTemplateColumns:currentStep.options.length > 4 ? 'repeat(auto-fill,minmax(130px,1fr))' : 'repeat(2,1fr)',gap:10,marginBottom:28}}>
            {currentStep.options.map(opt => {
              const isSelected = isMulti
                ? Array.isArray(currentSelected) && currentSelected.includes(opt.id)
                : currentSelected === opt.id
              return (
                <button key={opt.id} onClick={() => select(opt.id)} className="opt-card" style={{
                  background: isSelected ? `${G.gold}10` : G.gl,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${isSelected ? G.gold + '55' : G.br}`,
                  borderRadius: 14,
                  padding: '16px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? `0 0 0 1px ${G.gold}22, 0 8px 24px rgba(240,180,41,.1)` : 'none',
                }}>
                  {isSelected && <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${G.gold},transparent)`}} />}
                  <div style={{fontSize:24,marginBottom:8,transition:'transform .3s',transform:isSelected?'scale(1.1)':'scale(1)'}}>{opt.emoji}</div>
                  <div style={{fontFamily:'Syne, sans-serif',fontSize:12,fontWeight:700,color:isSelected?G.wht:'rgba(240,235,225,.75)',marginBottom:3}}>{opt.label}</div>
                  <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,color:G.mut,letterSpacing:.5}}>{opt.desc}</div>
                  {isSelected && <div style={{position:'absolute',top:10,right:10,width:18,height:18,borderRadius:'50%',background:G.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#000',fontWeight:900}}>✓</div>}
                </button>
              )
            })}
          </div>

          {/* ACTIONS */}
          <div className="onb-actions" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <button onClick={goBack} disabled={step===0} className="onb-back" style={{background:'none',border:`1px solid ${G.br}`,borderRadius:10,padding:'12px 20px',cursor:step===0?'default':'pointer',fontFamily:'Syne Mono, monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:step===0?'rgba(255,255,255,.1)':G.mut,transition:'all .3s'}}>
              ← Zpět
            </button>
            <button onClick={goNext} disabled={!hasSelection} className="onb-next" style={{flex:1,padding:'14px',borderRadius:10,border:'none',cursor:hasSelection?'pointer':'default',fontFamily:'Syne Mono, monospace',fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:'uppercase',background:hasSelection?G.gold:'rgba(255,255,255,.06)',color:hasSelection?'#000':G.mut,transition:'all .35s cubic-bezier(.34,1.56,.64,1)',boxShadow:hasSelection?'0 8px 28px rgba(240,180,41,.35)':'none',transform:hasSelection?'scale(1)':'scale(.98)'}}>
              {step === STEPS.length - 1 ? '🚀 Jdeme na to!' : 'Pokračovat →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}