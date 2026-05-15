'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import NajdiLogo from '@/components/ui/NajdiLogo'
import NajdiBot from '@/components/ui/NajdiBot'
import Link from 'next/link'



function FaqSection() {
  const [open, setOpen] = useState(-1)
  const G = { g:'#F0B429', wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)' }
  const faqs = [
    {q:'Co je NajdiDeal?',a:'NajdiDeal je prémiová AI platforma, která denně skenuje stovky nabídek na marketplace platformách. Filtrujeme jen ty s reálným profit potenciálem a VIP členové je dostávají jako první.'},
    {q:'Jak rychle uvidím první profit?',a:'Naši členové průměrně vydělají první profit do 7 dní. Nejrychlejší dealy – marketplace flipy – se prodají do 24–48 hodin.'},
    {q:'Jaký je rozdíl mezi FREE a VIP?',a:'FREE členové dostávají základní dealy se zpožděním. VIP členové dostávají alerty jako první, mají přístup k exkluzivním dealům, AI příležitostem a soukromé komunitě.'},
    {q:'Mohu zrušit kdykoliv?',a:'Ano. Žádné závazky, žádné skryté poplatky. Zrušíš jedním klikem v nastavení účtu. Přístup trvá do konce zaplacené periody.'},
    {q:'Co jsou Marketplace Flipy?',a:'Nakoupíš produkt za nízkou cenu a prodáš ho za tržní cenu. Průměrný profit na flip je 2 000–8 000 Kč. Nejrychlejší flipy trvají méně než 24 hodin.'},
    {q:'Jak funguje AI skenování?',a:'Náš AI systém nepřetržitě monitoruje Bazoš, Facebook Marketplace, Aukro a stovky dalších zdrojů. Každý deal hodnotí podle profit potenciálu a tržní poptávky.'},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {faqs.map((f,i) => (
        <div key={i} style={{background:G.gl,backdropFilter:'blur(28px)',border:`1px solid ${open===i?'rgba(240,180,41,.22)':G.br}`,borderRadius:14,overflow:'hidden',transition:'border-color .3s'}}>
          <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%',padding:'20px 26px',background:'none',border:'none',color:G.wht,fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:600,textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
            <span>{f.q}</span>
            <span style={{fontSize:20,color:G.g,transition:'transform .3s',transform:open===i?'rotate(45deg)':'none',flexShrink:0}}>+</span>
          </button>
          {open===i&&(
            <div style={{padding:'0 26px 22px'}}>
              <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:16}} />
              <p style={{fontSize:13,color:G.mut,lineHeight:1.88,fontWeight:300}}>{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


function ScannerStatus() {
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

// ─── iPhone Phone Mockup Component ───────────────────────────────────────────
function PhoneMockup() {
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
    <div style={{ position: 'relative', animation: 'phoneFloat 7s ease-in-out infinite', filter: 'drop-shadow(0 60px 120px rgba(0,0,0,.9)) drop-shadow(0 0 80px rgba(240,180,41,.06))', zIndex: 10 }}>
      <style>{`
        @keyframes phoneFloat{0%,100%{transform:translateY(0) rotate(-1deg)}40%{transform:translateY(-20px) rotate(.4deg)}70%{transform:translateY(-12px) rotate(-.5deg)}}
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
      <div style={{ position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)', width: 210, height: 26, background: 'rgba(0,0,0,.62)', borderRadius: '50%', filter: 'blur(20px)', animation: 'phoneShadow 7s ease-in-out infinite' }} />
    </div>
  )
}


function ChatWidget() {
  const supabase = createClient()
  const [step, setStep] = useState<'closed'|'form'|'waiting'|'chat'>('closed')
  const [minimized, setMinimized] = useState(false)
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return Math.random().toString(36).slice(2)
    const saved = localStorage.getItem('nd_chat_session')
    if (saved) return saved
    const newId = Math.random().toString(36).slice(2)
    localStorage.setItem('nd_chat_session', newId)
    return newId
  })
  const [connecting, setConnecting] = useState(false)
  const [connectStep, setConnectStep] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Obnov stav z minulé session
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedStep = localStorage.getItem('nd_chat_step') as any
    const savedEmail = localStorage.getItem('nd_chat_email')
    if (savedStep === 'waiting' || savedStep === 'chat') {
      if (savedEmail) setEmail(savedEmail)
      setStep(savedStep)
      // Načti historii zpráv
      supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true }).then(({ data }) => {
        if (data && data.length > 0) setMessages(data)
      })
    }
  }, [])

  // Ulož stav do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (step === 'closed' || step === 'form') return
    localStorage.setItem('nd_chat_step', step)
  }, [step])

  useEffect(() => {
    if (email) localStorage.setItem('nd_chat_email', email)
  }, [email])

  useEffect(() => {
    if (step !== 'waiting' && step !== 'chat') return
    const ch = supabase.channel('chat-' + sessionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, payload => {
        const m = payload.new as any
        if (m.role === 'admin') { setStep('chat'); setMinimized(false) }
        setMessages(prev => [...prev, m])
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [step, sessionId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function resetSession() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('nd_chat_session')
    localStorage.removeItem('nd_chat_step')
    localStorage.removeItem('nd_chat_email')
    const newId = Math.random().toString(36).slice(2)
    localStorage.setItem('nd_chat_session', newId)
  }

  async function submitForm() {
    if (!email.trim() || !request.trim()) return
    setConnecting(true)
    setConnectStep(0)
    const steps = [0,1,2,3,4]
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 520))
      setConnectStep(i + 1)
    }
    await new Promise(r => setTimeout(r, 300))
    setConnecting(false)
    setStep('waiting')
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', message: `📧 ${email} | ${request}` })
  }

  async function send() {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', message: msg }])
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', message: msg })
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const label = isImage ? `🖼️ ${file.name}` : `📎 ${file.name}`
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', message: label }])
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', message: label })
    e.target.value = ''
  }

  const isOpen = step !== 'closed'
  const showMinimized = minimized && step !== 'closed'

  useEffect(() => {
    const handler = () => { setStep('form'); setMinimized(false) }
    window.addEventListener('openChat', handler)
    return () => window.removeEventListener('openChat', handler)
  }, [])

  const statusDot = (color: string, pulse = false) => (
    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, animation: pulse ? 'cwPulse 1.4s infinite' : 'none', flexShrink: 0 }} />
  )

  return (
    <div style={{ position: 'fixed', bottom: 28, left: 28, zIndex: 9999 }}>
      <style>{`
        @keyframes cwSlideUp { from { opacity:0; transform:translateY(24px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cwPulse { 0%,100% { opacity:.3; transform:scale(.7) } 50% { opacity:1; transform:scale(1) } }
        @keyframes cwSpin { to { transform:rotate(360deg) } }
        @keyframes cwFadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes cwBounce { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-4px) } }
        .cw-input:focus { border-color: rgba(240,180,41,.5) !important; box-shadow: 0 0 0 3px rgba(240,180,41,.07) !important; outline: none !important; }
        .cw-msg { animation: cwFadeIn .22s ease; }
        .cw-fab:hover { transform: scale(1.08) !important; }
        .cw-icon-btn:hover { background: rgba(255,255,255,.1) !important; }
        .cw-send:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(240,180,41,.5) !important; }
        .cw-submit:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(240,180,41,.4) !important; }
        .cw-scroll::-webkit-scrollbar { width: 3px; }
        .cw-scroll::-webkit-scrollbar-track { background: transparent; }
        .cw-scroll::-webkit-scrollbar-thumb { background: rgba(240,180,41,.2); border-radius: 10px; }
      `}</style>
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />

      {/* MINIMIZED BAR */}
      {showMinimized && (
        <div onClick={() => setMinimized(false)} style={{ marginBottom: 12, padding: '12px 18px', background: '#0A0A14', borderRadius: 18, border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 12px 40px rgba(0,0,0,.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, animation: 'cwSlideUp .3s ease', minWidth: 220 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👑</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F0EBE1' }}>NajdiDeal Support</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              {step === 'chat' ? statusDot('#00E676') : statusDot('#F0B429', true)}
              <span style={{ fontSize: 9, color: step === 'chat' ? '#00E676' : '#F0B429', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>{step === 'chat' ? 'ONLINE' : 'ČEKÁME...'}</span>
            </div>
          </div>
          <div style={{ fontSize: 16, color: 'rgba(240,235,225,.3)' }}>↑</div>
        </div>
      )}

      {/* MAIN PANEL */}
      {isOpen && !minimized && (
        <div style={{ width: 372, marginBottom: 14, borderRadius: 28, overflow: 'hidden', animation: 'cwSlideUp .35s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 40px 100px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.07), inset 0 1px 0 rgba(255,255,255,.07)', background: '#0A0A14' }}>

          {/* GOLD LINE */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #F0B429 30%, #FFD97D 50%, #F0B429 70%, transparent)' }} />

          {/* HEADER */}
          <div style={{ padding: '16px 18px', background: 'linear-gradient(180deg, rgba(240,180,41,.07) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 6px 20px rgba(240,180,41,.3)' }}>👑</div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 13, height: 13, borderRadius: '50%', background: step === 'chat' ? '#00E676' : step === 'waiting' ? '#F0B429' : '#00E676', border: '2.5px solid #0A0A14', boxShadow: `0 0 8px ${step === 'chat' ? '#00E676' : step === 'waiting' ? '#F0B429' : '#00E676'}`, animation: step === 'waiting' ? 'cwPulse 1.4s infinite' : 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F0EBE1', letterSpacing: .2 }}>NajdiDeal Support</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                  {step === 'waiting' ? <>{statusDot('#F0B429', true)}<span style={{ fontSize: 9, color: 'rgba(240,180,41,.8)', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>HLEDÁME OPERÁTORA</span></> : step === 'chat' ? <>{statusDot('#00E676')}<span style={{ fontSize: 9, color: '#00E676', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>OPERÁTOR ONLINE</span></> : <>{statusDot('#00E676')}<span style={{ fontSize: 9, color: 'rgba(240,235,225,.4)', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>ODPOVÍDÁME DO 5 MIN</span></>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cw-icon-btn" onClick={() => setMinimized(true)} title="Minimalizovat" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>—</button>
              <button className="cw-icon-btn" onClick={() => setStep('closed')} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>×</button>
            </div>
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent)' }} />

          {/* CONNECTING SCREEN - DIVINE */}
          {connecting && (
            <div style={{ position: 'relative', overflow: 'hidden', background: '#05050F' }}>
              {/* Animated background */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 80% at 50% 120%, rgba(240,180,41,.12) 0%, transparent 65%)' }} />
              <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,180,41,.04), transparent)', animation: 'cwSpin 20s linear infinite' }} />
              <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,93,229,.04), transparent)', animation: 'cwSpin 15s linear infinite reverse' }} />

              {/* Top section */}
              <div style={{ padding: '32px 24px 20px', textAlign: 'center', position: 'relative' }}>
                {/* Crown orb */}
                <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 20px' }}>
                  {/* Outer glow */}
                  <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,180,41,.08), transparent)', animation: 'cwPulse 2s infinite' }} />
                  {/* Ring 1 */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(240,180,41,.1)', animation: 'cwSpin 12s linear infinite' }}>
                    <div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, borderRadius: '50%', background: '#F0B429', boxShadow: '0 0 10px #F0B429', transform: 'translateX(-50%)' }} />
                  </div>
                  {/* Ring 2 */}
                  <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px solid rgba(240,180,41,.15)', animation: 'cwSpin 8s linear infinite reverse' }}>
                    <div style={{ position: 'absolute', top: -3, left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#FFD97D', boxShadow: '0 0 8px #FFD97D', transform: 'translateX(-50%)' }} />
                  </div>
                  {/* Ring 3 spinner */}
                  <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#F0B429', borderRightColor: 'rgba(240,180,41,.3)', animation: 'cwSpin 1.6s linear infinite' }} />
                  {/* Core */}
                  <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(240,180,41,.2), rgba(200,136,10,.05))', backdropFilter: 'blur(4px)', border: '1px solid rgba(240,180,41,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.1)' }}>👑</div>
                </div>

                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', color: '#F0B429', fontFamily: 'Syne Mono,monospace', marginBottom: 6 }}>Navazujeme spojení</div>
                <div style={{ fontSize: 11, color: 'rgba(240,235,225,.35)', letterSpacing: .5 }}>
                  {connectStep < 2 ? 'Ověřujeme a zabezpečujeme...' : connectStep < 4 ? 'Hledáme nejlepšího operátora...' : '✦ Připraveno ✦'}
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(240,180,41,.1), transparent)', margin: '0 24px' }} />

              {/* Steps */}
              <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Ověřování identity', icon: '🛡️', desc: 'SSL · End-to-end šifrování' },
                  { label: 'Zabezpečení spojení', icon: '🔐', desc: '256-bit AES · Soukromý kanál' },
                  { label: 'Hledání experta', icon: '⭐', desc: 'Top hodnocený operátor' },
                  { label: 'Příprava workspace', icon: '💼', desc: 'Osobní chat místnost' },
                  { label: 'Připojeno', icon: '✦', desc: 'Vítejte v prémiové podpoře' },
                ].map((item, i) => {
                  const done = connectStep > i
                  const active = connectStep === i
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, background: done ? 'rgba(240,180,41,.05)' : active ? 'rgba(240,180,41,.03)' : 'rgba(255,255,255,.015)', border: `1px solid ${done ? 'rgba(240,180,41,.18)' : active ? 'rgba(240,180,41,.12)' : 'rgba(255,255,255,.04)'}`, transition: 'all .5s cubic-bezier(.4,0,.2,1)', transform: active ? 'translateX(3px)' : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: done ? 'linear-gradient(135deg,#F0B429,#C8880A)' : active ? 'rgba(240,180,41,.1)' : 'rgba(255,255,255,.03)', border: active ? '1px solid rgba(240,180,41,.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: done ? 13 : 16, flexShrink: 0, transition: 'all .5s', boxShadow: done ? '0 4px 14px rgba(240,180,41,.3)' : active ? '0 0 20px rgba(240,180,41,.15)' : 'none' }}>
                        {done ? '✓' : active ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F0B429', animation: 'cwPulse 1s infinite', boxShadow: '0 0 10px #F0B429' }} /> : item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: active || done ? 700 : 400, color: done ? 'rgba(240,235,225,.9)' : active ? '#F0B429' : 'rgba(240,235,225,.25)', fontFamily: 'Syne Mono,monospace', letterSpacing: .5, transition: 'all .4s' }}>{item.label}</div>
                        {(active || done) && <div style={{ fontSize: 9, color: done ? 'rgba(240,180,41,.5)' : 'rgba(240,235,225,.3)', marginTop: 2, letterSpacing: .3, transition: 'all .4s' }}>{item.desc}</div>}
                      </div>
                      {done && <div style={{ fontSize: 14, color: '#00E676', flexShrink: 0, animation: 'cwFadeIn .3s ease' }}>✓</div>}
                      {active && <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(240,180,41,.2)', borderTopColor: '#F0B429', animation: 'cwSpin 1s linear infinite', flexShrink: 0 }} />}
                    </div>
                  )
                })}
              </div>

              {/* Bottom badge */}
              <div style={{ margin: '0 20px 20px', padding: '10px 16px', background: 'rgba(255,255,255,.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: -4 }}>
                  {['🇨🇿','🇸🇰'].map((f,i) => <span key={i} style={{ fontSize: 14 }}>{f}</span>)}
                </div>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(240,235,225,.25)', fontFamily: 'Syne Mono,monospace', letterSpacing: 1 }}>NEJLEPŠÍ PODPORA V CZ & SK</div>
                  <div style={{ fontSize: 9, color: 'rgba(240,180,41,.5)', marginTop: 1 }}>★★★★★ · Odpovídáme do 5 minut</div>
                </div>
              </div>
            </div>
          )}

          {/* FORM */}
          {!connecting && step === 'form' && (
            <div style={{ padding: '20px 20px 24px' }}>
              <div style={{ marginBottom: 18, padding: '12px 14px', background: 'rgba(240,180,41,.04)', borderRadius: 14, border: '1px solid rgba(240,180,41,.1)', display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 16 }}>💎</span>
                <p style={{ fontSize: 12, color: 'rgba(240,235,225,.5)', margin: 0, lineHeight: 1.75 }}>Náš tým je připraven pomoci. Vyplň formulář a spojíme tě s expertem během okamžiku.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(240,180,41,.55)', display: 'block', marginBottom: 7, fontFamily: 'Syne Mono,monospace' }}>Email adresa</label>
                  <input className="cw-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.cz" type="email" style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '12px 15px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all .2s' }} />
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(240,180,41,.55)', display: 'block', marginBottom: 7, fontFamily: 'Syne Mono,monospace' }}>Váš požadavek</label>
                  <textarea className="cw-input" value={request} onChange={e => setRequest(e.target.value)} placeholder="Popište co potřebujete..." rows={3} style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '12px 15px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box', transition: 'all .2s' }} />
                </div>
                <button className="cw-submit" onClick={submitForm} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#F0B429,#C8880A)', border: 'none', borderRadius: 12, color: '#000', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 28px rgba(240,180,41,.28)', transition: 'all .25s', fontFamily: 'Syne Mono,monospace' }}>Spojit s operátorem →</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
                {['🔒 Zabezpečeno', '⚡ Rychlá odezva', '✓ Zdarma'].map(t => <span key={t} style={{ fontSize: 9, color: 'rgba(240,235,225,.2)' }}>{t}</span>)}
              </div>
            </div>
          )}

          {/* WAITING */}
          {step === 'waiting' && (
            <div style={{ padding: '36px 24px 40px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 22px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(240,180,41,.12)', borderTopColor: '#F0B429', animation: 'cwSpin 1.4s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', background: 'rgba(240,180,41,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⏳</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#F0B429', marginBottom: 10, fontFamily: 'Syne Mono,monospace' }}>Hledáme volného operátora</div>
              <p style={{ fontSize: 12, color: 'rgba(240,235,225,.38)', margin: '0 0 26px', lineHeight: 1.8 }}>Obvyklá čekací doba je do 5 minut.<br/>Prosím zůstaň na stránce.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#F0B429', animation: `cwPulse 1.2s infinite`, animationDelay: `${i * 0.18}s` }} />)}
              </div>
              <div style={{ marginTop: 26, padding: '13px 16px', background: 'rgba(255,255,255,.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,.05)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(240,180,41,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✉️</div>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(240,235,225,.28)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Syne Mono,monospace' }}>Kontakt</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,235,225,.65)', fontWeight: 600, marginTop: 2 }}>{email}</div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT */}
          {step === 'chat' && (
            <>
              <div style={{ padding: '8px 18px', background: 'linear-gradient(90deg, rgba(0,230,118,.05), rgba(0,230,118,.01))', borderBottom: '1px solid rgba(0,230,118,.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 10px #00E676', flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#00E676', fontFamily: 'Syne Mono,monospace', flex: 1 }}>Operátor připojen · Živý chat</span>
                <button onClick={() => { resetSession(); setStep('form'); setMessages([]); setEmail(''); setRequest('') }} title="Nová konverzace" style={{ fontSize: 9, color: 'rgba(240,235,225,.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne Mono,monospace', letterSpacing: .5, padding: '2px 6px', borderRadius: 4, transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F0B429')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,235,225,.3)')}>
                  + Nová
                </button>
              </div>
              <div className="cw-scroll" style={{ height: 285, overflowY: 'auto', padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.filter(m => !m.message.startsWith('📧')).map((m, i) => (
                  <div key={i} className="cw-msg" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                    {m.role === 'admin' && <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, boxShadow: '0 3px 10px rgba(240,180,41,.2)' }}>👑</div>}
                    <div>
                      {m.role === 'admin' && <div style={{ fontSize: 9, color: 'rgba(240,180,41,.4)', marginBottom: 3, fontFamily: 'Syne Mono,monospace', letterSpacing: .5 }}>Operátor</div>}
                      <div style={{ maxWidth: 230, padding: '10px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'linear-gradient(135deg,#F0B429,#C8880A)' : 'rgba(255,255,255,.06)', color: m.role === 'user' ? '#000' : '#F0EBE1', fontSize: 13, lineHeight: 1.55, fontWeight: m.role === 'user' ? 500 : 400, boxShadow: m.role === 'user' ? '0 4px 18px rgba(240,180,41,.2)' : '0 2px 8px rgba(0,0,0,.2)', border: m.role === 'admin' ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,.04)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="cw-icon-btn" onClick={() => fileRef.current?.click()} title="Přiložit soubor nebo foto" style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>📎</button>
                  <input className="cw-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Napiš zprávu..." style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, padding: '10px 13px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', transition: 'all .2s' }} />
                  <button className="cw-send" onClick={send} style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#F0B429,#C8880A)', border: 'none', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(240,180,41,.28)', flexShrink: 0, transition: 'all .2s' }}>↑</button>
                </div>
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 9, color: 'rgba(240,235,225,.18)', fontFamily: 'Syne Mono,monospace', letterSpacing: .5 }}>📎 Foto · PDF · Word podporováno</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Close button - only when open */}
      {isOpen && (
        <button onClick={() => { setStep('closed'); setMinimized(false) }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,235,225,.5)', transition: 'all .2s' }}>×</button>
      )}
    </div>
  )
}


export default function HomePage() {
  const [aiStatus, setAiStatus] = useState('AI analyzuje 2 341 nabídek právě teď')
  const [online, setOnline] = useState(47)
  const [members, setMembers] = useState(2341)
  const [counted, setCounted] = useState(false)
  const [liveAlert, setLiveAlert] = useState<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [views, setViews] = useState([847, 1203, 623])
  const statsRef = useRef<HTMLDivElement>(null)

  const statuses = ['AI analyzuje 2 341 nabídek právě teď','Nový deal detekován – marketplace flip','AI skener: 94% confidence score','Filtrování: 18 příležitostí prošlo','VIP alert odesílán členům…']
  const alerts = [
    {e:'📱',n:'Tomáš P.',b:'právě flipoval iPhone 15 Pro',a:'+7 200 Kč'},
    {e:'🤖',n:'Jakub M.',b:'registroval Jasper AI affiliate',a:'+35% provize'},
    {e:'🎮',n:'Petra K.',b:'prodala RTX 3060 Ti',a:'+4 100 Kč'},
    {e:'💻',n:'Martin V.',b:'flipoval MacBook Air M2',a:'+8 990 Kč'},
    {e:'👑',n:'Eliška R.',b:'vstoupila do VIP komunity',a:'🎉 Vítej!'},
  ]

  useEffect(() => {
    let si = 0
    const iv1 = setInterval(() => { si = (si+1)%5; setAiStatus(statuses[si]) }, 4000)
    const iv2 = setInterval(() => setOnline(p => Math.max(40, p + (Math.random()>.5?1:-1))), 4200)
    const iv3 = setInterval(() => { if(Math.random()>.8) setMembers(p => p+1) }, 12000)
    const iv4 = setInterval(() => setViews(p => p.map((v) => Math.random()>.6 ? v + Math.floor(Math.random()*3)+1 : v)), 2500)
    let ai = 0
    const showN = () => {
      setLiveAlert(alerts[ai++ % alerts.length])
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5200)
    }
    const t1 = setTimeout(() => { showN(); const iv5 = setInterval(showN, 7800); return () => clearInterval(iv5) }, 2500)
    return () => { clearInterval(iv1); clearInterval(iv2); clearInterval(iv3); clearInterval(iv4); clearTimeout(t1) }
  }, [])

  useEffect(() => {
    if (!statsRef.current || counted) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCounted(true); obs.disconnect() }
    }, { threshold: .1 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const G = { g:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)' }

  const deals = [
    {e:'📱',b:'TOP DEAL',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'iPhone 15 Pro 256GB',buy:'15 000 Kč',sell:'22 500 Kč',p:'+7 000 Kč',s:'Marketplace Flip'},
    {e:'🤖',b:'AI TOOL',bc:'rgba(77,159,255,.08)',bc2:'rgba(77,159,255,.18)',bc3:G.blu,n:'Jasper AI Affiliate',buy:'Provize 35%',sell:'Recurring',p:'Pasivní příjem',s:'Affiliate'},
    {e:'💻',b:'VIP ONLY',bc:'rgba(155,93,229,.08)',bc2:'rgba(155,93,229,.18)',bc3:G.pur,n:'MacBook Air M2',buy:'26 000 Kč',sell:'34 990 Kč',p:'+8 990 Kč',s:'Marketplace Flip'},
    {e:'🎮',b:'FLIP ALERT',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'RTX 3060 Ti 8GB',buy:'5 200 Kč',sell:'8 500 Kč',p:'+3 300 Kč',s:'Marketplace Flip'},
    {e:'🎧',b:'HOT DEAL',bc:'rgba(255,59,92,.08)',bc2:'rgba(255,59,92,.18)',bc3:'#FF3B5C',n:'AirPods Pro 2',buy:'4 200 Kč',sell:'6 990 Kč',p:'+2 790 Kč',s:'Marketplace Flip'},
    {e:'🌀',b:'TREND',bc:'rgba(0,230,118,.06)',bc2:'rgba(0,230,118,.14)',bc3:G.grn,n:'Dyson V15 Detect',buy:'8 900 Kč',sell:'14 200 Kč',p:'+4 800 Kč',s:'Trend Produkt'},
  ]

  const tickerItems = ['iPhone 15 Pro +7 000 Kč','Jasper AI 35% provize','RTX 3060 Ti +3 300 Kč','MacBook Air M2 +8 990 Kč','AirPods Pro 2 +2 790 Kč','PS5 Slim +3 800 Kč','Dyson V15 +4 800 Kč']
  const mq1 = ['MARKETPLACE FLIPY','AI PŘÍLEŽITOSTI','TREND PRODUKTY','PROFIT ALERTY','VIP KOMUNITA','LIVE DEALY']
  const mq2 = ['PASIVNÍ PŘÍJEM','ČESKÁ KOMUNITA','DŘÍV NEŽ OSTATNÍ','ONLINE PROFIT','REAL DEALS ONLY','VERIFIED PROFITS']

  return (
    <div style={{background:'#020208',color:G.wht,fontFamily:'Syne,sans-serif',overflowX:'hidden'}}>
      <style>{`
        @keyframes fadeU{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(0,230,118,.55)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes oF{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-28px)}}
        @keyframes gP{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes gB{0%,86%,100%{opacity:0;transform:translate(0)}87%{opacity:.9;transform:translate(-6px,2px)}89%{opacity:.9;transform:translate(6px,-2px)}91%{opacity:.5}93%{opacity:0}}
        @keyframes gA{0%,86%,100%{opacity:0;transform:translate(0)}87%{opacity:.7;transform:translate(6px,-2px)}89%{opacity:.7;transform:translate(-6px,2px)}91%{opacity:.4}93%{opacity:0}}
        @keyframes tkS{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes mqS{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes vipGlow{0%,100%{border-color:rgba(240,180,41,.2)}50%{border-color:rgba(240,180,41,.38)}}
        @keyframes count{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanLine{0%{top:0%;opacity:0}5%{opacity:.6}95%{opacity:.6}100%{top:100%;opacity:0}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes textGlow{0%,100%{text-shadow:0 0 40px rgba(240,180,41,.2)}50%{text-shadow:0 0 80px rgba(240,180,41,.5),0 0 120px rgba(240,180,41,.2)}}
        @keyframes nodeGlow{0%,100%{opacity:.7}50%{opacity:1}}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr !important;text-align:center;padding:90px 20px 60px !important}
          .hero-r{display:none !important}
          .hbtns{justify-content:center}
          .proof-row{justify-content:center}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important}
          .deals-grid{grid-template-columns:1fr !important}
          .how-grid{grid-template-columns:1fr !important;gap:10px !important}
          .how-grid>div{border-radius:14px !important}
          .vip-grid{grid-template-columns:1fr !important}
          .vip-banner-grid{grid-template-columns:1fr !important}
          .vip-banner-cta{align-items:flex-start !important}
          .proof-grid{grid-template-columns:1fr !important}
          .proof-left{padding-right:0 !important;border-right:none !important;border-bottom:1px solid rgba(255,255,255,.05);padding-bottom:60px;margin-bottom:60px}
          .proof-right{padding-left:0 !important}
          .pcards-grid{grid-template-columns:1fr 1fr !important}
          .pricing-grid{grid-template-columns:1fr !important;max-width:480px !important;margin-left:auto !important;margin-right:auto !important}
          .sec-pad{padding:80px 20px !important}
          .footer-grid{flex-direction:column !important}
          .footer-cols{flex-direction:column !important;gap:20px !important}
          .cta-box{padding:48px 24px !important;border-radius:18px !important}
          .faq-wrap{padding:80px 20px !important}
          .navbar-links{display:none !important}
          .navbar-inner{padding:0 18px !important}
          .marquee-text{font-size:32px !important}
        }
        @media(max-width:480px){
          .pcards-grid{grid-template-columns:1fr !important}
          .stats-grid{grid-template-columns:1fr 1fr !important}
          .pricing-grid{grid-template-columns:1fr !important;max-width:340px !important}
        }
        .glitch{position:relative;display:inline-block;color:#F0B429;text-shadow:0 0 60px rgba(240,180,41,.4)}
        .glitch::before{content:attr(data-t);position:absolute;top:0;left:0;width:100%;color:#0ff;opacity:0;animation:gB 5.5s steps(1) infinite;clip-path:polygon(0 8%,100% 8%,100% 38%,0 38%)}
        .glitch::after{content:attr(data-t);position:absolute;top:0;left:0;width:100%;color:#f0f;opacity:0;animation:gA 5.5s steps(1) .18s infinite;clip-path:polygon(0 62%,100% 62%,100% 88%,0 88%)}
        .dc:hover{transform:translateY(-11px) scale(1.012)!important;z-index:2}
        .vc:hover{transform:translateY(-10px)!important}
        .tc:hover{transform:translateX(5px)!important}
        .pcard:hover{transform:translateX(4px) translateY(-3px)!important}
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          HERO  –  text vlevo · iPhone vpravo (jako BetImperium)
      ════════════════════════════════════════════════════════════ */}
      <section className="hero-grid" style={{
        minHeight:'100vh',
        display:'grid',
        /* pevné 2 sloupce: text roste, telefon má fixní šířku */
        gridTemplateColumns:'1fr 380px',
        alignItems:'center',
        padding:'100px 56px 80px',
        position:'relative',
        overflow:'hidden',
        gap:48,
      }}>
        {/* dekorativní vrstvy pozadí */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.6),transparent)',zIndex:20,pointerEvents:'none'}} />
        <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:'linear-gradient(180deg,rgba(240,180,41,.04) 0%,transparent 100%)',zIndex:1,pointerEvents:'none'}} />
        <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,230,118,.35),transparent)',animation:'scanLine 6s ease-in-out infinite',zIndex:20,pointerEvents:'none'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(240,180,41,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.025) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse 90% 90% at 50% 50%,black 5%,transparent 75%)',animation:'gP 5s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:700,height:700,background:'radial-gradient(circle,rgba(240,180,41,.1) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(70px)',top:-200,right:-100,animation:'oF 14s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:550,height:550,background:'radial-gradient(circle,rgba(155,93,229,.07) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(70px)',bottom:-100,left:-80,animation:'oF 14s ease-in-out infinite',animationDelay:'-5s',pointerEvents:'none'}} />

        {/* ── LEVÝ SLOUPEC: text (stejný jako originál) ── */}
        <div style={{position:'relative',zIndex:10}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'6px 16px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.18)',backdropFilter:'blur(20px)',marginBottom:32}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,animation:'ping 1.8s infinite',display:'inline-block',flexShrink:0}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:G.grn,transition:'opacity .4s'}}>{aiStatus}</span>
          </div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(64px,10vw,140px)',lineHeight:.86,letterSpacing:4,marginBottom:20}}>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) both'}}>KAŽDÝ DEN</span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .08s both'}}>JSOU TAM</span>
            <span style={{display:'block',animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .16s both'}}>
              <span style={{background:'linear-gradient(90deg,#F0EBE1 0%,#F0B429 25%,#FFD97D 50%,#F0B429 75%,#F0EBE1 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite, textGlow 3s ease-in-out infinite'}}>VÝHODNÉ</span>
            </span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .24s both'}}>NABÍDKY.</span>
          </h1>
          <div style={{animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .32s both'}}>
            <p style={{fontSize:22,color:G.wht,lineHeight:1.5,maxWidth:480,marginBottom:12,fontWeight:600,letterSpacing:.5}}>Většina lidí je přehlédne.</p>
            <p style={{fontSize:16,color:G.mut,lineHeight:1.88,maxWidth:460,marginBottom:40,fontWeight:300}}>My je najdeme za tebe. Nakup levněji. Prodej za víc.<br/>Nepropásni dobrou příležitost.</p>
          </div>
          <div className="hbtns" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:52,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .44s both'}}>
            <Link href="#dealy" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',background:G.g,color:'#000',padding:'17px 34px',borderRadius:8,textDecoration:'none',transition:'transform .3s,box-shadow .3s',boxShadow:'0 8px 32px rgba(240,180,41,.22)',display:'inline-flex',alignItems:'center',gap:8}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-5px)';(e.currentTarget as any).style.boxShadow='0 24px 64px rgba(240,180,41,.52)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.22)'}}>Zobrazit dnešní nabídky →</Link>
            <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:G.wht,padding:'17px 34px',borderRadius:8,textDecoration:'none',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',backdropFilter:'blur(20px)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.25)';(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as any).style.color=G.wht}}>Začít zdarma</Link>
          </div>
          <div className="proof-row" style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap',animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .56s both'}}>
            <div style={{display:'flex'}}>
              {['T','M','E','J','K'].map((l,i) => <div key={i} style={{width:34,height:34,borderRadius:'50%',border:'2px solid rgba(240,180,41,.2)',background:'linear-gradient(135deg,rgba(240,180,41,.15),rgba(240,180,41,.03))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bebas Neue,sans-serif',fontSize:13,color:G.g,marginLeft:i>0?-9:0}}>{l}</div>)}
            </div>
            <div>
              <div style={{color:G.g,letterSpacing:3,fontSize:12}}>★★★★★</div>
              <div style={{fontSize:11,color:G.mut}}><strong style={{color:G.wht}}>{members.toLocaleString('cs-CZ')}</strong>+ lidí nakupuje chytřeji</div>
            </div>
            <div style={{width:1,height:28,background:'rgba(255,255,255,.1)'}} />
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:G.mut}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,display:'inline-block',animation:'ping 1.8s infinite',flexShrink:0}} />
              <strong style={{color:G.wht}}>{online}</strong> právě hledá nabídky
            </div>
          </div>
        </div>

        {/* ── PRAVÝ SLOUPEC: iPhone telefon ── */}
        <div className="hero-r" style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          position:'relative',
          zIndex:10,
        }}>
          {/* ambient glow za telefonem */}
          <div style={{position:'absolute',width:340,height:500,background:'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(240,180,41,.07) 0%,transparent 65%)',borderRadius:'50%',filter:'blur(30px)',pointerEvents:'none',animation:'oF 8s ease-in-out infinite'}} />
          <PhoneMockup />
        </div>
      </section>

      {/* TICKER */}
      <div style={{position:'relative',zIndex:10,padding:'15px 0',background:'rgba(240,180,41,.015)',borderTop:'1px solid rgba(240,180,41,.07)',borderBottom:'1px solid rgba(240,180,41,.07)',overflow:'hidden'}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'tkS 28s linear infinite'}}>
          {[...tickerItems,...tickerItems].map((t,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:10,padding:'0 36px',fontFamily:'Syne Mono,monospace',fontSize:10,letterSpacing:1,color:'rgba(240,235,225,.28)'}}>{t.split(' ').slice(0,-1).join(' ')} <span style={{color:G.grn,fontWeight:700}}>{t.split(' ').slice(-1)[0]}</span><span style={{color:'rgba(240,180,41,.16)',fontSize:20}}>·</span></span>)}
        </div>
      </div>

      {/* STATS */}
      <div ref={statsRef} className="stats-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        {[{n:247,s:'',l:'Dealů za měsíc'},{n:4235,s:' Kč',l:'Průměrný profit'},{n:18900,s:' Kč',l:'Největší profit'},{n:2341,s:'+',l:'Aktivních členů'}].map(({n,s,l}) => (
          <div key={l} style={{background:'rgba(6,6,14,.92)',backdropFilter:'blur(20px)',padding:'56px 36px',position:'relative',overflow:'hidden'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(50px,5.5vw,84px)',letterSpacing:2,color:G.g,lineHeight:1,textShadow:'0 0 50px rgba(240,180,41,.35)',marginBottom:8,animation:counted?'count .5s ease':'none'}}>
              {counted ? n.toLocaleString('cs-CZ')+s : '0'}
            </div>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.mut}}>{l}</div>
          </div>
        ))}
      </div>

      {/* DEALS */}
      <section id="dealy" className="sec-pad" style={{padding:'120px clamp(16px,5vw,56px)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:60,flexWrap:'wrap',gap:20}}>
          <div>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,animation:'ping 1.8s infinite',display:'inline-block'}} />
              Live · aktualizováno před 2 min
            </div>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,96px)',letterSpacing:3,lineHeight:.85}}>DNEŠNÍ<br/><span style={{color:G.g}}>NABÍDKY</span></h2>
          </div>
          <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.g,textDecoration:'none',padding:'10px 20px',borderRadius:6,background:'rgba(240,180,41,.05)',border:'1px solid rgba(240,180,41,.18)',backdropFilter:'blur(16px)',transition:'all .25s',whiteSpace:'nowrap'}} onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(240,180,41,.1)'}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(240,180,41,.05)'}}>Zobrazit vše →</Link>
        </div>
        <div className="deals-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
          {deals.map((d,i) => (
            <div key={i} className="dc" style={{position:'relative',overflow:'hidden',background:G.gl,backdropFilter:'blur(32px) saturate(180%)',border:`1px solid ${G.br}`,borderRadius:16,padding:24,transition:'transform .5s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .5s'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'55%',background:'linear-gradient(180deg,rgba(255,255,255,.04) 0%,transparent 100%)',borderRadius:'16px 16px 0 0',pointerEvents:'none'}} />
              <span style={{display:'inline-flex',alignItems:'center',gap:4,fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'4px 10px',borderRadius:100,marginBottom:16,background:d.bc,color:d.bc3,border:`1px solid ${d.bc2}`}}>{d.b}</span>
              <span style={{fontSize:44,display:'block',marginBottom:14,filter:'drop-shadow(0 0 8px rgba(240,180,41,.15))'}}>{d.e}</span>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,marginBottom:16,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.n}</div>
              <div style={{height:1,background:'rgba(255,255,255,.055)',marginBottom:14}} />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}><span style={{color:G.mut,fontFamily:'Syne Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:1}}>Koupeno za</span><span style={{color:G.g,fontWeight:500,fontSize:13}}>{d.buy}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}><span style={{color:G.mut,fontFamily:'Syne Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:1}}>Tržní cena</span><span style={{color:G.wht,fontWeight:500,fontSize:13}}>{d.sell}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,padding:'13px 14px',borderRadius:10,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.12)'}}>
                <span style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,letterSpacing:1,textTransform:'uppercase',display:'flex',alignItems:'center',gap:5}}><span style={{width:4,height:4,borderRadius:'50%',background:G.g,display:'inline-block'}} />{d.s}</span>
                <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,color:G.grn,letterSpacing:1,textShadow:'0 0 24px rgba(0,230,118,.35)',lineHeight:1}}>{d.p}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div style={{padding:'52px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'mqS 22s linear infinite'}}>
          {[...mq1,...mq1].map((w,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:22,padding:'0 36px',fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:5,color:'rgba(240,235,225,.04)'}}>{w}<span style={{color:'rgba(240,180,41,.1)',fontSize:24}}>✦</span></span>)}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{position:'relative',zIndex:10,padding:'80px 0',background:'linear-gradient(180deg,#06060E 0%,#020208 100%)',overflow:'hidden'}}>
        <style>{`
          @keyframes orb1{from{transform:rotate(0deg) translateX(var(--r1)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r1)) rotate(-360deg)}}
          @keyframes orb2{from{transform:rotate(120deg) translateX(var(--r1)) rotate(-120deg)}to{transform:rotate(480deg) translateX(var(--r1)) rotate(-480deg)}}
          @keyframes orb3{from{transform:rotate(240deg) translateX(var(--r1)) rotate(-240deg)}to{transform:rotate(600deg) translateX(var(--r1)) rotate(-600deg)}}
          @keyframes orb4{from{transform:rotate(60deg) translateX(var(--r2)) rotate(-60deg)}to{transform:rotate(420deg) translateX(var(--r2)) rotate(-420deg)}}
          @keyframes orb5{from{transform:rotate(180deg) translateX(var(--r2)) rotate(-180deg)}to{transform:rotate(540deg) translateX(var(--r2)) rotate(-540deg)}}
          @keyframes orb6{from{transform:rotate(300deg) translateX(var(--r2)) rotate(-300deg)}to{transform:rotate(660deg) translateX(var(--r2)) rotate(-660deg)}}
          @keyframes coreRotate{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
          @keyframes coreRotateRev{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}
          @keyframes corePulse{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.4),0 0 40px rgba(240,180,41,.2)}50%{box-shadow:0 0 0 16px rgba(240,180,41,.0),0 0 80px rgba(240,180,41,.4)}}
          @keyframes matrixFall{0%{transform:translateY(-100%);opacity:1}100%{transform:translateY(100vh);opacity:0}}
          @keyframes neuralFlow{0%{stroke-dashoffset:200}100%{stroke-dashoffset:0}}
          @keyframes howCardIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
          @keyframes blink{0%,90%,100%{opacity:1}95%{opacity:.3}}
          .how-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1200px;margin:0 auto;padding:0 56px;}
          .how-scanner{position:relative;--r1:160px;--r2:240px;height:580px;margin-bottom:56px;}
          .how-steps{display:flex;flex-direction:column;gap:6px;}
          @media(max-width:960px){.how-wrap{grid-template-columns:1fr;gap:0;padding:0 24px;}.how-scanner{--r1:110px;--r2:165px;height:380px;margin-bottom:80px;}}
          @media(max-width:480px){.how-scanner{--r1:90px;--r2:135px;height:320px;margin-bottom:72px;}.how-matrix{display:none}}
        `}</style>
        <div style={{textAlign:'center',padding:'0 24px',marginBottom:56}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'#F0B429',marginBottom:12}}>Jak to funguje</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,92px)',letterSpacing:3,lineHeight:.85}}>TAK JEDNODUCHÉ<br/><span style={{color:'#F0B429'}}>TO JE.</span></h2>
        </div>
        <div className="how-wrap">
          <div className="how-scanner">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="how-matrix" style={{position:'absolute',top:0,left:`${i*13+2}%`,width:1,height:'80%',overflow:'hidden',opacity:.12}}>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:'#F0B429',lineHeight:1.4,animation:`matrixFall ${3+i*.4}s linear ${i*.3}s infinite`,whiteSpace:'nowrap',writingMode:'vertical-rl'}}>{'10AIΩ∑∆Σβλ'}</div>
              </div>
            ))}
            <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,230,118,.7),transparent)',animation:'scanLine 3s ease-in-out infinite',zIndex:8,boxShadow:'0 0 12px rgba(0,230,118,.4)'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:'calc(var(--r1) * 2)',height:'calc(var(--r1) * 2)',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px dashed rgba(240,180,41,.18)',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:'calc(var(--r2) * 2)',height:'calc(var(--r2) * 2)',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px dashed rgba(240,180,41,.08)',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:160,height:160,borderRadius:'50%',border:'1px solid rgba(240,180,41,.2)',borderTop:'2px solid rgba(240,180,41,.6)',animation:'coreRotate 8s linear infinite',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:120,height:120,borderRadius:'50%',border:'1px solid rgba(0,230,118,.15)',borderRight:'2px solid rgba(0,230,118,.5)',animation:'coreRotateRev 5s linear infinite',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',transform:'translate(-50%,-50%)',zIndex:10}}>
              <div style={{width:90,height:90,borderRadius:'50%',background:'radial-gradient(circle,rgba(240,180,41,.25) 0%,rgba(240,180,41,.08) 50%,transparent 70%)',border:'2px solid rgba(240,180,41,.5)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',animation:'corePulse 3s ease-in-out infinite',gap:4}}>
                <div style={{fontSize:26}}>🧠</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:6,color:'#F0B429',letterSpacing:2,textTransform:'uppercase',animation:'blink 4s ease-in-out infinite'}}>AI CORE</div>
              </div>
            </div>
            {[{emoji:'📡',label:'Scanning',color:'#00E676',anim:'orb1 12s linear infinite'},{emoji:'⚡',label:'Filtrování',color:'#4D9FFF',anim:'orb2 12s linear infinite'},{emoji:'👑',label:'VIP Alert',color:'#F0B429',anim:'orb3 12s linear infinite'}].map(o => (
              <div key={o.label} style={{position:'absolute',top:'42%',left:'50%',animation:o.anim,zIndex:8}}>
                <div style={{transform:'translate(-50%,-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{width:46,height:46,borderRadius:'50%',background:`${o.color}15`,border:`2px solid ${o.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,backdropFilter:'blur(8px)',boxShadow:`0 0 20px ${o.color}33`}}>{o.emoji}</div>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:7,color:o.color,letterSpacing:1,textTransform:'uppercase',background:'rgba(2,2,8,.88)',padding:'2px 6px',borderRadius:4,whiteSpace:'nowrap',border:`1px solid ${o.color}22`}}>{o.label}</div>
                </div>
              </div>
            ))}
            {[{emoji:'📱',label:'+7 000 Kč',color:'rgba(240,180,41,.8)',anim:'orb4 20s linear infinite'},{emoji:'💻',label:'+8 990 Kč',color:'rgba(0,230,118,.8)',anim:'orb5 20s linear infinite'},{emoji:'🎮',label:'+3 300 Kč',color:'rgba(77,159,255,.8)',anim:'orb6 20s linear infinite'}].map(o => (
              <div key={o.label} style={{position:'absolute',top:'42%',left:'50%',animation:o.anim,zIndex:7}}>
                <div style={{transform:'translate(-50%,-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,backdropFilter:'blur(6px)'}}>{o.emoji}</div>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:10,color:o.color,letterSpacing:1,background:'rgba(2,2,8,.88)',padding:'1px 5px',borderRadius:3,whiteSpace:'nowrap'}}>{o.label}</div>
                </div>
              </div>
            ))}
            <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:6,pointerEvents:'none'}} viewBox="0 0 400 520" preserveAspectRatio="xMidYMid meet">
              {[{x1:55,y1:78,x2:200,y2:218,color:'#00E676'},{x1:305,y1:52,x2:200,y2:218,color:'#4D9FFF'},{x1:355,y1:210,x2:200,y2:218,color:'#9B5DE5'},{x1:320,y1:430,x2:200,y2:218,color:'#F0B429'},{x1:98,y1:445,x2:200,y2:218,color:'#FF6B35'},{x1:32,y1:290,x2:200,y2:218,color:'#00E676'}].map((l,i) => (
                <g key={i}>
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth=".5" strokeOpacity=".15" />
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1" strokeOpacity=".5" strokeDasharray="4 6" style={{animation:`neuralFlow ${2+i*.3}s linear ${i*.4}s infinite`}} />
                </g>
              ))}
            </svg>
            <ScannerStatus />
          </div>
          <div className="how-steps">
            {[{n:'01',icon:'🔍',color:'#00E676',h:'Sledujeme trh za tebe',p:'Procházíme tisíce inzerátů každý den. Auta, nemovitosti, elektroniku, oblečení – vše na jednom místě. Ty nemusíš hledat.'},{n:'02',icon:'✓',color:'#4D9FFF',h:'Vybereme to nejlepší',p:'Zobrazíme ti jen nabídky které skutečně stojí za pozornost. Žádný šum, žádné přehlcení.'},{n:'03',icon:'🔔',color:'#F0B429',h:'Upozorníme tě jako první',p:'Jakmile se objeví dobrá nabídka, okamžitě ti dáme vědět. Dřív než to uvidí ostatní.'}].map((s2,i) => (
              <div key={i} style={{display:'flex',gap:20,alignItems:'flex-start',padding:'22px 24px',background:'rgba(255,255,255,.026)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,.07)',borderLeft:`3px solid ${s2.color}`,borderRadius:12,transition:'all .3s',animation:`howCardIn .6s ${i*.15}s ease both`,marginBottom:10}} onMouseEnter={e=>{(e.currentTarget as any).style.background=`${s2.color}06`;(e.currentTarget as any).style.transform='translateX(6px)'}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,.026)';(e.currentTarget as any).style.transform=''}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:40,color:`${s2.color}25`,lineHeight:1,flexShrink:0}}>{s2.n}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`${s2.color}12`,border:`1px solid ${s2.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{s2.icon}</div>
                    <h3 style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:s2.color}}>{s2.h}</h3>
                  </div>
                  <p style={{fontSize:12,color:'rgba(240,235,225,.45)',lineHeight:1.85,fontWeight:300}}>{s2.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div style={{padding:'52px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'mqS 18s linear infinite reverse'}}>
          {[...mq2,...mq2].map((w,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:22,padding:'0 36px',fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:5,color:'rgba(240,235,225,.04)'}}>{w}<span style={{color:'rgba(240,180,41,.1)',fontSize:24}}>✦</span></span>)}
        </div>
      </div>

      {/* VIP SECTION */}
      <section className="sec-pad" style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',background:'linear-gradient(180deg,#020208 0%,#06060E 100%)'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 65% 70% at 50% 50%,rgba(240,180,41,.03) 0%,transparent 70%)'}} />
        <div style={{textAlign:'center',marginBottom:64,position:'relative'}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>👑 Exkluzivní přístup</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,92px)',letterSpacing:3,lineHeight:.85}}>CO ZÍSKÁŠ<br/><span style={{color:G.g}}>VE VIP?</span></h2>
        </div>
        <div className="vip-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,position:'relative'}}>
          {[{n:'01',i:'🔔',h:'Upozornění jako první',p:'Jakmile přibyde dobrá nabídka, okamžitě ti dáme vědět. Dřív než ostatní.'},{n:'02',i:'🎯',h:'Jen relevantní nabídky',p:'Žádný šum. Zobrazujeme ti jen to co ti skutečně sedí.'},{n:'03',i:'💰',h:'Nakup za méně',p:'Porovnáváme ceny za tebe. Vždy víš jestli je nabídka výhodná.'},{n:'04',i:'📦',h:'Prodej jednodušeji',p:'Přidej inzerát za minutu. Oslovíš tisíce lidí kteří aktivně hledají.'},{n:'05',i:'👥',h:'Komunita lidí jako ty',p:'Sdílíme tipy, zkušenosti a dobré nabídky. Nejsi na to sám.'},{n:'06',i:'📊',h:'Přehled trhu',p:'Vidíš co je podhodnocené, co táhne a kde jsou příležitosti.'}].map((v,i) => (
            <div key={i} className="vc" style={{background:'rgba(255,255,255,.022)',backdropFilter:'blur(28px)',border:`1px solid ${G.br}`,borderRadius:16,padding:'40px 32px',position:'relative',overflow:'hidden',transition:'transform .45s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .4s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-10px)';(e.currentTarget as any).style.borderColor='rgba(240,180,41,.2)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.borderColor=G.br}}>
              <div style={{position:'absolute',top:14,right:18,fontFamily:'Bebas Neue,sans-serif',fontSize:72,color:'rgba(240,180,41,.04)',lineHeight:1}}>{v.n}</div>
              <div style={{width:52,height:52,borderRadius:11,background:'rgba(240,180,41,.07)',border:'1px solid rgba(240,180,41,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20}}>{v.i}</div>
              <h3 style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:11}}>{v.h}</h3>
              <p style={{fontSize:12,color:G.mut,lineHeight:1.88,fontWeight:300}}>{v.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="proof-grid sec-pad" style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:0}}>
        <div className="proof-left" style={{paddingRight:88,borderRight:'1px solid rgba(255,255,255,.05)'}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>💰 Ověřené profity</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(38px,5vw,68px)',letterSpacing:3,lineHeight:.85,marginBottom:16}}>LIDÉ KTEŘÍ<br/><span style={{color:G.g}}>TO ZKUSILI.</span></h2>
          <p style={{fontSize:12,color:G.mut,margin:'16px 0 32px',fontWeight:300,lineHeight:1.88}}>Skutečné výsledky skutečných lidí.</p>
          <div className="pcards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10,marginBottom:32}}>
            {[{a:'Ušetřil 8 200 Kč',i:'iPhone 14 Pro · Praha',t:'Nalezeno za 2 dny'},{a:'Prodal za 3 dny',i:'MacBook Air M1 · Brno',t:'Bez zbytečného smlouvání'},{a:'Ušetřil 3 450 Kč',i:'PS5 · Ostrava',t:'Koupil pod tržní cenou'},{a:'Našel za hodinu',i:'RTX 3060 Ti · Plzeň',t:'Nabídka zmizela do 6 hodin'}].map((p,i) => (
              <div key={i} className="pcard" style={{background:'rgba(255,255,255,.022)',backdropFilter:'blur(24px)',border:'1px solid rgba(0,230,118,.1)',borderLeft:'2px solid #00E676',borderRadius:11,padding:20,transition:'transform .3s'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:13,color:G.grn,fontWeight:700,marginBottom:4}}>{p.a}</div>
                <div style={{fontSize:12,color:G.wht,fontWeight:500,marginBottom:4}}>{p.i}</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut,letterSpacing:.5}}>{p.t}</div>
              </div>
            ))}
          </div>
          <Link href="/dashboard" style={{background:G.g,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'16px 32px',borderRadius:8,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(240,180,41,.22)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-4px)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform=''}}>✈ Zobrazit na platformě</Link>
        </div>
        <div className="proof-right" style={{paddingLeft:88}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>⭐ Recenze</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(38px,5vw,68px)',letterSpacing:3,lineHeight:.85,marginBottom:32}}>CO ŘÍKAJÍ<br/><span style={{color:G.g}}>ČLENOVÉ</span></h2>
          {[{av:'T',n:'Tomáš P., Praha',a:'Ušetřil 18 000 Kč',t:'Hledal jsem notebook tři týdny sám a nic. NajdiDeal mi ho našel za dva dny. Zaplatil jsem o 18 000 méně než v obchodě.'},{av:'M',n:'Martin V., Brno',a:'Prodal za 3 dny',t:'Měl jsem auto na prodej dva měsíce bez zájmu. Dal jsem ho sem a do tří dnů byl prodaný. Bez handrkování o cenu.'},{av:'E',n:'Eliška R., Ostrava',a:'Nekupuje jinak',t:'Teď před každým nákupem kouknu sem. Třikrát jsem koupila věc výrazně pod cenou. Prostě to dává smysl.'}].map((r,i) => (
            <div key={i} className="tc" style={{background:'rgba(255,255,255,.02)',backdropFilter:'blur(24px)',border:`1px solid ${G.br}`,borderRadius:13,padding:24,marginBottom:10,position:'relative',overflow:'hidden',transition:'border-color .3s,transform .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.14)'}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor=G.br}}>
              <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:12}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,rgba(240,180,41,.18),rgba(240,180,41,.04))',border:'1px solid rgba(240,180,41,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bebas Neue,sans-serif',fontSize:17,color:G.g,flexShrink:0}}>{r.av}</div>
                <div><div style={{fontSize:12,fontWeight:700}}>{r.n}</div><div style={{color:G.g,fontSize:9,letterSpacing:3}}>★★★★★</div></div>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,color:G.grn,marginLeft:'auto',letterSpacing:1}}>{r.a}</div>
              </div>
              <p style={{fontSize:11,color:G.mut,lineHeight:1.82,fontWeight:300}}>{r.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',textAlign:'center',background:'linear-gradient(180deg,#06060E 0%,#020208 100%)'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(240,180,41,.025) 0%,transparent 70%)'}} />
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 20px',borderRadius:100,background:'rgba(0,230,118,.06)',border:'1px solid rgba(0,230,118,.2)',marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#00E676',display:'inline-block',animation:'ping 1.8s infinite',flexShrink:0}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:10,letterSpacing:2,color:'#00E676'}}>Zakladatelská cena · Přihlas se teď a platíš méně navždy</span>
          </div>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>Jednoduchý přístup</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,96px)',letterSpacing:3,lineHeight:.85}}>VYBER SI <span style={{color:G.g}}>PŘÍSTUP</span></h2>
          <p style={{fontSize:14,color:G.mut,marginTop:14,fontWeight:300}}>Začni zdarma · Zruš kdykoliv · Žádné závazky</p>
          <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,maxWidth:920,margin:'56px auto 0'}}>
            {[
              {tier:'ZDARMA',price:'0',per:'navždy',color:G.mut,desc:'Pro vyzkoušení',features:[{on:true,t:'Základní nabídky každý den'},{on:true,t:'Zobrazení všech inzerátů'},{on:true,t:'Přístup k marketplace'},{on:false,t:'Okamžitá upozornění'},{on:false,t:'Kontakt na prodejce'},{on:false,t:'Přidávání inzerátů'},{on:false,t:'Uložená hledání'},{on:false,t:'Hlídač ceny'}],cta:'Začít zdarma',href:'/dashboard',featured:false,note:null},
              {tier:'STANDARD',price:'299',per:'měsíc',color:G.g,desc:'Pro aktivní nakupující a prodejce',features:[{on:true,t:'Vše ze Zdarma'},{on:true,t:'Okamžitá upozornění na nabídky'},{on:true,t:'Kontakt na prodejce (tel + zprávy)'},{on:true,t:'Až 5 inzerátů měsíčně'},{on:true,t:'Soukromá komunita'},{on:true,t:'Uložená hledání'},{on:true,t:'Historie cen'},{on:true,t:'Hlídač ceny – upozorní při slevě'}],cta:'Vybrat Standard',href:'/vip',featured:true,note:'Zakladatelská cena'},
              {tier:'PREMIUM',price:'699',per:'měsíc',color:'#4D9FFF',desc:'Pro maximální výhodu',features:[{on:true,t:'Vše ze Standard'},{on:true,t:'Upozornění JAKO PRVNÍ – dřív než ostatní'},{on:true,t:'Až 20 inzerátů měsíčně'},{on:true,t:'1× Boost inzerátu zdarma měsíčně'},{on:true,t:'Ověřený prodejce badge'},{on:true,t:'Odhad správné ceny produktu'},{on:true,t:'Statistiky tvých inzerátů'},{on:true,t:'Prioritní podpora do 4 hodin'}],cta:'Vybrat Premium',href:'/vip',featured:false,note:'Zakladatelská cena'},
            ].map((p,i) => (
              <div key={i} style={{background:p.featured?'rgba(240,180,41,.04)':i===2?'rgba(77,159,255,.03)':'rgba(255,255,255,.025)',backdropFilter:'blur(36px)',border:`1px solid ${p.featured?'rgba(240,180,41,.28)':i===2?'rgba(77,159,255,.18)':'rgba(255,255,255,.07)'}`,borderRadius:20,padding:'44px 32px',position:'relative',overflow:'hidden',textAlign:'left',transition:'transform .35s,box-shadow .35s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-6px)';(e.currentTarget as any).style.boxShadow='0 32px 80px rgba(0,0,0,.5)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow=''}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${p.color},transparent)`}} />
                {p.featured&&<div style={{position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:G.g,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'5px 16px',borderRadius:'0 0 8px 8px',boxShadow:'0 4px 18px rgba(240,180,41,.38)'}}>Nejoblíbenější</div>}
                <div style={{marginTop:p.featured?14:0}}>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:p.color,marginBottom:4}}>{p.tier}</div>
                  <div style={{fontSize:11,color:G.mut,marginBottom:20,fontWeight:300}}>{p.desc}</div>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:64,letterSpacing:2,lineHeight:1,color:p.featured?G.g:i===2?'#4D9FFF':G.wht}}>{p.price}<span style={{fontSize:22}}> Kč</span></div>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:G.mut,marginBottom:4}}>za {p.per}</div>
                  {p.note&&<div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:'#00E676',letterSpacing:1,marginBottom:20}}>🔒 {p.note} – cena se zvýší</div>}
                  {!p.note&&<div style={{marginBottom:20}} />}
                  <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:20}} />
                  <ul style={{listStyle:'none',marginBottom:28,padding:0}}>
                    {p.features.map((f,j)=>(
                      <li key={j} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:12,color:f.on?'rgba(240,235,225,.78)':G.mut,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontWeight:300,opacity:f.on?1:.4}}>
                        <span style={{width:17,height:17,borderRadius:'50%',background:f.on?'rgba(0,230,118,.08)':'rgba(255,255,255,.04)',border:`1px solid ${f.on?'rgba(0,230,118,.2)':'rgba(255,255,255,.07)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:f.on?'#00E676':G.mut,flexShrink:0,marginTop:1}}>{f.on?'✓':'✗'}</span>
                        {f.t}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} style={{display:'block',width:'100%',padding:'15px',borderRadius:10,fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',textAlign:'center',textDecoration:'none',transition:'all .3s',background:p.featured?G.g:i===2?'#4D9FFF':'rgba(255,255,255,.06)',color:p.featured||i===2?'#000':G.wht,border:p.featured||i===2?'none':'1px solid rgba(255,255,255,.1)',boxShadow:p.featured?'0 8px 28px rgba(240,180,41,.3)':i===2?'0 8px 28px rgba(77,159,255,.25)':''}}>{p.cta}</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{maxWidth:920,margin:'40px auto 0',background:'rgba(255,255,255,.022)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'32px 36px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)'}} />
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap' as const}}>
              <div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.g,marginBottom:6}}>⚡ Boost inzerátu</div>
                <div style={{fontSize:14,color:G.wht,fontWeight:600,marginBottom:4}}>Prodej rychleji. Zobraz se nahoře.</div>
                <div style={{fontSize:12,color:G.mut,fontWeight:300}}>Tvůj inzerát uvidí víc lidí a prodáš dřív.</div>
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {[{label:'7 dní',price:'79 Kč',color:'rgba(240,235,225,.5)'},{label:'30 dní',price:'199 Kč',color:G.g},{label:'Nahoře 1 týden',price:'299 Kč',color:'#4D9FFF'}].map(b=>(
                  <div key={b.label} style={{background:'rgba(255,255,255,.04)',border:`1px solid ${b.color}33`,borderRadius:12,padding:'14px 20px',textAlign:'center',cursor:'pointer',transition:'all .25s'}} onMouseEnter={e=>{(e.currentTarget as any).style.background=`${b.color}10`;(e.currentTarget as any).style.borderColor=`${b.color}55`}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,.04)';(e.currentTarget as any).style.borderColor=`${b.color}33`}}>
                    <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,color:b.color,letterSpacing:1,lineHeight:1}}>{b.price}</div>
                    <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,letterSpacing:1,textTransform:'uppercase',marginTop:4}}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:36,marginTop:32,flexWrap:'wrap'}}>
            {['✓ Zruš kdykoliv','✓ Bezpečná platba','✓ Okamžitý přístup','✓ Žádné skryté poplatky'].map(t=><div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:11,color:'#00E676',fontFamily:'Syne Mono,monospace'}}>{t}</div>)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{position:'relative',zIndex:10,padding:'140px clamp(16px,5vw,56px)',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(240,180,41,.04) 0%,transparent 70%)'}} />
        <div className="cta-box" style={{maxWidth:720,margin:'0 auto',position:'relative',background:'rgba(255,255,255,.025)',backdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:24,padding:'88px 64px',boxShadow:'0 56px 130px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07)'}}>
          <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,#F0B429,transparent)'}} />
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:4,textTransform:'uppercase',color:G.g,marginBottom:20}}>Připoj se</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(52px,10vw,112px)',letterSpacing:5,lineHeight:.86,marginBottom:20}}>PŘESTAŇ<br/>PŘEHLÍŽET<br/><span style={{color:G.g,textShadow:'0 0 56px rgba(240,180,41,.28)'}}>PŘÍLEŽITOSTI.</span></h2>
          <p style={{fontSize:14,color:G.mut,marginBottom:40,fontWeight:300,lineHeight:1.88}}>Přes 2 341 lidí už nakupuje chytřeji.<br/>Začni zdarma. Zruš kdykoliv.</p>
          <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',background:G.g,color:'#000',padding:'17px 34px',borderRadius:8,textDecoration:'none',boxShadow:'0 8px 32px rgba(240,180,41,.22)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-5px)';(e.currentTarget as any).style.boxShadow='0 24px 64px rgba(240,180,41,.52)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.22)'}}>Začít zdarma</Link>
            <Link href="#dealy" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:G.wht,padding:'17px 34px',borderRadius:8,textDecoration:'none',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',backdropFilter:'blur(20px)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.25)';(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as any).style.color=G.wht}}>Zobrazit nabídky</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{position:'relative',zIndex:10,padding:'60px 56px 28px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)'}} />
        <div className="footer-grid" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:36,marginBottom:48}}>
          <div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:19,letterSpacing:4,display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <NajdiLogo size="md" href="/" showText={true} />
            </div>
            <p style={{fontSize:11,color:G.mut,maxWidth:200,lineHeight:1.75,fontWeight:300}}>Najdi deal dřív než ostatní. Každý den nové příležitosti.</p>
          </div>
          <div className="footer-cols" style={{display:'flex',gap:56,flexWrap:'wrap'}}>
            {[{h:'Platforma',links:[{l:'Dashboard',href:'/dashboard'},{l:'VIP Členství',href:'/vip'},{l:'FAQ',href:'/faq'},{l:'Nápověda',href:'/napoveda'}]},{h:'Firma',links:[{l:'Kariéra',href:'/kariera'},{l:'Kontakt',href:'/kontakt'},{l:'Pro firmy',href:'/b2b'}]},{h:'Právní',links:[{l:'GDPR',href:'/gdpr'},{l:'Obchodní podmínky',href:'/obchodni-podminky'}]}].map(col => (
              <div key={col.h}>
                <h4 style={{fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:G.mut,marginBottom:14}}>{col.h}</h4>
                {col.links.map(lk => <Link key={lk.l} href={lk.href} style={{display:'block',fontSize:11,color:G.mut,textDecoration:'none',marginBottom:9,fontWeight:300,transition:'color .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.color=G.mut}}>{lk.l}</Link>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:24,borderTop:'1px solid rgba(255,255,255,.04)',flexWrap:'wrap',gap:8}}>
          <div style={{fontSize:9,color:G.mut,fontFamily:'Syne Mono,monospace'}}>© 2026 NajdiDeal · Hosabut s.r.o. · IČO: 23338342</div>
          <div style={{fontSize:9,color:G.mut,fontFamily:'Syne Mono,monospace'}}>info@najdideal.cz</div>
        </div>
      </footer>

      {/* LIVE NOTIFICATION */}
      {liveAlert && (
        <div style={{position:'fixed',bottom:28,left:28,zIndex:800,display:'flex',alignItems:'center',gap:13,background:'rgba(6,6,14,.9)',backdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,.07)',borderLeft:'2px solid #00E676',borderRadius:13,padding:'16px 20px',maxWidth:330,transform:showAlert?'translateX(0)':'translateX(-120%)',opacity:showAlert?1:0,transition:'transform .65s cubic-bezier(.34,1.56,.64,1),opacity .4s',boxShadow:'0 22px 72px rgba(0,0,0,.65)'}}>
          <span style={{fontSize:26,flexShrink:0}}>{liveAlert.e}</span>
          <div>
            <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>{liveAlert.n}</div>
            <div style={{fontSize:10,color:G.mut}}>{liveAlert.b}</div>
            <div style={{fontFamily:'Bebas Neue,monospace',fontSize:20,color:G.grn,letterSpacing:1,marginTop:3,textShadow:'0 0 16px rgba(0,230,118,.3)'}}>{liveAlert.a}</div>
          </div>
        </div>
      )}

      {/* LIVE CHAT WIDGET */}
      <ChatWidget />
      <NajdiBot mood="happy" />
    </div>
  )
}
