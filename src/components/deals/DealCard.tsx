'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { Bookmark, BookmarkCheck, Lock, TrendingUp, Flame, Star } from 'lucide-react'
import { cn, formatCZK, formatPercent, formatRelative } from '@/lib/utils'
import type { Deal } from '@/lib/types'
import { CATEGORY_META } from '@/lib/types'

interface DealCardProps {
  deal: Deal
  isSaved?: boolean
  onSave?: (dealId: string) => void
  isVip?: boolean
  compact?: boolean
}

const GLOW_STYLE = `
  @keyframes rotateBorder {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes dealPulse {
    0%,100% { opacity:.5; }
    50%      { opacity:1; }
  }
  @keyframes profitIn {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
`

export function DealCard({ deal, isSaved = false, onSave, isVip = false, compact = false }: DealCardProps) {
  const [saved, setSaved]             = useState(isSaved)
  const [savePending, setSavePending] = useState(false)
  const [hov, setHov]                 = useState(false)
  const [mp, setMp]                   = useState({ x: 50, y: 50 })
  const cardRef                       = useRef<HTMLDivElement>(null)

  const meta     = CATEGORY_META[deal.category as keyof typeof CATEGORY_META]
  const isLocked = deal.access_level === 'vip' && !isVip
  const isHot    = deal.is_hot
  const accentColor = isHot ? '#F0B429' : deal.is_featured ? '#4D9FFF' : deal.is_trending ? '#00E676' : '#F0B429'

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (savePending || isLocked) return
    setSavePending(true)
    setSaved(prev => !prev)
    await onSave?.(deal.id)
    setSavePending(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <Link href={isLocked ? '/membership' : `/deals/${deal.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <style>{GLOW_STYLE}</style>

      <div
        ref={cardRef}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          borderRadius: 20,
          padding: compact ? '16px' : '20px',
          background: hov ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.026)',
          backdropFilter: 'blur(32px) saturate(180%)',
          border: `1px solid ${hov ? accentColor + '44' : 'rgba(255,255,255,.07)'}`,
          transition: 'all .45s cubic-bezier(.34,1.56,.64,1)',
          transform: hov ? 'translateY(-6px) scale(1.01)' : 'translateY(0)',
          boxShadow: hov
            ? `0 28px 70px rgba(0,0,0,.55), 0 0 0 1px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,.07)`
            : '0 2px 12px rgba(0,0,0,.2)',
          cursor: isLocked ? 'default' : 'pointer',
          overflow: 'hidden',
          opacity: isLocked ? 0.85 : 1,
        }}
      >
        {/* ── ROTATING GLOW BORDER ── */}
        {hov && (
          <div style={{ position: 'absolute', inset: -2, borderRadius: 22, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '150%', height: '150%',
              transform: 'translate(-50%,-50%)',
              background: `conic-gradient(from 0deg, transparent 0deg, ${accentColor}66 60deg, transparent 120deg, transparent 360deg)`,
              animation: 'rotateBorder 3s linear infinite',
            }} />
            <div style={{ position: 'absolute', inset: 2, borderRadius: 20, background: hov ? 'rgba(255,255,255,.04)' : '#020208' }} />
          </div>
        )}

        {/* ── MOUSE GLOW ── */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle at ${mp.x}% ${mp.y}%, ${accentColor}0e 0%, transparent 55%)`,
          opacity: hov ? 1 : 0, transition: 'opacity .3s',
        }} />

        {/* ── TOP LINE ── */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: hov ? 1 : 0.35, transition: 'opacity .4s', zIndex: 1,
        }} />

        {/* ── TOP SHINE ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(180deg,rgba(255,255,255,.03) 0%,transparent 100%)',
          borderRadius: '20px 20px 0 0', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── CONTENT ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Thumbnail / Emoji icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 13,
                background: 'rgba(255,255,255,.05)',
                border: `1px solid ${hov ? accentColor + '33' : 'rgba(255,255,255,.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0, overflow: 'hidden',
                transition: 'all .35s cubic-bezier(.34,1.56,.64,1)',
                transform: hov ? 'scale(1.12) rotate(-6deg)' : 'scale(1)',
                boxShadow: hov ? `0 0 18px ${accentColor}44` : 'none',
              }}>
                {deal.image_url
                  ? <img src={deal.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; if (e.currentTarget.parentElement) e.currentTarget.parentElement.textContent = deal.emoji || '💰' }} />
                  : (deal.emoji || '💰')}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${accentColor}12`, border: `1px solid ${accentColor}28`, borderRadius: 100, padding: '3px 9px' }}>
                  <span style={{ fontSize: 10 }}>{meta?.icon}</span>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: accentColor }}>{meta?.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {deal.is_featured && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(77,159,255,.1)', border: '1px solid rgba(77,159,255,.25)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: '#4D9FFF', textTransform: 'uppercase' }}>
                      ★ Featured
                    </span>
                  )}
                  {deal.is_hot && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.28)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: '#F0B429', textTransform: 'uppercase', animation: 'dealPulse 2s ease-in-out infinite' }}>
                      🔥 Hot
                    </span>
                  )}
                  {deal.is_trending && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.22)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: '#00E676', textTransform: 'uppercase' }}>
                      ↑ Trend
                    </span>
                  )}
                  {deal.access_level === 'vip' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(155,93,229,.1)', border: '1px solid rgba(155,93,229,.28)', borderRadius: 100, padding: '2px 7px', fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: '#9B5DE5', textTransform: 'uppercase' }}>
                      👑 VIP
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              style={{ padding: 8, borderRadius: 9, background: saved ? 'rgba(240,180,41,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${saved ? 'rgba(240,180,41,.25)' : 'rgba(255,255,255,.07)'}`, cursor: 'pointer', transition: 'all .25s', flexShrink: 0 }}
            >
              {saved
                ? <BookmarkCheck size={14} color="#F0B429" />
                : <Bookmark size={14} color="rgba(240,235,225,.4)" />}
            </button>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, lineHeight: 1.35,
            color: hov ? '#F0EBE1' : 'rgba(240,235,225,.9)',
            marginBottom: 14, transition: 'color .3s',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {deal.title}
          </h3>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,.05)', marginBottom: 14 }} />

          {/* Price rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {deal.buy_price != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,235,225,.35)' }}>Koupeno za</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1, color: '#F0B429' }}>{formatCZK(deal.buy_price)}</span>
              </div>
            )}
            {deal.sell_price != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,235,225,.35)' }}>Běžná cena</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1, color: 'rgba(240,235,225,.6)' }}>{formatCZK(deal.sell_price)}</span>
              </div>
            )}
            {deal.trend_percent != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,235,225,.35)' }}>Nárůst trendu</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1, color: '#00E676' }}>+{deal.trend_percent}%</span>
              </div>
            )}
          </div>

          {/* Profit row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px',
            background: isLocked ? 'rgba(255,255,255,.03)' : 'rgba(0,230,118,.07)',
            border: `1px solid ${isLocked ? 'rgba(255,255,255,.06)' : 'rgba(0,230,118,.15)'}`,
            borderRadius: 12, position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F0B429', boxShadow: '0 0 6px #F0B429' }} />
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,235,225,.35)' }}>
                {deal.profit_amount ? 'Profit' : 'Příležitost'}
              </span>
            </div>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1, lineHeight: 1,
              color: isLocked ? 'transparent' : '#00E676',
              filter: isLocked ? 'blur(8px)' : `drop-shadow(0 0 10px #00E67688)`,
              transition: 'filter .3s',
              animation: 'profitIn .4s ease',
            }}>
              {deal.profit_amount != null
                ? `+${formatCZK(deal.profit_amount)}`
                : deal.short_desc?.split('·')[0]?.trim() || 'VIP deal'}
            </span>

            {/* Lock overlay on profit */}
            {isLocked && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 }}>
                <Lock size={12} color="#9B5DE5" />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9B5DE5' }}>VIP only</span>
              </div>
            )}
          </div>

          {/* Footer */}
          {!compact && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: 'rgba(240,235,225,.3)', letterSpacing: .5 }}>
                {formatRelative(deal.created_at)}
              </span>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: 'rgba(240,235,225,.3)', letterSpacing: .5 }}>
                {deal.view_count} zobrazení
              </span>
            </div>
          )}
        </div>

        {/* ── VIP LOCK OVERLAY ── */}
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(2,2,8,.7)', backdropFilter: 'blur(4px)', borderRadius: 20 }}>
            <Lock size={22} color="#9B5DE5" />
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9B5DE5' }}>VIP přístup</span>
            <div style={{ background: '#F0B429', color: '#000', fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '7px 16px', borderRadius: 7 }}>
              Odemknout
            </div>
          </div>
        )}

        {/* ── BOTTOM GLOW BLOB ── */}
        <div style={{
          position: 'absolute', bottom: -40, right: -40, width: 120, height: 120,
          background: `${accentColor}08`, borderRadius: '50%', filter: 'blur(24px)',
          opacity: hov ? 1 : 0, transition: 'opacity .4s', pointerEvents: 'none', zIndex: 0,
        }} />
      </div>
    </Link>
  )
}

// Skeleton loader
export function DealCardSkeleton() {
  return (
    <div style={{ borderRadius: 20, padding: 20, background: 'rgba(255,255,255,.026)', border: '1px solid rgba(255,255,255,.07)', overflow: 'hidden' }}>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 18, width: '60%', borderRadius: 6, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 14, width: '40%', borderRadius: 6, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s .15s infinite' }} />
        </div>
      </div>
      <div style={{ height: 16, width: '80%', borderRadius: 6, marginBottom: 14, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s .1s infinite' }} />
      <div style={{ height: 1, background: 'rgba(255,255,255,.05)', marginBottom: 14 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ height: 10, width: '30%', borderRadius: 4, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.5s ${i * .1}s infinite` }} />
            <div style={{ height: 10, width: '25%', borderRadius: 4, background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.5s ${i * .1 + .05}s infinite` }} />
          </div>
        ))}
      </div>
      <div style={{ height: 52, borderRadius: 12, background: 'linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.06) 50%,rgba(255,255,255,.03) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s .2s infinite' }} />
    </div>
  )
}
