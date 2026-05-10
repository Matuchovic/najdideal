'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Crown, TrendingUp, Bookmark, Bell, Zap, ArrowRight, Flame, Star } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null as any)
  const [deals, setDeals] = useState([] as any[])
  const [alerts, setAlerts] = useState([] as any[])
  const [savedCount, setSavedCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const [profileRes, dealsRes, savedRes, notifsRes, alertsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('deals').select('*').in('status', ['active', 'featured']).order('created_at', { ascending: false }).limit(6),
        supabase.from('saved_deals').select('deal_id').eq('user_id', user.id),
        supabase.from('notifications').select('id').eq('user_id', user.id).eq('is_read', false),
        supabase.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(3),
      ])
      setProfile(profileRes.data)
      setDeals(dealsRes.data ?? [])
      setSavedCount(savedRes.data?.length ?? 0)
      setUnreadCount(notifsRes.data?.length ?? 0)
      setAlerts(alertsRes.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{width:'40px',height:'40px',border:'2px solid rgba(240,180,41,.2)',borderTop:'2px solid #F0B429',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
      <style>{'.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  )

  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  const stats = [
    { label: 'Dostupné dealy', value: deals.length.toString(), icon: TrendingUp, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Uložené dealy', value: savedCount.toString(), icon: Bookmark, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Nová oznámení', value: unreadCount.toString(), icon: Bell, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Členství', value: (profile?.role ?? 'FREE').toUpperCase(), icon: Crown, color: isVip ? 'text-gold-500' : 'text-void-400', bg: isVip ? 'bg-gold-500/10' : 'bg-void-800' },
  ]

  return (
    <div className="space-y-8 pb-24 lg:pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white mb-1">
            VITEJ, <span className="text-gold-500">{profile?.full_name?.split(' ')[0]?.toUpperCase() ?? 'CLENE'}</span>
          </h1>
          <p className="font-body text-void-400 text-sm">
            {isVip ? '👑 VIP pristup aktivni' : 'Free pristup'}
          </p>
        </div>
        {!isVip && (
          <Link href="/membership" className="btn btn-gold hidden sm:flex">
            <Crown className="w-4 h-4" />
            Upgradovat na VIP
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={"p-2 rounded-lg " + bg}>
                <Icon className={"w-4 h-4 " + color} />
              </div>
            </div>
            <div className={"font-display text-3xl tracking-wider mb-1 " + color}>{value}</div>
            <div className="font-heading text-xs text-void-400 tracking-wider uppercase">{label}</div>
          </div>
        ))}
      </div>

      {!isVip && (
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-gold-500" />
                <span className="font-heading text-sm text-gold-400 tracking-wider uppercase">Odemkni VIP pristup</span>
              </div>
              <h3 className="font-display text-2xl tracking-widest text-white mb-1">ZISKEJ NEJLEPSI DEALY JAKO PRVNI</h3>
              <p className="font-body text-void-400 text-sm">VIP dealy, rychle alerty, AI prilezitosti za 399 Kc/mesic</p>
            </div>
            <Link href="/membership" className="btn btn-gold-lg flex-shrink-0">
              <Crown className="w-4 h-4" />
              Vstoupit do VIP
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="live-dot" />
              <h2 className="font-heading text-lg tracking-wider text-white uppercase">Live Alerty</h2>
            </div>
            <Link href="/alerts" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider uppercase">
              Vsechny →
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="card p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-void-800 flex items-center justify-center flex-shrink-0 text-xl">
                  {alert.type === 'vip' ? '👑' : alert.type === 'ai' ? '🤖' : alert.type === 'trend' ? '📈' : '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm text-white truncate mb-1">{alert.title}</h3>
                  <p className="font-body text-xs text-void-400 line-clamp-2">{alert.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg tracking-wider text-white uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 text-gold-500" />
            {isVip ? 'Nejnovejsi dealy' : 'Free dealy'}
          </h2>
          <Link href="/deals" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider uppercase">
            Zobrazit vse →
          </Link>
        </div>
        {deals.length === 0 && (
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-void-900/50 text-center">
            <p className="text-void-400 text-sm">Zatim zadne dealy. Brzy pridame prvni!</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {deals.map((deal: any) => (
            <Link key={deal.id} href={"/deals/" + deal.slug} className="card p-5 block hover:border-gold-500/20 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-void-800 flex items-center justify-center text-xl flex-shrink-0">
                  {deal.emoji ?? '💰'}
                </div>
                <div>
                  <h3 className="font-heading text-sm text-white font-600 mb-1">{deal.title}</h3>
                  <span className="font-heading text-xs text-gold-500 tracking-wider uppercase">{deal.category}</span>
                </div>
              </div>
              {deal.profit_amount && (
                <div className="text-green-400 font-display text-2xl">
                  +{deal.profit_amount.toLocaleString('cs-CZ')} Kc
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}