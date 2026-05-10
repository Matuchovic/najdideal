import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DealCard } from '@/components/deals/DealCard'
import { Search } from 'lucide-react'

export const metadata = { title: 'Hledat' }

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'
  const q = searchParams.q?.trim() ?? ''

  let deals: any[] = []
  if (q.length >= 2) {
    let query = supabase.from('deals').select('*').in('status', ['active','featured'])
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,source_name.ilike.%${q}%`)
      .order('created_at', { ascending: false }).limit(24)
    if (!isVip) query = query.eq('access_level', 'free')
    const { data } = await query
    deals = data ?? []
  }

  const { data: savedRaw } = await supabase.from('saved_deals').select('deal_id').eq('user_id', user.id)
  const savedIds = new Set((savedRaw ?? []).map(d => d.deal_id))

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white mb-4">HLEDAT</h1>
        <form method="GET" action="/search">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void-400" />
            <input
              name="q" type="search" defaultValue={q} placeholder="Hledat dealy, produkty, příležitosti..."
              className="input pl-12" autoFocus
            />
          </div>
        </form>
      </div>

      {q.length >= 2 && (
        <>
          <p className="font-body text-sm text-void-400">
            {deals.length > 0 ? `${deals.length} výsledků pro "${q}"` : `Žádné výsledky pro "${q}"`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} isSaved={savedIds.has(deal.id)} isVip={isVip} />
            ))}
          </div>
        </>
      )}

      {q.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <p className="font-display text-2xl tracking-widest text-void-500">ZADEJ HLEDANÝ VÝRAZ</p>
          <p className="font-body text-sm text-void-600 mt-2">Min. 2 znaky</p>
        </div>
      )}
    </div>
  )
}
