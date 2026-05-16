'use client'
import NajdiLogo from '@/components/ui/NajdiLogo'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import OnboardingTour from '@/components/ui/OnboardingTour'
import { Crown, TrendingUp, Bookmark, Bell, ArrowRight, Flame, Zap, Activity, Eye, Clock, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'


/* ═══════════ DESIGN TOKENS ═══════════ */
const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.1)', gold3:'rgba(240,180,41,.06)', gold4:'rgba(240,180,41,.22)',
  grn:'#00E676', grn2:'rgba(0,230,118,.08)',
  blu:'#4D9FFF', pur:'#9B5DE5', red:'#FF3B5C', org:'#FF6B35',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', mut2:'rgba(240,235,225,.2)',
  bg:'#020208', bg2:'#06060E',
  gl:'rgba(255,255,255,.026)', glh:'rgba(255,255,255,.046)',
  br:'rgba(255,255,255,.07)', brh:'rgba(240,180,41,.25)',
}

/* ═══════════ VIP SYSTEM ═══════════ */
type Role = 'free' | 'vip' | 'vip_pro' | 'vip_ultra' | 'vip_max' | 'admin'
const VIP_TIERS: Record<Role, { level: number; label: string; color: string; emoji: string; nextPlan?: string; nextPrice?: string; nextBenefit?: string }> = {
  free:      { level: 1, label: 'ZDARMA',   color: G.mut,  emoji: '🔓', nextPlan: 'STANDARD', nextPrice: '299 Kč/měsíc', nextBenefit: 'Okamžitá upozornění, kontakt na prodejce, marketplace' },
  vip:       { level: 2, label: 'STANDARD', color: G.gold, emoji: '⭐', nextPlan: 'PREMIUM',  nextPrice: '699 Kč/měsíc', nextBenefit: 'AI příležitosti, alerty jako první, boost inzerátů' },
  vip_pro:   { level: 3, label: 'PREMIUM',  color: G.blu,  emoji: '💎', nextPlan: 'PREMIUM',  nextPrice: '699 Kč/měsíc', nextBenefit: 'Máš nejvyšší přístup' },
  vip_ultra: { level: 4, label: 'PREMIUM',  color: G.blu,  emoji: '💎' },
  vip_max:   { level: 5, label: 'PREMIUM',  color: G.blu,  emoji: '💎' },
  admin:     { level: 99, label: 'ADMIN',   color: G.gold, emoji: '🔧' },
}
function getTier(role: string) { return VIP_TIERS[role as Role] ?? VIP_TIERS.free }
function hasAccess(userRole: string, requiredRole: string): boolean {
  return getTier(userRole).level >= getTier(requiredRole as Role).level
}

/* ═══════════ ANIMATED NUMBER ═══════════ */
function AnimNum({ val, suf = '', dur = 1200 }: { val: number; suf?: string; dur?: number }) {
  const [n, setN] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setN(Math.round(val * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [val, dur])
  return <>{n.toLocaleString('cs-CZ')}{suf}</>
}

/* ═══════════ BOOT SEQUENCE ═══════════ */
function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const sequence = [
    '> NAJDIDEAL INTELLIGENCE v3.0',
    '> Připojování k databázi dealů...',
    '> AI scoring engine: ONLINE',
    '> Trh skenován: Praha, Brno, Ostrava...',
    '> Načítám tvoje příležitosti...',
    '> DEAL ROOM AKTIVNÍ ✓',
  ]
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLines(prev => [...prev, sequence[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => { setDone(true); setTimeout(onDone, 600) }, 400)
      }
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#020208', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: done ? 0 : 1, transition: 'opacity .6s ease',
      pointerEvents: done ? 'none' : 'auto',
    }}>
      <div style={{ maxWidth: 480, width: '100%', padding: 32 }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <NajdiLogo size="lg" showText href="/" />
        </div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 11, letterSpacing: 1, lineHeight: 2.2 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ color: i === lines.length - 1 ? G.gold : G.mut, opacity: 1, animation: 'fadeIn .3s ease' }}>
              {l}
            </div>
          ))}
          <span style={{ display: 'inline-block', width: 8, height: 14, background: G.gold, animation: 'blink 1s infinite', verticalAlign: 'middle', marginLeft: 4 }} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════ PARTICLES ═══════════ */
