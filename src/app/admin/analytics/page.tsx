import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Users, Eye, Tag, BarChart3 } from 'lucide-react'
import { formatCZK } from '@/lib/utils'

export const metadata = { title: 'Admin – Analytika' }

export default async function AdminAnalyticsPage() {
  const supabase = createClient()

  const now = new Date()
  const day7  = new Date(now.getTime() - 7  * 86400000).toISOString()
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString()
  const today = new Date(now.getTime() -      86400000).toISOString()

  const [
    { count: users30 },
    { count: users7  },
    { count: usersToday },
    { count: vipTotal },
    { count: views30 },
    { count: viewsToday },
    { count: deals30 },
    { data: topDeals },
    { data: dealsByCategory },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count:'exact', head:true }).gte('created_at', day30),
    supabase.from('profiles').select('*', { count:'exact', head:true }).gte('created_at', day7),
    supabase.from('profiles').select('*', { count:'exact', head:true }).gte('created_at', today),
    supabase.from('profiles').select('*', { count:'exact', head:true }).eq('role','vip'),
    supabase.from('deal_views').select('*', { count:'exact', head:true }).gte('created_at', day30),
    supabase.from('deal_views').select('*', { count:'exact', head:true }).gte('created_at', today),
    supabase.from('deals').select('*', { count:'exact', head:true }).gte('created_at', day30),
    supabase.from('deals').select('id,title,emoji,view_count,save_count,profit_amount').order('view_count', { ascending:false }).limit(10),
    supabase.from('deals').select('category').in('status',['active','featured']),
  ])

  // Category breakdown
  const catCount: Record<string, number> = {}
  ;(dealsByCategory ?? []).forEach(d => {
    catCount[d.category] = (catCount[d.category] ?? 0) + 1
  })
  const catEntries = Object.entries(catCount).sort((a,b) => b[1] - a[1])
  const totalCatDeals = catEntries.reduce((s,[,v]) => s+v, 0)

  const STAT_BLOCKS = [
    { label:'Noví uživatelé (30d)', value: users30 ?? 0,    sub:`${users7 ?? 0} za 7 dní · ${usersToday ?? 0} dnes`,  color:'text-blue-400',  icon: Users },
    { label:'VIP členů celkem',     value: vipTotal ?? 0,   sub:'Platící členové',                                      color:'text-gold-500',  icon: TrendingUp },
    { label:'Zobrazení dealů (30d)',value: views30 ?? 0,    sub:`${viewsToday ?? 0} zobrazení dnes`,                   color:'text-green-400', icon: Eye },
    { label:'Nové dealy (30d)',      value: deals30 ?? 0,   sub:'Za posledních 30 dní',                                 color:'text-purple-400',icon: Tag },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white">ANALYTIKA</h1>
        <p className="font-body text-void-400 text-sm mt-1">Přehled výkonu platformy</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_BLOCKS.map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`font-display text-4xl tracking-wider mb-1 ${color}`}>
              {value.toLocaleString('cs-CZ')}
            </div>
            <div className="font-heading text-xs text-void-400 uppercase tracking-wider mb-1">{label}</div>
            <div className="font-heading text-[10px] text-void-500">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top deals by views */}
        <div className="card p-5">
          <h2 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Top dealy (zobrazení)
          </h2>
          <div className="space-y-3">
            {(topDeals ?? []).map((deal, i) => (
              <div key={deal.id} className="flex items-center gap-3">
                <div className="font-display text-lg text-void-600 w-6 text-center flex-shrink-0">
                  {i + 1}
                </div>
                <div className="w-9 h-9 rounded-xl bg-void-800 flex items-center justify-center text-lg flex-shrink-0">
                  {deal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-600 text-void-200 truncate">{deal.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-heading text-xs text-void-500 flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />{deal.view_count}
                    </span>
                    <span className="font-heading text-xs text-void-500">
                      💾 {deal.save_count}
                    </span>
                  </div>
                </div>
                {deal.profit_amount && (
                  <span className="font-display text-sm text-green-400 flex-shrink-0">
                    +{formatCZK(deal.profit_amount)}
                  </span>
                )}
              </div>
            ))}
            {(topDeals ?? []).length === 0 && (
              <p className="font-body text-sm text-void-500 text-center py-6">Žádná data</p>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <h2 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Dealy dle kategorie
          </h2>
          <div className="space-y-3">
            {catEntries.map(([cat, count]) => {
              const pct = totalCatDeals > 0 ? Math.round((count / totalCatDeals) * 100) : 0
              const LABELS: Record<string, string> = {
                marketplace_flip: '🔄 Marketplace Flip',
                ai_opportunity:   '🤖 AI Příležitost',
                trend_product:    '📈 Trend Produkt',
                profit_alert:     '⚡ Profit Alert',
                affiliate:        '💎 Affiliate',
                dropshipping:     '📦 Dropshipping',
                crypto:           '₿ Krypto',
                other:            '🎯 Ostatní',
              }
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading text-xs font-600 text-void-300">{LABELS[cat] ?? cat}</span>
                    <span className="font-heading text-xs text-void-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-void-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {catEntries.length === 0 && (
              <p className="font-body text-sm text-void-500 text-center py-6">Žádná data</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue estimate */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="font-heading text-xs text-void-400 uppercase tracking-wider mb-1">Odhadovaný měsíční příjem</div>
            <div className="font-display text-5xl text-gold-500">
              {formatCZK((vipTotal ?? 0) * 399)}
            </div>
            <div className="font-heading text-xs text-void-500 mt-1">{vipTotal ?? 0} VIP členů × 399 Kč</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <div className="font-display text-2xl text-white">{formatCZK((vipTotal ?? 0) * 399 * 12)}</div>
              <div className="font-heading text-[10px] text-void-500 uppercase tracking-wider">ARR (roční)</div>
            </div>
            <div>
              <div className="font-display text-2xl text-green-400">399 Kč</div>
              <div className="font-heading text-[10px] text-void-500 uppercase tracking-wider">MRR za člena</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
