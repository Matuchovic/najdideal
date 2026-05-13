'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'login' | 'loading'>('login')
  const [loadPct, setLoadPct] = useState(0)
  const [loadStage, setLoadStage] = useState(0)
  const [liveCount, setLiveCount] = useState(47)
  const loadRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random() > .5 ? 1 : -1))), 4000)
    return () => clearInterval(iv)
  }, [])

  const G = {
    gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF', red: '#FF3B5C', pur: '#9B5DE5',
    wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)',
    bg: '#020208', bg2: '#06060E', gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)',
  }

  const loadStages = [
    { pct: 0,  label: 'MARKETPLACE FLIPY',  sub: 'Načítám tržiště…',       color: G.gold },
    { pct: 18, label: 'AUTA & MOTORKY',      sub: 'Skenuji 4 831 vozidel…', color: G.blu  },
    { pct: 36, label: 'NEMOVITOSTI',         sub: 'Analyzuji 1 247 bytů…',  color: G.pur  },
    { pct: 54, label: 'OBLEČENÍ & MÓDA',     sub: 'Hledám podhodnocené…',   color: G.grn  },
    { pct: 72, label: 'AI PROFIT SCORING',   sub: 'Hodnotím příležitosti…', color: G.red  },
    { pct: 90, label: 'PŘÍPRAVA DASHBOARDU', sub: 'Skoro hotovo…',          color: G.gold },
  ]

  const startLoading = () => {
    setPhase('loading')
    setLoadPct(0)
    setLoadStage(0)
    let p = 0
    loadRef.current = setInterval(() => {
      p += Math.random() * 1.6 + 0.5
      const pct = Math.min(Math.round(p), 100)
      setLoadPct(pct)
      const stage = loadStages.reduce((acc, s, i) => pct >= s.pct ? i : acc, 0)
      setLoadStage(stage)
      if (pct >= 100) {
        clearInterval(loadRef.current!)
        setTimeout(() => window.location.replace('/dashboard'), 500)
      }
    }, 55)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    startLoading()
  }

  const cur = loadStages[loadStage] || loadStages[0]

  return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden', fontFamily: 'Syne, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@300;400;600;700;800&family=Syne+Mono&display=swap');
        @keyframes spinRing    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes spinRingRev { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes corePulse   { 0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.5),0 0 40px rgba(240,180,41,.15)} 50%{box-shadow:0 0 0 16px rgba(240,180,41,0),0 0 80px rgba(240,180,41,.5)} }
        @keyframes stageIn     { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(24px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes pingGrn     { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,.8)} 55%{box-shadow:0 0 0 6px transparent} }
        @keyframes pingGold    { 0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.8)} 55%{box-shadow:0 0 0 5px transparent} }
        @keyframes orbFloat    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }
        @keyframes scanLine    { 0%{top:0%;opacity:0} 5%{opacity:.6} 95%{opacity:.6} 100%{top:100%;opacity:0} }
        @keyframes flashIn     { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .nd-input {
          width: 100%;
          background: rgba(6,6,14,.9);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 12px;
          padding: 14px 16px;
          color: #F0EBE1;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color .25s;
        }
        .nd-input:focus { border-color: rgba(240,180,41,.4); }
        .nd-input::placeholder { color: rgba(240,235,225,.25); }
        .nd-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #06060E inset !important;
          -webkit-text-fill-color: #F0EBE1 !important;
        }
        .nd-cat-card:hover { border-color: rgba(240,180,41,.25) !important; transform: translateY(-2px); }
      `}} />

      {/* ambient orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle,rgba(240,180,41,.06) 0%,transparent 65%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'orbFloat 12s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(0,230,118,.04) 0%,transparent 65%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'orbFloat 15s ease-in-out infinite reverse', pointerEvents: 'none' }} />
      {/* grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(240,180,41,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.02) 1px,transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* ════ LOGIN PHASE ════ */}
      {phase === 'login' && (
        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10, animation: 'fadeUp .7s ease both' }}>

          {/* logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, background: G.gold, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#000', boxShadow: '0 0 20px rgba(240,180,41,.35)' }}>ND</div>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: 5, color: G.wht }}>NAJDI<span style={{ color: G.gold }}>DEAL</span></span>
            </Link>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: G.mut }}>AI-powered marketplace</div>
          </div>

          {/* live badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.18)', borderRadius: 100 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, animation: 'pingGrn 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.grn }}>{Math.round(liveCount)} lidí právě nakupuje</span>
            </div>
          </div>

          {/* card */}
          <div style={{ background: 'rgba(255,255,255,.026)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.5),transparent)' }} />

            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 4, color: G.wht, marginBottom: 6, lineHeight: 1 }}>PŘIHLÁSIT SE</div>
              <div style={{ fontSize: 13, color: G.mut, fontWeight: 300 }}>Nakup levněji. Prodej za víc.</div>
            </div>

            {error && (
              <div style={{ marginBottom: 18, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,59,92,.08)', border: '1px solid rgba(255,59,92,.2)', fontFamily: 'Syne Mono, monospace', fontSize: 11, color: G.red, letterSpacing: '0.5px' }}>
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.mut, marginBottom: 7 }}>E-mail</div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: .4 }}>✉</span>
                  <input name="email" type="email" required placeholder="vas@email.cz" className="nd-input" style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.mut, marginBottom: 7 }}>Heslo</div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: .4 }}>🔒</span>
                  <input name="password" type={show ? 'text' : 'password'} required placeholder="••••••••" className="nd-input" style={{ paddingLeft: 40, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: G.mut, fontSize: 16, lineHeight: 1 }}>
                    {show ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
                <Link href="/reset-password" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: G.gold, textDecoration: 'none', opacity: .8 }}>Zapomenuté heslo?</Link>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', fontFamily: 'Syne Mono, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: loading ? 'rgba(240,180,41,.2)' : G.gold, color: loading ? G.gold : '#000', padding: '16px', borderRadius: 12, border: 'none', cursor: loading ? 'default' : 'pointer', boxShadow: loading ? 'none' : '0 8px 32px rgba(240,180,41,.4)', transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(240,180,41,.3)', borderTop: `2px solid ${G.gold}`, borderRadius: '50%', animation: 'spinRing .8s linear infinite' }} />Přihlašuji…</>
                ) : (
                  <>Vstoupit do NajdiDeal →</>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontFamily: 'Syne Mono, monospace', fontSize: 10, color: G.mut, marginBottom: 14 }}>nebo</div>

            <Link href="/register" style={{ display: 'block', width: '100%', fontFamily: 'Syne Mono, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(255,255,255,.04)', color: G.wht, padding: '15px', borderRadius: 12, border: `1px solid ${G.br}`, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', transition: 'all .25s', marginBottom: 28 }}>
              Začít zdarma
            </Link>

            {/* categories preview */}
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: G.mut, textAlign: 'center', marginBottom: 12 }}>Co najdeš uvnitř</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {[
                { e: '🔄', t: 'Marketplace Flipy', c: G.gold, sub: 'Nakup. Prodej. Profit.' },
                { e: '🚗', t: 'Auta & Motorky',    c: G.blu,  sub: '12 400+ vozidel' },
                { e: '🏠', t: 'Nemovitosti',        c: G.pur,  sub: '3 800+ bytů a domů' },
                { e: '👟', t: 'Bazar & Móda',       c: G.grn,  sub: 'Luxus pod cenou' },
              ].map(cat => (
                <div key={cat.t} className="nd-cat-card" style={{ background: G.gl, border: `1px solid ${cat.c}15`, borderRadius: 11, padding: '12px 11px', position: 'relative', overflow: 'hidden', transition: 'all .25s', cursor: 'default' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${cat.c},transparent)`, opacity: .5 }} />
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{cat.e}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: G.wht, marginBottom: 2 }}>{cat.t}</div>
                  <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{cat.sub}</div>
                </div>
              ))}
            </div>

            {/* social proof */}
            <div style={{ padding: '13px 15px', background: 'rgba(0,230,118,.04)', border: '1px solid rgba(0,230,118,.12)', borderRadius: 11, display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ fontSize: 22 }}>💰</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: G.wht }}>Průměrný profit 4 235 Kč/měsíc</div>
                <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, marginTop: 2 }}>2 341+ aktivních členů · zruš kdykoliv</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ LOADING PHASE ════ */}
      {phase === 'loading' && (
        <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'flashIn .4s ease' }}>

          {/* scan line across full screen */}
          <div style={{ position: 'absolute', left: '-50vw', right: '-50vw', height: 2, background: `linear-gradient(90deg,transparent,${cur.color},transparent)`, top: `${loadPct}%`, transition: 'top .08s linear', boxShadow: `0 0 16px ${cur.color}`, opacity: .6, pointerEvents: 'none' }} />

          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, background: G.gold, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: '#000', boxShadow: '0 0 20px rgba(240,180,41,.4)' }}>ND</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 5, color: G.wht }}>NAJDI<span style={{ color: G.gold }}>DEAL</span></div>
          </div>

          {/* big circle */}
          <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 40 }}>
            {/* outer ring */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 220, height: 220, borderRadius: '50%', border: '2px solid rgba(255,255,255,.05)', borderTop: `2px solid ${cur.color}`, animation: 'spinRing 1.8s linear infinite', transition: 'border-top-color .4s' }} />
            {/* mid ring */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 175, height: 175, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.04)', borderRight: `1.5px solid rgba(240,180,41,.35)`, animation: 'spinRingRev 1.3s linear infinite' }} />
            {/* inner ring */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 132, height: 132, borderRadius: '50%', border: '1px solid rgba(255,255,255,.03)', borderBottom: `1px solid ${cur.color}55`, animation: 'spinRing 2.4s linear infinite' }} />
            {/* core */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${cur.color}15,${cur.color}04 55%,transparent)`, border: `1.5px solid ${cur.color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'corePulse 2.5s ease-in-out infinite', gap: 4, transition: 'border-color .4s, background .4s' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, color: cur.color, letterSpacing: 1, lineHeight: 1, transition: 'color .4s', textShadow: `0 0 30px ${cur.color}66` }}>{loadPct}</div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, letterSpacing: '2px', textTransform: 'uppercase' }}>%</div>
            </div>
          </div>

          {/* stage label */}
          <div key={loadStage} style={{ textAlign: 'center', marginBottom: 24, animation: 'stageIn .35s ease' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 30, letterSpacing: 4, color: cur.color, marginBottom: 6, transition: 'color .4s', textShadow: `0 0 24px ${cur.color}55` }}>
              {cur.label}
            </div>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 11, color: G.mut, letterSpacing: '1px' }}>
              {cur.sub}
            </div>
          </div>

          {/* progress bar */}
          <div style={{ width: '100%', maxWidth: 400, height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${loadPct}%`, background: `linear-gradient(90deg,${cur.color},rgba(255,255,255,.9))`, borderRadius: 2, transition: 'width .07s linear, background .4s' }} />
          </div>

          {/* checklist */}
          <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loadStages.map((s, i) => {
              const done = loadPct >= s.pct + 18
              const active = loadStage === i
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: done ? 1 : active ? 1 : .25, transition: 'opacity .3s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${done ? G.grn : active ? s.color : G.br}`, background: done ? 'rgba(0,230,118,.15)' : active ? `${s.color}12` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, transition: 'all .3s' }}>
                    {done ? <span style={{ color: G.grn }}>✓</span> : active ? <span style={{ color: s.color }}>·</span> : null}
                  </div>
                  <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 11, color: done ? G.grn : active ? s.color : G.mut, letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color .3s', flex: 1 }}>{s.label}</span>
                  {active && <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: s.color, letterSpacing: 1 }}>{loadPct}%</span>}
                  {done && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, color: G.grn }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
