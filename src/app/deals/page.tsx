import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DealCard, DealCardSkeleton } from '@/components/deals/DealCard'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { CATEGORY_META } from '@/lib/types'

export const metadata = { title: 'Všechny dealy' }

interface Props { searchParams: { cat?: string; sort?: string } }

export default async function DealsPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  let query = supabase.from('deals').select('*').in('status', ['active', 'featured'])
  if (searchParams.cat) query = query.eq('category', searchParams.cat)
  if (!isVip) query = query.eq('access_level', 'free')

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    newest:   { col: 'created_at',    asc: false },
    profit:   { col: 'profit_amount', asc: false },
    popular:  { col: 'view_count',    asc: false },
    trending: { col: 'trend_percent', asc: false },
  }
  const sort = sortMap[searchParams.sort ?? 'newest'] ?? sortMap.newest
  query = query.order(sort.col, { ascending: sort.asc })

  const { data: deals } = await query.limit(48)
  const { data: savedRaw } = await supabase.from('saved_deals').select('deal_id').eq('user_id', user.id)
  const savedIds = new Set((savedRaw ?? []).map(d => d.deal_id))

  const SORTS = [
    { value: 'newest',   label: 'Nejnovější' },
    { value: 'profit',   label: 'Nejvyšší profit' },
    { value: 'popular',  label: 'Nejoblíbenější' },
    { value: 'trending', label: 'Trending' },
  ]

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white">DEALY</h1>
          <p className="font-body text-void-400 text-sm mt-1">{deals?.length ?? 0} dealů{searchParams.cat ? ` v kategorii ${CATEGORY_META[searchParams.cat as keyof typeof CATEGORY_META]?.label}` : ''}</p>
        </div>
        {!isVip && (
          <Link href="/membership" className="btn btn-gold"><Crown className="w-4 h-4" />VIP – Všechny dealy</Link>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Link href="/deals" className={`flex-shrink-0 px-4 py-2 rounded-full font-heading text-xs font-700 tracking-wider uppercase transition-all border ${!searchParams.cat ? 'bg-gold-500 text-black border-gold-500' : 'border-white/10 text-void-400 hover:border-white/20 hover:text-void-200'}`}>
          Vše
        </Link>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <Link key={key} href={`/deals?cat=${key}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-heading text-xs font-700 tracking-wider uppercase transition-all border flex items-center gap-1.5 ${searchParams.cat === key ? 'bg-gold-500 text-black border-gold-500' : 'border-white/10 text-void-400 hover:border-white/20 hover:text-void-200'}`}>
            {meta.icon} {meta.label}
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 flex-wrap">
        {SORTS.map(s => (
          <Link key={s.value} href={`/deals?sort=${s.value}${searchParams.cat ? `&cat=${searchParams.cat}` : ''}`}
            className={`px-3 py-1.5 rounded-lg font-heading text-xs font-600 tracking-wider transition-all border ${(searchParams.sort ?? 'newest') === s.value ? 'bg-void-800 border-gold-500/30 text-gold-400' : 'border-white/[0.06] text-void-500 hover:text-void-300'}`}>
            {s.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {(deals ?? []).map(deal => (
          <DealCard key={deal.id} deal={deal} isSaved={savedIds.has(deal.id)} isVip={isVip} />
        ))}
      </div>

      {deals?.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-3xl text-void-600 mb-3">ŽÁDNÉ DEALY</p>
          <p className="font-body text-void-500 text-sm">Zkus jinou kategorii nebo se vrať později.</p>
        </div>
      )}
    </div>
  )
}
