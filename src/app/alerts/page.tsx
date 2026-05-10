import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Zap, Star, Crown, Lock, ArrowRight } from 'lucide-react'
import { formatRelative } from '@/lib/utils'
import { ALERT_TYPE_META } from '@/lib/types'

export const metadata = { title: 'Alerty' }

export default async function AlertsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  const visible   = (alerts ?? []).filter(a => a.access_level === 'free' || isVip)
  const lockedCnt = (alerts ?? []).filter(a => a.access_level === 'vip' && !isVip).length

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="live-dot" />
            <span className="font-heading text-xs text-void-400 tracking-wider">Live · aktualizováno před 2 min</span>
          </div>
          <h1 className="font-display text-4xl tracking-widest text-white">ALERTY</h1>
          <p className="font-body text-void-400 text-sm mt-1">{visible.length} aktivních alertů{lockedCnt > 0 && ` · ${lockedCnt} VIP uzamčeno`}</p>
        </div>
        {!isVip && <Link href="/membership" className="btn btn-gold"><Crown className="w-4 h-4" />VIP přístup</Link>}
      </div>

      {/* VIP upsell banner */}
      {!isVip && lockedCnt > 0 && (
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="relative flex items-center gap-4">
            <Lock className="w-8 h-8 text-gold-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-heading text-sm font-700 text-gold-400 uppercase tracking-wider mb-0.5">{lockedCnt} VIP alertů uzamčeno</h3>
              <p className="font-body text-xs text-void-400">Získej přístup k exkluzivním VIP alertům za 399 Kč/měsíc</p>
            </div>
            <Link href="/membership" className="btn btn-gold flex-shrink-0">
              Odemknout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Alerts list */}
      <div className="space-y-3">
        {visible.map(alert => {
          const meta = ALERT_TYPE_META[alert.type as keyof typeof ALERT_TYPE_META]
          return (
            <div key={alert.id} className={`card p-5 relative overflow-hidden transition-all ${alert.is_pinned ? 'border-gold-500/20' : ''}`}>
              {alert.is_pinned && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              )}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-base font-700 text-white">{alert.title}</h3>
                      {alert.is_pinned && <Star className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />}
                      {alert.access_level === 'vip' && <span className="badge badge-vip">👑 VIP</span>}
                      <span className="badge" style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}>
                        {meta.label}
                      </span>
                    </div>
                    <span className="font-heading text-xs text-void-500 flex-shrink-0">{formatRelative(alert.created_at)}</span>
                  </div>
                  <p className="font-body text-sm text-void-400 leading-relaxed">{alert.body}</p>
                  {alert.cta_url && (
                    <a href={alert.cta_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 font-heading text-xs font-700 text-gold-500 hover:text-gold-400 tracking-wider uppercase transition-colors">
                      {alert.cta_text ?? 'Zobrazit detail'} <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-20">
          <Zap className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-700 text-void-400 mb-2">Žádné aktivní alerty</h3>
          <p className="font-body text-sm text-void-500">Nové alerty přidáváme každý den. Brzy se vrať!</p>
        </div>
      )}
    </div>
  )
}
