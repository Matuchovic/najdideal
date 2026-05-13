'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import OnboardingModal from '@/components/ui/OnboardingModal'
import { Crown, TrendingUp, Bookmark, Bell, ArrowRight, Flame, Zap, Activity, Eye, Clock, Lock, Sparkles, ChevronUp } from 'lucide-react'
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
  free:      { level: 1, label: 'FREE',      color: G.mut,  emoji: '🔓', nextPlan: 'VIP',       nextPrice: '499 Kč/měsíc',   nextBenefit: 'Exkluzivní dealy, rychlé alerty, soukromá komunita' },
  vip:       { level: 2, label: 'VIP',       color: G.gold, emoji: '👑', nextPlan: 'VIP PRO',   nextPrice: '999 Kč/měsíc',   nextBenefit: 'AI deep scan, trend predictions, dedikovaný support' },
  vip_pro:   { level: 3, label: 'VIP PRO',   color: G.blu,  emoji: '🚀', nextPlan: 'VIP ULTRA', nextPrice: '1 999 Kč/měsíc', nextBenefit: 'Ultra alerty 24/7, AI profit scoring, priority support' },
  vip_ultra: { level: 4, label: 'VIP ULTRA', color: G.pur,  emoji: '⚡', nextPlan: 'VIP MAX',   nextPrice: '2 799 Kč/měsíc', nextBenefit: 'Osobní konzultace, mastermind, first-access all deals' },
  vip_max:   { level: 5, label: 'VIP MAX',   color: G.org,  emoji: '💎' },
  admin:     { level: 99, label: 'ADMIN',    color: G.gold, emoji: '🔧' },
}

function getTier(role: string): typeof VIP_TIERS[Role] {
  return VIP_TIERS[role as Role] ?? VIP_TIERS.free
}

function hasAccess(userRole: string, requiredRole: string): boolean {
  const userLevel = getTier(userRole).level
  const reqLevel = getTier(requiredRole as Role).level
  return userLevel >= reqLevel
}

/* ═══════════ COMPONENTS ═══════════ */

function AnimNum({ val, suf = '', dur = 1400 }: { val: number; suf?: string; dur?: number }) {
  const [n, setN] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setN(Math.round(ease * val))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [val, dur])
  return <>{n.toLocaleString('cs-CZ')}{suf}</>
}

function LiveDot({ color = G.grn, size = 8 }: { color?: string; size?: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      <style>{`@keyframes livePing{0%,100%{box-shadow:0 0 0 0 ${color}88}60%{box-shadow:0 0 0 6px transparent}}`}</style>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, animation: 'livePing 2s ease-in-out infinite' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    </span>
  )
}

function Skeleton({ w = '100%', h = '20px', r = '8px' }: { w?: string; h?: string; r?: string }) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s ease-in-out infinite' }}>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  )
}

function LockedCard({ requiredPlan, color = G.gold }: { requiredPlan: string; color?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(2,2,8,.82)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10, padding: 24, textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: color + '15', border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Lock size={20} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color, marginBottom: 4 }}>Vyžaduje {requiredPlan}</div>
        <div style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>Upgraduj pro přístup k tomuto obsahu</div>
      </div>
      <Link href="/vip" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: color, color: '#000', padding: '9px 18px', borderRadius: 7, textDecoration: 'none', boxShadow: `0 6px 20px ${color}44` }}>
        Upgradovat →
      </Link>
    </div>
  )
}

function UpgradeBanner({ role }: { role: string }) {
  const tier = getTier(role)
  if (!tier.nextPlan) return null
  return (
    <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `1px solid ${tier.color}33`, padding: '18px 22px', background: `${tier.color}06`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${tier.color},transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ChevronUp size={16} color={tier.color} />
        <div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: tier.color, marginBottom: 3 }}>Upgraduj na {tier.nextPlan}</div>
          <div style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>{tier.nextBenefit}</div>
        </div>
      </div>
      <Link href="/vip" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: tier.color, color: '#000', padding: '10px 18px', borderRadius: 7, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: `0 6px 20px ${tier.color}33`, flexShrink: 0 }}>
        {tier.nextPlan} – {tier.nextPrice}
      </Link>
    </div>
  )
}

