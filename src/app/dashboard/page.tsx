'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Crown, TrendingUp, Bookmark, Bell, ArrowRight, Flame, Zap, Activity, Eye, Clock, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const G = {
  gold: '#F0B429',
  gold2: 'rgba(240,180,41,.12)',
  gold3: 'rgba(240,180,41,.06)',
  gold4: 'rgba(240,180,41,.22)',
  goldGlow: '0 0 40px rgba(240,180,41,.25)',
  grn: '#00E676',
  grn2: 'rgba(0,230,118,.08)',
  grn3: 'rgba(0,230,118,.18)',
  blu: '#4D9FFF',
  pur: '#9B5DE5',
  red: '#FF3B5C',
  wht: '#F0EBE1',
  mut: 'rgba(240,235,225,.38)',
  mut2: 'rgba(240,235,225,.18)',
  bg: '#020208',
  bg2: '#06060E',
  glass: 'rgba(255,255,255,.026)',
  glassHov: 'rgba(255,255,255,.046)',
  border: 'rgba(255,255,255,.07)',
  borderHov: 'rgba(240,180,41,.25)',
}

const CSS = `
  @keyframes shimmer {
    0% { background-position: -200% 0 }
    100% { background-position: 200% 0 }
  }
  @keyframes livePing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,230,118,.6) }
    60% { box-shadow: 0 0 0 7px transparent }
  }
  @keyframes goldPing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(240,180,41,.5) }
    60% { box-shadow: 0 0 0 7px transparent }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px) }
    to { opacity: 1; transform: translateY(0) }
  }
  @keyframes fadeIn {
    from { opacity: 0 } to { opacity: 1 }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0,0) scale(1) }
    33% { transform: translate(20px,-30px) scale(1.04) }
    66% { transform: translate(-15px,20px) scale(.97) }
  }
  @keyframes statusRotate {
    0%, 30% { opacity: 1 }
    35%, 95% { opacity: 0 }
    100% { opacity: 1 }
  }
  @keyframes goldShimmer {
    0% { background-position: -200% center }
    100% { background-position: 200% center }
  }
  @keyframes pulse {
    0%, 100% { opacity: .6 }
    50% { opacity: 1 }
  }
  @keyframes numberRoll {
    from { transform: translateY(10px); opacity: 0 }
    to { transform: translateY(0); opacity: 1 }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(240,180,41,.15) }
    50% { border-color: rgba(240,180,41,.35) }
  }
`

/* ═══════════════════════════════════════════════
   ANIMATED NUMBER
═══════════════════════════════════════════════ */
function AnimNum({ val, suf = '', pre = '', dur = 1400 }: { val: number; suf?: string; pre?: string; dur?: number }) {
  const [n, setN] = useState(0)
  const [key, setKey] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const from = prev.current
    const to = val
    prev.current = val
    if (from === to) return
    setKey(k => k + 1)
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setN(Math.round(from + (to - from) * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [val, dur])

  return <span key={key} style={{ display: 'inline-block', animation: 'numberRoll .35s ease' }}>{pre}{n.toLocaleString('cs-CZ')}{suf}</span>
}

/* ═══════════════════════════════════════════════
   LIVE DOT
═══════════════════════════════════════════════ */
function LiveDot({ color = G.grn, size = 8 }: { color?: string; size?: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, animation: `${color === G.gold ? 'goldPing' : 'livePing'} 2.2s ease-in-out infinite` }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    </span>
  )
}

