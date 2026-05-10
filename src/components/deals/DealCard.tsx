'use client'

import Link from 'next/link'
import { useState } from 'react'
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

export function DealCard({ deal, isSaved = false, onSave, isVip = false, compact = false }: DealCardProps) {
  const [saved, setSaved] = useState(isSaved)
  const [savePending, setSavePending] = useState(false)
  const meta = CATEGORY_META[deal.category as keyof typeof CATEGORY_META]
  const isLocked = deal.access_level === 'vip' && !isVip

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (savePending || isLocked) return
    setSavePending(true)
    setSaved(prev => !prev)
    await onSave?.(deal.id)
    setSavePending(false)
  }

  return (
    <Link href={isLocked ? '/membership' : `/deals/${deal.slug}`} className="block group">
      <div className={cn(
        'card relative overflow-hidden',
        compact ? 'p-4' : 'p-5',
        isLocked && 'opacity-80'
      )}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/60 transition-all duration-500" />

        {/* Shine on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(245,184,0,0.04) 0%, transparent 50%)' }} />

        {/* VIP Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center glass rounded-2xl gap-2">
            <Lock className="w-5 h-5 text-gold-500" />
            <span className="font-heading text-xs font-bold tracking-widest text-gold-500 uppercase">VIP přístup</span>
          </div>
        )}

        <div className="relative">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-void-800 border border-white/5 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {deal.emoji}
              </div>
              <div className="flex flex-col gap-1">
                <span className={cn('badge', meta.badgeClass)}>{meta.icon} {meta.label}</span>
                <div className="flex items-center gap-1.5">
                  {deal.is_featured && <span className="badge badge-gold"><Star className="w-2.5 h-2.5" /> Featured</span>}
                  {deal.is_hot     && <span className="badge badge-red"><Flame className="w-2.5 h-2.5" /> Hot</span>}
                  {deal.is_trending && <span className="badge badge-green"><TrendingUp className="w-2.5 h-2.5" /> Trend</span>}
                  {deal.access_level === 'vip' && <span className="badge badge-vip">👑 VIP</span>}
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title={saved ? 'Odebrat' : 'Uložit'}>
              {saved
                ? <BookmarkCheck className="w-4 h-4 text-gold-500" />
                : <Bookmark     className="w-4 h-4 text-void-400 group-hover:text-void-200 transition-colors" />}
            </button>
          </div>

          {/* Title */}
          <h3 className="font-heading text-[17px] font-700 tracking-wide mb-3 leading-tight group-hover:text-gold-400 transition-colors line-clamp-2">
            {deal.title}
          </h3>

          {/* Price rows */}
          <div className="space-y-2 mb-4">
            {deal.buy_price != null && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-void-400 font-heading font-600 tracking-wide uppercase text-xs">Koupeno za</span>
                <span className="text-gold-500 font-heading font-700 text-base">{formatCZK(deal.buy_price)}</span>
              </div>
            )}
            {deal.sell_price != null && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-void-400 font-heading font-600 tracking-wide uppercase text-xs">Běžná cena</span>
                <span className="text-void-300 font-medium">{formatCZK(deal.sell_price)}</span>
              </div>
            )}
            {deal.trend_percent != null && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-void-400 font-heading font-600 tracking-wide uppercase text-xs">Nárůst trendu</span>
                <span className="profit-positive font-heading font-700 text-base">+{deal.trend_percent}%</span>
              </div>
            )}
            {deal.profit_percent != null && deal.buy_price == null && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-void-400 font-heading font-600 tracking-wide uppercase text-xs">Provize</span>
                <span className="profit-positive font-heading font-700 text-base">{deal.profit_percent}%</span>
              </div>
            )}
          </div>

          {/* Profit row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-void-400 font-heading font-600 tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {deal.source_name}
            </div>
            {deal.profit_amount != null ? (
              <span className="font-display text-2xl profit-positive glow-text">
                {deal.profit_amount > 0 ? '+' : ''}{formatCZK(deal.profit_amount)}
              </span>
            ) : deal.profit_percent != null && deal.buy_price != null ? (
              <span className="font-display text-2xl profit-positive">
                {formatPercent(deal.profit_percent)}
              </span>
            ) : null}
          </div>

          {/* Footer */}
          {!compact && (
            <div className="flex items-center justify-between mt-3 pt-2">
              <span className="text-xs text-void-500 font-heading">{formatRelative(deal.created_at)}</span>
              <span className="text-xs text-void-500 font-heading">{deal.view_count} zobrazení</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// Skeleton loader
export function DealCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-5 w-24 rounded shimmer" />
            <div className="h-4 w-16 rounded shimmer" />
          </div>
        </div>
        <div className="w-6 h-6 rounded shimmer" />
      </div>
      <div className="h-5 w-3/4 rounded shimmer mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-4/5 rounded shimmer" />
      </div>
      <div className="flex justify-between pt-3 border-t border-white/5">
        <div className="h-4 w-20 rounded shimmer" />
        <div className="h-7 w-28 rounded shimmer" />
      </div>
    </div>
  )
}