function GoldParticles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    dur: 6 + Math.random() * 8,
    size: 1 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.35,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes rise {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: var(--op); }
          90% { opacity: var(--op); }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes categoryPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(240,180,41,0); }
          50% { box-shadow: 0 0 20px 4px rgba(240,180,41,.12); }
        }
        @keyframes dealSlide {
          from { opacity:0; transform: translateX(-16px); }
          to { opacity:1; transform: translateX(0); }
        }
        @keyframes goldPulse {
          0%,100% { opacity:.6; transform:scale(1); }
          50% { opacity:1; transform:scale(1.04); }
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmerMove {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          bottom: 0,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: G.gold,
          ['--op' as any]: p.opacity,
          animation: `rise ${p.dur}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

/* ═══════════ CATEGORY CARDS ═══════════ */
const CATEGORIES = [
  { icon: '🔄', label: 'MARKETPLACE FLIP', sub: 'Flipni to & vydělej', color: G.gold, href: '/deals?cat=marketplace_flip', glow: 'rgba(240,180,41,.2)', hot: true },
  { icon: '🤖', label: 'AI PŘÍLEŽITOST', sub: 'AI nalezené dealy', color: G.blu, href: '/deals?cat=ai_opportunity', glow: 'rgba(77,159,255,.2)' },
  { icon: '📈', label: 'TREND PRODUKT', sub: 'Trendující produkty', color: G.grn, href: '/deals?cat=trend_product', glow: 'rgba(0,230,118,.2)' },
  { icon: '⚡', label: 'PROFIT ALERT', sub: 'Rychlé příležitosti', color: G.red, href: '/deals?cat=profit_alert', glow: 'rgba(255,59,92,.2)' },
  { icon: '💎', label: 'AFFILIATE', sub: 'Pasivní příjem', color: G.pur, href: '/deals?cat=affiliate', glow: 'rgba(155,93,229,.2)' },
  { icon: '📦', label: 'DROPSHIPPING', sub: 'Bez skladu & zásob', color: G.org, href: '/deals?cat=dropshipping', glow: 'rgba(255,107,53,.2)' },
  { icon: '₿', label: 'KRYPTO', sub: 'Crypto příležitosti', color: '#FFD97D', href: '/deals?cat=crypto', glow: 'rgba(255,217,125,.2)' },
  { icon: '🎯', label: 'OSTATNÍ', sub: 'Různé příležitosti', color: G.mut, href: '/deals', glow: 'rgba(240,235,225,.1)' },
]

function CategoryCard({ cat, idx }: { cat: typeof CATEGORIES[0]; idx: number }) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), idx * 60); obs.disconnect() } }, { threshold: .1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [idx])

  return (
    <Link href={cat.href} style={{ textDecoration: 'none' }}>
      <div
        ref={ref}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'relative',
          background: hov ? `rgba(255,255,255,.05)` : G.gl,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hov ? cat.color + '55' : 'rgba(255,255,255,.07)'}`,
          borderRadius: 16,
          padding: '20px 16px',
          cursor: 'pointer',
          transition: 'all .4s cubic-bezier(.34,1.56,.64,1)',
          transform: vis ? (hov ? 'translateY(-6px) scale(1.02)' : 'translateY(0)') : 'translateY(24px)',
          opacity: vis ? 1 : 0,
          overflow: 'hidden',
          boxShadow: hov ? `0 20px 60px ${cat.glow}, 0 0 0 1px ${cat.color}22` : 'none',
          animation: cat.hot ? 'categoryPulse 3s ease-in-out infinite' : 'none',
        }}
      >
        {/* Top line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${cat.color},transparent)`, opacity: hov ? 1 : 0.4, transition: 'opacity .3s' }} />

        {/* HOT badge */}
        {cat.hot && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: `${cat.color}20`, border: `1px solid ${cat.color}44`, borderRadius: 100, padding: '2px 8px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 2, color: cat.color, textTransform: 'uppercase' }}>
            HOT
          </div>
        )}

        {/* Glow blob */}
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, background: cat.glow, borderRadius: '50%', filter: 'blur(20px)', opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />

        <div style={{ fontSize: 32, marginBottom: 10, transition: 'transform .3s', transform: hov ? 'scale(1.15) rotate(-5deg)' : 'scale(1)', display: 'inline-block' }}>
          {cat.icon}
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 3, color: hov ? cat.color : G.wht, transition: 'color .3s', marginBottom: 3 }}>
          {cat.label}
        </div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, color: G.mut, textTransform: 'uppercase' }}>
          {cat.sub}
        </div>
      </div>
    </Link>
  )
}

