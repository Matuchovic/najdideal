'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, Eye, Lock, Phone, Mail, MessageSquare, ArrowLeft, Send } from 'lucide-react'

const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.08)', gold4:'rgba(240,180,41,.18)',
  grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const TIER_LEVEL: Record<string,number> = { free:1, vip:2, vip_pro:3, vip_ultra:4, vip_max:5, admin:99 }
function hasAccess(userRole: string, required: string) {
  return (TIER_LEVEL[userRole] ?? 1) >= (TIER_LEVEL[required] ?? 1)
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msgSent, setMsgSent] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const [pR, lR] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('listings').select('*').eq('id', params.id).single(),
      ])
      setProfile(pR.data)
      setListing(lR.data)
      // Increment views
      if (lR.data) supabase.from('listings').update({ views_count: (lR.data.views_count ?? 0) + 1 }).eq('id', params.id)
      // Load messages if VIP PRO
      if (pR.data && hasAccess(pR.data.role, 'vip_pro')) {
        const { data: msgs } = await supabase.from('listing_messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).eq('listing_id', params.id).order('created_at', { ascending: true })
        setMessages(msgs ?? [])
      }
      setLoading(false)
    })
  }, [params.id])

  const sendMessage = async () => {
    if (!newMsg.trim() || sending) return
    setSending(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !listing) return
    await supabase.from('listing_messages').insert({
      listing_id: listing.id,
      sender_id: user.id,
      receiver_id: listing.user_id,
      message: newMsg.trim(),
    })
    setMessages(p => [...p, { sender_id: user.id, message: newMsg.trim(), created_at: new Date().toISOString() }])
    setNewMsg('')
    setSending(false)
    setMsgSent(true)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!listing) return <div style={{ textAlign: 'center', padding: 60, color: G.mut }}>Inzerát nenalezen.</div>

  const userRole = profile?.role ?? 'free'
  const canContact = hasAccess(userRole, 'vip_pro')
  const isOwner = profile?.id === listing.user_id
  const catEmoji: Record<string,string> = { nemovitosti:'🏠', auta:'🚗', elektronika:'📱', obleceni:'👗', ostatni:'🛒' }

  return (
    <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, textDecoration: 'none', marginBottom: 24, padding: '7px 12px', border: `1px solid ${G.br}`, borderRadius: 6, background: G.gl, transition: 'color .2s' }}>
        <ArrowLeft size={12} /> Zpět na marketplace
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, animation: 'fadeUp .5s ease both' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main card */}
          <div style={{ background: G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${G.br}`, borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent)' }} />
            {/* FOTO GALERIE */}
            {listing.images && listing.images.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,.03)', marginBottom: 8, position: 'relative' }}>
                  <img src={listing.images[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '4px 10px', fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.wht }}>{activeImg + 1} / {listing.images.length}</div>
                </div>
                {listing.images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                    {listing.images.map((img: string, i: number) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: `2px solid ${activeImg === i ? G.gold : 'transparent'}`, transition: 'border-color .2s', opacity: activeImg === i ? 1 : .6 }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, color: G.mut }}>
                {catEmoji[listing.category] ?? '🛒'} {listing.category}
              </span>
              {listing.condition && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, color: G.mut }}>{listing.condition}</span>}
              {listing.is_boosted && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.25)', color: G.gold }}>⚡ BOOST</span>}
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px,5vw,44px)', letterSpacing: 3, color: G.wht, marginBottom: 12, lineHeight: 1 }}>{listing.title}</h1>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, color: G.gold, letterSpacing: 2, marginBottom: 20, textShadow: '0 0 30px rgba(240,180,41,.3)' }}>
              {listing.price ? `${Number(listing.price).toLocaleString('cs-CZ')} Kč` : 'Cena dohodou'}
              {listing.price_negotiable && <span style={{ fontSize: 18, color: G.mut, marginLeft: 10 }}>· Možná dohoda</span>}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 20 }} />
            {listing.description && <p style={{ fontSize: 13, color: 'rgba(240,235,225,.65)', lineHeight: 1.9, fontWeight: 300, whiteSpace: 'pre-wrap' }}>{listing.description}</p>}
            <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
              {listing.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={12} color={G.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{listing.location}</span></div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={12} color={G.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{listing.views_count ?? 0} zobrazení</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} color={G.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{new Date(listing.created_at).toLocaleDateString('cs-CZ')}</span></div>
            </div>
          </div>

          {/* MESSAGES – VIP PRO+ */}
          {!isOwner && (
            <div style={{ background: G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${canContact ? G.br : 'rgba(77,159,255,.18)'}`, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${canContact ? 'rgba(255,255,255,.08)' : '#4D9FFF'},transparent)` }} />
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <MessageSquare size={15} color={canContact ? G.gold : G.blu} />
                <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: canContact ? G.gold : G.blu }}>Napsat zprávu</span>
                {!canContact && <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.blu, background: 'rgba(77,159,255,.08)', border: '1px solid rgba(77,159,255,.2)', borderRadius: 4, padding: '2px 8px', marginLeft: 'auto' }}>VIP PRO</span>}
              </div>
              {canContact ? (
                <div style={{ padding: 20 }}>
                  <p style={{ fontSize: 12, color: G.mut, fontWeight: 300, marginBottom: 16, lineHeight: 1.7 }}>Otevři chat a piš přímo s prodejcem v reálném čase.</p>
                  <Link href={`/marketplace/zpravy/${listing.id}?other=${listing.user_id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '14px', background: G.gold, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 10, textDecoration: 'none', boxShadow: '0 6px 24px rgba(240,180,41,.28)', transition: 'all .3s' }}>
                    💬 Otevřít chat s prodejcem
                  </Link>
                </div>
              ) : (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <Lock size={28} color={G.blu} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 12, color: G.mut, fontWeight: 300, marginBottom: 16, lineHeight: 1.7 }}>Pro posílání zpráv prodejcům potřebuješ VIP PRO nebo vyšší.</p>
                  <Link href="/vip" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: G.blu, color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }}>Upgradovat na VIP PRO →</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT – CONTACT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${canContact ? G.br : 'rgba(77,159,255,.2)'}`, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${canContact ? 'rgba(240,180,41,.3)' : '#4D9FFF'},transparent)` }} />
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${G.br}` }}>
              <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: canContact ? G.gold : G.blu }}>
                {canContact ? '📞 Kontakt na prodejce' : '🔒 Kontakt zamčen'}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              {canContact ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {listing.phone && (
                    <a href={`tel:${listing.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.2)', borderRadius: 10, textDecoration: 'none' }}>
                      <Phone size={15} color='#00E676' />
                      <div>
                        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: '#00E676', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Telefon</div>
                        <div style={{ fontSize: 14, color: G.wht, fontWeight: 600 }}>{listing.phone}</div>
                      </div>
                    </a>
                  )}
                  {listing.email && (
                    <a href={`mailto:${listing.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(240,180,41,.06)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 10, textDecoration: 'none' }}>
                      <Mail size={15} color={G.gold} />
                      <div>
                        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Email</div>
                        <div style={{ fontSize: 13, color: G.wht, fontWeight: 500 }}>{listing.email}</div>
                      </div>
                    </a>
                  )}
                  {!listing.phone && !listing.email && <p style={{ fontSize: 12, color: G.mut, textAlign: 'center', padding: '12px 0' }}>Prodejce nezadal kontaktní údaje.</p>}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(77,159,255,.08)', border: '1px solid rgba(77,159,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Lock size={22} color={G.blu} />
                  </div>
                  <p style={{ fontSize: 12, color: G.mut, fontWeight: 300, marginBottom: 16, lineHeight: 1.75 }}>Telefonní číslo a email prodejce jsou dostupné od <strong style={{ color: G.blu }}>VIP PRO</strong>.</p>
                  <Link href="/vip" style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: G.blu, color: '#fff', padding: '12px', borderRadius: 9, textDecoration: 'none', textAlign: 'center', boxShadow: '0 6px 20px rgba(77,159,255,.25)' }}>
                    Odemknout VIP PRO →
                  </Link>
                  <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut, marginTop: 10 }}>od 999 Kč/měsíc</p>
                </div>
              )}
            </div>
          </div>

          {isOwner && (
            <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Tvůj inzerát</p>
              <Link href="/marketplace/pridat" style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: 'rgba(255,255,255,.05)', color: G.wht, padding: '10px', borderRadius: 8, textDecoration: 'none', textAlign: 'center', border: `1px solid ${G.br}` }}>
                + Přidat další inzerát
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:768px){.listing-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  )
}