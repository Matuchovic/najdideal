import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DealCard } from '@/components/deals/DealCard'
import Link from 'next/link'
import { Crown, Flame, TrendingUp, Star, Zap } from 'lucide-react'
import { CATEGORY_META } from '@/lib/types'

export const metadata = { title: 'Dealy | NajdiDeal' }

interface Props { searchParams: { cat?: string; sort?: string } }

const SORTS = [
  { value: 'newest',  label: 'Nejnovější',     icon: '🕐' },
  { value: 'profit',  label: 'Nejvyšší profit', icon: '💰' },
  { value: 'popular', label: 'Nejoblíbenější',  icon: '👁' },
  { value: 'trending',label: 'Trending',        icon: '📈' },
]

const CAT_COLORS: Record<string, string> = {
  marketplace_flip: '#F0B429',
  ai_prilezitost:   '#4D9FFF',
  trend_produkt:    '#00E676',
  profit_alert:     '#FF3B5C',
  affiliate:        '#9B5DE5',
  dropshipping:     '#FF6B35',
  krypto:           '#FFD97D',
  ostatni:          'rgba(240,235,225,.4)',
}

export default async function DealsPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'free'
  const isVip = role === 'vip' || role === 'vip_pro' || role === 'vip_ultra' || role === 'vip_max' || role === 'admin'

  const isPremium = role === 'vip_pro' || role === 'vip_ultra' || role === 'vip_max' || role === 'admin'
  const isStandard = role === 'vip' || isPremium

  let query = supabase.from('deals').select('*').in('status', ['active', 'featured'])
  if (searchParams.cat) query = query.eq('category', searchParams.cat)
  
  // Přístupy ke kategoriím podle plánu
  if (!isStandard && !isPremium) {
    // FREE - jen základní kategorie
    query = query.in('category', ['marketplace_flip', 'trend_product', 'other'])
    query = query.eq('access_level', 'free')
  } else if (isStandard && !isPremium) {
    // STANDARD - vše kromě AI příležitostí a profit alertů
    query = query.not('category', 'in', '("ai_opportunity","profit_alert")')
  }
  // PREMIUM a ADMIN vidí vše

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    newest:   { col: 'created_at',    asc: false },
    profit:   { col: 'profit_amount', asc: false },
    popular:  { col: 'view_count',    asc: false },
    trending: { col: 'trend_percent', asc: false },
  }
  const sort = sortMap[searchParams.sort ?? 'newest'] ?? sortMap.newest
  query = query.order(sort.col, { ascending: sort.asc })

  const { data: deals } = await query.limit(48)
  const { data: savedRaw } = await supabase.from('saved_deals').select('deal_id').eq('user_id', user.id)
  const savedIds = new Set((savedRaw ?? []).map(d => d.deal_id))

  const activeCat = searchParams.cat
  const activeSort = searchParams.sort ?? 'newest'
  const catMeta = activeCat ? CATEGORY_META[activeCat as keyof typeof CATEGORY_META] : null
  const accentColor = activeCat ? (CAT_COLORS[activeCat] ?? '#F0B429') : '#F0B429'

  return (
    <div style={{ paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .deals-filter-pill { transition: all .25s cubic-bezier(.34,1.56,.64,1); }
        .deals-filter-pill:hover { transform: translateY(-2px); }
        .deals-sort-btn { transition: all .2s ease; }
        .deals-sort-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── AMBIENT ── */}
      <div style={{ position: 'fixed', top: '20%', right: '-10%', width: 400, height: 400, background: `radial-gradient(circle,${accentColor}08 0%,transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)', transition: 'background .5s' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '-5%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(77,159,255,.05) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(50px)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28, animation: 'fadeUp .6s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 3, height: 24, background: accentColor, borderRadius: 2, boxShadow: `0 0 12px ${accentColor}`, transition: 'background .5s' }} />
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px,5vw,52px)', letterSpacing: 5, color: '#F0EBE1', lineHeight: 1 }}>
                  {catMeta ? catMeta.label.toUpperCase() : 'VŠECHNY DEALY'}
                </h1>
                {catMeta && <span style={{ fontSize: 28 }}>{catMeta.icon}</span>}
              </div>
              <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, letterSpacing: 2, color: 'rgba(240,235,225,.35)', textTransform: 'uppercase' }}>
                {deals?.length ?? 0} {deals?.length === 1 ? 'deal' : 'dealů'} {activeCat ? `· kategorie ${catMeta?.label}` : '· všechny kategorie'}
              </p>
            </div>

            {!isVip && (
              <Link href="/vip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: '#F0B429', color: '#000', padding: '11px 20px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 8px 28px rgba(240,180,41,.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Crown size={13} /> VIP — Všechny dealy
              </Link>
            )}
          </div>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, animation: 'fadeUp .6s ease both', animationDelay: '.1s' }}>
          {/* Vše */}
          <Link href={`/deals${activeSort !== 'newest' ? `?sort=${activeSort}` : ''}`} className="deals-filter-pill" style={{
            flexShrink: 0, padding: '8px 16px',
            background: !activeCat ? '#F0B429' : 'rgba(255,255,255,.04)',
            border: `1px solid ${!activeCat ? '#F0B429' : 'rgba(255,255,255,.08)'}`,
            borderRadius: 100, textDecoration: 'none',
            fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
            color: !activeCat ? '#000' : 'rgba(240,235,225,.5)',
            boxShadow: !activeCat ? '0 4px 16px rgba(240,180,41,.25)' : 'none',
          }}>
            VŠE
          </Link>

          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const isActive = activeCat === key
            const color = CAT_COLORS[key] ?? '#F0B429'
            return (
              <Link
                key={key}
                href={`/deals?cat=${key}${activeSort !== 'newest' ? `&sort=${activeSort}` : ''}`}
                className="deals-filter-pill"
                style={{
                  flexShrink: 0, padding: '8px 16px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: isActive ? `${color}18` : 'rgba(255,255,255,.04)',
                  border: `1px solid ${isActive ? color + '55' : 'rgba(255,255,255,.08)'}`,
                  borderRadius: 100, textDecoration: 'none',
                  fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: isActive ? color : 'rgba(240,235,225,.45)',
                  boxShadow: isActive ? `0 4px 16px ${color}22` : 'none',
                }}
              >
                <span style={{ fontSize: 12 }}>{meta.icon}</span>
                {meta.label}
              </Link>
            )
          })}
        </div>

        {/* ── SORT ── */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28, animation: 'fadeUp .6s ease both', animationDelay: '.15s' }}>
          {SORTS.map(s => {
            const isActive = activeSort === s.value
            return (
              <Link
                key={s.value}
                href={`/deals?sort=${s.value}${activeCat ? `&cat=${activeCat}` : ''}`}
                className="deals-sort-btn"
                style={{
                  padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 5,
                  borderRadius: 9, textDecoration: 'none',
                  background: isActive ? 'rgba(240,180,41,.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(240,180,41,.3)' : 'rgba(255,255,255,.06)'}`,
                  fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: isActive ? '#F0B429' : 'rgba(240,235,225,.35)',
                }}
              >
                <span>{s.icon}</span> {s.label}
              </Link>
            )
          })}
        </div>

        {/* ── VIP BANNER ── */}
        {!isVip && (
          <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp .6s ease both', animationDelay: '.2s' }}>
            <Zap size={13} color="#F0B429" style={{ flexShrink: 0 }} />
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(240,235,225,.5)', fontWeight: 300 }}>
              Vidíš pouze volné dealy.{' '}
              <Link href="/vip" style={{ color: '#F0B429', fontWeight: 600, textDecoration: 'none' }}>Upgraduj na VIP</Link>
              {' '}pro přístup ke všem příležitostem.
            </p>
          </div>
        )}

        {/* ── GRID ── */}
        {deals && deals.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, animation: 'fadeUp .7s ease both', animationDelay: '.25s' }}>
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} isSaved={savedIds.has(deal.id)} isVip={isVip} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '80px 24px', textAlign: 'center', animation: 'fadeUp .6s ease both' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 4, color: 'rgba(240,235,225,.2)', marginBottom: 8 }}>ŽÁDNÉ DEALY</p>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: 'rgba(240,235,225,.25)', textTransform: 'uppercase' }}>
              Zkus jinou kategorii nebo se vrať později
            </p>
            <Link href="/deals" style={{ display: 'inline-flex', marginTop: 24, padding: '10px 22px', background: 'rgba(240,180,41,.08)', border: '1px solid rgba(240,180,41,.2)', borderRadius: 9, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#F0B429', textDecoration: 'none' }}>
              Zobrazit vše
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