function StatCard({ label, value, numVal, suf = '', icon: Icon, accent, delay = 0 }: any) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect() } }, { threshold: .1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? G.glh : G.gl, backdropFilter: 'blur(28px) saturate(160%)', border: `1px solid ${hov ? G.brh : G.br}`, borderRadius: 16, padding: '26px 22px', position: 'relative', overflow: 'hidden', transition: 'all .45s cubic-bezier(.34,1.56,.64,1)', transform: vis ? (hov ? 'translateY(-6px) scale(1.02)' : 'translateY(0)') : 'translateY(24px)', opacity: vis ? 1 : 0, boxShadow: hov ? `0 28px 72px rgba(0,0,0,.55),0 0 0 1px ${accent}22,inset 0 1px 0 rgba(255,255,255,.08)` : '0 4px 20px rgba(0,0,0,.25)' }}>
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: hov ? 1 : 0, transition: 'opacity .4s' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle,${accent}08 0%,transparent 70%)`, borderRadius: '50%', transform: 'translate(35%,-35%)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}10`, border: `1px solid ${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .45s cubic-bezier(.34,1.56,.64,1)', transform: hov ? 'scale(1.14) rotate(-8deg)' : 'scale(1)' }}>
          <Icon size={17} color={accent} />
        </div>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}`, opacity: .7 }} />
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: 2, color: accent, lineHeight: 1, marginBottom: 5, textShadow: hov ? `0 0 50px ${accent}55` : `0 0 30px ${accent}33`, transition: 'text-shadow .4s' }}>
        {typeof numVal === 'number' ? <AnimNum val={numVal} suf={suf} /> : value}
      </div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.mut }}>{label}</div>
    </div>
  )
}

