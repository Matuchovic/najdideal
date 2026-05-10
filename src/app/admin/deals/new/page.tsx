import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { slugify } from '@/lib/utils'
import type { DealCategory, DealStatus, DealAccess } from '@/lib/types'

export const metadata = { title: 'Admin – Nový deal' }

async function saveDeal(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title       = formData.get('title') as string
  const buyPrice    = formData.get('buy_price') ? Number(formData.get('buy_price')) : null
  const sellPrice   = formData.get('sell_price') ? Number(formData.get('sell_price')) : null
  const profitAmt   = buyPrice && sellPrice ? sellPrice - buyPrice : null
  const profitPct   = buyPrice && sellPrice ? ((sellPrice - buyPrice) / buyPrice) * 100 : formData.get('profit_percent') ? Number(formData.get('profit_percent')) : null
  const tagsRaw     = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
  const trendPct    = formData.get('trend_percent') ? Number(formData.get('trend_percent')) : null

  const payload = {
    title,
    slug:          slugify(title) + '-' + Date.now().toString(36),
    description:   formData.get('description') as string,
    short_desc:    formData.get('short_desc') as string,
    category:      formData.get('category') as DealCategory,
    status:        formData.get('status') as DealStatus,
    access_level:  formData.get('access_level') as DealAccess,
    buy_price:     buyPrice,
    sell_price:    sellPrice,
    profit_amount: profitAmt,
    profit_percent:profitPct,
    emoji:         formData.get('emoji') as string || '💰',
    source_url:    formData.get('source_url') as string || null,
    source_name:   formData.get('source_name') as string || null,
    tags:          tagsRaw,
    is_featured:   formData.get('is_featured') === 'on',
    is_hot:        formData.get('is_hot') === 'on',
    is_trending:   formData.get('is_trending') === 'on',
    trend_percent: trendPct,
    created_by:    user.id,
  }

  await supabase.from('deals').insert(payload)
  revalidatePath('/admin/deals')
  revalidatePath('/dashboard')
  redirect('/admin/deals')
}

const CATEGORIES = [
  { value: 'marketplace_flip', label: '🔄 Marketplace Flip' },
  { value: 'ai_opportunity',   label: '🤖 AI Příležitost' },
  { value: 'trend_product',    label: '📈 Trend Produkt' },
  { value: 'profit_alert',     label: '⚡ Profit Alert' },
  { value: 'affiliate',        label: '💎 Affiliate' },
  { value: 'dropshipping',     label: '📦 Dropshipping' },
  { value: 'crypto',           label: '₿ Krypto' },
  { value: 'other',            label: '🎯 Ostatní' },
]

const EMOJIS = ['💰','📱','💻','🎮','🎧','🤖','📈','🌀','📊','💎','⚡','🔄','📦','🛒','🎯','🏆','🚀','💡']

export default function NewDealPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/deals" className="p-2 rounded-xl hover:bg-void-800 transition-colors">
          <ArrowLeft className="w-4 h-4 text-void-400" />
        </Link>
        <div>
          <h1 className="font-display text-3xl tracking-widest text-white">NOVÝ DEAL</h1>
          <p className="font-body text-void-400 text-sm">Přidej nový deal do platformy</p>
        </div>
      </div>

      <form action={saveDeal} className="space-y-5">

        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Základní informace</h3>

          <div>
            <label className="input-label">Název dealu *</label>
            <input name="title" type="text" required placeholder="iPhone 15 Pro 256GB – Marketplace Flip" className="input" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Emoji ikona</label>
              <select name="emoji" className="input">
                {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Kategorie *</label>
              <select name="category" required className="input bg-void-800">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Krátký popis (pro kartu)</label>
            <input name="short_desc" type="text" placeholder="Max. 120 znaků" maxLength={120} className="input" />
          </div>

          <div>
            <label className="input-label">Plný popis</label>
            <textarea name="description" rows={4} placeholder="Detailní popis dealu..." className="input resize-none" />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Cenové informace</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Cena nákupu (Kč)</label>
              <input name="buy_price" type="number" step="0.01" placeholder="15000" className="input" />
            </div>
            <div>
              <label className="input-label">Tržní cena (Kč)</label>
              <input name="sell_price" type="number" step="0.01" placeholder="22000" className="input" />
            </div>
            <div>
              <label className="input-label">Provize / Profit % (AI)</label>
              <input name="profit_percent" type="number" step="0.1" placeholder="35" className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">Trend % nárůst (volitelné)</label>
            <input name="trend_percent" type="number" step="0.1" placeholder="278" className="input" />
          </div>
        </div>

        {/* Source & Tags */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Zdroj a metadata</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Název zdroje</label>
              <input name="source_name" type="text" placeholder="Marketplace Flip" className="input" />
            </div>
            <div>
              <label className="input-label">URL zdroje</label>
              <input name="source_url" type="url" placeholder="https://..." className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">Tagy (čárkou oddělené)</label>
            <input name="tags" type="text" placeholder="iphone, apple, flip, smartphone" className="input" />
          </div>
        </div>

        {/* Access & Status */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Přístup a status</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Přístup</label>
              <select name="access_level" className="input bg-void-800">
                <option value="free">Free – veřejný</option>
                <option value="vip">VIP – pouze pro VIP členy</option>
              </select>
            </div>
            <div>
              <label className="input-label">Status</label>
              <select name="status" className="input bg-void-800">
                <option value="active">Aktivní</option>
                <option value="featured">Featured (zvýrazněný)</option>
                <option value="draft">Draft (skrytý)</option>
                <option value="expired">Vypršelý</option>
                <option value="sold_out">Vyprodáno</option>
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            {[['is_featured','⭐ Featured'], ['is_hot','🔥 Hot'], ['is_trending','📈 Trending']].map(([name, lbl]) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={name} className="w-4 h-4 accent-gold-500 rounded" />
                <span className="font-heading text-sm text-void-300">{lbl}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-gold">
            <Save className="w-4 h-4" /> Uložit deal
          </button>
          <Link href="/admin/deals" className="btn btn-ghost">Zrušit</Link>
        </div>
      </form>
    </div>
  )
}
