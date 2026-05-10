import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Crown, Users, Shield } from 'lucide-react'
import { formatDate, formatRelative } from '@/lib/utils'
import type { UserRole } from '@/lib/types'
import { ROLE_META } from '@/lib/types'

export const metadata = { title: 'Admin – Uživatelé' }

async function changeRole(formData: FormData) {
  'use server'
  const supabase = createClient()
  const userId = formData.get('user_id') as string
  const role   = formData.get('role') as UserRole
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

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const totalUsers = users?.length ?? 0
  const vipCount   = users?.filter(u => u.role === 'vip').length ?? 0
  const adminCount = users?.filter(u => u.role === 'admin').length ?? 0
  const freeCount  = users?.filter(u => u.role === 'free').length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white">UŽIVATELÉ</h1>
          <p className="font-body text-void-400 text-sm mt-1">{totalUsers} registrovaných uživatelů</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Free uživatelé', value: freeCount,  color: 'text-void-300', bg: 'bg-void-700/50', icon: Users },
          { label: 'VIP členové',    value: vipCount,   color: 'text-gold-500', bg: 'bg-gold-500/10', icon: Crown },
          { label: 'Admini',         value: adminCount, color: 'text-red-400',  bg: 'bg-red-400/10',  icon: Shield },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="stat-card flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div>
              <div className={`font-display text-3xl ${color}`}>{value}</div>
              <div className="font-heading text-xs text-void-500 uppercase tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Uživatel</th>
              <th>Role</th>
              <th>Uložené dealy</th>
              <th>Aktivní od</th>
              <th>Naposledy aktivní</th>
              <th>Změnit roli</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map(user => {
              const rm = ROLE_META[user.role as UserRole]
              return (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/15 flex items-center justify-center font-heading text-sm font-700 text-gold-400 flex-shrink-0">
                        {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-600 text-void-200 truncate">{user.full_name ?? '—'}</p>
                        <p className="font-heading text-xs text-void-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'vip' ? 'badge-vip' : user.role === 'admin' ? 'badge-admin' : 'badge-free'}`}>
                      {rm.icon} {rm.label}
                    </span>
                  </td>
                  <td>
                    <span className="font-heading text-sm text-void-300">{user.deals_saved}</span>
                  </td>
                  <td>
                    <span className="font-heading text-xs text-void-500">{formatDate(user.created_at)}</span>
                  </td>
                  <td>
                    <span className="font-heading text-xs text-void-500">{formatRelative(user.last_active)}</span>
                  </td>
                  <td>
                    <form action={changeRole} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={user.id} />
                      <select name="role" defaultValue={user.role} className="input py-1.5 px-2 text-xs bg-void-800 w-28">
                        <option value="free">Free</option>
                        <option value="vip">VIP</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="btn btn-ghost py-1.5 px-3 text-xs">
                        Uložit
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
