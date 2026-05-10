import { createClient } from '@/lib/supabase/server'
import { Users, Tag, Zap, TrendingUp, Crown, Eye, PlusCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCZK, formatRelative } from '@/lib/utils'

export const metadata = { title: 'Admin – Přehled' }

export default async function AdminPage() {
  const supabase = createClient()

  const [
    { count: totalUsers },
    { count: vipUsers },
    { count: totalDeals },
    { count: activeDeals },
    { count: totalAlerts },
    { data: recentDeals },
    { data: recentUsers },
    { count: todayViews },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'vip'),
    supabase.from('deals').select('*', { count: 'exact', head: true }),
    supabase.from('deals').select('*', { count: 'exact', head: true }).in('status', ['active','featured']),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('deals').select('id,title,emoji,status,access_level,profit_amount,view_count,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('id,full_name,email,role,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('deal_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
  ])

  const STATS = [
    { label: 'Celkem uživatelů', value: totalUsers ?? 0,  icon: Users,     color: 'text-blue-400',  bg: 'bg-blue-400/10',  sub: `${vipUsers ?? 0} VIP` },
    { label: 'Celkem dealů',     value: totalDeals ?? 0,  icon: Tag,       color: 'text-gold-500',  bg: 'bg-gold-500/10',  sub: `${activeDeals ?? 0} aktivních` },
    { label: 'Aktivní alerty',   value: totalAlerts ?? 0, icon: Zap,       color: 'text-green-400', bg: 'bg-green-400/10', sub: 'Právě teď' },
    { label: 'Zobrazení dnes',   value: todayViews ?? 0,  icon: Eye,       color: 'text-purple-400',bg: 'bg-purple-400/10',sub: 'Za posledních 24h' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white mb-1">ADMIN PŘEHLED</h1>
          <p className="font-body text-void-400 text-sm">Správa celé NajdiDeal platformy</p>
        </div>
        <Link href="/admin/deals/new" className="btn btn-gold">
          <PlusCircle className="w-4 h-4" /> Nový deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="stat-card">
            <div className={`p-2 rounded-lg ${bg} w-fit mb-4`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`font-display text-4xl tracking-wider mb-1 ${color}`}>{value.toLocaleString('cs-CZ')}</div>
            <div className="font-heading text-xs text-void-400 uppercase tracking-wider mb-0.5">{label}</div>
            <div className="font-heading text-[10px] text-void-500">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { href: '/admin/deals/new', icon: PlusCircle, label: 'Přidat deal', color: 'text-gold-500' },
          { href: '/admin/alerts',    icon: Zap,         label: 'Správa alertů', color: 'text-green-400' },
          { href: '/admin/users',     icon: Crown,       label: 'VIP uživatelé', color: 'text-purple-400' },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href} className="card p-4 flex items-center gap-3 group hover:border-white/10">
            <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
            <span className="font-heading text-sm font-700 text-void-300 group-hover:text-white transition-colors">{label}</span>
            <ArrowRight className="w-3.5 h-3.5 text-void-500 ml-auto group-hover:text-void-300 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent deals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Nejnovější dealy</h2>
            <Link href="/admin/deals" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider">Správa →</Link>
          </div>
          <div className="space-y-2">
            {(recentDeals ?? []).map(deal => (
              <Link key={deal.id} href={`/admin/deals`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-void-800/50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-void-800 flex items-center justify-center text-lg flex-shrink-0">{deal.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-600 text-void-200 truncate">{deal.title}</p>
                  <p className="font-heading text-[11px] text-void-500">{formatRelative(deal.created_at)}</p>
                </div>
                {deal.profit_amount && <span className="font-display text-sm text-green-400">+{formatCZK(deal.profit_amount)}</span>}
                <span className={`badge ${deal.access_level === 'vip' ? 'badge-vip' : 'badge-free'} flex-shrink-0`}>{deal.access_level}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider">Noví uživatelé</h2>
            <Link href="/admin/users" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider">Správa →</Link>
          </div>
          <div className="space-y-2">
            {(recentUsers ?? []).map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-void-800/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center font-heading text-sm font-700 text-gold-400 flex-shrink-0">
                  {u.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-600 text-void-200 truncate">{u.full_name ?? 'Uživatel'}</p>
                  <p className="font-heading text-[11px] text-void-500 truncate">{u.email}</p>
                </div>
                <span className={`badge ${u.role === 'vip' ? 'badge-vip' : u.role === 'admin' ? 'badge-admin' : 'badge-free'} flex-shrink-0`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
