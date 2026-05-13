'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Plus, Lock, Eye, MapPin, Clock, TrendingUp } from 'lucide-react'

const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.08)', gold4:'rgba(240,180,41,.18)',
  grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35', red:'#FF3B5C',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const CATEGORIES = [
  { key: 'all', label: 'Vše', emoji: '🔍' },
  { key: 'nemovitosti', label: 'Nemovitosti', emoji: '🏠', minRole: 'vip_pro' },
  { key: 'auta', label: 'Auta & Motorky', emoji: '🚗', minRole: 'vip' },
  { key: 'elektronika', label: 'Elektronika', emoji: '📱', minRole: 'vip' },
  { key: 'obleceni', label: 'Oblečení', emoji: '👗', minRole: 'free' },
  { key: 'ostatni', label: 'Ostatní', emoji: '🛒', minRole: 'free' },
]

const TIER_LEVEL: Record<string, number> = { free:1, vip:2, vip_pro:3, vip_ultra:4, vip_max:5, admin:99 }
const TIER_COLOR: Record<string, string> = { free:G.mut, vip:G.gold, vip_pro:G.blu, vip_ultra:G.pur, vip_max:G.org, admin:G.gold }
const TIER_LABEL: Record<string, string> = { free:'FREE', vip:'VIP', vip_pro:'VIP PRO', vip_ultra:'VIP ULTRA', vip_max:'VIP MAX', admin:'ADMIN' }

function hasAccess(userRole: string, required: string) {
  return (TIER_LEVEL[userRole] ?? 1) >= (TIER_LEVEL[required] ?? 1)
}

function canAdd(userRole: string, category: string) {
  const cat = CATEGORIES.find(c => c.key === category)
  if (!cat || !cat.minRole) return true
  return hasAccess(userRole, cat.minRole)
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const [pR, lR] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('listings').select('*').eq('status', 'active').order('is_boosted', { ascending: false }).order('created_at', { ascending: false }),
      ])
      setProfile(pR.data)
      setListings(lR.data ?? [])
      setLoading(false)
    })
  }, [])

  const userRole = profile?.role ?? 'free'
  const tierColor = TIER_COLOR[userRole] ?? G.mut
  const canContact = hasAccess(userRole, 'vip_pro')

  const filtered = listings.filter(l => {
    if (cat !== 'all' && l.category !== cat) return false
    if (search && !l.title?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ marginBottom: 28, animation: 'fadeUp .5s ease both' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>🛒 Marketplace</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,52px)', letterSpacing: 4, color: G.wht, lineHeight: 1 }}>
            NAJDI <span style={{ color: G.gold }}>PŘÍLEŽITOST</span>
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/marketplace/moje" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, textDecoration: 'none', padding: '11px 16px', border: '1px solid rgba(240,180,41,.2)', borderRadius: 8, background: 'rgba(240,180,41,.05)', whiteSpace: 'nowrap' }}>
              📋 Moje inzeráty
            </Link>
            <Link href="/marketplace/zpravy" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.blu, textDecoration: 'none', padding: '11px 16px', border: '1px solid rgba(77,159,255,.2)', borderRadius: 8, background: 'rgba(77,159,255,.05)', whiteSpace: 'nowrap' }}>
              💬 Zprávy
            </Link>
            <Link href="/marketplace/pridat" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 18px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 6px 24px rgba(240,180,41,.25)', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Přidat inzerát
            </Link>
          </div>
        </div>
      </div>

      {/* CONTACT ACCESS BANNER */}
      {!canContact && (
        <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 12, background: 'rgba(77,159,255,.05)', border: '1px solid rgba(77,159,255,.18)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Lock size={14} color={G.blu} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.blu, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>VIP PRO </span>
            <span style={{ fontSize: 12, color: G.mut, fontWeight: 300 }}>– odemkni zobrazení telefonního čísla a posílání zpráv prodejcům</span>
          </div>
          <Link href="/vip" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: G.blu, color: '#fff', padding: '7px 14px', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}>Upgradovat →</Link>
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} color={G.mut} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hledat inzeráty…" style={{ width: '100%', padding: '11px 14px 11px 40px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 10, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 13, outline: 'none' }} />
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 14px', borderRadius: 8, border: `1px solid ${cat === c.key ? 'rgba(240,180,41,.35)' : G.br}`, background: cat === c.key ? 'rgba(240,180,41,.08)' : G.gl, color: cat === c.key ? G.gold : G.mut, cursor: 'pointer', transition: 'all .2s', backdropFilter: 'blur(20px)' }}>
            <span>{c.emoji}</span> {c.label}
            {c.minRole && c.minRole !== 'free' && <span style={{ fontSize: 7, background: TIER_COLOR[c.minRole] + '22', color: TIER_COLOR[c.minRole], border: `1px solid ${TIER_COLOR[c.minRole]}33`, borderRadius: 4, padding: '1px 5px' }}>{TIER_LABEL[c.minRole]}</span>}
          </button>
        ))}
      </div>

      {/* LISTINGS GRID */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Žádné inzeráty v této kategorii</p>
          <Link href="/marketplace/pridat" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 20px', borderRadius: 8, textDecoration: 'none' }}>
            <Plus size={13} /> Přidat první inzerát
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
          {filtered.map((l, i) => (
            <ListingCard key={l.id} listing={l} idx={i} userRole={userRole} canContact={canContact} />
          ))}
        </div>
      )}
    </div>
  )
}