/* ═══════════════════════════════════════════════
   SHIMMER SKELETON
═══════════════════════════════════════════════ */
function Sk({ w = '100%', h = '20px', r = '10px' }: { w?: string; h?: string; r?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.04) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.8s ease-in-out infinite',
    }} />
  )
}

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({ label, value, numVal, suf = '', icon: Icon, accent, delay = 0, isVip = false }: any) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect() }
    }, { threshold: .1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? G.glassHov : G.glass,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${hov ? G.borderHov : G.border}`,
        borderRadius: 16,
        padding: '26px 22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .45s cubic-bezier(.34,1.56,.64,1)',
        transform: vis ? (hov ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)') : 'translateY(28px) scale(.97)',
        opacity: vis ? 1 : 0,
        boxShadow: hov
          ? `0 28px 72px rgba(0,0,0,.55), 0 0 0 1px ${accent}25, inset 0 1px 0 rgba(255,255,255,.09)`
          : '0 4px 20px rgba(0,0,0,.25)',
        cursor: 'default',
      }}
    >
      {/* Top glow */}
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />
      {/* BG radial */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, background: `radial-gradient(circle, ${accent}09 0%, transparent 70%)`, borderRadius: '50%', transform: 'translate(35%, -35%)', transition: 'opacity .4s', opacity: hov ? 1 : .6 }} />
      {/* Inner shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 100%)', borderRadius: '16px 16px 0 0', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${accent}10`, border: `1px solid ${accent}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .4s',
          transform: hov ? 'scale(1.14) rotate(-8deg)' : 'scale(1)',
          boxShadow: hov ? `0 0 20px ${accent}33` : 'none',
        }}>
          <Icon size={17} color={accent} />
        </div>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}`, opacity: .7, animation: 'pulse 2.5s ease-in-out infinite' }} />
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 44, letterSpacing: 2,
        color: accent, lineHeight: 1, marginBottom: 5,
        textShadow: hov ? `0 0 50px ${accent}55` : `0 0 30px ${accent}33`,
        transition: 'text-shadow .4s',
      }}>
        {typeof numVal === 'number' ? <AnimNum val={numVal} suf={suf} /> : value}
      </div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.mut }}>
        {label}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DEAL CARD
