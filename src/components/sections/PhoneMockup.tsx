'use client'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Link from 'next/link'
import NajdiLogo from '@/components/ui/NajdiLogo'

export default function PhoneMockup() {
  type AppScreen = 'login' | 'loading' | 'dashboard'

  const [screen, setScreen] = useState<AppScreen>('login')
  const [loadPct, setLoadPct] = useState(0)
  const [loadStage, setLoadStage] = useState(0)
  const [dashTab, setDashTab] = useState<'marketplace' | 'reality' | 'bazar' | 'auta'>('marketplace')
  const [liveCount, setLiveCount] = useState(47)
  const [email, setEmail] = useState('jan@email.cz')
  const [pass, setPass] = useState('••••••••')
  const loadRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random() > .5 ? 1 : -1))), 4000)
    return () => clearInterval(iv)
  }, [])

  const G = {
    gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF', red: '#FF3B5C',
    wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)',
    bg: '#020208', bg2: '#06060E', bg3: '#0d1018',
    gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)',
  }

  const loadStages = [
    { pct: 0,   label: 'MARKETPLACE FLIPY',   sub: 'Načítám tržiště…',        color: G.gold },
    { pct: 20,  label: 'AUTA & MOTORKY',       sub: 'Skenuji 4 831 vozidel…',  color: G.blu  },
    { pct: 40,  label: 'NEMOVITOSTI',          sub: 'Analyzuji 1 247 bytů…',   color: '#9B5DE5' },
    { pct: 60,  label: 'OBLEČENÍ & MÓDA',      sub: 'Hledám podhodnocené…',    color: G.grn  },
    { pct: 80,  label: 'AI PROFIT SCORING',    sub: 'Hodnotím příležitosti…',  color: G.red  },
    { pct: 95,  label: 'PŘÍPRAVA DASHBOARDU',  sub: 'Skoro hotovo…',           color: G.gold },
  ]

  const startLogin = () => {
    setScreen('loading')
    setLoadPct(0)
    setLoadStage(0)
    let p = 0
    loadRef.current = setInterval(() => {
      p += Math.random() * 1.8 + 0.6
      const pct = Math.min(Math.round(p), 100)
      setLoadPct(pct)
      const stage = loadStages.findLastIndex(s => pct >= s.pct)
      setLoadStage(Math.max(0, stage))
      if (pct >= 100) {
        clearInterval(loadRef.current!)
        setTimeout(() => setScreen('dashboard'), 600)
      }
    }, 60)
  }

  const mo: React.CSSProperties = { fontFamily: 'Syne Mono, monospace' }
  const bb: React.CSSProperties = { fontFamily: 'Bebas Neue, sans-serif' }
  const sy: React.CSSProperties = { fontFamily: 'Syne, sans-serif' }

  // ── marketplace items ──
  const items = {
    marketplace: [
      { e: '📱', n: 'iPhone 15 Pro 256GB', p: '+7 200 Kč', loc: 'Praha', hot: true,  ai: 97 },
      { e: '💻', n: 'MacBook Air M2',       p: '+8 990 Kč', loc: 'Brno',   hot: false, ai: 91, locked: true },
      { e: '🎮', n: 'RTX 3060 Ti 8GB',      p: '+3 300 Kč', loc: 'Plzeň',  hot: false, ai: 88 },
      { e: '🎧', n: 'AirPods Pro 2. gen',   p: '+2 790 Kč', loc: 'Olomouc',hot: false, ai: 85 },
      { e: '🌀', n: 'Dyson V15 Detect',     p: '+4 800 Kč', loc: 'Praha',  hot: true,  ai: 83 },
    ],
    auta: [
      { e: '🚗', n: 'BMW M3 Competition',   p: '2 290 000 Kč', loc: 'Praha', hot: true,  ai: 95 },
      { e: '🚙', n: 'Audi RS6 Avant 2023',  p: '3 890 000 Kč', loc: 'Brno',  hot: false, ai: 91 },
      { e: '🏎️', n: 'Porsche 911 Carrera',  p: '5 490 000 Kč', loc: 'Praha', hot: false, ai: 89, locked: true },
      { e: '🚐', n: 'VW Transporter T6.1',  p: '890 000 Kč',   loc: 'Plzeň', hot: false, ai: 82 },
    ],
    reality: [
      { e: '🏠', n: 'Byt 3+kk Vinohrady',  p: '8 500 000 Kč', loc: 'Praha 2', hot: true,  ai: 94 },
      { e: '🏢', n: 'Kancelář 120m² centrum',p: '95 000 Kč/m', loc: 'Brno',   hot: false, ai: 88 },
      { e: '🏡', n: 'Rodinný dům Průhonice', p: '12 900 000 Kč',loc: 'Praha',  hot: false, ai: 86, locked: true },
      { e: '🏗️', n: 'Stavební parcela 800m²',p: '3 200 000 Kč', loc: 'Ostrava',hot: false, ai: 81 },
    ],
    bazar: [
      { e: '⌚', n: 'Rolex Submariner',     p: '189 000 Kč', loc: 'Praha', hot: true,  ai: 96 },
      { e: '👜', n: 'Louis Vuitton Neverfull',p: '32 000 Kč', loc: 'Brno',  hot: false, ai: 88 },
      { e: '👟', n: 'Nike Air Jordan 1 Retro',p: '8 900 Kč', loc: 'Praha', hot: false, ai: 85 },
      { e: '🎸', n: 'Gibson Les Paul Standard',p:'45 000 Kč', loc: 'Praha', hot: false, ai: 82 },
    ],
  }

  return (
    <div style={{ position: 'relative', animation: 'phoneFloat 7s ease-in-out infinite', zIndex: 10, willChange: 'transform', transform: 'translateZ(0)' }}>
      <style>{`
        @keyframes phoneFloat{0%,100%{transform:translateY(0)}40%{transform:translateY(-18px)}70%{transform:translateY(-10px)}}
        @keyframes phoneShadow{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.4}40%{transform:translateX(-50%) scaleX(.72);opacity:.18}}
        @keyframes scrIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pingGold{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.8)}55%{box-shadow:0 0 0 4px transparent}}
        @keyframes pingGrn{0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,.8)}55%{box-shadow:0 0 0 4px transparent}}

        /* ── LOADING SCREEN ── */
        @keyframes spinRing{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes spinRingRev{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}
        @keyframes corePulse{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.5),0 0 30px rgba(240,180,41,.2)}50%{box-shadow:0 0 0 12px rgba(240,180,41,.0),0 0 60px rgba(240,180,41,.5)}}
        @keyframes stageIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes progGrow{from{width:0}to{width:100%}}
        @keyframes tickerPhone{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes flashIn{0%{opacity:0;transform:scale(.96)}100%{opacity:1;transform:scale(1)}}
        @keyframes rowIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ══ PHONE FRAME ══ */}
      <div style={{ width: 290, borderRadius: 50, background: 'linear-gradient(160deg,#2a2a3e 0%,#101018 45%,#1a1a28 100%)', border: '1.5px solid rgba(255,255,255,.12)', boxShadow: `inset 0 1px 0 rgba(255,255,255,.15),inset 0 -1px 0 rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04),0 0 0 8px #0c0c1a,0 0 0 9px rgba(255,255,255,.055),0 0 0 10px #060610,0 70px 140px rgba(0,0,0,.95),0 30px 60px rgba(0,0,0,.7)`, overflow: 'visible', position: 'relative' }}>

        {/* side buttons */}
        {[{ s: { left: -3, top: 86,  width: 3, height: 26 } }, { s: { left: -3, top: 122, width: 3, height: 48 } }, { s: { left: -3, top: 180, width: 3, height: 48 } }, { s: { right: -3, top: 148, width: 3, height: 70 } }].map((b, i) => (
          <div key={i} style={{ position: 'absolute', background: 'linear-gradient(to right,#1a1a28,#0f0f1a)', borderRadius: 2, ...b.s }} />
        ))}

        {/* screen */}
        <div style={{ background: G.bg, borderRadius: 42, margin: 4, overflow: 'hidden', height: 600, position: 'relative' }}>

          {/* dynamic island */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 84, height: 26, background: '#000', borderRadius: 13, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 9, gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#111', border: '1px solid rgba(255,255,255,.05)' }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,230,118,.55)' }} />
          </div>

          {/* status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px 5px', position: 'relative', zIndex: 20 }}>
            <div style={{ ...sy, fontWeight: 700, fontSize: 13, color: G.wht }}>9:41</div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {[4, 7, 10, 13].map(h => <div key={h} style={{ width: 3, height: h, background: 'rgba(240,235,225,.75)', borderRadius: 1 }} />)}
              </div>
              <div style={{ ...mo, fontSize: 10, color: 'rgba(240,235,225,.8)' }}>5G</div>
              <div style={{ width: 21, height: 11, border: '1.5px solid rgba(240,235,225,.55)', borderRadius: 3, display: 'flex', alignItems: 'center', padding: '1.5px' }}>
                <div style={{ width: '82%', height: '100%', background: G.grn, borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* ════ LOGIN SCREEN ════ */}
          {screen === 'login' && (
            <div style={{ height: 530, overflowY: 'auto', scrollbarWidth: 'none', animation: 'scrIn .35s ease' }}>
              <div style={{ padding: '16px 20px 0' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <NajdiLogo size="sm" href="/" showText={true} />
                  </div>
                  <div style={{ ...mo, fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: G.mut }}>AI-powered marketplace</div>
                </div>

                {/* headline */}
                <div style={{ marginBottom: 22, textAlign: 'center' }}>
                  <div style={{ ...bb, fontSize: 28, letterSpacing: 3, lineHeight: 1, color: G.wht, marginBottom: 6 }}>
                    PŘIHLÁSIT SE
                  </div>
                  <div style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>Nakup levněji. Prodej za víc.</div>
                </div>

                {/* live badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, animation: 'pingGrn 2s ease-in-out infinite' }} />
                  <span style={{ ...mo, fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.grn }}>{Math.round(liveCount)} lidí právě nakupuje</span>
                </div>

                {/* form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ ...mo, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.mut, marginBottom: 5 }}>E-mail</div>
                    <div style={{ background: G.bg2, border: `1px solid ${G.br}`, borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, opacity: .5 }}>✉</span>
                      <span style={{ ...sy, fontSize: 12, color: G.wht }}>{email}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ ...mo, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.mut, marginBottom: 5 }}>Heslo</div>
                    <div style={{ background: G.bg2, border: `1px solid ${G.br}`, borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, opacity: .5 }}>🔒</span>
                      <span style={{ ...sy, fontSize: 12, color: G.wht, letterSpacing: 2 }}>{pass}</span>
                    </div>
                  </div>
                </div>

                {/* login btn */}
                <button onClick={startLogin} style={{ width: '100%', ...mo, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: G.gold, color: '#000', padding: '14px', borderRadius: 11, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(240,180,41,.4)', marginBottom: 12 }}>
                  Vstoupit do NajdiDeal →
                </button>

                <div style={{ textAlign: 'center', ...mo, fontSize: 9, color: G.mut, marginBottom: 20 }}>nebo</div>

                <button style={{ width: '100%', ...mo, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(255,255,255,.04)', color: G.wht, padding: '13px', borderRadius: 11, border: `1px solid ${G.br}`, cursor: 'pointer', marginBottom: 20 }}>
                  Začít zdarma
                </button>

                {/* categories preview */}
                <div style={{ ...mo, fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: G.mut, textAlign: 'center', marginBottom: 12 }}>Co najdeš uvnitř</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {[
                    { e: '🔄', t: 'Marketplace Flipy', c: G.gold, sub: 'Nakup. Prodej. Profit.' },
                    { e: '🚗', t: 'Auta & Motorky',    c: G.blu,  sub: '12 400+ vozidel' },
                    { e: '🏠', t: 'Nemovitosti',        c: '#9B5DE5', sub: '3 800+ bytů a domů' },
                    { e: '👟', t: 'Bazar & Móda',       c: G.grn,  sub: 'Luxus pod cenou' },
                  ].map(cat => (
                    <div key={cat.t} style={{ background: G.gl, border: `1px solid ${cat.c}18`, borderRadius: 10, padding: '11px 10px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${cat.c},transparent)`, opacity: .5 }} />
                      <div style={{ fontSize: 18, marginBottom: 5 }}>{cat.e}</div>
                      <div style={{ ...sy, fontSize: 11, fontWeight: 700, color: G.wht, marginBottom: 2 }}>{cat.t}</div>
                      <div style={{ ...mo, fontSize: 8, color: G.mut }}>{cat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* social proof */}
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(0,230,118,.04)', border: '1px solid rgba(0,230,118,.12)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 20 }}>💰</div>
                  <div>
                    <div style={{ ...sy, fontSize: 11, fontWeight: 700, color: G.wht }}>Průměrný profit 4 235 Kč/měsíc</div>
                    <div style={{ ...mo, fontSize: 8, color: G.mut, marginTop: 2 }}>2 341+ aktivních členů · zruš kdykoliv</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ LOADING SCREEN ════ */}
          {screen === 'loading' && (
            <div style={{ height: 530, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', animation: 'scrIn .3s ease', position: 'relative', overflow: 'hidden' }}>

              {/* brutal bg grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(240,180,41,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.03) 1px,transparent 1px)`, backgroundSize: '28px 28px' }} />
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%,rgba(240,180,41,.08) 0%,transparent 65%)` }} />

              {/* scan line */}
              <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${loadStages[loadStage]?.color || G.gold},transparent)`, top: `${loadPct}%`, transition: 'top .1s linear', boxShadow: `0 0 12px ${loadStages[loadStage]?.color || G.gold}`, opacity: .7 }} />

              {/* logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, position: 'relative', zIndex: 2 }}>
                <NajdiLogo size="md" href="/" showText={true} />
              </div>

              {/* big circular progress */}
              <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 28, zIndex: 2 }}>
                {/* outer ring */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 160, height: 160, borderRadius: '50%', border: '2px solid rgba(255,255,255,.06)', borderTop: `2px solid ${loadStages[loadStage]?.color || G.gold}`, animation: 'spinRing 2s linear infinite', transition: 'border-top-color .4s' }} />
                {/* inner ring */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.04)', borderRight: `1.5px solid rgba(240,180,41,.4)`, animation: 'spinRingRev 1.4s linear infinite' }} />
                {/* core */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 84, height: 84, borderRadius: '50%', background: `radial-gradient(circle,rgba(240,180,41,.12),rgba(240,180,41,.04) 60%,transparent)`, border: `1.5px solid rgba(240,180,41,.3)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'corePulse 2.5s ease-in-out infinite', gap: 2 }}>
                  <div style={{ ...bb, fontSize: 34, color: loadStages[loadStage]?.color || G.gold, letterSpacing: 1, lineHeight: 1, transition: 'color .4s' }}>{loadPct}</div>
                  <div style={{ ...mo, fontSize: 7, color: G.mut, letterSpacing: '1px', textTransform: 'uppercase' }}>%</div>
                </div>
              </div>

              {/* current stage label */}
              <div key={loadStage} style={{ textAlign: 'center', marginBottom: 20, animation: 'stageIn .3s ease', position: 'relative', zIndex: 2 }}>
                <div style={{ ...bb, fontSize: 22, letterSpacing: 3, color: loadStages[loadStage]?.color || G.gold, marginBottom: 4, transition: 'color .4s', textShadow: `0 0 20px ${loadStages[loadStage]?.color || G.gold}55` }}>
                  {loadStages[loadStage]?.label || 'NAČÍTÁNÍ'}
                </div>
                <div style={{ ...mo, fontSize: 10, color: G.mut, letterSpacing: '1px' }}>
                  {loadStages[loadStage]?.sub || 'Připravuji data…'}
                </div>
              </div>

              {/* progress bar */}
              <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: 20, overflow: 'hidden', position: 'relative', zIndex: 2 }}>
                <div style={{ height: '100%', width: `${loadPct}%`, background: `linear-gradient(90deg,${loadStages[loadStage]?.color || G.gold},rgba(255,255,255,.8))`, borderRadius: 2, transition: 'width .08s linear, background .4s' }} />
              </div>

              {/* stages checklist */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 2 }}>
                {loadStages.map((s, i) => {
                  const done = loadPct >= s.pct + 20
                  const active = loadStage === i
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: done ? 1 : active ? 1 : .28, transition: 'opacity .3s' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${done ? G.grn : active ? s.color : G.br}`, background: done ? 'rgba(0,230,118,.15)' : active ? `${s.color}10` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, transition: 'all .3s' }}>
                        {done ? <span style={{ color: G.grn }}>✓</span> : active ? <span style={{ color: s.color, animation: 'corePulse 1s ease-in-out infinite', display: 'inline-block' }}>·</span> : null}
                      </div>
                      <span style={{ ...mo, fontSize: 9, color: done ? G.grn : active ? s.color : G.mut, letterSpacing: '1px', transition: 'color .3s' }}>{s.label}</span>
                      {active && <div style={{ marginLeft: 'auto', ...mo, fontSize: 8, color: s.color }}>{loadPct}%</div>}
                      {done && <div style={{ marginLeft: 'auto', ...mo, fontSize: 8, color: G.grn }}>✓</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ════ DASHBOARD ════ */}
          {screen === 'dashboard' && (
            <div style={{ height: 530, display: 'flex', flexDirection: 'column', animation: 'flashIn .5s ease' }}>

              {/* top header */}
              <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${G.br}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <NajdiLogo size="sm" href="/" showText={true} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, animation: 'pingGrn 2s ease-in-out infinite' }} />
                    <span style={{ ...mo, fontSize: 8, color: G.grn, letterSpacing: '1px' }}>{Math.round(liveCount)} online</span>
                  </div>
                </div>

                {/* stats strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: G.br, borderRadius: 8, overflow: 'hidden' }}>
                  {[
                    { n: '247', l: 'Dealů' },
                    { n: '4 235', l: 'Avg profit' },
                    { n: '12 400', l: 'Vozidel' },
                    { n: '98%', l: 'AI přesn.' },
                  ].map(s => (
                    <div key={s.l} style={{ background: G.bg2, padding: '7px 4px', textAlign: 'center' }}>
                      <div style={{ ...bb, fontSize: 14, color: G.gold, letterSpacing: 1, lineHeight: 1 }}>{s.n}</div>
                      <div style={{ ...mo, fontSize: 7, color: G.mut, letterSpacing: '.5px', textTransform: 'uppercase', marginTop: 1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* category tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${G.br}`, background: G.bg2, flexShrink: 0 }}>
                {([
                  { id: 'marketplace', ico: '🔄', lbl: 'Flipy' },
                  { id: 'auta',        ico: '🚗', lbl: 'Auta' },
                  { id: 'reality',     ico: '🏠', lbl: 'Reality' },
                  { id: 'bazar',       ico: '👟', lbl: 'Bazar' },
                ] as const).map(tab => (
                  <button key={tab.id} onClick={() => setDashTab(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 4px', background: 'none', border: 'none', borderBottom: dashTab === tab.id ? `2px solid ${G.gold}` : '2px solid transparent', cursor: 'pointer', transition: 'border-color .2s' }}>
                    <span style={{ fontSize: 14 }}>{tab.ico}</span>
                    <span style={{ ...mo, fontSize: 8, letterSpacing: '.5px', textTransform: 'uppercase', color: dashTab === tab.id ? G.gold : G.mut, transition: 'color .2s' }}>{tab.lbl}</span>
                  </button>
                ))}
              </div>

              {/* items list */}
              <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '10px 12px' }}>

                {/* AI badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: G.grn, animation: 'pingGrn 2s ease-in-out infinite' }} />
                  <span style={{ ...mo, fontSize: 8, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: G.grn }}>Live · AI ohodnoceno</span>
                  <span style={{ ...mo, fontSize: 8, color: G.mut, marginLeft: 'auto' }}>
                    {dashTab === 'marketplace' ? '5 nabídek' : dashTab === 'auta' ? '4 vozidla' : dashTab === 'reality' ? '4 nemovitosti' : '4 nabídky'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items[dashTab].map((item, i) => (
                    <div key={i} style={{ background: item.hot ? 'rgba(240,180,41,.03)' : G.gl, border: `1px solid ${item.hot ? 'rgba(240,180,41,.2)' : G.br}`, borderRadius: 11, padding: '10px 11px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden', animation: `rowIn .4s ease ${i * .06}s both` }}>
                      {item.hot && <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.55),transparent)' }} />}
                      {item.hot && <div style={{ position: 'absolute', top: 8, right: 10, width: 5, height: 5, borderRadius: '50%', background: G.gold, animation: 'pingGold 2s ease-in-out infinite' }} />}

                      <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.e}</div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...sy, fontSize: 11, fontWeight: 700, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{item.n}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ ...mo, fontSize: 8, color: G.mut }}>📍 {item.loc}</span>
                          <span style={{ width: 3, height: 3, borderRadius: '50%', background: G.mut, flexShrink: 0 }} />
                          <span style={{ ...mo, fontSize: 8, color: G.gold }}>AI {item.ai}%</span>
                        </div>
                      </div>

                      {('locked' in item && item.locked) ? (
                        <div style={{ ...mo, fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: G.gold, background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.25)', borderRadius: 5, padding: '3px 7px', flexShrink: 0 }}>🔒 VIP</div>
                      ) : (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ ...bb, fontSize: dashTab === 'marketplace' ? 15 : 13, color: dashTab === 'marketplace' ? G.grn : G.wht, letterSpacing: .5, lineHeight: 1, textShadow: dashTab === 'marketplace' ? '0 0 10px rgba(0,230,118,.35)' : 'none' }}>{item.p}</div>
                          {dashTab === 'marketplace' && <div style={{ ...mo, fontSize: 7, color: G.grn, marginTop: 2 }}>profit</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* upgrade banner */}
                <div style={{ marginTop: 12, padding: '12px 13px', background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ ...mo, fontSize: 8, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: G.gold, marginBottom: 2 }}>👑 VIP přístup</div>
                      <div style={{ fontSize: 10, color: G.mut, fontWeight: 300 }}>Odemkni skryté nabídky a AI alerty</div>
                    </div>
                    <button style={{ ...mo, fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: G.gold, color: '#000', padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', flexShrink: 0 }}>499 Kč/m</button>
                  </div>
                </div>

              </div>

              {/* bottom nav */}
              <div style={{ borderTop: `1px solid ${G.br}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0 10px', background: G.bg2, flexShrink: 0 }}>
                {[
                  { ico: '🏠', lbl: 'Domů' },
                  { ico: '🔍', lbl: 'Hledat' },
                  { ico: '🔔', lbl: 'Alerty', badge: 3 },
                  { ico: '👤', lbl: 'Profil' },
                ].map((n, i) => (
                  <button key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                    <span style={{ fontSize: 18, filter: i === 0 ? 'none' : 'grayscale(1) opacity(.38)' }}>{n.ico}</span>
                    <span style={{ ...mo, fontSize: 8, color: i === 0 ? G.gold : G.mut, letterSpacing: '.5px', textTransform: 'uppercase' }}>{n.lbl}</span>
                    {n.badge && <div style={{ position: 'absolute', top: -2, right: -2, width: 13, height: 13, borderRadius: '50%', background: G.red, display: 'flex', alignItems: 'center', justifyContent: 'center', ...sy, fontSize: 7, fontWeight: 700, color: '#fff', border: `1.5px solid ${G.bg}` }}>{n.badge}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* shadow */}
      <div style={{ position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)', width: 210, height: 26, background: 'rgba(0,0,0,.62)', borderRadius: '50%', filter: 'blur(20px)', animation: 'phoneShadow 7s ease-in-out infinite', willChange: 'transform, opacity' }} />
    </div>
  )
}