/* ═══════════ AI SCORE RING ═══════════ */
function AIScoreRing({ score = 94 }: { score?: number }) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    setTimeout(() => setAnimated(score), 500)
  }, [score])
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (animated / 100) * circ

  return (
    <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer orbit */}
      <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px dashed rgba(240,180,41,.2)', animation: 'orbitSpin 12s linear infinite' }} />
      <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(240,180,41,.08)', animation: 'orbitSpin 20s linear infinite reverse' }} />

      {/* Radar sweep */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: 1,
          background: `linear-gradient(90deg, transparent, ${G.gold}88)`,
          transformOrigin: 'left center',
          animation: 'radarSpin 3s linear infinite',
        }} />
      </div>

      <svg width={140} height={140} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={6} />
        {/* Progress */}
        <circle
          cx={70} cy={70} r={r}
          fill="none"
          stroke={G.gold}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(.34,1.56,.64,1)', filter: `drop-shadow(0 0 8px ${G.gold}88)` }}
        />
      </svg>

      {/* Center */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, color: G.gold, lineHeight: 1, animation: 'goldPulse 2.5s ease-in-out infinite' }}>
          {animated}
        </div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, letterSpacing: 2, color: G.mut, textTransform: 'uppercase' }}>
          AI SKÓRE
        </div>
      </div>
    </div>
  )
}

