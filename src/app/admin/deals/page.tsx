import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

const G = {
  gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF',
  pur: '#9B5DE5', red: '#FF3B5C', wht: '#F0EBE1',
  mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.03)',
  br: 'rgba(255,255,255,.07)',
}

export const metadata = { title: 'Admin – Dealy' }

async function deleteDeal(formData: FormData) {
  'use server'
  const supabase = createClient()
  await supabase.from('deals').delete().eq('id', formData.get('id') as string)
  revalidatePath('/admin/deals')
}

async function toggleStatus(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const newStatus = status === 'active' ? 'draft' : 'active'
  await supabase.from('deals').update({ status: newStatus }).eq('id', id)
  revalidatePath('/admin/deals')
}

export default async function AdminDealsPage() {
  const supabase = createClient()
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false })

  const total = deals?.length ?? 0
  const active = deals?.filter(d => d.status === 'active' || d.status === 'featured').length ?? 0
  const vipDeals = deals?.filter(d => d.access_level === 'vip').length ?? 0
  const draft = deals?.filter(d => d.status === 'draft').length ?? 0

  const statusColor: Record<string, string> = {
    active: G.grn, featured: G.gold, draft: G.mut, expired: G.red, sold_out: G.red,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 28, background: G.gold, borderRadius: 2, boxShadow: `0 0 10px ${G.gold}` }} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: G.wht, lineHeight: 1 }}>SPRÁVA DEALŮ</h1>
          </div>
          <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.mut, textTransform: 'uppercase' }}>{total} dealů celkem</p>
        </div>
        <Link href="/admin/deals/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: `0 6px 20px ${G.gold}33` }}>
          ➕ Nový deal
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Celkem', value: total, color: G.wht, icon: '📋' },
          { label: 'Aktivní', value: active, color: G.grn, icon: '✅' },
          { label: 'VIP only', value: vipDeals, color: G.pur, icon: '👑' },
          { label: 'Draft', value: draft, color: G.mut, icon: '📝' },
        ].map(s => (
          <div key={s.label} style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,.02)' }}>
              {['Deal', 'Kategorie', 'Profit', 'Přístup', 'Status', 'Zobrazení', 'Akce'].map(h => (
                <th key={h} style={{ padding: '12px 14px', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${G.br}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(deals ?? []).map(deal => {
              const sc = statusColor[deal.status] ?? G.mut
              return (
                <tr key={deal.id} style={{ borderBottom: `1px solid rgba(255,255,255,.04)` }}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{deal.emoji || '💰'}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{deal.title}</div>
                        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>{new Date(deal.created_at).toLocaleDateString('cs-CZ')}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>{deal.category}</td>
                  <td style={{ padding: '11px 14px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: G.grn }}>
                    {deal.profit_amount ? `+${Number(deal.profit_amount).toLocaleString('cs-CZ')} Kč` : '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 5, background: deal.access_level === 'vip' ? 'rgba(155,93,229,.12)' : 'rgba(255,255,255,.05)', color: deal.access_level === 'vip' ? G.pur : G.mut, border: `1px solid ${deal.access_level === 'vip' ? 'rgba(155,93,229,.25)' : G.br}` }}>{deal.access_level}</span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 5, background: `${sc}12`, color: sc, border: `1px solid ${sc}28` }}>{deal.status}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontFamily: "'Syne Mono', monospace", fontSize: 10, color: G.mut }}>{deal.view_count ?? 0}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Link href={`/deals/${deal.slug}`} target="_blank" style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(77,159,255,.08)', border: `1px solid rgba(77,159,255,.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, textDecoration: 'none' }} title="Zobrazit">👁</Link>
                      <form action={toggleStatus} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={deal.id} />
                        <input type="hidden" name="status" value={deal.status} />
                        <button type="submit" style={{ width: 30, height: 30, borderRadius: 7, background: deal.status === 'active' ? 'rgba(0,230,118,.08)' : 'rgba(255,255,255,.05)', border: `1px solid ${deal.status === 'active' ? 'rgba(0,230,118,.2)' : G.br}`, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={deal.status === 'active' ? 'Deaktivovat' : 'Aktivovat'}>
                          {deal.status === 'active' ? '⏸' : '▶️'}
                        </button>
                      </form>
                      <form action={deleteDeal} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={deal.id} />
                        <button type="submit" onClick={e => { if (!confirm('Smazat deal?')) e.preventDefault() }} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,59,92,.06)', border: `1px solid rgba(255,59,92,.2)`, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Smazat">
                          🗑️
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
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: 'rgba(240,235,225,.2)' }}>ŽÁDNÉ DEALY</p>
          </div>
        )}
      </div>
    </div>
  )
}
