import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Eye, Bookmark } from 'lucide-react'
import { formatCZK, formatRelative } from '@/lib/utils'
import { CATEGORY_META } from '@/lib/types'

export const metadata = { title: 'Admin – Dealy' }

async function deleteDeal(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('deals').delete().eq('id', id)
  revalidatePath('/admin/deals')
}

async function toggleStatus(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id     = formData.get('id') as string
  const status = formData.get('status') as string
  const next   = status === 'active' ? 'draft' : 'active'
  await supabase.from('deals').update({ status: next }).eq('id', id)
  revalidatePath('/admin/deals')
}

export default async function AdminDealsPage() {
  const supabase = createClient()
  const { data: deals } = await supabase.from('deals').select('*').order('created_at', { ascending: false })

  const STATUS_COLOR: Record<string, string> = {
    active: 'badge-green', featured: 'badge-gold', draft: 'badge-gray', expired: 'badge-red', sold_out: 'badge-purple',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white">SPRÁVA DEALŮ</h1>
          <p className="font-body text-void-400 text-sm mt-1">{deals?.length ?? 0} dealů celkem</p>
        </div>
        <Link href="/admin/deals/new" className="btn btn-gold"><PlusCircle className="w-4 h-4" />Nový deal</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Kategorie</th>
              <th>Profit</th>
              <th>Přístup</th>
              <th>Status</th>
              <th>Zobrazení</th>
              <th>Přidáno</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {(deals ?? []).map(deal => {
              const catMeta = CATEGORY_META[deal.category as keyof typeof CATEGORY_META]
              return (
                <tr key={deal.id}>
                  <td>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-void-800 flex items-center justify-center text-lg flex-shrink-0">{deal.emoji}</div>
                      <span className="font-heading text-sm font-600 text-void-200 truncate max-w-[200px]">{deal.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${catMeta.badgeClass}`}>{catMeta.icon} {catMeta.label}</span>
                  </td>
                  <td>
                    {deal.profit_amount ? (
                      <span className="font-display text-sm text-green-400">+{formatCZK(deal.profit_amount)}</span>
                    ) : deal.profit_percent ? (
                      <span className="font-display text-sm text-gold-500">{deal.profit_percent}%</span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${deal.access_level === 'vip' ? 'badge-vip' : 'badge-free'}`}>{deal.access_level}</span>
                  </td>
                  <td>
                    <form action={toggleStatus}>
                      <input type="hidden" name="id" value={deal.id} />
                      <input type="hidden" name="status" value={deal.status} />
                      <button type="submit" className={`badge ${STATUS_COLOR[deal.status] ?? 'badge-gray'} cursor-pointer hover:opacity-80 transition-opacity`}>
                        {deal.status}
                      </button>
                    </form>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-void-400 font-heading text-xs">
                      <Eye className="w-3 h-3" />{deal.view_count}
                    </div>
                  </td>
                  <td>
                    <span className="font-heading text-xs text-void-500">{formatRelative(deal.created_at)}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link href={`/deals/${deal.slug}`} className="p-1.5 rounded-lg hover:bg-void-700 transition-colors" title="Zobrazit">
                        <Eye className="w-3.5 h-3.5 text-void-400" />
                      </Link>
                      <Link href={`/admin/deals/new?edit=${deal.id}`} className="p-1.5 rounded-lg hover:bg-void-700 transition-colors" title="Editovat">
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      </Link>
                      <form action={deleteDeal}>
                        <input type="hidden" name="id" value={deal.id} />
                        <button type="submit" className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Smazat"
                          onClick={e => { if (!confirm('Opravdu smazat tento deal?')) e.preventDefault() }}>
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(deals ?? []).length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-void-600 mb-3">ŽÁDNÉ DEALY</p>
            <Link href="/admin/deals/new" className="btn btn-gold"><PlusCircle className="w-4 h-4" />Přidat první deal</Link>
          </div>
        )}
      </div>
    </div>
  )
}