/* ═══════════ DEAL MESSAGE ═══════════ */
function DealMessage({ deal, idx, userRole }: { deal: any; idx: number; userRole: string }) {
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const tier = getTier(userRole)
  const isLocked = deal.access_level === 'vip' && !hasAccess(userRole, 'vip')

  useEffect(() => {
    setTimeout(() => setVis(true), idx * 120 + 200)
  }, [idx])

  const timeAgo = () => {
    const mins = Math.floor(Math.random() * 55) + 1
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h`
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', gap: 14, alignItems: 'flex-start',
        padding: '16px 18px',
        background: hov ? 'rgba(255,255,255,.04)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,.04)',
        transition: 'all .3s ease',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateX(0)' : 'translateX(-20px)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Left accent */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 2,
        background: deal.is_hot ? G.gold : deal.access_level === 'vip' ? G.pur : G.grn,
        borderRadius: 2, opacity: hov ? 1 : 0.4, transition: 'opacity .3s',
      }} />

      {/* Thumbnail / Emoji */}
      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,.06)', overflow: 'hidden', background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {deal.image_url
          ? <img src={deal.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (deal.emoji || '💰')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: hov ? G.wht : 'rgba(240,235,225,.9)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', filter: isLocked ? 'blur(4px)' : 'none', flex: 1 }}>
            {deal.title || 'Deal bez názvu'}
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut, flexShrink: 0 }}>{timeAgo()} ago</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Profit */}
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1, color: isLocked ? 'transparent' : G.grn, filter: isLocked ? 'blur(8px)' : `drop-shadow(0 0 6px ${G.grn}66)`, lineHeight: 1 }}>
            {(() => { if (deal.profit_amount) return `+${Number(deal.profit_amount).toLocaleString('cs-CZ')} Kč`; if (deal.sell_price) return `${Number(deal.sell_price).toLocaleString('cs-CZ')} Kč`; const m = deal.title.match(/(\d[\d\s]*?)\s*Kč|:\s*(\d[\d\s]{1,8})\s*$/); if (m) return `${parseInt((m[1]||m[2]).replace(/\s/g,''), 10).toLocaleString('cs-CZ')} Kč`; return deal.source_name === 'Bazoš.cz' ? '→ Bazoš.cz' : '+??? Kč'; })()}
          </div>

          {deal.is_hot && (
            <div style={{ background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.3)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: G.gold, textTransform: 'uppercase' }}>
              HOT
            </div>
          )}
          {deal.access_level === 'vip' && (
            <div style={{ background: 'rgba(155,93,229,.1)', border: '1px solid rgba(155,93,229,.3)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: G.pur, textTransform: 'uppercase' }}>
              VIP
            </div>
          )}
        </div>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(2,2,8,.5)', backdropFilter: 'blur(2px)' }}>
          <Lock size={12} color={G.pur} />
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.pur, letterSpacing: 1.5, textTransform: 'uppercase' }}>VIP Only</span>
          <Link href="/vip" style={{ background: G.gold, color: '#000', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, padding: '4px 10px', borderRadius: 4, textDecoration: 'none', letterSpacing: 1 }}>Odemknout</Link>
        </div>
      )}
    </div>
  )
}

/* ═══════════ STAT CARD ═══════════ */
function StatCard({ label, numVal, value, icon: Icon, accent, delay }: any) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  useEffect(() => { setTimeout(() => setVis(true), delay + 800) }, [delay])

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hov ? 'rgba(255,255,255,.04)' : G.gl,
        backdropFilter: 'blur(32px)',
        border: `1px solid ${hov ? accent + '44' : G.br}`,
        borderRadius: 18,
        padding: '24px 20px',
        transition: 'all .45s cubic-bezier(.34,1.56,.64,1)',
        transform: vis ? (hov ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(20px)',
        opacity: vis ? 1 : 0,
        boxShadow: hov ? `0 24px 60px rgba(0,0,0,.5), 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,.06)` : 'none',
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: hov ? 1 : 0.5, transition: 'opacity .3s' }} />

      {/* Corner dot */}
      <div style={{ position: 'absolute', top: 14, right: 14, width: 6, height: 6, borderRadius: '50%', background: accent, opacity: hov ? 1 : 0.4, boxShadow: `0 0 8px ${accent}`, transition: 'opacity .3s' }} />

      {/* Icon */}
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}12`, border: `1px solid ${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={17} color={accent} />
      </div>

      {/* Value */}
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 2, color: accent, lineHeight: 1, marginBottom: 6, filter: `drop-shadow(0 0 12px ${accent}44)` }}>
        {numVal !== undefined ? <AnimNum val={numVal} /> : value}
      </div>

      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase', color: G.mut }}>
        {label}
      </div>

      {/* Glow blob */}
      <div style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, background: `${accent}08`, borderRadius: '50%', filter: 'blur(20px)', transition: 'opacity .4s', opacity: hov ? 1 : 0 }} />
    </div>
  )
}

/* ═══════════ LIVE TICKER ═══════════ */
const TICKER_ITEMS = [
  { e: '🚗', n: 'BMW M3', p: '+45 000 Kč', c: '#F0B429' },
  { e: '💻', n: 'MacBook Air M2', p: '+8 990 Kč', c: '#4D9FFF' },
  { e: '🏠', n: 'Byt 3+kk Praha', p: 'AI 94%', c: '#00E676' },
  { e: '⌚', n: 'Rolex Sub', p: '+22 000 Kč', c: '#F0B429' },
  { e: '🎮', n: 'RTX 4070', p: '+5 300 Kč', c: '#9B5DE5' },
  { e: '👟', n: 'Jordan 1 Retro', p: '+3 800 Kč', c: '#FF6B35' },
  { e: '🏍️', n: 'Porsche 911', p: 'VIP DEAL', c: '#FF3B5C' },
  { e: '📱', n: 'iPhone 15 Pro', p: '+6 200 Kč', c: '#4D9FFF' },
]

/* ═══════════ SCANNER SECTION ═══════════ */
function ScannerSection({ userRole, onScan, scanning, scanResult }: any) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (scanning) {
      setProgress(0)
      const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 12, 95)), 300)
      return () => clearInterval(interval)
    } else {
      if (scanResult) setProgress(100)
    }
  }, [scanning, scanResult])

  if (userRole !== 'admin') return null

  return (
    <div style={{ position: 'relative', background: 'rgba(77,159,255,.03)', border: '1px solid rgba(77,159,255,.15)', borderRadius: 20, padding: '28px 24px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#4D9FFF,transparent)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        {/* Scanner visual */}
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(77,159,255,.1)" strokeWidth={4} />
            <circle cx={40} cy={40} r={32} fill="none" stroke={G.blu} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 201} 201`}
              style={{ transition: 'stroke-dasharray .4s ease', filter: 'drop-shadow(0 0 6px #4D9FFF88)' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {scanning ? (
              <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: 1.5, background: `linear-gradient(90deg, transparent, ${G.blu})`, transformOrigin: 'left center', animation: 'radarSpin .8s linear infinite' }} />
              </div>
            ) : (
              <Sparkles size={20} color={G.blu} />
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.blu }}>AI Bazoš Scanner</span>
            {scanning && <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, boxShadow: `0 0 8px ${G.grn}`, animation: 'goldPulse 1s infinite' }} />}
          </div>
          <p style={{ fontSize: 11, color: G.mut, fontWeight: 300, marginBottom: 10 }}>Prohledá Bazoš.cz a přidá nejlepší flip příležitosti.</p>

          {scanning && (
            <div style={{ height: 2, background: 'rgba(77,159,255,.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: G.blu, borderRadius: 2, transition: 'width .4s ease', boxShadow: `0 0 8px ${G.blu}` }} />
            </div>
          )}

          {scanResult && !scanResult.error && (
            <div style={{ padding: '8px 12px', background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.18)', borderRadius: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn }}>
              ✓ Naskenováno {scanResult.scanned} · Nalezeno {scanResult.found} · Přidáno {scanResult.inserted}
            </div>
          )}
          {scanResult?.error && (
            <div style={{ padding: '8px 12px', background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.18)', borderRadius: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.red }}>
              ✗ {scanResult.error}
            </div>
          )}
        </div>

        <button
          onClick={onScan}
          disabled={scanning}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
            background: scanning ? 'rgba(77,159,255,.08)' : G.blu,
            color: scanning ? G.blu : '#fff',
            padding: '13px 22px', borderRadius: 10, border: 'none',
            cursor: scanning ? 'default' : 'pointer',
            boxShadow: scanning ? 'none' : `0 8px 28px rgba(77,159,255,.35)`,
            transition: 'all .3s', flexShrink: 0,
          }}
        >
          {scanning
            ? <><div style={{ width: 13, height: 13, border: `2px solid rgba(77,159,255,.3)`, borderTop: `2px solid ${G.blu}`, borderRadius: '50%', animation: 'radarSpin .8s linear infinite' }} /> Skenuji...</>
            : <><Sparkles size={14} /> Spustit scan</>
          }
        </button>
      </div>
    </div>
  )
}

