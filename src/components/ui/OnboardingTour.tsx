'use client'
import { useState, useEffect } from 'react'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – OnboardingTour
//  Vlož do: src/components/ui/OnboardingTour.tsx
//
//  Pak v src/app/dashboard/page.tsx přidej:
//    import OnboardingTour from '@/components/ui/OnboardingTour'
//
//  A na konec return() před </div>:
//    <OnboardingTour />
// ══════════════════════════════════════════════════════════

const G = {
  gold: '#F0B429', gold2: 'rgba(240,180,41,.1)', gold4: 'rgba(240,180,41,.22)',
  grn: '#00E676', blu: '#4D9FFF', pur: '#9B5DE5', red: '#FF3B5C',
  wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)',
  bg: '#020208', bg2: '#06060E',
  gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)',
}

type Step = {
  id: number
  title: string
  desc: string
  emoji: string
  color: string
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  highlight?: string // CSS selector to highlight
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'VÍTEJ V NAJDIDEAL',
    desc: 'Jsme rádi že jsi tady. Ukážeme ti jak platforma funguje — zabere to jen 30 sekund.',
    emoji: '👋',
    color: G.gold,
    position: 'center',
  },
  {
    id: 2,
    title: 'TVŮJ DASHBOARD',
    desc: 'Tady vidíš přehled všeho — dostupné dealy, uložené nabídky, nová oznámení a tvou úroveň přístupu.',
    emoji: '📊',
    color: G.blu,
    position: 'top-center',
  },
  {
    id: 3,
    title: 'ŽIVÉ DEALY',
    desc: 'Každý den přibývají nové příležitosti — marketplace flipy, AI příležitosti, trend produkty. HOT dealy mizí rychle!',
    emoji: '🔥',
    color: G.red,
    position: 'center',
  },
  {
    id: 4,
    title: 'AI PROFIT SCORING',
    desc: 'Každý deal hodnotí naše AI podle profit potenciálu. Čím vyšší skóre, tím lepší příležitost. FREE plán vidí základní dealy.',
    emoji: '🤖',
    color: G.grn,
    position: 'center',
  },
  {
    id: 5,
    title: 'VIP PŘÍSTUP',
    desc: 'VIP členové dostávají alerty jako první, vidí skryté příležitosti a mají přístup k AI deep scan. Průměrný profit 4 235 Kč/měsíc.',
    emoji: '👑',
    color: G.gold,
    position: 'center',
  },
  {
    id: 6,
    title: 'MARKETPLACE',
    desc: 'Přejdi do Marketplace a nakup nebo prodej cokoliv — elektroniku, auta, nemovitosti, oblečení. Vše pod jednou střechou.',
    emoji: '🛒',
    color: G.pur,
    position: 'center',
  },
  {
    id: 7,
    title: 'JSI PŘIPRAVEN!',
    desc: 'To je vše. Začni prozkoumávat dealy a najdi svou první příležitost. Hodně štěstí!',
    emoji: '🚀',
    color: G.grn,
    position: 'center',
  },
]

