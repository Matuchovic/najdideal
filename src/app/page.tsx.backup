import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Crown, Zap, TrendingUp, Users, Shield, ArrowRight,
  Star, CheckCircle, ChevronDown
} from 'lucide-react'

export const metadata = {
  title: 'NajdiDeal – Najdi deal dřív než ostatní',
  description: 'Denně filtrujeme stovky nabídek. Ty dostaneš jen ty nejlepší dealy jako první.',
}

const STATS = [
  { value: '247',     label: 'Dealů za měsíc' },
  { value: '4 235 Kč', label: 'Průměrný profit' },
  { value: '18 900 Kč',label: 'Největší profit' },
  { value: '2 341+',  label: 'Spokojených členů' },
]

const VIP_FEATURES = [
  { icon: '⚡', title: 'Nejrychlejší alerty',  desc: 'Dealy dostaneš jako první. Rychlost = profit.' },
  { icon: '👑', title: 'Exkluzivní VIP dealy', desc: 'Přístup k dealům s nejvyšším profit potenciálem.' },
  { icon: '🤖', title: 'AI příležitosti',      desc: 'Affiliate programy a pasivní příjem přes AI.' },
  { icon: '📈', title: 'Trend produkty',       desc: 'Trendy před mainstream médii – ideální pro dropshipping.' },
  { icon: '👥', title: 'Soukromá komunita',    desc: 'Uzavřená komunita lidí, kteří opravdu vydělávají.' },
  { icon: '🔒', title: 'VIP obsah navíc',      desc: 'Návody, strategie a bonusy jen pro VIP členy.' },
]

const TESTIMONIALS = [
  { name: 'Tomáš P.', text: 'Díky NajdiDeal jsem vydělal přes 28 000 Kč. Nejlepší komunita, kterou znám!', profit: '+28 000 Kč' },
  { name: 'Martin V.', text: 'Dealy chodí rychle a jsou prověřené. Flipuju každý týden, funguje to skvěle.', profit: '+12 500 Kč' },
  { name: 'Eliška R.', text: 'AI příležitosti mi přinášejí stabilní pasivní příjem každý měsíc.', profit: '+8 400 Kč' },
]

const TICKER_ITEMS = [
  '📱 iPhone 15 Pro +7 000 Kč', '🤖 AI Affiliate 35% provize', '🎮 RTX 3060 +3 300 Kč',
  '💻 MacBook Air M2 +8 990 Kč', '🎧 AirPods Pro 2 +2 790 Kč', '📈 Trend +278%',
  '🔄 PS5 +3 500 Kč', '💎 Jasper AI 30% provize',
]

