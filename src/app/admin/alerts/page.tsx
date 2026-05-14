import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AlertType, DealAccess } from '@/lib/types'

const G = {
  gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF',
  pur: '#9B5DE5', red: '#FF3B5C', wht: '#F0EBE1',
  mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.03)',
  br: 'rgba(255,255,255,.07)',
}

export const metadata = { title: 'Admin – Alerty' }

async function createAlert(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('alerts').insert({
    title: formData.get('title') as string,
    body: formData.get('body') as string,
    type: formData.get('type') as AlertType,
    access_level: formData.get('access_level') as DealAccess,
    cta_text: formData.get('cta_text') as string || null,
    cta_url: formData.get('cta_url') as string || null,
    is_pinned: formData.get('is_pinned') === 'on',
    is_active: true,
    created_by: user.id,
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
  const id = formData.get('id') as string
  const pinned = formData.get('pinned') === 'true'
  await supabase.from('alerts').update({ is_pinned: !pinned }).eq('id', id)
  revalidatePath('/admin/alerts')
}

const ALERT_TYPES = [
  { value: 'deal', label: '💰 Deal', color: G.gold },
  { value: 'price_drop', label: '📉 Pokles ceny', color: G.blu },
  { value: 'trend', label: '📈 Trend', color: G.grn },
  { value: 'ai', label: '🤖 AI', color: G.pur },
  { value: 'vip', label: '👑 VIP', color: G.gold },
  { value: 'system', label: '🔔 Systém', color: G.mut },
]

const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.04)', border: `1px solid rgba(255,255,255,.1)`, borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#F0EBE1', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(240,235,225,.38)', marginBottom: 8 }

export default async function AdminAlertsPage() {
  const supabase = createClient()
  const { data: alerts } = await supabase.from('alerts').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false })

  const typeColorMap: Record<string, string> = {
    deal: G.gold, price_drop: G.blu, trend: G.grn, ai: G.pur, vip: G.gold, system: G.mut,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 3, height: 28, background: G.grn, borderRadius: 2, boxShadow: `0 0 10px ${G.grn}` }} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: G.wht, lineHeight: 1 }}>SPRÁVA ALERTŮ</h1>
        </div>
        <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.mut, textTransform: 'uppercase' }}>{alerts?.length ?? 0} alertů celkem</p>
      </div>

      {/* Create form */}
      <div style={{ background: G.gl, border: `1px solid rgba(240,180,41,.2)`, borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${G.gold},transparent)` }} />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, color: G.wht, marginBottom: 20 }}>➕ NOVÝ ALERT</div>
        <form action={createAlert} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nadpis *</label>
            <input name="title" type="text" required placeholder="🔥 Nový TOP DEAL právě přidán!" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Obsah alertu *</label>
            <textarea name="body" required rows={3} placeholder="Detailní popis alertu..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Typ</label>
              <select name="type" style={{ ...inputStyle, background: 'rgba(255,255,255,.06)' }}>
                {ALERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Přístup</label>
              <select name="access_level" style={{ ...inputStyle, background: 'rgba(255,255,255,.06)' }}>
                <option value="free">Free – veřejný</option>
                <option value="vip">VIP – pouze VIP</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" name="is_pinned" style={{ width: 16, height: 16, accentColor: G.gold }} />
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: G.wht }}>⭐ Připnout nahoře</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>CTA text (tlačítko)</label>
              <input name="cta_text" type="text" placeholder="Zobrazit deal" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CTA URL</label>
              <input name="cta_url" type="url" placeholder="https://..." style={inputStyle} />
            </div>
          </div>
          <div>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: `0 6px 20px ${G.gold}33` }}>
              ⚡ Publikovat alert
            </button>
          </div>
        </form>
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(alerts ?? []).map(alert => {
          const color = typeColorMap[alert.type] ?? G.mut
          return (
            <div key={alert.id} style={{ background: alert.is_pinned ? 'rgba(240,180,41,.03)' : G.gl, border: `1px solid ${alert.is_pinned ? 'rgba(240,180,41,.2)' : G.br}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: `${color}14`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {ALERT_TYPES.find(t => t.value === alert.type)?.label.split(' ')[0] ?? '⚡'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: G.wht }}>{alert.is_pinned ? '📌 ' : ''}{alert.title}</span>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 5, background: `${color}14`, color, border: `1px solid ${color}28` }}>{alert.type}</span>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 5, background: alert.access_level === 'vip' ? 'rgba(155,93,229,.1)' : 'rgba(255,255,255,.05)', color: alert.access_level === 'vip' ? G.pur : G.mut, border: `1px solid ${alert.access_level === 'vip' ? 'rgba(155,93,229,.25)' : G.br}` }}>{alert.access_level}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300, lineHeight: 1.6 }}>{alert.body}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <form action={togglePin}>
                  <input type="hidden" name="id" value={alert.id} />
                  <input type="hidden" name="pinned" value={String(alert.is_pinned)} />
                  <button type="submit" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={alert.is_pinned ? 'Odepnout' : 'Připnout'}>
                    {alert.is_pinned ? '📌' : '📍'}
                  </button>
                </form>
                <form action={deleteAlert}>
                  <input type="hidden" name="id" value={alert.id} />
                  <button type="submit" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,59,92,.06)', border: `1px solid rgba(255,59,92,.2)`, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Smazat">
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          )
        })}
        {(alerts ?? []).length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: 'rgba(240,235,225,.2)' }}>ŽÁDNÉ ALERTY</p>
          </div>
        )}
      </div>
    </div>
  )
}
