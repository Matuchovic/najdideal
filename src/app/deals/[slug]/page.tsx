import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, TrendingUp, Crown, Clock, Eye, Tag } from 'lucide-react'
import { formatCZK, formatDate, formatRelative } from '@/lib/utils'
import { CATEGORY_META } from '@/lib/types'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient()
  const { data } = await supabase.from('deals').select('title,short_desc').eq('slug', params.slug).single()
  return { title: data?.title ?? 'Deal', description: data?.short_desc }
}

export default async function DealDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  const { data: deal } = await supabase.from('deals').select('*').or(`slug.eq.${params.slug},id.eq.${params.slug}`).single()
  if (!deal) notFound()
  if (deal.access_level === 'vip' && !isVip) redirect('/membership')

  const { data: savedRow } = await supabase.from('saved_deals').select('id').eq('user_id', user.id).eq('deal_id', deal.id).single()
  const isSaved = !!savedRow

  // Increment view
  await supabase.from('deals').update({ view_count: deal.view_count + 1 }).eq('id', deal.id)

  const meta = CATEGORY_META[deal.category as keyof typeof CATEGORY_META] ?? { label: 'Deal', icon: '💰', color: '#F0B429', badgeClass: 'badge-gold' }

  return (
    <div className="max-w-4xl pb-24 lg:pb-8">
      {/* Back */}
      <Link href="/deals" className="inline-flex items-center gap-2 font-heading text-xs font-600 text-void-400 hover:text-void-200 tracking-wider uppercase transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Zpět na dealy
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-void-800 border border-white/[0.06] flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                {deal.image_url
                  ? <img src={deal.image_url} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; if(e.currentTarget.parentElement) e.currentTarget.parentElement.textContent = deal.emoji }} />
                  : deal.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`badge ${meta.badgeClass}`}>{meta.icon} {meta.label}</span>
                  {deal.is_featured && <span className="badge badge-gold">⭐ Featured</span>}
                  {deal.is_hot      && <span className="badge badge-red">🔥 Hot</span>}
                  {deal.is_trending && <span className="badge badge-green">📈 Trending</span>}
                  {deal.access_level === 'vip' && <span className="badge badge-vip">👑 VIP</span>}
                </div>
                <h1 className="font-display text-3xl tracking-widest text-white leading-tight">{deal.title.toUpperCase()}</h1>
              </div>
            </div>

            {/* Price breakdown */}
            {(deal.buy_price != null || deal.sell_price != null) && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {deal.buy_price != null && (
                  <div className="p-4 rounded-xl bg-void-800 border border-white/[0.05]">
                    <div className="font-heading text-[10px] text-void-400 uppercase tracking-wider mb-1">Koupeno za</div>
                    <div className="font-display text-2xl text-gold-500">{formatCZK(deal.buy_price)}</div>
                  </div>
                )}
                {deal.sell_price != null && (
                  <div className="p-4 rounded-xl bg-void-800 border border-white/[0.05]">
                    <div className="font-heading text-[10px] text-void-400 uppercase tracking-wider mb-1">Tržní cena</div>
                    <div className="font-display text-2xl text-white">{formatCZK(deal.sell_price)}</div>
                  </div>
                )}
                {deal.profit_amount != null && (
                  <div className="p-4 rounded-xl bg-green-400/5 border border-green-400/15">
                    <div className="font-heading text-[10px] text-green-400/70 uppercase tracking-wider mb-1">Profit</div>
                    <div className="font-display text-2xl text-green-400">+{formatCZK(deal.profit_amount)}</div>
                  </div>
                )}
              </div>
            )}

            {deal.trend_percent != null && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-400/5 border border-green-400/15 mb-5">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-heading text-sm font-700 text-green-400">Nárůst trendu: +{deal.trend_percent}% za 30 dní</span>
              </div>
            )}

            {deal.description && (
              <div>
                <h3 className="font-heading text-xs font-700 text-void-400 uppercase tracking-wider mb-2">Popis dealu</h3>
                <p className="font-body text-sm text-void-300 leading-relaxed">{deal.description}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {deal.tags.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-3.5 h-3.5 text-void-400" />
                <span className="font-heading text-xs font-700 text-void-400 uppercase tracking-wider">Tagy</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-void-800 border border-white/[0.06] font-heading text-xs text-void-300 tracking-wider">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CTA Card */}
          <div className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
            <div className="space-y-3">
              {deal.source_url && (
                <a href={deal.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-gold-lg w-full justify-center">
                  <ExternalLink className="w-4 h-4" />
                  Zobrazit zdroj
                </a>
              )}
              <form action={async () => {
                'use server'
                const sb = createClient()
                if (isSaved) {
                  await sb.from('saved_deals').delete().eq('user_id', user!.id).eq('deal_id', deal.id)
                } else {
                  await sb.from('saved_deals').insert({ user_id: user!.id, deal_id: deal.id })
                }
              }}>
                <button type="submit" className="btn btn-outline w-full justify-center">
                  {isSaved ? <><BookmarkCheck className="w-4 h-4" /> Uloženo</> : <><Bookmark className="w-4 h-4" /> Uložit deal</>}
                </button>
              </form>
            </div>
          </div>

          {/* Meta info */}
          <div className="card p-5 space-y-3">
            <h3 className="font-heading text-xs font-700 text-void-400 uppercase tracking-wider">Informace</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-void-400 font-heading font-600 text-xs uppercase tracking-wider flex items-center gap-1.5"><Eye className="w-3 h-3" /> Zobrazení</span>
                <span className="text-void-200 font-heading font-600">{deal.view_count.toLocaleString('cs-CZ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-void-400 font-heading font-600 text-xs uppercase tracking-wider flex items-center gap-1.5"><Bookmark className="w-3 h-3" /> Uložení</span>
                <span className="text-void-200 font-heading font-600">{deal.save_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-void-400 font-heading font-600 text-xs uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Přidáno</span>
                <span className="text-void-200 font-heading font-600">{formatRelative(deal.created_at)}</span>
              </div>
              {deal.expires_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-void-400 font-heading font-600 text-xs uppercase tracking-wider">Platí do</span>
                  <span className="text-red-400 font-heading font-600">{formatDate(deal.expires_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