const FREE_FEATURES  = ['Základní dealy každý den', 'Free alerty', 'Komunita přístup', 'Upgrade kdykoliv']
const VIP_PLAN_FEATS = ['Vše z Free', 'VIP dealy a alerty', 'AI příležitosti', 'Rychlé alerty jako první', 'Soukromá komunita', 'VIP obsah a bonusy']

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: featuredDeals } = await supabase
    .from('deals')
    .select('id,title,emoji,category,access_level,profit_amount,profit_percent,trend_percent,source_name,buy_price,sell_price,is_hot,is_featured,slug')
    .in('status', ['active', 'featured'])
    .eq('access_level', 'free')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-void-1000 overflow-x-hidden">

      {/* ── NAV ───────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="absolute inset-0 bg-void-1000/80 backdrop-blur-2xl border-b border-white/[0.05]" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center font-display text-lg text-black relative overflow-hidden">
              <span className="relative z-10">ND</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
            </div>
            <span className="font-display text-xl tracking-widest text-white">NAJDI<span className="text-gold-500">DEAL</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[['#deals','Dealy'],['#vip','VIP'],['#pricing','Ceny'],['#reviews','Recenze']].map(([h,l]) => (
              <a key={h} href={h} className="font-heading text-xs font-600 text-void-400 hover:text-white tracking-wider uppercase transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn btn-gold py-2.5 px-5 text-sm">
                Přejít do aplikace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login"    className="font-heading text-xs font-600 text-void-400 hover:text-white tracking-wider uppercase transition-colors hidden sm:block">Přihlásit se</Link>
                <Link href="/register" className="btn btn-gold py-2.5 px-5 text-sm"><Crown className="w-3.5 h-3.5" />Začít zdarma</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-1/4 left-1/6 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: '2s' }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(245,184,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,184,0,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 60% 40%,black 20%,transparent 80%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20">
                <div className="live-dot w-1.5 h-1.5" />
                <span className="font-heading text-xs font-700 text-gold-400 tracking-widest uppercase">2 341+ aktivních členů</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 text-gold-500 fill-gold-500" />)}
                <span className="font-heading text-xs text-void-400 ml-1">4.9/5</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-display tracking-widest leading-none mb-6">
              <span className="block text-[clamp(64px,10vw,130px)] text-white">NAJDI DEAL</span>
              <span className="block text-[clamp(64px,10vw,130px)]" style={{ WebkitTextStroke: '1px rgba(245,184,0,0.4)', color: 'transparent' }}>DŘÍV NEŽ</span>
              <span className="block text-[clamp(64px,10vw,130px)] text-gradient-gold">OSTATNÍ.</span>
            </h1>

            <p className="font-body text-lg text-void-400 leading-relaxed max-w-xl mb-10 font-light">
              Denně filtrujeme <span className="text-white font-medium">stovky nabídek</span> a online příležitostí.
              Ty dostaneš jen ty <span className="text-white font-medium">nejlepší dealy jako první</span>.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/register" className="btn btn-gold-lg">
                <Crown className="w-4 h-4" />
                Začít zdarma
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#deals" className="btn btn-outline py-4 px-8">
                Prohlédnout dealy
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {['T','M','E','J','K','O'].map((l,i) => (
                  <div key={i} className="w-9 h-9 rounded-xl bg-gold-500/15 border-2 border-void-1000 flex items-center justify-center font-display text-sm text-gold-400"
                    style={{ marginLeft: i === 0 ? 0 : -10 }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 text-gold-500 fill-gold-500" />)}
                </div>
                <p className="font-body text-xs text-void-400">Připojilo se již <span className="text-white font-semibold">2 341+</span> členů</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-500/40" />
          <ChevronDown className="w-4 h-4 text-void-500" />
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────── */}
      <div className="border-y border-white/[0.05] bg-void-950/50 overflow-hidden py-3">
        <div className="ticker-track flex gap-0 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item inline-flex items-center gap-3 px-8 font-heading text-sm font-600 text-void-400">
              {item}
              <span className="text-gold-500/30">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.05]">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-void-950 p-10 text-center group hover:bg-void-900 transition-colors">
                <div className="font-display text-5xl lg:text-6xl text-gold-500 mb-2 group-hover:text-gold-400 transition-colors">{value}</div>
                <div className="font-heading text-xs text-void-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEALS ────────────────────────────────── */}
      <section id="deals" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="live-dot" />
                <span className="font-heading text-xs text-void-400 tracking-widest uppercase">Live · Aktualizováno před 2 min</span>
              </div>
              <h2 className="font-display text-5xl lg:text-7xl tracking-widest text-white">LIVE <span className="text-gradient-gold">DEALY</span></h2>
              <p className="font-body text-void-400 mt-2">Nejnovější příležitosti – volně dostupné pro všechny</p>
            </div>
            <Link href="/register" className="btn btn-outline">
              Zobrazit vše <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(featuredDeals ?? []).map(deal => {
              const CATS: Record<string,{label:string;icon:string;cls:string}> = {
                marketplace_flip: { label:'Marketplace Flip', icon:'🔄', cls:'badge-gold' },
                ai_opportunity:   { label:'AI Příležitost',   icon:'🤖', cls:'badge-blue' },
                trend_product:    { label:'Trend Produkt',    icon:'📈', cls:'badge-green' },
                profit_alert:     { label:'Profit Alert',     icon:'⚡', cls:'badge-red' },
                affiliate:        { label:'Affiliate',        icon:'💎', cls:'badge-purple' },
              }
              const cat = CATS[deal.category] ?? { label:'Deal', icon:'💰', cls:'badge-gray' }
              return (
                <Link key={deal.id} href="/register" className="group block">
                  <div className="card p-5 h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/60 transition-all duration-500" />
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`badge ${cat.cls} mb-2 block w-fit`}>{cat.icon} {cat.label}</span>
                        <div className="w-12 h-12 rounded-xl bg-void-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {deal.emoji}
                        </div>
                      </div>
                      {deal.is_hot && <span className="badge badge-red">🔥 Hot</span>}
                    </div>
                    <h3 className="font-heading text-base font-700 text-void-200 group-hover:text-gold-400 transition-colors mb-3 line-clamp-2">{deal.title}</h3>
                    <div className="space-y-1.5 mb-4">
                      {deal.buy_price  && <div className="flex justify-between text-xs"><span className="text-void-500 font-heading uppercase tracking-wider">Koupeno za</span><span className="text-gold-500 font-heading font-700">{deal.buy_price.toLocaleString('cs-CZ')} Kč</span></div>}
                      {deal.sell_price && <div className="flex justify-between text-xs"><span className="text-void-500 font-heading uppercase tracking-wider">Tržní cena</span><span className="text-void-300 font-heading">{deal.sell_price.toLocaleString('cs-CZ')} Kč</span></div>}
                      {deal.trend_percent && <div className="flex justify-between text-xs"><span className="text-void-500 font-heading uppercase tracking-wider">Trend</span><span className="text-green-400 font-heading font-700">+{deal.trend_percent}%</span></div>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <span className="font-heading text-[11px] text-void-500 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />{deal.source_name}
                      </span>
                      {deal.profit_amount ? (
                        <span className="font-display text-2xl text-green-400">+{deal.profit_amount.toLocaleString('cs-CZ')} Kč</span>
                      ) : deal.profit_percent ? (
                        <span className="font-display text-2xl text-gold-500">{deal.profit_percent}%</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              )
            })}
            {(!featuredDeals || featuredDeals.length === 0) && (
              /* Placeholder cards */
              [...Array(6)].map((_,i) => (
                <div key={i} className="card p-5 h-48">
                  <div className="h-5 w-24 rounded shimmer mb-3" />
                  <div className="w-12 h-12 rounded-xl shimmer mb-4" />
                  <div className="h-4 w-3/4 rounded shimmer mb-2" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/register" className="btn btn-gold-lg">
              <Crown className="w-4 h-4" />
              Registrovat se a vidět všechny dealy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIP FEATURES ──────────────────────────────── */}
      <section id="vip" className="py-24 bg-void-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
              <Crown className="w-4 h-4 text-gold-500" />
              <span className="font-heading text-xs font-700 text-gold-400 tracking-widest uppercase">VIP přístup</span>
            </div>
            <h2 className="font-display text-5xl lg:text-7xl tracking-widest text-white mb-4">
              CO ZÍSKÁŠ<br /><span className="text-gradient-gold">VE VIP?</span>
            </h2>
            <p className="font-body text-void-400 max-w-lg mx-auto">Exkluzivní přístup k nejlepším dealům, AI příležitostem a soukromé komunitě.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIP_FEATURES.map((f, i) => (
              <div key={f.title} className="card p-6 group relative overflow-hidden">
                <div className="absolute top-3 right-4 font-display text-7xl text-white/[0.03] group-hover:text-white/[0.05] transition-colors leading-none select-none">
                  {String(i+1).padStart(2,'0')}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/15 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-heading text-sm font-700 text-gold-400 uppercase tracking-wider mb-2">{f.title}</h3>
                <p className="font-body text-sm text-void-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF / TESTIMONIALS ──────────────────────── */}
      <section id="reviews" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Proof numbers */}
            <div>
              <h2 className="font-display text-5xl tracking-widest text-white mb-3">
                DŮKAZY,<br />NE <span className="text-gradient-gold">SLOVA.</span>
              </h2>
              <p className="font-body text-void-400 mb-10">Skutečné profity našich členů za posledních 30 dní</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { amt:'+8 200 Kč', name:'iPhone 14 Pro',    time:'1 den' },
                  { amt:'+5 600 Kč', name:'MacBook Air M1',   time:'2 dny' },
                  { amt:'+3 450 Kč', name:'PS5 Disc Edition', time:'1 den' },
                  { amt:'+6 900 Kč', name:'RTX 3060 Ti',      time:'1 den' },
                ].map(({ amt, name, time }) => (
                  <div key={name} className="card p-4 relative overflow-hidden group hover:border-green-400/20">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-400" />
                    <div className="font-display text-2xl text-green-400 mb-1 group-hover:scale-105 transition-transform origin-left">{amt}</div>
                    <div className="font-heading text-xs font-600 text-void-300">{name}</div>
                    <div className="font-heading text-[10px] text-void-500 mt-0.5">⏱ Otočeno za {time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="card p-5 relative overflow-hidden group hover:border-gold-500/15">
                  <div className="absolute top-4 right-5 font-display text-6xl text-gold-500/[0.06] leading-none select-none">"</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/20 flex items-center justify-center font-display text-lg text-gold-400 flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-700 text-white">{t.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(5)].map((_,i) => <Star key={i} className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />)}
                      </div>
                    </div>
                    <span className="ml-auto font-display text-lg text-green-400">{t.profit}</span>
                  </div>
                  <p className="font-body text-sm text-void-400 leading-relaxed italic">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-void-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl lg:text-7xl tracking-widest text-white mb-4">
              VYBER SI<br /><span className="text-gradient-gold">PŘÍSTUP</span>
            </h2>
            <p className="font-body text-void-400">Začni zdarma · Zruš kdykoliv · Bez závazků</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free */}
            <div className="card p-8">
              <div className="font-heading text-xs text-void-400 uppercase tracking-widest mb-1">FREE</div>
              <div className="font-body text-xs text-void-500 mb-6">Základní přístup navždy</div>
              <div className="font-display text-6xl text-white mb-8">0 <span className="text-3xl text-void-400">Kč</span></div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-body text-sm text-void-400">
                    <CheckCircle className="w-4 h-4 text-void-500 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-ghost w-full justify-center">Začít zdarma</Link>
            </div>

            {/* VIP */}
            <div className="relative card p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,184,0,0.07) 0%, #141418 60%)', borderColor: 'rgba(245,184,0,0.25)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
              <div className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl bg-gold-500">
                <span className="font-heading text-[10px] font-700 text-black tracking-widest uppercase">👑 Nejlepší volba</span>
              </div>
              <div className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-1 mt-3">VIP</div>
              <div className="font-body text-xs text-void-400 mb-6">Plný přístup – vše odemčeno</div>
              <div className="mb-1">
                <span className="font-display text-6xl text-gold-500">399</span>
                <span className="font-display text-3xl text-void-400"> Kč</span>
                <span className="font-heading text-sm text-void-500">/měsíc</span>
              </div>
              <div className="font-heading text-[10px] text-void-500 mb-8">Zrušení kdykoliv</div>
              <ul className="space-y-3 mb-8">
                {VIP_PLAN_FEATS.map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-body text-sm text-void-200">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-gold-lg w-full justify-center">
                <Crown className="w-4 h-4" />
                Vstoupit do VIP
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              [Shield,  'Bezpečná platba'],
              [Zap,     'Okamžitý přístup'],
              [Users,   'Zrušení kdykoliv'],
              [Shield,  'Bez závazků'],
            ].map(([Icon, text], i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-void-500">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {text as string}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/5 rounded-3xl blur-3xl" />
            <div className="relative card p-16 border-gold-500/15 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              <Crown className="w-12 h-12 text-gold-500 mx-auto mb-6" />
              <h2 className="font-display text-5xl lg:text-7xl tracking-widest text-white mb-4">
                PŘIPOJ SE<br /><span className="text-gradient-gold">TEĎ.</span>
              </h2>
              <p className="font-body text-void-400 max-w-lg mx-auto mb-10 leading-relaxed">
                Přes 2 341 lidí už nacházelo dealy jako první. Začni dnes – zdarma.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn btn-gold-lg">
                  <Crown className="w-4 h-4" />
                  Začít zdarma
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn btn-outline py-4 px-8">
                  Přihlásit se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-display text-base text-black">ND</div>
                <span className="font-display text-lg tracking-widest">NAJDI<span className="text-gold-500">DEAL</span></span>
              </div>
              <p className="font-body text-xs text-void-500 max-w-xs leading-relaxed">Nejprémiornější deal komunita v ČR a SK. Najdi deal dřív než ostatní.</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                { head: 'Produkt', links: [['Dealy','/register'],['Alerty','/register'],['VIP','/register'],['Ceny','#pricing']] },
                { head: 'Komunita', links: [['Registrace','/register'],['Přihlášení','/login'],['Telegram','https://t.me'],['Discord','#']] },
                { head: 'Podpora', links: [['FAQ','#'],['Podmínky','#'],['Soukromí','#'],['Kontakt','#']] },
              ].map(({ head, links }) => (
                <div key={head}>
                  <p className="font-heading text-[10px] font-700 text-void-500 uppercase tracking-widest mb-3">{head}</p>
                  <div className="space-y-2">
                    {links.map(([label, href]) => (
                      <a key={label} href={href} className="block font-body text-xs text-void-500 hover:text-void-300 transition-colors">{label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-void-600">© 2026 NajdiDeal. Všechna práva vyhrazena.</p>
            <p className="font-heading text-xs text-void-600">Made with ❤️ v České republice</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
