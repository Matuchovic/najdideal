'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, CheckCircle, Clock, Eye, MapPin, AlertCircle, MessageSquare } from 'lucide-react'

export const metadata = { title: 'Moje inzeráty', description: 'Přehled tvých aktivních inzerátů na marketplace.' }


const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.08)', gold4:'rgba(240,180,41,.18)',
  grn:'#00E676', grn2:'rgba(0,230,118,.08)',
  blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35', red:'#FF3B5C',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const STATUS_CONFIG = {
  active:     { label: 'Aktivní',    color: G.grn,  bg: 'rgba(0,230,118,.08)',    border: 'rgba(0,230,118,.2)',    emoji: '🟢' },
  reserved:   { label: 'Rezervováno', color: G.gold, bg: 'rgba(240,180,41,.08)',   border: 'rgba(240,180,41,.2)',   emoji: '🟡' },
  sold:       { label: 'Prodáno',    color: G.mut,  bg: 'rgba(255,255,255,.05)',  border: 'rgba(255,255,255,.1)',  emoji: '⚫' },
  inactive:   { label: 'Skryté',     color: G.red,  bg: 'rgba(255,59,92,.06)',    border: 'rgba(255,59,92,.18)',   emoji: '🔴' },
}

const catEmoji: Record<string,string> = { nemovitosti:'🏠', auta:'🚗', elektronika:'📱', obleceni:'👗', ostatni:'🛒' }

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string|null>(null)
  const [updating, setUpdating] = useState<string|null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null)
  const router = useRouter()

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setListings(data ?? [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const supabase = createClient()
    await supabase.from('listings').update({ status }).eq('id', id)
    setListings(p => p.map(l => l.id === id ? { ...l, status } : l))
    setUpdating(null)
  }

  const deleteListing = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    // Smazat fotky ze storage
    const listing = listings.find(l => l.id === id)
    if (listing?.images?.length) {
      const paths = listing.images.map((url: string) => url.split('/listings/')[1])
      await supabase.storage.from('listings').remove(paths)
    }
    await supabase.from('listings').delete().eq('id', id)
    setListings(p => p.filter(l => l.id !== id))
    setDeleting(null)
    setConfirmDelete(null)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const active = listings.filter(l => l.status === 'active').length
  const sold = listings.filter(l => l.status === 'sold').length
  const views = listings.reduce((a,l) => a + (l.views_count ?? 0), 0)

  return (
    <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', paddingBottom: 80 }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap', animation: 'fadeUp .5s ease both' }}>
        <div>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>📋 Správa inzerátů</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,52px)', letterSpacing: 4, color: G.wht, lineHeight: 1 }}>
            MOJE <span style={{ color: G.gold }}>INZERÁTY</span>
          </h1>
        </div>
        <Link href="/marketplace/pridat" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 18px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 6px 24px rgba(240,180,41,.25)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Plus size={14} /> Přidat inzerát
        </Link>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 24, animation: 'fadeUp .5s .05s ease both', opacity: 0 }}>
        {[
          { label: 'Aktivní', value: active, color: G.grn, emoji: '🟢' },
          { label: 'Prodáno', value: sold, color: G.gold, emoji: '✅' },
          { label: 'Celkem zobrazení', value: views, color: G.blu, emoji: '👁' },
        ].map(s => (
          <div key={s.label} style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 12, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: s.color, letterSpacing: 2, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut, letterSpacing: 2, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* LISTINGS */}
      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, animation: 'fadeUp .5s .1s ease both', opacity: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 20 }}>Zatím nemáš žádné inzeráty</p>
          <Link href="/marketplace/pridat" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 20px', borderRadius: 8, textDecoration: 'none' }}>
            <Plus size={13} /> Přidat první inzerát
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listings.map((l, i) => {
            const st = STATUS_CONFIG[l.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.active
            const isUpdating = updating === l.id
            const isDeleting = deleting === l.id
            const showConfirm = confirmDelete === l.id

            return (
              <div key={l.id} style={{ background: G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${G.br}`, borderRadius: 16, overflow: 'hidden', position: 'relative', animation: `fadeUp .5s ${i * 0.06}s ease both`, opacity: 0, transition: 'opacity .3s', ...(l.status === 'sold' ? { opacity: .6 } : {}) }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.15),transparent)' }} />

                <div style={{ display: 'flex', gap: 0 }}>
                  {/* Foto náhled */}
                  {l.images?.length > 0 && (
                    <div style={{ width: 100, flexShrink: 0, background: 'rgba(255,255,255,.03)', overflow: 'hidden' }}>
                      <img src={l.images[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: l.status === 'sold' ? 'grayscale(1)' : 'none' }} />
                    </div>
                  )}

                  <div style={{ flex: 1, padding: '18px 20px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, padding: '3px 9px', borderRadius: 100, background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {st.emoji} {st.label}
                          </span>
                          <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut }}>
                            {catEmoji[l.category] ?? '🛒'} {l.category}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: G.wht, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</h3>
                      </div>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: G.gold, letterSpacing: 1, flexShrink: 0 }}>
                        {l.price ? `${Number(l.price).toLocaleString('cs-CZ')} Kč` : 'Dohodou'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                      {l.location && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} color={G.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{l.location}</span></div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} color={G.mut} /><span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{l.views_count ?? 0} zobrazení</span></div>
                      <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut }}>{new Date(l.created_at).toLocaleDateString('cs-CZ')}</div>
                    </div>

                    {/* ACTION BUTTONS */}
                    {!showConfirm ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                        {/* EDIT */}
                        <Link href={`/marketplace/upravit/${l.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.wht, textDecoration: 'none', padding: '7px 12px', border: `1px solid ${G.br}`, borderRadius: 7, background: 'rgba(255,255,255,.04)', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                          <Edit2 size={11} /> Upravit
                        </Link>
                        {/* ZPRÁVY */}
                        <Link href={`/marketplace/zpravy`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.blu, textDecoration: 'none', padding: '7px 12px', border: '1px solid rgba(77,159,255,.2)', borderRadius: 7, background: 'rgba(77,159,255,.05)', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                          <MessageSquare size={11} /> Zprávy
                        </Link>
                        {/* BOOST */}
                        <Link href={`/marketplace/boost/${l.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#F0B429', textDecoration: 'none', padding: '7px 12px', border: '1px solid rgba(240,180,41,.25)', borderRadius: 7, background: 'rgba(240,180,41,.06)', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                          ⚡ Boost
                        </Link>

                        {/* STATUS BUTTONS */}
                        {l.status !== 'active' && (
                          <button onClick={() => updateStatus(l.id, 'active')} disabled={isUpdating} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.grn, padding: '7px 12px', border: '1px solid rgba(0,230,118,.2)', borderRadius: 7, background: 'rgba(0,230,118,.06)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <CheckCircle size={11} /> {isUpdating ? '…' : 'Aktivovat'}
                          </button>
                        )}
                        {l.status !== 'reserved' && l.status !== 'sold' && (
                          <button onClick={() => updateStatus(l.id, 'reserved')} disabled={isUpdating} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold, padding: '7px 12px', border: 'rgba(240,180,41,.2) solid 1px', borderRadius: 7, background: 'rgba(240,180,41,.06)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <Clock size={11} /> {isUpdating ? '…' : 'Rezervováno'}
                          </button>
                        )}
                        {l.status !== 'sold' && (
                          <button onClick={() => updateStatus(l.id, 'sold')} disabled={isUpdating} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.pur, padding: '7px 12px', border: '1px solid rgba(155,93,229,.2)', borderRadius: 7, background: 'rgba(155,93,229,.06)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <CheckCircle size={11} /> {isUpdating ? '…' : 'Prodáno'}
                          </button>
                        )}
                        {l.status === 'active' && (
                          <button onClick={() => updateStatus(l.id, 'inactive')} disabled={isUpdating} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, padding: '7px 12px', border: `1px solid ${G.br}`, borderRadius: 7, background: G.gl, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <AlertCircle size={11} /> {isUpdating ? '…' : 'Skrýt'}
                          </button>
                        )}

                        {/* DELETE */}
                        <button onClick={() => setConfirmDelete(l.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.red, padding: '7px 12px', border: '1px solid rgba(255,59,92,.18)', borderRadius: 7, background: 'rgba(255,59,92,.05)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                          <Trash2 size={11} /> Smazat
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.2)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: G.wht, fontWeight: 500 }}>Opravdu smazat inzerát? Tato akce je nevratná.</span>
                        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                          <button onClick={() => deleteListing(l.id)} disabled={isDeleting} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: G.red, color: '#fff', padding: '8px 14px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>
                            {isDeleting ? '…' : '🗑 Smazat'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: 'rgba(255,255,255,.05)', color: G.mut, padding: '8px 14px', borderRadius: 7, border: `1px solid ${G.br}`, cursor: 'pointer' }}>
                            Zrušit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}