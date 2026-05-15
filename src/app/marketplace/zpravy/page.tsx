'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowRight, Clock, Eye } from 'lucide-react'

export const metadata = { title: 'Zprávy', description: 'Tvoje zprávy a konverzace na marketplace.' }


const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

export default function ZpravyPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      // Načti všechny zprávy kde jsem sender nebo receiver
      const { data } = await supabase
        .from('listing_messages')
        .select(`
          listing_id,
          sender_id,
          receiver_id,
          message,
          is_read,
          created_at,
          listings(id, title, images, category, price)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      // Seskupit podle listing_id + druhý účastník
      const convMap = new Map<string, any>()
      for (const msg of data ?? []) {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        const key = `${msg.listing_id}-${otherId}`
        if (!convMap.has(key)) {
          convMap.set(key, {
            listing_id: msg.listing_id,
            other_id: otherId,
            listing: msg.listings,
            last_message: msg.message,
            last_at: msg.created_at,
            unread: 0,
          })
        }
        if (!msg.is_read && msg.receiver_id === user.id) {
          convMap.get(key).unread++
        }
      }

      setConversations(Array.from(convMap.values()))
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const unreadTotal = conversations.reduce((a, c) => a + c.unread, 0)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ marginBottom: 28, animation: 'fadeUp .5s ease both' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>💬 Zprávy</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,52px)', letterSpacing: 4, color: G.wht, lineHeight: 1 }}>
            MOJE <span style={{ color: G.gold }}>ZPRÁVY</span>
          </h1>
          {unreadTotal > 0 && (
            <div style={{ background: G.gold, color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, padding: '4px 14px', borderRadius: 100, boxShadow: '0 0 20px rgba(240,180,41,.4)' }}>{unreadTotal}</div>
          )}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 20 }}>Zatím žádné zprávy</p>
          <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '11px 20px', borderRadius: 8, textDecoration: 'none' }}>
            Procházet inzeráty →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversations.map((c, i) => {
            const catEmoji: Record<string,string> = { nemovitosti:'🏠', auta:'🚗', elektronika:'📱', obleceni:'👗', ostatni:'🛒' }
            const hasUnread = c.unread > 0
            return (
              <Link key={i} href={`/marketplace/zpravy/${c.listing_id}?other=${c.other_id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: hasUnread ? 'rgba(240,180,41,.04)' : G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${hasUnread ? 'rgba(240,180,41,.22)' : G.br}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .3s', position: 'relative', overflow: 'hidden', animation: `fadeUp .5s ${i * 0.06}s ease both`, opacity: 0 }}>
                  {hasUnread && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />}

                  {/* Foto nebo emoji */}
                  <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {c.listing?.images?.[0] ? <img src={c.listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : catEmoji[c.listing?.category] ?? '🛒'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: hasUnread ? G.wht : 'rgba(240,235,225,.8)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.listing?.title ?? 'Inzerát'}
                    </div>
                    <div style={{ fontSize: 11, color: G.mut, fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: hasUnread ? 'normal' : 'italic' }}>
                      {c.last_message}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    {c.unread > 0 && <div style={{ background: G.gold, color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</div>}
                    <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut }}>
                      {new Date(c.last_at).toLocaleDateString('cs-CZ')}
                    </div>
                    <ArrowRight size={13} color={G.mut} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}