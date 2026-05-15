'use client'
import { useEffect, useState, useRef } from 'react'
import type { Profile, Listing, ListingMessage } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Check, CheckCheck, Phone, MoreVertical } from 'lucide-react'

const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.1)', gold4:'rgba(240,180,41,.22)',
  grn:'#00E676', grn2:'rgba(0,230,118,.08)',
  blu:'#4D9FFF', pur:'#9B5DE5',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', mut2:'rgba(240,235,225,.18)',
  bg:'#020208', bg2:'#06060E',
  gl:'rgba(255,255,255,.026)', glh:'rgba(255,255,255,.046)',
  br:'rgba(255,255,255,.07)',
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<any[]>([])
  const [listing, setListing] = useState<Listing | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const otherId = searchParams.get('other') ?? ''

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }

      const [pR, lR] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('listings').select('*').eq('id', params.id).single(),
      ])
      setProfile({ ...pR.data, id: user.id })
      setListing(lR.data)

      const { data: msgs } = await supabase
        .from('listing_messages')
        .select('*')
        .eq('listing_id', params.id)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      setMessages(msgs ?? [])

      await supabase.from('listing_messages')
        .update({ is_read: true })
        .eq('listing_id', params.id)
        .eq('receiver_id', user.id)
        .eq('sender_id', otherId)

      setLoading(false)

      const channel = supabase
        .channel(`chat-${params.id}-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'listing_messages',
          filter: `listing_id=eq.${params.id}`,
        }, async (payload) => {
          const msg = payload.new as ListingMessage
          if ((msg.sender_id === user.id && msg.receiver_id === otherId) ||
              (msg.sender_id === otherId && msg.receiver_id === user.id)) {
            setMessages(p => [...p, msg])
            if (msg.receiver_id === user.id) {
              await supabase.from('listing_messages').update({ is_read: true }).eq('id', msg.id)
            }
          }
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    })
  }, [params.id, otherId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: messages.length > 0 ? 'smooth' : 'auto' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMsg.trim() || sending || !profile) return
    setSending(true)
    const text = newMsg.trim()
    setNewMsg('')
    const supabase = createClient()
    await supabase.from('listing_messages').insert({
      listing_id: params.id,
      sender_id: profile.id,
      receiver_id: otherId,
      message: text,
      is_read: false,
    })
    setSending(false)
    inputRef.current?.focus()
  }

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (ts: string) => {
    const d = new Date(ts)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Dnes'
    if (d.toDateString() === yesterday.toDateString()) return 'Včera'
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })
  }

  const grouped: { date: string; msgs: ListingMessage[] }[] = []
  for (const msg of messages) {
    const d = formatDate(msg.created_at)
    const last = grouped[grouped.length - 1]
    if (last && last.date === d) last.msgs.push(msg)
    else grouped.push({ date: d, msgs: [msg] })
  }

  const catEmoji: Record<string,string> = { nemovitosti:'🏠', auta:'🚗', elektronika:'📱', obleceni:'👗', ostatni:'🛒' }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: `2px solid ${G.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Syne, sans-serif', color: G.wht }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes msgInRight{from{opacity:0;transform:translateX(20px) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes msgInLeft{from{opacity:0;transform:translateX(-20px) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(240,180,41,.15)}50%{box-shadow:0 0 40px rgba(240,180,41,.3)}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(240,180,41,.2);border-radius:2px}
      `}</style>

      {/* NOISE */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: .018, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      {/* AMBIENT ORB */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(240,180,41,.06) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,2,8,.88)', backdropFilter: 'blur(40px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.25),transparent)' }} />
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 760, margin: '0 auto', width: '100%' }}>

          {/* Zpět */}
          <Link href="/marketplace/zpravy" style={{ width: 36, height: 36, borderRadius: 10, background: G.gl, border: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flexShrink: 0, transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,180,41,.3)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = G.br }}>
            <ArrowLeft size={16} color={G.mut} />
          </Link>

          {/* Avatar inzerátu */}
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: G.gl, border: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}>
            {listing?.images?.[0]
              ? <img src={listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : catEmoji[listing?.category ?? ''] ?? '🛒'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
              {listing?.title ?? 'Inzerát'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: G.gold, letterSpacing: 1 }}>
                {listing?.price ? `${Number(listing.price).toLocaleString('cs-CZ')} Kč` : 'Cena dohodou'}
              </div>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }} />
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, textTransform: 'uppercase', letterSpacing: 1 }}>
                {catEmoji[listing?.category ?? '']} {listing?.category}
              </div>
            </div>
          </div>

          {/* Odkaz na inzerát */}
          <Link href={`/marketplace/${params.id}`} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.gold, textDecoration: 'none', padding: '7px 12px', border: `1px solid rgba(240,180,41,.2)`, borderRadius: 7, background: 'rgba(240,180,41,.05)', whiteSpace: 'nowrap', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.05)' }}>
            Inzerát →
          </Link>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', width: '100%' }}>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn .5s ease both' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: G.gold2, border: `1px solid rgba(240,180,41,.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px', animation: 'glow 3s ease-in-out infinite' }}>💬</div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, color: G.wht, marginBottom: 8 }}>ZAČNI KONVERZACI</h3>
            <p style={{ fontSize: 12, color: G.mut, fontWeight: 300, lineHeight: 1.7 }}>Napiš prodejci první zprávu.<br/>Odpovídají obvykle do 24 hodin.</p>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 12px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 100 }}>{date}</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
            </div>

            {msgs.map((msg, i) => {
              const isMine = msg.sender_id === profile?.id
              const prevMsg = msgs[i - 1]
              const isFirst = !prevMsg || prevMsg.sender_id !== msg.sender_id
              const nextMsg = msgs[i + 1]
              const isLast = !nextMsg || nextMsg.sender_id !== msg.sender_id

              return (
                <div key={msg.id ?? i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: isLast ? 12 : 3, animation: `${isMine ? 'msgInRight' : 'msgInLeft'} .28s cubic-bezier(.34,1.56,.64,1) both` }}>
                  <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>

                    {/* Bubble */}
                    <div style={{
                      padding: '11px 16px',
                      borderRadius: isMine
                        ? `18px 18px ${isLast ? '4px' : '18px'} 18px`
                        : `18px 18px 18px ${isLast ? '4px' : '18px'}`,
                      background: isMine
                        ? 'linear-gradient(135deg,rgba(240,180,41,.18) 0%,rgba(240,180,41,.1) 100%)'
                        : 'rgba(255,255,255,.06)',
                      border: `1px solid ${isMine ? 'rgba(240,180,41,.25)' : 'rgba(255,255,255,.08)'}`,
                      backdropFilter: 'blur(20px)',
                      boxShadow: isMine ? '0 4px 20px rgba(240,180,41,.08)' : '0 4px 20px rgba(0,0,0,.2)',
                      position: 'relative',
                    }}>
                      {/* Tail */}
                      {isLast && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          [isMine ? 'right' : 'left']: -6,
                          width: 12,
                          height: 12,
                          background: isMine ? 'rgba(240,180,41,.14)' : 'rgba(255,255,255,.06)',
                          clipPath: isMine ? 'polygon(0 0, 100% 0, 100% 100%)' : 'polygon(0 0, 100% 0, 0 100%)',
                        }} />
                      )}
                      <p style={{ fontSize: 13, color: G.wht, lineHeight: 1.65, margin: 0, wordBreak: 'break-word', fontWeight: 300 }}>{msg.message}</p>
                    </div>

                    {/* Time + read */}
                    {isLast && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, paddingInline: 4 }}>
                        <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut }}>{formatTime(msg.created_at)}</span>
                        {isMine && (msg.is_read
                          ? <CheckCheck size={11} color={G.gold} />
                          : <Check size={11} color={G.mut} />)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* ── INPUT ── */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 100, background: 'rgba(2,2,8,.92)', backdropFilter: 'blur(40px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: 760, margin: '0 auto', width: '100%' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Napiš zprávu…"
              style={{
                width: '100%',
                padding: '13px 18px',
                background: 'rgba(255,255,255,.07)',
                border: `1px solid ${newMsg ? 'rgba(240,180,41,.3)' : 'rgba(255,255,255,.09)'}`,
                borderRadius: 14,
                color: G.wht,
                fontFamily: 'Syne, sans-serif',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color .2s, background .2s',
                backdropFilter: 'blur(20px)',
              }}
              onFocus={e => { e.currentTarget.style.background = 'rgba(255,255,255,.09)' }}
              onBlur={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)' }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={sending || !newMsg.trim()}
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: newMsg.trim() ? G.gold : 'rgba(255,255,255,.06)',
              border: `1px solid ${newMsg.trim() ? 'rgba(240,180,41,.4)' : 'rgba(255,255,255,.08)'}`,
              cursor: newMsg.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: newMsg.trim() ? '0 6px 24px rgba(240,180,41,.35)' : 'none',
              transform: newMsg.trim() ? 'scale(1)' : 'scale(.95)',
            }}
            onMouseEnter={e => { if (newMsg.trim()) (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = newMsg.trim() ? 'scale(1)' : 'scale(.95)' }}
          >
            {sending
              ? <div style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              : <Send size={18} color={newMsg.trim() ? '#000' : G.mut} style={{ transform: 'rotate(-4deg)' }} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}