function ListingCard({ listing: l, idx, userRole, canContact }: any) {
  const [hov, setHov] = useState(false)
  const G2 = { gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)' }
  const catEmoji: Record<string,string> = { nemovitosti:'🏠', auta:'🚗', elektronika:'📱', obleceni:'👗', ostatni:'🛒' }

  return (
    <Link href={`/marketplace/${l.id}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: l.is_boosted ? 'rgba(240,180,41,.04)' : G2.gl, backdropFilter: 'blur(28px)', border: `1px solid ${hov ? 'rgba(240,180,41,.28)' : (l.is_boosted ? 'rgba(240,180,41,.18)' : G2.br)}`, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', transition: 'all .4s cubic-bezier(.34,1.56,.64,1)', transform: hov ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hov ? '0 24px 64px rgba(0,0,0,.5)' : 'none', animation: `fadeUp .5s ${idx * 0.06}s ease both`, opacity: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)', opacity: hov ? 1 : 0, transition: 'opacity .3s' }} />

        {/* Foto náhled */}
        {l.images && l.images.length > 0 && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: 'rgba(255,255,255,.03)' }}>
            <img src={l.images[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', transform: hov ? 'scale(1.05)' : 'scale(1)' }} />
          </div>
        )}
        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: `1px solid ${G2.br}`, color: G2.mut }}>
            {catEmoji[l.category] ?? '🛒'} {l.category}
          </span>
          {l.is_boosted && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.25)', color: G2.gold }}>⚡ BOOST</span>}
          {l.condition && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, padding: '3px 9px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: `1px solid ${G2.br}`, color: G2.mut }}>{l.condition}</span>}
        </div>

        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: hov ? G2.gold : G2.wht, marginBottom: 8, lineHeight: 1.35, transition: 'color .3s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</h3>

        {l.description && <p style={{ fontSize: 11, color: G2.mut, lineHeight: 1.7, fontWeight: 300, marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{l.description}</p>}

        <div style={{ height: 1, background: 'rgba(255,255,255,.055)', marginBottom: 12 }} />

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: G2.gold, letterSpacing: 1, lineHeight: 1, textShadow: hov ? '0 0 24px rgba(240,180,41,.4)' : 'none', transition: 'text-shadow .3s' }}>
            {l.price ? `${Number(l.price).toLocaleString('cs-CZ')} Kč` : 'Dohodou'}
          </div>
          {l.price_negotiable && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G2.mut, letterSpacing: 1 }}>Možná dohoda</span>}
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {l.location && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} color={G2.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G2.mut }}>{l.location}</span></div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} color={G2.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G2.mut }}>{l.views_count ?? 0}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} color={G2.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G2.mut }}>{new Date(l.created_at).toLocaleDateString('cs-CZ')}</span></div>
        </div>

        {/* Contact locked */}
        {!canContact && (
          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(77,159,255,.05)', border: '1px solid rgba(77,159,255,.15)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Lock size={10} color='#4D9FFF' />
            <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: '#4D9FFF', letterSpacing: 1, textTransform: 'uppercase' }}>Kontakt odemkne VIP PRO</span>
          </div>
        )}
      </div>
    </Link>
  )
}