function DealCard({ deal, idx, userRole }: { deal: any; idx: number; userRole: string }) {
  const [hov, setHov] = useState(false)
  const [vis, setVis] = useState(false)
  const [mp, setMp] = useState({ x: 50, y: 50 })
  const [views, setViews] = useState(deal.view_count || 0)
  const ref = useRef<HTMLDivElement>(null)
  
  const dealRequiredRole = deal.access_level || 'free'
  const isLocked = !hasAccess(userRole, dealRequiredRole)
  const isHot = deal.is_hot || deal.is_featured
  const tierInfo = getTier(dealRequiredRole as Role)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), idx * 80); obs.disconnect() } }, { threshold: .05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [idx])

  useEffect(() => {
    const iv = setInterval(() => { if (Math.random() > .7) setViews((p: number) => p + Math.floor(Math.random() * 3) + 1) }, 3000 + Math.random() * 4000)
    return () => clearInterval(iv)
  }, [])

  const catLabels: Record<string, string> = {
    marketplace_flip: 'Marketplace Flip', ai_opportunity: 'AI Příležitost',
    trend_product: 'Trend Produkt', affiliate: 'Affiliate',
    dropshipping: 'Dropshipping', crypto: 'Crypto', other: 'Ostatní',
  }

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
      style={{ background: isHot ? 'rgba(240,180,41,.032)' : G.gl, backdropFilter: 'blur(32px) saturate(180%)', border: `1px solid ${hov ? (isHot ? 'rgba(240,180,41,.4)' : G.brh) : (isHot ? 'rgba(240,180,41,.18)' : G.br)}`, borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden', transition: 'all .5s cubic-bezier(.34,1.56,.64,1)', transform: vis ? (hov ? 'translateY(-8px) scale(1.01)' : 'translateY(0)') : 'translateY(32px)', opacity: vis ? 1 : 0, cursor: isLocked ? 'default' : 'pointer', boxShadow: hov ? `0 32px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)` : '0 2px 12px rgba(0,0,0,.2)' }}>
      
      {/* Mouse glow */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: `radial-gradient(circle at ${mp.x}% ${mp.y}%,rgba(240,180,41,.055) 0%,transparent 55%)`, opacity: hov && !isLocked ? 1 : 0, transition: 'opacity .3s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg,transparent,${isHot ? G.gold : 'rgba(255,255,255,.12)'},transparent)`, opacity: hov ? 1 : .4 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.035) 0%,transparent 100%)', borderRadius: '16px 16px 0 0', pointerEvents: 'none' }} />

      {/* Badges */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
        {isHot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(240,180,41,.09)', border: '1px solid rgba(240,180,41,.25)', borderRadius: 100, padding: '3px 10px' }}>
            <LiveDot color={G.gold} size={6} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold }}>HOT</span>
          </div>
        )}
        {isLocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${tierInfo.color}09`, border: `1px solid ${tierInfo.color}33`, borderRadius: 100, padding: '3px 10px' }}>
            <Lock size={9} color={tierInfo.color} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: tierInfo.color }}>{tierInfo.label}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, paddingRight: 80 }}>
        <div style={{ fontSize: 34, lineHeight: 1, flexShrink: 0, transition: 'transform .45s cubic-bezier(.34,1.56,.64,1)', transform: hov && !isLocked ? 'scale(1.22) rotate(-10deg)' : 'scale(1)', filter: `drop-shadow(0 0 ${hov ? '14px' : '6px'} rgba(240,180,41,${hov ? '.66' : '.22'}))` }}>
          {deal.emoji || '💰'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: hov && !isLocked ? G.gold : G.wht, marginBottom: 4, lineHeight: 1.35, transition: 'color .3s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {deal.title || 'Deal bez názvu'}
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut }}>
            {catLabels[deal.category] || deal.category}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.055)', marginBottom: 14 }} />

      {/* Profit row – blurred if locked */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: isLocked ? 'rgba(255,255,255,.03)' : G.grn2, border: `1px solid ${isLocked ? 'rgba(255,255,255,.06)' : 'rgba(0,230,118,.14)'}`, borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: G.gold }} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: G.mut }}>
              {deal.profit_amount ? 'Profit' : 'Příležitost'}
            </span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1, color: isLocked ? 'transparent' : G.grn, lineHeight: 1, textShadow: isLocked ? 'none' : `0 0 20px ${G.grn}66`, filter: isLocked ? 'blur(8px)' : 'none', userSelect: isLocked ? 'none' : 'auto', transition: 'filter .3s' }}>
            {deal.profit_amount ? `+${deal.profit_amount.toLocaleString('cs-CZ')} Kč` : deal.short_desc?.split('·')[0]?.trim() || 'VIP deal'}
          </div>
        </div>
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10 }}>
            <Lock size={13} color={tierInfo.color} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: tierInfo.color }}>Odemknout v {tierInfo.label}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Eye size={10} color={G.mut} />
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: .5 }}>
            <AnimNum val={views} />
          </span>
        </div>
        {deal.is_trending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={10} color={G.grn} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn }}>+{deal.trend_percent || 0}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

function AlertCard({ alert, idx, userRole }: { alert: any; idx: number; userRole: string }) {
  const [vis, setVis] = useState(false)
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  const isLocked = alert.access_level === 'vip' && !hasAccess(userRole, 'vip')

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), idx * 110); obs.disconnect() } }, { threshold: .1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [idx])

  const cfg: Record<string, { emoji: string; color: string }> = {
    vip: { emoji: '👑', color: G.gold }, ai: { emoji: '🤖', color: G.blu },
    trend: { emoji: '📈', color: G.grn },
  }
  const c = cfg[alert.type] || { emoji: '⚡', color: G.pur }

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${hov ? c.color + '33' : G.br}`, borderLeft: `2px solid ${c.color}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'all .4s ease', transform: vis ? (hov ? 'translateX(4px)' : 'translateX(0)') : 'translateX(-24px)', opacity: vis ? 1 : 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}10`, border: `1px solid ${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{c.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: G.wht, marginBottom: 3, filter: isLocked ? 'blur(4px)' : 'none', userSelect: isLocked ? 'none' : 'auto' }}>{alert.title}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: G.mut, lineHeight: 1.65, fontWeight: 300, filter: isLocked ? 'blur(4px)' : 'none', userSelect: isLocked ? 'none' : 'auto' }}>{alert.body?.slice(0, 90)}{alert.body?.length > 90 ? '…' : ''}</div>
      </div>
      {isLocked && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(2,2,8,.6)', backdropFilter: 'blur(2px)' }}>
          <Lock size={12} color={G.gold} />
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold }}>VIP alert</span>
          <Link href="/vip" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '5px 10px', borderRadius: 5, textDecoration: 'none' }}>Odemknout</Link>
        </div>
      )}
      {alert.access_level === 'vip' && !isLocked && (
        <div style={{ flexShrink: 0, fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold, background: G.gold3, border: `1px solid ${G.gold4}`, borderRadius: 4, padding: '3px 7px', whiteSpace: 'nowrap' }}>VIP</div>
      )}
    </div>
  )
}

/* ═══════════ MAIN DASHBOARD ═══════════ */
export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [deals, setDeals] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(47)
  const [statusIdx, setStatusIdx] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const router = useRouter()

  const statuses = ['AI analyzuje nové dealy…', 'Skenování trhů dokončeno', 'Nové příležitosti detekovány', 'Live monitoring aktivní']

  const runScanner = async () => {
    setScanning(true)
    setScanResult(null)
    try {
      const res = await fetch('/api/ai-scanner?secret=najdideal-scanner-2026')
      const data = await res.json()
      setScanResult(data)
    } catch(e) {
      setScanResult({ error: 'Chyba při skenování' })
    }
    setScanning(false)
  }

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
      if (!pR.data?.onboarding_completed) {
        setTimeout(() => setShowOnboarding(true), 800)
      }
      setDeals(dR.data ?? [])
      setSavedCount(sR.data?.length ?? 0)
      setUnreadCount(nR.data?.length ?? 0)
      setAlerts(aR.data ?? [])
      setLoading(false)
    })
    const i1 = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random()>.5?1:-1))), 4200)
    const i2 = setInterval(() => setStatusIdx(p => (p+1)%4), 4000)
    const i3 = setInterval(() => setLastUpdate(p => p+1), 1000)
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3) }
  }, [])

  const userRole = profile?.role ?? 'free'
  const tier = getTier(userRole)
  const isVip = tier.level >= 2

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      <Skeleton w="180px" h="28px" r="8px" />
      <Skeleton w="260px" h="14px" r="6px" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
        {[...Array(4)].map((_,i) => <Skeleton key={i} h="120px" r="16px" />)}
      </div>
      <Skeleton h="60px" r="14px" />
      {[...Array(3)].map((_,i) => <Skeleton key={i} h="68px" r="12px" />)}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 80 }}>
      <style>{`
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes goldShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @media(max-width:768px){
          .stat-grid{grid-template-columns:repeat(2,1fr) !important}
          .deals-grid{grid-template-columns:1fr !important}
          .locked-grid{grid-template-columns:1fr !important}
          .proof-grid{grid-template-columns:1fr 1fr !important}
        }
        @media(max-width:480px){
          .proof-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      {/* AMBIENT ORBS */}
      <div style={{ position: 'fixed', top: '15%', right: '-5%', width: 350, height: 350, background: 'radial-gradient(circle,rgba(240,180,41,.06) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)', animation: 'fadeUp .5s ease' }} />

      {/* HEADER */}
      <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp .65s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 100, backdropFilter: 'blur(20px)' }}>
            <LiveDot />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.grn }}>{liveCount} online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 100, backdropFilter: 'blur(20px)' }}>
            <Sparkles size={9} color={G.gold} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut }}>{statuses[statusIdx]}</span>
          </div>
          {/* VIP BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: `${tier.color}10`, border: `1px solid ${tier.color}28`, borderRadius: 100 }}>
            <span style={{ fontSize: 12 }}>{tier.emoji}</span>
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: tier.color }}>{tier.label}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px,5.5vw,56px)', letterSpacing: 4, lineHeight: 1, color: G.wht, marginBottom: 7 }}>
              VÍTEJ,{' '}
              <span style={{ background: 'linear-gradient(135deg,#F0B429 0%,#FFD97D 50%,#F0B429 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'goldShimmer 4s linear infinite' }}>
                {profile?.full_name?.split(' ')[0]?.toUpperCase() ?? 'ČLENE'}
              </span>
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300 }}>
              {tier.label} přístup · {lastUpdate < 60 ? `Aktualizováno před ${lastUpdate}s` : 'Aktualizováno právě teď'}
            </p>
          </div>
          {!isVip && (
            <Link href="/vip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '12px 22px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 8px 32px rgba(240,180,41,.28)' }}>
              <Crown size={14} /> Vstoupit do VIP
            </Link>
          )}
        </div>
      </div>

      
      {/* MARKETPLACE QUICK LINK */}
      <Link href="/marketplace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 14, textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'all .3s' }} onMouseEnter={e => { (e.currentTarget as any).style.background = 'rgba(240,180,41,.08)' }} onMouseLeave={e => { (e.currentTarget as any).style.background = 'rgba(240,180,41,.04)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 28 }}>🛒</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: '#F0B429', lineHeight: 1 }}>MARKETPLACE</div>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: 'rgba(240,235,225,.38)', letterSpacing: 1, marginTop: 3 }}>Prodej a kup nemovitosti, auta, elektroniku a více</div>
          </div>
        </div>
        <ArrowRight size={20} color="#F0B429" style={{ flexShrink: 0 }} />
      </Link>

      {/* UPGRADE BANNER */}
      <UpgradeBanner role={userRole} />

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 11, position: 'relative', zIndex: 1 }}>
        <StatCard label="Dostupné dealy" numVal={deals.length} icon={TrendingUp} accent={G.gold} delay={0} />
        <StatCard label="Uložené dealy" numVal={savedCount} icon={Bookmark} accent={G.blu} delay={80} />
        <StatCard label="Nová oznámení" numVal={unreadCount} icon={Bell} accent={G.grn} delay={160} />
        <StatCard label="Úroveň přístupu" value={tier.label} icon={Crown} accent={tier.color} delay={240} />
      </div>

      {/* LOCKED FEATURES PREVIEW – pouze pro free */}
      {!isVip && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, position: 'relative', zIndex: 1 }}>
          {[
            { icon: '⚡', title: 'Rychlé alerty', desc: 'Dostávej dealy jako první', req: 'VIP', color: G.gold },
            { icon: '🤖', title: 'AI deep scan', desc: 'AI analýza profit potenciálu', req: 'VIP PRO', color: G.blu },
            { icon: '📊', title: 'Trend predictions', desc: 'Předpovědi trendových produktů', req: 'VIP PRO', color: G.blu },
            { icon: '💎', title: 'Mastermind skupina', desc: 'Exkluzivní inner circle', req: 'VIP MAX', color: G.org },
          ].map(f => (
            <div key={f.title} style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${f.color}18`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: G.wht }}>{f.title}</div>
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: f.color, letterSpacing: 1.5, textTransform: 'uppercase' }}>Vyžaduje {f.req}</div>
                </div>
                <Lock size={13} color={f.color} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
              <div style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* ALERTS */}
      {alerts.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <LiveDot />
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: G.wht }}>Live Alerty</span>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>· před {lastUpdate < 60 ? `${lastUpdate}s` : `${Math.floor(lastUpdate/60)}m`}</span>
            </div>
            <Link href="/alerts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, textDecoration: 'none' }}>
              Všechny <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map((a, i) => <AlertCard key={a.id} alert={a} idx={i} userRole={userRole} />)}
          </div>
        </div>
      )}

      {/* DEALS */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Flame size={15} color={G.gold} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: G.wht }}>
              {isVip ? 'Nejnovější příležitosti' : 'Dostupné dealy'}
            </span>
          </div>
          <Link href="/deals" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, textDecoration: 'none' }}>
            Zobrazit vše <ArrowRight size={11} />
          </Link>
        </div>

        {!isVip && (
          <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 10, background: G.gold3, border: `1px solid ${G.gold4}`, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Zap size={13} color={G.gold} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>
              Vidíš pouze free dealy. Část příležitostí je zamčena.{' '}
              <Link href="/vip" style={{ color: G.gold, fontWeight: 600, textDecoration: 'none' }}>Upgraduj na VIP</Link>
              {' '}pro plný přístup.
            </p>
          </div>
        )}

        {deals.length === 0 ? (
          <div style={{ padding: '48px 24px', borderRadius: 16, border: `1px solid ${G.br}`, background: G.gl, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Brzy zde uvidíš první dealy</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 11 }}>
            {deals.map((d, i) => <DealCard key={d.id} deal={d} idx={i} userRole={userRole} />)}
          </div>
        )}
      </div>

      {/* AI SCANNER – pouze admin */}
      {userRole === 'admin' && (
        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(77,159,255,.04)', border: '1px solid rgba(77,159,255,.18)', borderRadius: 16, padding: '24px 22px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#4D9FFF,transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Sparkles size={15} color={G.blu} />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.blu }}>AI Bazoš Scanner</span>
              </div>
              <p style={{ fontSize: 11, color: G.mut, fontWeight: 300 }}>Prohledá Bazoš.cz a přidá nejlepší flip příležitosti do marketplace.</p>
              {scanResult && !scanResult.error && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.18)', borderRadius: 8 }}>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn }}>✓ Naskenováno {scanResult.scanned} inzerátů · Nalezeno {scanResult.found} flipů · Přidáno {scanResult.inserted} nových</span>
                </div>
              )}
              {scanResult?.error && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.18)', borderRadius: 8 }}>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: '#FF3B5C' }}>✗ {scanResult.error}</span>
                </div>
              )}
            </div>
            <button onClick={runScanner} disabled={scanning} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: scanning ? 'rgba(77,159,255,.1)' : G.blu, color: scanning ? G.blu : '#fff', padding: '12px 20px', borderRadius: 9, border: 'none', cursor: scanning ? 'default' : 'pointer', boxShadow: scanning ? 'none' : '0 6px 20px rgba(77,159,255,.3)', transition: 'all .3s', flexShrink: 0 }}>
              {scanning ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(77,159,255,.3)', borderTop: `2px solid ${G.blu}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Skenuji…</> : <><Sparkles size={14} /> Spustit AI scan</>}
            </button>
          </div>
        </div>
      )}

      {/* FOOTER STATUS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '18px 0', borderTop: `1px solid ${G.br}`, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[
          { Icon: Activity, label: `${liveCount} online`, color: G.grn },
          { Icon: Eye, label: '247 dealů tento měsíc', color: G.mut },
          { Icon: Clock, label: lastUpdate < 60 ? `Aktualizováno před ${lastUpdate}s` : 'Živě', color: G.mut },
        ].map(({ Icon, label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={11} color={color} />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color }}>{label}</span>
          </div>
        ))}
      </div>
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
    </div>
  )
}
