import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { UserRole } from '@/lib/types'

const G = {
  gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF',
  pur: '#9B5DE5', red: '#FF3B5C', wht: '#F0EBE1',
  mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.03)',
  br: 'rgba(255,255,255,.07)',
}

export const metadata = { title: 'Admin – Uživatelé' }

async function changeRole(formData: FormData) {
  'use server'
  const supabase = createClient()
  const userId = formData.get('user_id') as string
  const role = formData.get('role') as UserRole
  await supabase.from('profiles').update({ role }).eq('id', userId)
  if (role === 'vip') {
    const expires = new Date()
    expires.setMonth(expires.getMonth() + 1)
    await supabase.from('memberships').upsert({
      user_id: userId, status: 'active', plan: 'vip_monthly',
      started_at: new Date().toISOString(), expires_at: expires.toISOString(),
    }, { onConflict: 'user_id' })
    await supabase.from('notifications').insert({
      user_id: userId, type: 'membership',
      title: '👑 VIP přístup aktivován!',
      body: 'Tvůj VIP přístup byl aktivován. Vítej mezi elitou!',
      link: '/dashboard',
    })
  }
  revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
  const supabase = createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  const total = users?.length ?? 0
  const vipCount = users?.filter(u => u.role !== 'free' && u.role !== 'admin').length ?? 0
  const adminCount = users?.filter(u => u.role === 'admin').length ?? 0
  const freeCount = users?.filter(u => u.role === 'free').length ?? 0

  const roleColor: Record<string, string> = {
    admin: G.gold, vip: G.pur, vip_pro: G.blu,
    vip_ultra: G.blu, vip_max: G.blu, free: G.mut,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 3, height: 28, background: G.blu, borderRadius: 2, boxShadow: `0 0 10px ${G.blu}` }} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: G.wht, lineHeight: 1 }}>UŽIVATELÉ</h1>
        </div>
        <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.mut, textTransform: 'uppercase' }}>{total} registrovaných uživatelů</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Free', value: freeCount, color: G.mut, icon: '🔓' },
          { label: 'Platící', value: vipCount, color: G.gold, icon: '👑' },
          { label: 'Admin', value: adminCount, color: G.red, icon: '🔧' },
        ].map(s => (
          <div key={s.label} style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}14`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 2, color: s.color, lineHeight: 1 }}>{s.value}</div>
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
              {['Uživatel', 'Role', 'Uložené dealy', 'Registrace', 'Poslední aktivita', 'Změnit roli'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, textAlign: 'left', fontWeight: 700, borderBottom: `1px solid ${G.br}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map(u => {
              const rc = roleColor[u.role] ?? G.mut
              return (
                <tr key={u.id} style={{ borderBottom: `1px solid rgba(255,255,255,.04)` }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${rc}15`, border: `1px solid ${rc}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: rc, flexShrink: 0 }}>
                        {(u.full_name || u.email || 'U')[0].toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name || '—'}</div>
                        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 9px', borderRadius: 6, background: `${rc}14`, color: rc, border: `1px solid ${rc}28` }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 11, color: G.mut }}>{u.deals_saved ?? 0}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>{new Date(u.created_at).toLocaleDateString('cs-CZ')}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>{u.last_active ? new Date(u.last_active).toLocaleDateString('cs-CZ') : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <form action={changeRole} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="hidden" name="user_id" value={u.id} />
                      <select name="role" defaultValue={u.role} style={{ padding: '6px 10px', background: 'rgba(255,255,255,.05)', border: `1px solid ${G.br}`, borderRadius: 7, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.wht, outline: 'none' }}>
                        <option value="free">Free</option>
                        <option value="vip">Standard</option>
                        <option value="vip_pro">Premium</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" style={{ padding: '6px 12px', background: 'rgba(240,180,41,.1)', border: `1px solid rgba(240,180,41,.25)`, borderRadius: 7, fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: G.gold, cursor: 'pointer' }}>
                        Uložit
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(users ?? []).length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: "'Syne Mono', monospace", fontSize: 10, color: G.mut, letterSpacing: 2, textTransform: 'uppercase' }}>Žádní uživatelé</div>
        )}
      </div>
    </div>
  )
}
