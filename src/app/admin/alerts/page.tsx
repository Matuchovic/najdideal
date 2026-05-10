import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Zap, PlusCircle, Trash2, Star, StarOff } from 'lucide-react'
import { formatRelative } from '@/lib/utils'
import { ALERT_TYPE_META } from '@/lib/types'
import type { AlertType, DealAccess } from '@/lib/types'
import { slugify } from '@/lib/utils'

export const metadata = { title: 'Admin – Alerty' }

async function createAlert(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('alerts').insert({
    title:        formData.get('title') as string,
    body:         formData.get('body') as string,
    type:         formData.get('type') as AlertType,
    access_level: formData.get('access_level') as DealAccess,
    cta_text:     formData.get('cta_text') as string || null,
    cta_url:      formData.get('cta_url') as string || null,
    is_pinned:    formData.get('is_pinned') === 'on',
    is_active:    true,
    created_by:   user.id,
  })
  revalidatePath('/admin/alerts')
  revalidatePath('/alerts')
  revalidatePath('/dashboard')
}

async function deleteAlert(formData: FormData) {
  'use server'
  const supabase = createClient()
  await supabase.from('alerts').delete().eq('id', formData.get('id') as string)
  revalidatePath('/admin/alerts')
}

async function togglePin(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id      = formData.get('id') as string
  const pinned  = formData.get('pinned') === 'true'
  await supabase.from('alerts').update({ is_pinned: !pinned }).eq('id', id)
  revalidatePath('/admin/alerts')
}

const ALERT_TYPES: { value: AlertType; label: string }[] = [
  { value: 'deal',       label: '💰 Deal' },
  { value: 'price_drop', label: '📉 Pokles ceny' },
  { value: 'trend',      label: '📈 Trend' },
  { value: 'ai',         label: '🤖 AI' },
  { value: 'vip',        label: '👑 VIP' },
  { value: 'system',     label: '🔔 Systém' },
]

export default async function AdminAlertsPage() {
  const supabase = createClient()
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white">SPRÁVA ALERTŮ</h1>
        <p className="font-body text-void-400 text-sm mt-1">{alerts?.length ?? 0} alertů celkem</p>
      </div>

      {/* Create form */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <h2 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Nový alert
        </h2>
        <form action={createAlert} className="space-y-4">
          <div>
            <label className="input-label">Nadpis *</label>
            <input name="title" type="text" required placeholder="🔥 Nový TOP DEAL právě přidán!" className="input" />
          </div>
          <div>
            <label className="input-label">Obsah alertu *</label>
            <textarea name="body" required rows={3} placeholder="Detailní popis alertu..." className="input resize-none" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Typ</label>
              <select name="type" className="input bg-void-800">
                {ALERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Přístup</label>
              <select name="access_level" className="input bg-void-800">
                <option value="free">Free – veřejný</option>
                <option value="vip">VIP – pouze VIP členové</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-3">
                <input type="checkbox" name="is_pinned" className="w-4 h-4 accent-gold-500 rounded" />
                <span className="font-heading text-sm text-void-300">⭐ Připnout nahoře</span>
              </label>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">CTA text (tlačítko)</label>
              <input name="cta_text" type="text" placeholder="Zobrazit deal" className="input" />
            </div>
            <div>
              <label className="input-label">CTA URL</label>
              <input name="cta_url" type="url" placeholder="https://..." className="input" />
            </div>
          </div>
          <button type="submit" className="btn btn-gold">
            <Zap className="w-4 h-4" /> Publikovat alert
          </button>
        </form>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {(alerts ?? []).map(alert => {
          const meta = ALERT_TYPE_META[alert.type as AlertType]
          return (
            <div key={alert.id} className={`card p-5 flex items-start gap-4 ${alert.is_pinned ? 'border-gold-500/20' : ''}`}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}
              >
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-sm font-700 text-white">{alert.title}</h3>
                    {alert.is_pinned && <Star className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />}
                    <span className={`badge ${alert.access_level === 'vip' ? 'badge-vip' : 'badge-free'}`}>
                      {alert.access_level}
                    </span>
                    <span className="badge" style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}>
                      {meta.label}
                    </span>
                  </div>
                  <span className="font-heading text-xs text-void-500 flex-shrink-0">{formatRelative(alert.created_at)}</span>
                </div>
                <p className="font-body text-sm text-void-400 leading-relaxed line-clamp-2">{alert.body}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Toggle pin */}
                <form action={togglePin}>
                  <input type="hidden" name="id" value={alert.id} />
                  <input type="hidden" name="pinned" value={String(alert.is_pinned)} />
                  <button type="submit" title={alert.is_pinned ? 'Odepnout' : 'Připnout'}
                    className="p-1.5 rounded-lg hover:bg-void-700 transition-colors">
                    {alert.is_pinned
                      ? <StarOff className="w-4 h-4 text-gold-400" />
                      : <Star    className="w-4 h-4 text-void-500" />}
                  </button>
                </form>
                {/* Delete */}
                <form action={deleteAlert}>
                  <input type="hidden" name="id" value={alert.id} />
                  <button type="submit" title="Smazat"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    onClick={e => { if (!confirm('Smazat alert?')) e.preventDefault() }}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </form>
              </div>
            </div>
          )
        })}

        {(alerts ?? []).length === 0 && (
          <div className="text-center py-16">
            <Zap className="w-10 h-10 text-void-600 mx-auto mb-3" />
            <p className="font-display text-2xl text-void-600">ŽÁDNÉ ALERTY</p>
          </div>
        )}
      </div>
    </div>
  )
}