═══════════════════════════════════════════════ */
function DealCard({ deal, idx, isVip }: { deal: any; idx: number; isVip: boolean }) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  const [mp, setMp] = useState({ x: 50, y: 50 })
  const [liveViews, setLiveViews] = useState(deal.view_count || 0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), idx * 90); obs.disconnect() }
    }, { threshold: .05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [idx])

  // Live view count simulation
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > .7) setLiveViews((p: number) => p + Math.floor(Math.random() * 3) + 1)
    }, 3000 + Math.random() * 4000)
    return () => clearInterval(iv)
  }, [])

  const handleMM = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const isHot = deal.is_hot || deal.is_featured
  const isLocked = deal.access_level === 'vip' && !isVip
  const profitColor = deal.profit_amount ? G.grn : G.gold
  const catLabels: Record<string, string> = {
    marketplace_flip: 'Marketplace Flip',
    ai_opportunity: 'AI Příležitost',
    trend_product: 'Trend Produkt',
    affiliate: 'Affiliate',
    dropshipping: 'Dropshipping',
    crypto: 'Crypto',
    other: 'Ostatní',
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseMove={handleMM}
      style={{
        background: isHot ? 'rgba(240,180,41,.032)' : G.glass,
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: `1px solid ${hov ? (isHot ? 'rgba(240,180,41,.4)' : G.borderHov) : (isHot ? 'rgba(240,180,41,.18)' : G.border)}`,
        borderRadius: 16,
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .5s cubic-bezier(.34,1.56,.64,1)',
        transform: vis
          ? (hov ? 'translateY(-10px) scale(1.015)' : 'translateY(0) scale(1)')
          : 'translateY(36px) scale(.96)',
        opacity: vis ? 1 : 0,
        cursor: 'pointer',
        boxShadow: hov
          ? `0 40px 100px rgba(0,0,0,.65), 0 0 ${isHot ? '80px rgba(240,180,41,.07)' : '40px rgba(0,0,0,.1)'}, inset 0 1px 0 rgba(255,255,255,.09)`
          : '0 2px 16px rgba(0,0,0,.2)',
        animation: isHot && vis ? 'borderGlow 4s ease-in-out infinite' : 'none',
      }}
    >
      {/* Mouse glow */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: `radial-gradient(circle at ${mp.x}% ${mp.y}%, rgba(240,180,41,.06) 0%, transparent 55%)`, opacity: hov ? 1 : 0, transition: 'opacity .3s', pointerEvents: 'none' }} />
      {/* Top shimmer */}
      <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg, transparent, ${isHot ? G.gold : 'rgba(255,255,255,.14)'}, transparent)`, opacity: hov ? 1 : .5 }} />
      {/* Inner shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,.035) 0%, transparent 100%)', borderRadius: '16px 16px 0 0', pointerEvents: 'none' }} />

      {/* HOT / LOCK badge */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
        {isHot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(240,180,41,.09)', border: '1px solid rgba(240,180,41,.25)', borderRadius: 100, padding: '3px 10px' }}>
            <LiveDot color={G.gold} size={6} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold }}>HOT</span>
          </div>
        )}
        {isLocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(155,93,229,.09)', border: '1px solid rgba(155,93,229,.22)', borderRadius: 100, padding: '3px 10px' }}>
            <Lock size={9} color={G.pur} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.pur }}>VIP</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, paddingRight: isHot || isLocked ? 80 : 0 }}>
        <div style={{
          fontSize: 34, lineHeight: 1, flexShrink: 0,
          transition: 'transform .45s cubic-bezier(.34,1.56,.64,1), filter .4s',
          transform: hov ? 'scale(1.22) rotate(-10deg)' : 'scale(1)',
          filter: hov ? `drop-shadow(0 0 14px ${G.gold}66)` : `drop-shadow(0 0 6px ${G.gold}22)`,
        }}>
          {deal.emoji || '💰'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
            color: hov ? G.gold : G.wht,
            marginBottom: 4, lineHeight: 1.35,
            transition: 'color .3s',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {deal.title || 'Deal bez názvu'}
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut }}>
            {catLabels[deal.category] || deal.category}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,.055)', margin: '0 0 14px' }} />

      {/* Profit row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 14px',
        background: isLocked ? 'rgba(155,93,229,.05)' : G.grn2,
        border: `1px solid ${isLocked ? 'rgba(155,93,229,.15)' : 'rgba(0,230,118,.14)'}`,
        borderRadius: 10,
        position: 'relative', overflow: 'hidden',
      }}>
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', background: 'rgba(6,6,14,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock size={13} color={G.pur} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.pur }}>Pouze VIP členové</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: G.gold, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: G.mut }}>
            {deal.profit_amount ? 'Profit' : 'Příležitost'}
          </span>
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1,
          color: profitColor, lineHeight: 1,
          textShadow: hov ? `0 0 28px ${profitColor}66` : `0 0 16px ${profitColor}44`,
          transition: 'text-shadow .4s',
        }}>
          {deal.profit_amount
            ? `+${deal.profit_amount.toLocaleString('cs-CZ')} Kč`
            : deal.short_desc?.split('·')[0]?.trim() || 'VIP deal'}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Eye size={10} color={G.mut} />
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: .5 }}>
            <AnimNum val={liveViews} />
          </span>
        </div>
        {deal.is_trending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={10} color={G.grn} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn, letterSpacing: .5 }}>
              +{deal.trend_percent || 0}% trend
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ALERT CARD
═══════════════════════════════════════════════ */
function AlertCard({ alert, idx }: { alert: any; idx: number }) {
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), idx * 110); obs.disconnect() }
    }, { threshold: .1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [idx])

  const cfg: Record<string, { emoji: string; color: string }> = {
    vip: { emoji: '👑', color: G.gold },
    ai: { emoji: '🤖', color: G.blu },
    trend: { emoji: '📈', color: G.grn },
  }
  const c = cfg[alert.type] || { emoji: '⚡', color: G.pur }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: G.glass,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hov ? c.color + '33' : G.border}`,
        borderLeft: `2px solid ${c.color}`,
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        transition: 'all .4s cubic-bezier(.25,.46,.45,.94)',
        transform: vis ? (hov ? 'translateX(5px)' : 'translateX(0)') : 'translateX(-24px)',
        opacity: vis ? 1 : 0,
        boxShadow: hov ? `0 16px 48px rgba(0,0,0,.35), 0 0 30px ${c.color}10, inset 0 1px 0 rgba(255,255,255,.05)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${c.color}44, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}10`, border: `1px solid ${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, transition: 'transform .4s', transform: hov ? 'scale(1.1)' : 'scale(1)' }}>
        {c.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: G.wht, marginBottom: 3, lineHeight: 1.3 }}>{alert.title}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: G.mut, lineHeight: 1.65, fontWeight: 300 }}>{alert.body?.slice(0, 90)}{alert.body?.length > 90 ? '…' : ''}</div>
      </div>
      {alert.access_level === 'vip' && (
        <div style={{ flexShrink: 0, fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold, background: G.gold3, border: `1px solid ${G.gold4}`, borderRadius: 4, padding: '3px 7px', whiteSpace: 'nowrap' }}>VIP</div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [deals, setDeals] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(47)
  const [statusIdx, setStatusIdx] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(0)
  const router = useRouter()

  const statuses = [
    'AI analyzuje nové dealy…',
    'Skenování trhů dokončeno',
    'Nové příležitosti detekována',
    'Live monitoring aktivní',
  ]

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const [pR, dR, sR, nR, aR] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('deals').select('*').in('status', ['active','featured']).order('created_at', { ascending: false }).limit(6),
        supabase.from('saved_deals').select('deal_id').eq('user_id', user.id),
        supabase.from('notifications').select('id').eq('user_id', user.id).eq('is_read', false),
        supabase.from('alerts').select('*').eq('is_active', true).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(4),
      ])
      setProfile(pR.data)
      setDeals(dR.data ?? [])
      setSavedCount(sR.data?.length ?? 0)
      setUnreadCount(nR.data?.length ?? 0)
      setAlerts(aR.data ?? [])
      setLoading(false)
    })

    // Live simulations
    const liveIv = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random() > .5 ? 1 : -1))), 4200)
    const statusIv = setInterval(() => setStatusIdx(p => (p + 1) % 4), 4000)
    const updateIv = setInterval(() => setLastUpdate(p => p + 1), 1000)
    return () => { clearInterval(liveIv); clearInterval(statusIv); clearInterval(updateIv) }
  }, [])

  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  /* LOADING */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>
      <style>{CSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Sk w="180px" h="28px" r="8px" />
        <Sk w="260px" h="14px" r="6px" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {[...Array(4)].map((_,i) => <Sk key={i} h="118px" r="16px" />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[...Array(3)].map((_,i) => <Sk key={i} h="68px" r="12px" />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {[...Array(3)].map((_,i) => <Sk key={i} h="180px" r="16px" />)}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, paddingBottom: 96, position: 'relative' }}>
      <style>{CSS}</style>

      {/* ── AMBIENT ORBS ── */}
      <div style={{ position: 'fixed', top: '15%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(240,180,41,.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 14s ease-in-out infinite', filter: 'blur(40px)' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '-8%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(155,93,229,.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat 18s ease-in-out infinite reverse', filter: 'blur(40px)' }} />

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp .65s ease both' }}>
        {/* Live status bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', background: G.glass, border: `1px solid ${G.border}`, borderRadius: 100, backdropFilter: 'blur(20px)' }}>
            <LiveDot />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.grn }}>{liveCount} online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: G.glass, border: `1px solid ${G.border}`, borderRadius: 100, backdropFilter: 'blur(20px)' }}>
            <Sparkles size={9} color={G.gold} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut }}>{statuses[statusIdx]}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(34px,5.5vw,58px)', letterSpacing: 4, lineHeight: 1, color: G.wht, marginBottom: 7 }}>
              VÍTEJ,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #F0B429 0%, #FFD97D 50%, #F0B429 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'goldShimmer 4s linear infinite',
              }}>
                {profile?.full_name?.split(' ')[0]?.toUpperCase() ?? 'ČLENE'}
              </span>
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300, lineHeight: 1.6 }}>
              {isVip
                ? '👑 VIP přístup aktivní · Všechny příležitosti odemčeny'
                : 'Free přístup · Upgraduj a získej exkluzivní VIP příležitosti'}
            </p>
          </div>
          {!isVip && (
            <Link href="/membership" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
              fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              background: G.gold, color: '#000', padding: '12px 22px', borderRadius: 9, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(240,180,41,.28)', transition: 'all .35s cubic-bezier(.34,1.56,.64,1)',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 22px 56px rgba(240,180,41,.48)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(240,180,41,.28)' }}
            >
              <Crown size={14} /> Vstoupit do VIP
            </Link>
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 11, position: 'relative', zIndex: 1 }}>
        <StatCard label="Dostupné dealy" numVal={deals.length} icon={TrendingUp} accent={G.gold} delay={0} />
        <StatCard label="Uložené dealy" numVal={savedCount} icon={Bookmark} accent={G.blu} delay={80} />
        <StatCard label="Nová oznámení" numVal={unreadCount} icon={Bell} accent={G.grn} delay={160} />
        <StatCard label="Členství" value={profile?.role?.toUpperCase() ?? 'FREE'} icon={Crown} accent={isVip ? G.gold : G.mut} delay={240} />
      </div>

      {/* ── VIP UPSELL ── */}
      {!isVip && (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(240,180,41,.18)', padding: '26px', animation: 'borderGlow 4s ease-in-out infinite', zIndex: 1 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg, rgba(240,180,41,.045) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(240,180,41,.55), transparent)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Crown size={15} color={G.gold} />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: G.gold }}>Exkluzivní VIP přístup</span>
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(20px,3.5vw,30px)', letterSpacing: 3, color: G.wht, marginBottom: 7, lineHeight: 1.1 }}>ZÍSKEJ DEALY DŘÍV NEŽ OSTATNÍ</h3>
              <p style={{ fontSize: 11, color: G.mut, fontWeight: 300, maxWidth: 360, lineHeight: 1.75 }}>VIP dealy · Rychlé alerty · AI příležitosti · Soukromá komunita · 399 Kč/měsíc</p>
            </div>
            <Link href="/membership" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
              fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              background: G.gold, color: '#000', padding: '13px 26px', borderRadius: 9, textDecoration: 'none',
              boxShadow: '0 10px 40px rgba(240,180,41,.32)', transition: 'all .35s cubic-bezier(.34,1.56,.64,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(240,180,41,.52)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(240,180,41,.32)' }}
            >
              <Crown size={14} /> Vstoupit do VIP <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* ── LIVE ALERTS ── */}
      {alerts.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <LiveDot />
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: G.wht }}>Live Alerty</span>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>
                · před {lastUpdate < 60 ? `${lastUpdate}s` : `${Math.floor(lastUpdate/60)}m`}
              </span>
            </div>
            <Link href="/alerts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, textDecoration: 'none' }}>
              Všechny <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map((a, i) => <AlertCard key={a.id} alert={a} idx={i} />)}
          </div>
        </div>
      )}

      {/* ── DEALS ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Flame size={15} color={G.gold} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: G.wht }}>
              {isVip ? 'Nejnovější příležitosti' : 'Free dealy'}
            </span>
          </div>
          <Link href="/deals" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, textDecoration: 'none' }}>
            Zobrazit vše <ArrowRight size={11} />
          </Link>
        </div>

        {!isVip && (
          <div style={{ marginBottom: 14, padding: '11px 15px', borderRadius: 10, background: G.gold3, border: `1px solid ${G.gold4}`, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Zap size={13} color={G.gold} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: G.mut, fontWeight: 300, lineHeight: 1.5 }}>
              Vidíš pouze free dealy.{' '}
              <Link href="/membership" style={{ color: G.gold, fontWeight: 600, textDecoration: 'none' }}>Upgraduj na VIP</Link>
              {' '}a získej přístup ke všem exkluzivním dealům.
            </p>
          </div>
        )}

        {deals.length === 0 ? (
          <div style={{ padding: '48px 24px', borderRadius: 16, border: `1px solid ${G.border}`, background: G.glass, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Brzy zde uvidíš první dealy</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px,1fr))', gap: 11 }}>
            {deals.map((d, i) => <DealCard key={d.id} deal={d} idx={i} isVip={isVip} />)}
          </div>
        )}
      </div>

      {/* ── FOOTER STATUS ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '18px 0', borderTop: `1px solid ${G.border}`, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[
          { Icon: Activity, label: `${liveCount} online`, color: G.grn },
          { Icon: Eye, label: '247 dealů tento měsíc', color: G.mut },
          { Icon: Clock, label: lastUpdate < 60 ? `Aktualizováno před ${lastUpdate}s` : 'Aktualizováno právě teď', color: G.mut },
        ].map(({ Icon, label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={11} color={color} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}