export default function OnboardingTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [animDir, setAnimDir] = useState<'in' | 'out'>('in')

  useEffect(() => {
    // Zkontroluj jestli uživatel tour už viděl
    const seen = localStorage.getItem('nd_tour_done')
    if (!seen) {
      // Malé zpoždění aby se dashboard načetl
      setTimeout(() => setVisible(true), 800)
    }
  }, [])

  const next = () => {
    if (step < STEPS.length - 1) {
      setAnimDir('out')
      setTimeout(() => {
        setStep(s => s + 1)
        setAnimDir('in')
      }, 200)
    } else {
      finish()
    }
  }

  const prev = () => {
    if (step > 0) {
      setAnimDir('out')
      setTimeout(() => {
        setStep(s => s - 1)
        setAnimDir('in')
      }, 200)
    }
  }

  const finish = () => {
    setClosing(true)
    localStorage.setItem('nd_tour_done', '1')
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  const cur = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <>
      <style>{`
        @keyframes tourFadeIn  { from{opacity:0}                        to{opacity:1} }
        @keyframes tourSlideIn { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes tourSlideOut{ from{opacity:1;transform:translateY(0) scale(1)}   to{opacity:0;transform:translateY(-12px) scale(.97)} }
        @keyframes tourClose   { from{opacity:1}                        to{opacity:0} }
        @keyframes tourPing    { 0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.7)} 55%{box-shadow:0 0 0 8px transparent} }
        @keyframes tourSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes tourPulse   { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes tourBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      {/* ── OVERLAY ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: closing
          ? 'rgba(2,2,8,0)'
          : 'rgba(2,2,8,.82)',
        backdropFilter: closing ? 'blur(0px)' : 'blur(8px)',
        WebkitBackdropFilter: closing ? 'blur(0px)' : 'blur(8px)',
        animation: closing ? 'tourClose .4s ease forwards' : 'tourFadeIn .4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}>

        {/* ── CARD ── */}
        <div style={{
          width: '100%', maxWidth: 480,
          background: 'rgba(6,6,14,.96)',
          backdropFilter: 'blur(40px)',
          border: `1px solid ${cur.color}33`,
          borderRadius: 24,
          padding: '36px 32px',
          position: 'relative', overflow: 'hidden',
          animation: animDir === 'in'
            ? 'tourSlideIn .3s cubic-bezier(.34,1.56,.64,1)'
            : 'tourSlideOut .2s ease forwards',
          boxShadow: `0 40px 100px rgba(0,0,0,.8), 0 0 0 1px ${cur.color}22, 0 0 80px ${cur.color}08`,
        }}>
          {/* top glow line */}
          <div style={{
            position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
            background: `linear-gradient(90deg,transparent,${cur.color},transparent)`,
            transition: 'background .4s',
          }} />

          {/* ambient glow */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 300,
            background: `radial-gradient(circle,${cur.color}0A,transparent 70%)`,
            borderRadius: '50%', pointerEvents: 'none',
            transition: 'background .4s',
          }} />

          {/* skip button */}
          <button onClick={finish} style={{
            position: 'absolute', top: 16, right: 16,
            fontFamily: 'Syne Mono,monospace', fontSize: 9,
            fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: G.mut, background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color .2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = G.wht)}
            onMouseLeave={e => (e.currentTarget.style.color = G.mut)}
          >Přeskočit ✕</button>

          {/* step indicator */}
          <div style={{
            fontFamily: 'Syne Mono,monospace', fontSize: 9,
            letterSpacing: '2px', textTransform: 'uppercase',
            color: cur.color, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: cur.color,
              animation: 'tourPing 2s ease-in-out infinite',
            }} />
            Krok {step + 1} z {STEPS.length}
          </div>

          {/* emoji */}
          <div style={{
            fontSize: 52, lineHeight: 1, marginBottom: 20,
            animation: 'tourBounce 2s ease-in-out infinite',
            display: 'inline-block',
            filter: `drop-shadow(0 0 20px ${cur.color}66)`,
          }}>
            {cur.emoji}
          </div>

          {/* title */}
          <div style={{
            fontFamily: 'Bebas Neue,sans-serif',
            fontSize: 'clamp(28px,5vw,40px)',
            letterSpacing: 4, lineHeight: 1,
            color: G.wht, marginBottom: 14,
            textShadow: `0 0 40px ${cur.color}22`,
          }}>
            {cur.title}
          </div>

          {/* description */}
          <p style={{
            fontFamily: 'Syne,sans-serif',
            fontSize: 15, fontWeight: 300,
            color: G.mut, lineHeight: 1.75,
            marginBottom: 32,
          }}>
            {cur.desc}
          </p>

          {/* progress bar */}
          <div style={{
            height: 3, background: 'rgba(255,255,255,.06)',
            borderRadius: 2, marginBottom: 24, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg,${cur.color},rgba(255,255,255,.8))`,
              borderRadius: 2,
              transition: 'width .4s cubic-bezier(.34,1.56,.64,1), background .4s',
            }} />
          </div>

          {/* dot indicators */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 6, marginBottom: 28,
          }}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => {
                setAnimDir('out')
                setTimeout(() => { setStep(i); setAnimDir('in') }, 200)
              }} style={{
                width: i === step ? 20 : 6,
                height: 6, borderRadius: 3,
                background: i === step ? cur.color : 'rgba(255,255,255,.12)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
                boxShadow: i === step ? `0 0 8px ${cur.color}` : 'none',
              }} />
            ))}
          </div>

          {/* buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button onClick={prev} style={{
                fontFamily: 'Syne Mono,monospace',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                background: 'rgba(255,255,255,.04)',
                border: `1px solid ${G.br}`,
                color: G.mut, padding: '14px 20px',
                borderRadius: 12, cursor: 'pointer',
                transition: 'all .25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = G.wht; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.15)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = G.mut; (e.currentTarget as HTMLElement).style.borderColor = G.br }}
              >← Zpět</button>
            )}
            <button onClick={next} style={{
              flex: 1,
              fontFamily: 'Syne Mono,monospace',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              background: cur.color, color: '#000',
              padding: '15px 24px', borderRadius: 12,
              border: 'none', cursor: 'pointer',
              boxShadow: `0 8px 32px ${cur.color}44`,
              transition: 'all .3s, background .4s, box-shadow .4s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 40px ${cur.color}66` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${cur.color}44` }}
            >
              {step === STEPS.length - 1 ? '🚀 Začít používat' : `Další →`}
            </button>
          </div>

          {/* bottom note */}
          {step === 0 && (
            <div style={{
              marginTop: 16, textAlign: 'center',
              fontFamily: 'Syne Mono,monospace', fontSize: 9,
              color: 'rgba(240,235,225,.2)', letterSpacing: '1px',
            }}>
              Tour se zobrazí pouze jednou · Kdykoli ho najdeš v nastavení
            </div>
          )}
        </div>

        {/* ── FLOATING STATS (decorative) ── */}
        {step === 0 && (
          <div style={{
            position: 'absolute', bottom: 40, left: 40,
            display: 'flex', gap: 10,
            animation: 'tourFadeIn .8s .4s ease both',
          }}>
            {[
              { n: '2 341+', l: 'Nabídek', c: G.gold },
              { n: '4 235 Kč', l: 'Avg profit', c: G.grn },
              { n: '98%', l: 'AI přesnost', c: G.blu },
            ].map(s => (
              <div key={s.l} style={{
                background: 'rgba(6,6,14,.9)',
                border: `1px solid ${s.c}22`,
                borderRadius: 10, padding: '10px 14px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'Bebas Neue,sans-serif',
                  fontSize: 20, color: s.c, letterSpacing: 1,
                  textShadow: `0 0 16px ${s.c}55`,
                }}>{s.n}</div>
                <div style={{
                  fontFamily: 'Syne Mono,monospace',
                  fontSize: 8, color: G.mut,
                  letterSpacing: '1px', textTransform: 'uppercase',
                  marginTop: 2,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}
