import type { Deal } from '@/lib/types'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DealCard } from '@/components/deals/DealCard'
import { Bookmark } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Uložené dealy' }

export default async function SavedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  const { data: saved } = await supabase
    .from('saved_deals')
    .select('*, deal:deals(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const deals = (saved ?? []).map(s => s.deal).filter(Boolean)

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white">ULOŽENÉ DEALY</h1>
        <p className="font-body text-void-400 text-sm mt-1">{deals.length} uložených dealů</p>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-void-800 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7 text-void-500" />
          </div>
          <h3 className="font-display text-2xl tracking-widest text-void-400 mb-2">ŽÁDNÉ ULOŽENÉ DEALY</h3>
          <p className="font-body text-sm text-void-500 mb-6">Procházej dealy a ukládej si ty nejlepší příležitosti.</p>
          <Link href="/deals" className="btn btn-gold">Procházet dealy</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {deals.map((deal: Deal) => (
            <DealCard key={deal.id} deal={deal} isSaved={true} isVip={isVip} />
          ))}
        </div>
      )}
    </div>
  )
}