/* ═══════════ MAIN DASHBOARD ═══════════ */
export default function DashboardPage() {
  const [booted, setBooted] = useState(false)
  const [showBoot, setShowBoot] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [deals, setDeals] = useState<any[]>([])
  const [totalDeals, setTotalDeals] = useState(0)
  const [alerts, setAlerts] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(47)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [tourKey, setTourKey] = useState(0)
  const [tickerPaused, setTickerPaused] = useState(false)
  const router = useRouter()
  const resetTour = () => { localStorage.removeItem('nd_tour_done'); setTourKey(k => k + 1) }

  const runScanner = async () => {
    setScanning(true); setScanResult(null)
    try {
      const res = await fetch('/api/ai-scanner?secret=najdideal-scanner-2026')
      setScanResult(await res.json())
    } catch { setScanResult({ error: 'Chyba při skenování' }) }
    setScanning(false)
  }

  useEffect(() => {
    // Check if booted already this session
    const alreadyBooted = typeof window !== 'undefined' && sessionStorage.getItem('nd_booted')
    if (alreadyBooted) { setBooted(true) } else { setShowBoot(true) }

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const [pR, dR] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('deals').select('*').in('status', ['active', 'featured']).order('created_at', { ascending: false }).limit(8),
      ])
      setProfile(pR.data)
      setDeals(dR.data ?? [])
      setLoading(false)
      fetch('/api/dashboard-stats?uid=' + user.id)
        .then(r => r.json())
        .then(s => {
          if (typeof s.totalDeals === 'number') setTotalDeals(s.totalDeals)
          if (typeof s.savedCount === 'number') setSavedCount(s.savedCount)
          if (typeof s.unreadCount === 'number') setUnreadCount(s.unreadCount)
        })
        .catch(() => {})
    })

    const i1 = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random() > .5 ? 1 : -1))), 4200)
    return () => clearInterval(i1)
  }, [])

  const handleBootDone = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('nd_booted', '1')
    setBooted(true)
    setTimeout(() => setShowBoot(false), 700)
  }

  const userRole = profile?.role ?? 'free'
  const tier = getTier(userRole)
  const isVip = tier.level >= 2

  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      {/* BOOT */}
      {showBoot && (
        <BootSequence onDone={handleBootDone} />
      )}

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sectionReveal {
          from { opacity:0; transform:translateY(32px); }
          to { opacity:1; transform:translateY(0); }
        }
        .section-anim { animation: sectionReveal .7s ease both; }
      `}</style>

      {/* PARTICLES */}
      <GoldParticles />

      {/* AMBIENT ORBS */}
      <div style={{ position: 'fixed', top: '10%', right: '-8%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(240,180,41,.05) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(77,159,255,.04) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(50px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '40%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(155,93,229,.03) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 36, paddingBottom: 100 }}>

        {/* ── LIVE TICKER ── */}
        <div style={{ margin: '0 -16px', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,.04)', background: 'rgba(255,255,255,.015)' }}
          onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}>
          <div style={{ display: 'flex', animation: `tickerScroll 28s linear infinite`, animationPlayState: tickerPaused ? 'paused' : 'running', width: 'max-content' }}>
            {tickerAll.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px', borderRight: '1px solid rgba(255,255,255,.04)', flexShrink: 0 }}>
                <span>{t.e}</span>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, color: G.mut, whiteSpace: 'nowrap' }}>{t.n}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1, color: t.c, whiteSpace: 'nowrap' }}>{t.p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{ animation: 'fadeUp .8s ease both', animationDelay: '.1s' }}>
          {/* Status badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.2)', borderRadius: 100 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, boxShadow: `0 0 8px ${G.grn}`, animation: 'goldPulse 2s infinite' }} />
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.grn }}>{liveCount} ONLINE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: `${tier.color}10`, border: `1px solid ${tier.color}28`, borderRadius: 100 }}>
              <span style={{ fontSize: 11 }}>{tier.emoji}</span>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, color: tier.color }}>{tier.label}</span>
            </div>
            {userRole === 'admin' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,107,53,.08)', border: '1px solid rgba(255,107,53,.2)', borderRadius: 100 }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.org }}>🔧 ADMIN</span>
              </div>
            )}
          </div>

          {/* Name + AI score */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 3, color: G.mut, textTransform: 'uppercase', marginBottom: 8 }}>
                DEAL ROOM — {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,72px)', letterSpacing: 4, lineHeight: .95, color: G.wht, marginBottom: 0 }}>
                VÍTEJ,{' '}
                <span style={{ background: 'linear-gradient(135deg,#F0B429 0%,#FFD97D 40%,#F0B429 60%,#C8880A 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'goldShimmer 4s linear infinite' }}>
                  {profile?.full_name?.split(' ')[0]?.toUpperCase() ?? 'ČLENE'}
                </span>
              </h1>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300, marginTop: 10 }}>
                {tier.label} přístup · Systém aktivní
              </p>
            </div>

            {/* AI Score ring */}
            <AIScoreRing score={94} />
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, animation: 'fadeUp .8s ease both', animationDelay: '.2s' }}>
          <StatCard label="Dostupné dealy" numVal={totalDeals} icon={Flame} accent={G.gold} delay={0} />
          <StatCard label="Uložené dealy" numVal={savedCount} icon={Bookmark} accent={G.blu} delay={80} />
          <StatCard label="Oznámení" numVal={unreadCount} icon={Bell} accent={G.grn} delay={160} />
          <StatCard label="Přístup" value={tier.label} icon={Crown} accent={tier.color} delay={240} />
        </div>

        {/* ── CATEGORIES ── */}
        <div style={{ animation: 'fadeUp .8s ease both', animationDelay: '.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 20, background: G.gold, borderRadius: 2, boxShadow: `0 0 10px ${G.gold}` }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4, color: G.wht }}>KATEGORIE DEALŮ</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
            {CATEGORIES.map((cat, i) => <CategoryCard key={cat.label} cat={cat} idx={i} />)}
          </div>
        </div>

        {/* ── MARKETPLACE LINK ── */}
        <Link href="/marketplace" style={{ textDecoration: 'none', animation: 'fadeUp .8s ease both', animationDelay: '.35s', display: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 16, position: 'relative', overflow: 'hidden', transition: 'all .3s' }}
            onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(240,180,41,.08)'}
            onMouseLeave={e => (e.currentTarget as any).style.background = 'rgba(240,180,41,.04)'}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 32 }}>🛒</div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: G.gold, lineHeight: 1 }}>MARKETPLACE</div>
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: 1, marginTop: 3 }}>Nakup, prodej, flipni — vše na jednom místě</div>
              </div>
            </div>
            <ArrowRight size={22} color={G.gold} />
          </div>
        </Link>

        {/* ── DEAL FEED ── */}
        <div style={{ animation: 'fadeUp .8s ease both', animationDelay: '.4s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 20, background: G.grn, borderRadius: 2, boxShadow: `0 0 10px ${G.grn}` }} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4, color: G.wht }}>LIVE DEAL FEED</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: G.grn, boxShadow: `0 0 10px ${G.grn}`, animation: 'goldPulse 1.5s infinite' }} />
            </div>
            <Link href="/deals" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, color: G.gold, textDecoration: 'none', textTransform: 'uppercase' }}>
              Vše <ArrowRight size={11} />
            </Link>
          </div>

          {/* Feed container */}
          <div style={{ background: G.gl, backdropFilter: 'blur(32px)', border: `1px solid ${G.br}`, borderRadius: 20, overflow: 'hidden' }}>
            {!isVip && (
              <div style={{ padding: '10px 18px', background: 'rgba(240,180,41,.04)', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={11} color={G.gold} />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>
                  Free verze — část dealů zamčena.{' '}
                  <Link href="/vip" style={{ color: G.gold, fontWeight: 600, textDecoration: 'none' }}>Upgraduj na VIP</Link>
                </span>
              </div>
            )}

            {deals.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
                <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>
                  Brzy zde uvidíš první dealy
                </p>
              </div>
            ) : (
              deals.map((d, i) => <DealMessage key={d.id} deal={d} idx={i} userRole={userRole} />)
            )}
          </div>
        </div>

        {/* ── AI SCANNER ── */}
        <div style={{ animation: 'fadeUp .8s ease both', animationDelay: '.5s' }}>
          <ScannerSection userRole={userRole} onScan={runScanner} scanning={scanning} scanResult={scanResult} />
        </div>

        {/* ── UPGRADE BANNER ── */}
        {!isVip && (
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', animation: 'fadeUp .8s ease both', animationDelay: '.55s' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(240,180,41,.08) 0%,rgba(155,93,229,.06) 50%,rgba(77,159,255,.06) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,#9B5DE5,transparent)' }} />
            <div style={{ position: 'relative', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 4, color: G.wht, marginBottom: 6 }}>
                  ODEMKNI PLNÝ POTENCIÁL
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300 }}>
                  VIP členové vidí průměrně 3× více dealů s vyšším profit potenciálem.
                </p>
              </div>
              <Link href="/vip" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(240,180,41,.35)', whiteSpace: 'nowrap' }}>
                <Crown size={15} /> Vstoupit do VIP
              </Link>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,.05)', flexWrap: 'wrap', gap: 16, animation: 'fadeUp .8s ease both', animationDelay: '.6s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { Icon: Activity, label: `${liveCount} online`, color: G.grn },
              { Icon: Eye, label: '247 dealů tento měsíc', color: G.mut },
              { Icon: Clock, label: 'Živě aktualizováno', color: G.mut },
            ].map(({ Icon, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={11} color={color} />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, color }}>{label}</span>
              </div>
            ))}
          </div>
          <button onClick={resetTour} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(240,235,225,.2)', background: 'none', border: '1px solid rgba(255,255,255,.05)', borderRadius: 7, padding: '6px 12px', cursor: 'pointer' }}>
            🗺 Průvodce
          </button>
        </div>

        <OnboardingTour key={tourKey} />
      </div>
    </>
  )
}
