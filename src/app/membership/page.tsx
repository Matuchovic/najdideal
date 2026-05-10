import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Crown, Check, Zap, Shield, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'VIP Členství' }

const VIP_FEATURES = [
  { icon: '⚡', title: 'Nejrychlejší alerty', desc: 'Dealy dostaneš jako první, dřív než ostatní' },
  { icon: '👑', title: 'Všechny VIP dealy',   desc: 'Přístup k exkluzivním dealům s nejvyšším ziskem' },
  { icon: '🤖', title: 'AI příležitosti',      desc: 'Affiliate programy a pasivní příjmy přes AI' },
  { icon: '📈', title: 'Trend produkty',       desc: 'Produkty s rostoucím trendem před mainstream médii' },
  { icon: '👥', title: 'Soukromá komunita',    desc: 'Uzavřená komunita 2 341+ členů, kteří vydělávají' },
  { icon: '🔒', title: 'VIP obsah navíc',      desc: 'Návody, strategie a bonusový obsah pouze pro VIP' },
]

export default async function MembershipPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role,created_at').eq('id', user.id).single()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  return (
    <div className="pb-24 lg:pb-8 space-y-10">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
          <Crown className="w-4 h-4 text-gold-500" />
          <span className="font-heading text-xs font-700 text-gold-400 tracking-widest uppercase">VIP přístup</span>
        </div>
        <h1 className="font-display text-5xl lg:text-7xl tracking-widest text-white mb-4">
          VYBER SI SVŮJ<br /><span className="text-gradient-gold">PŘÍSTUP</span>
        </h1>
        <p className="font-body text-void-400 max-w-md mx-auto">Začni zdarma a kdykoliv přejdi na VIP. Zrušení bez závazků.</p>
      </div>

      {/* VIP active banner */}
      {isVip && (
        <div className="max-w-lg mx-auto p-5 rounded-2xl border border-gold-500/25 bg-gold-500/5 text-center">
          <Crown className="w-8 h-8 text-gold-500 mx-auto mb-3" />
          <h3 className="font-display text-2xl tracking-widest text-gold-400 mb-1">VIP PŘÍSTUP AKTIVNÍ</h3>
          <p className="font-body text-sm text-void-400">Máš plný přístup ke všem dealům a funkcím.</p>
        </div>
      )}

      {/* Plans */}
      {!isVip && (
        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Free */}
          <div className="card p-7">
            <div className="font-heading text-xs font-700 text-void-400 uppercase tracking-widest mb-1">FREE</div>
            <div className="font-body text-sm text-void-500 mb-5">Základní přístup navždy</div>
            <div className="font-display text-5xl tracking-widest text-white mb-6">0 <span className="text-2xl text-void-400">Kč</span></div>
            <ul className="space-y-3 mb-7">
              {['Základní dealy každý den', 'Free alerty', 'Komunita', 'Omezený přístup'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-void-400">
                  <Check className="w-4 h-4 text-void-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="btn btn-ghost w-full justify-center">Pokračovat zdarma</Link>
          </div>

          {/* VIP */}
          <div className="relative card p-7 border-gold-500/25 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,184,0,0.06) 0%, #141418 60%)' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-b-xl bg-gold-500 font-heading text-[10px] font-700 text-black tracking-widest uppercase">
              👑 Nejlepší volba
            </div>
            <div className="font-heading text-xs font-700 text-gold-400 uppercase tracking-widest mb-1 mt-3">VIP</div>
            <div className="font-body text-sm text-void-400 mb-5">Plný přístup – vše odemčeno</div>
            <div className="mb-1">
              <span className="font-display text-5xl tracking-widest text-gold-500">399</span>
              <span className="font-display text-2xl text-void-400"> Kč</span>
              <span className="font-heading text-sm text-void-500">/měsíc</span>
            </div>
            <div className="font-heading text-[10px] text-void-500 mb-6">Zrušení kdykoliv · bez závazků</div>
            <ul className="space-y-3 mb-7">
              {['Vše z Free', 'VIP dealy a alerty', 'AI příležitosti', 'Rychlé alerty jako první', 'Soukromá komunita', 'VIP obsah a bonusy'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-void-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className="btn btn-gold-lg w-full justify-center" onClick={() => alert('Platební brána bude brzy k dispozici!')}>
              <Crown className="w-4 h-4" /> Vstoupit do VIP <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Features grid */}
      <div>
        <h2 className="font-display text-3xl tracking-widest text-center text-white mb-8">CO ZÍSKÁŠ VE <span className="text-gradient-gold">VIP</span></h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIP_FEATURES.map(f => (
            <div key={f.title} className="card p-5 hover:border-gold-500/20">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-heading text-sm font-700 text-gold-400 uppercase tracking-wider mb-1">{f.title}</h3>
              <p className="font-body text-sm text-void-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap justify-center gap-8">
        {[[Shield, 'Bezpečná platba přes Stripe'], [Zap, 'Okamžitý přístup'], [Users, 'Zrušení kdykoliv']].map(([Icon, text]) => (
          <div key={text as string} className="flex items-center gap-2 text-sm text-void-400">
            <Check className="w-4 h-4 text-green-400" />
            {text as string}
          </div>
        ))}
      </div>
    </div>
  )
}
