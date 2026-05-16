'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const G = { bg:'#020208', gl:'rgba(255,255,255,.04)', br:'rgba(255,255,255,.08)', wht:'#F0EBE1', mut:'rgba(240,235,225,.45)', g:'#F0B429', grn:'#00E676' }

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string; pulse: boolean }> = {
  open:        { label: 'Nový',           color: '#4D9FFF', bg: 'rgba(77,159,255,.1)',   icon: '🔵', pulse: false },
  in_progress: { label: 'V řešení',       color: '#F0B429', bg: 'rgba(240,180,41,.1)',   icon: '⚙️', pulse: true  },
  resolved:    { label: 'Vyřešeno',       color: '#00E676', bg: 'rgba(0,230,118,.1)',    icon: '✅', pulse: false },
  closed:      { label: 'Ukončen',        color: '#888',    bg: 'rgba(255,255,255,.05)', icon: '🔒', pulse: false },
}

export default function MojePozadavky() {
  const supabase = createClient()
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [ratingHover, setRatingHover] = useState<Record<string, number>>({})
  const [ratingDone, setRatingDone] = useState<Record<string, boolean>>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      await loadTickets(user.email || '')

      // Realtime — live status update
      const ch = supabase.channel('moje-pozadavky')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload: any) => {
          const m = payload.new
          if (m.role === 'admin' && !m.message?.startsWith('__STATUS__')) {
            setNewMsg(m.session_id)
            setTimeout(() => setNewMsg(null), 3000)
          }
          if (m.message?.startsWith('__STATUS__')) {
            const status = m.message.replace('__STATUS__', '')
            setTickets(prev => prev.map(t => t.session_id === m.session_id ? { ...t, status } : t))
          }
          if (selected === m.session_id) {
            setMessages(prev => [...prev, m])
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
          }
        })
        .subscribe()
      return () => { supabase.removeChannel(ch) }
    })
  }, [selected])

  async function loadTickets(email: string) {
    const { data } = await supabase
      .from('chat_messages').select('session_id, message, created_at, status')
      .ilike('message', `📧 ${email}%`).order('created_at', { ascending: false })
    if (!data) { setLoading(false); return }

    const results = await Promise.all(data.map(async (m: any) => {
      const parts = m.message?.split(' | ')
      const { data: msgs } = await supabase
        .from('chat_messages').select('message, role, created_at')
        .eq('session_id', m.session_id).order('created_at', { ascending: false }).limit(10)

      const statusMsg = (msgs || []).find((x: any) => x.message?.startsWith('__STATUS__'))
      const lastMsg = (msgs || []).find((x: any) => !x.message?.startsWith('__STATUS__') && !x.message?.startsWith('📧'))
      const hasNewAdminMsg = (msgs || []).some((x: any) => x.role === 'admin' && !x.message?.startsWith('__STATUS__') && !x.message?.startsWith('Dobrý den'))

      return {
        session_id: m.session_id,
        subject: parts?.[1] || 'Bez předmětu',
        status: statusMsg ? statusMsg.message.replace('__STATUS__', '') : (m.status || 'open'),
        created_at: m.created_at,
        last_message: lastMsg?.message || '',
        last_role: lastMsg?.role || '',
        hasNew: hasNewAdminMsg,
      }
    }))

    setTickets(results)
    setLoading(false)
  }

  async function submitRating(sid: string, stars: number) {
    await supabase.from('chat_messages').insert({ session_id: sid, role: 'user', message: `__RATING__${stars}`, rating: stars })
    setRatings(prev => ({ ...prev, [sid]: stars }))
    setRatingDone(prev => ({ ...prev, [sid]: true }))
  }

  async function openTicket(sid: string) {
    setSelected(sid)
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at', { ascending: true })
    setMessages((data || []).filter((m: any) => !m.message?.startsWith('__STATUS__')))
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(240,180,41,.2)', borderTopColor: '#F0B429', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: G.mut, fontSize: 12, fontFamily: 'Syne Mono,monospace', letterSpacing: 2 }}>NAČÍTÁM...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.wht, fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes newMsg { 0%{background:rgba(240,180,41,.2)} 100%{background:rgba(255,255,255,.04)} }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, animation: 'fadeUp .5s ease' }}>
          <Link href="/dashboard" style={{ color: G.mut, textDecoration: 'none', fontSize: 12, padding: '8px 12px', border: '1px solid rgba(255,255,255,.07)', borderRadius: 8 }}>← Dashboard</Link>
          <div>
            <h1 style={{ fontFamily: 'Syne Mono,monospace', fontSize: 16, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: G.g, margin: 0 }}>Moje požadavky</h1>
            <div style={{ fontSize: 11, color: G.mut, marginTop: 2 }}>{userEmail}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {Object.entries(STATUS_META).map(([key, st]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: st.color }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, animation: st.pulse ? 'pulse 1.4s infinite' : 'none' }} />
                {st.label}
              </div>
            ))}
          </div>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', animation: 'fadeUp .5s ease' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <div style={{ fontSize: 15, color: G.wht, marginBottom: 8 }}>Zatím žádné požadavky</div>
            <div style={{ fontSize: 12, color: G.mut, marginBottom: 24 }}>Napište nám přes chat na hlavní stránce</div>
            <Link href="/" style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.3)', borderRadius: 10, color: G.g, fontSize: 11, fontFamily: 'Syne Mono,monospace', letterSpacing: 1, textDecoration: 'none' }}>Otevřít chat →</Link>
          </div>
        ) : !selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tickets.map((t, i) => {
              const st = STATUS_META[t.status] || STATUS_META.open
              const isNew = newMsg === t.session_id
              return (
                <div key={t.session_id} onClick={() => openTicket(t.session_id)}
                  style={{ padding: '20px 24px', background: isNew ? 'rgba(240,180,41,.08)' : G.gl, border: `1px solid ${t.hasNew ? 'rgba(240,180,41,.3)' : G.br}`, borderRadius: 16, cursor: 'pointer', transition: 'all .3s', display: 'flex', alignItems: 'center', gap: 16, animation: `fadeUp .5s ease ${i * 0.07}s both`, position: 'relative', overflow: 'hidden' }}>
                  {/* Status indikátor */}
                  <div style={{ width: 3, position: 'absolute', left: 0, top: 0, bottom: 0, background: st.color, borderRadius: '3px 0 0 3px' }} />
                  <div style={{ fontSize: 28 }}>{st.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: G.wht }}>{t.subject}</div>
                      {t.hasNew && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F0B429', animation: 'pulse 1.4s infinite', flexShrink: 0 }} />}
                    </div>
                    {t.last_message && <div style={{ fontSize: 12, color: G.mut, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.last_role === 'admin' ? '👑 ' : ''}{t.last_message}</div>}
                    <div style={{ fontSize: 10, color: 'rgba(240,235,225,.25)', marginTop: 5, fontFamily: 'Syne Mono,monospace' }}>{new Date(t.created_at).toLocaleString('cs-CZ')} · #{t.session_id.slice(0,6).toUpperCase()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <div style={{ padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, fontSize: 9, fontFamily: 'Syne Mono,monospace', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {st.pulse && <div style={{ width: 5, height: 5, borderRadius: '50%', background: st.color, animation: 'pulse 1.4s infinite' }} />}
                      {st.label}
                    </div>
                    {(t.status === 'resolved' || t.status === 'closed') && !ratingDone[t.session_id] && (
                      <div style={{ display: 'flex', gap: 3 }} onClick={e => e.stopPropagation()}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star}
                            onMouseEnter={() => setRatingHover(prev => ({ ...prev, [t.session_id]: star }))}
                            onMouseLeave={() => setRatingHover(prev => ({ ...prev, [t.session_id]: 0 }))}
                            onClick={() => submitRating(t.session_id, star)}
                            style={{ fontSize: 18, cursor: 'pointer', transition: 'transform .15s', transform: (ratingHover[t.session_id] || ratings[t.session_id] || 0) >= star ? 'scale(1.2)' : 'scale(1)', filter: (ratingHover[t.session_id] || ratings[t.session_id] || 0) >= star ? 'none' : 'grayscale(1) opacity(.3)' }}>⭐</span>
                        ))}
                      </div>
                    )}
                    {ratingDone[t.session_id] && <div style={{ fontSize: 10, color: '#00E676', fontFamily: 'Syne Mono,monospace' }}>✓ Ohodnoceno</div>}
                    <div style={{ fontSize: 16, color: 'rgba(240,235,225,.2)' }}>→</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ animation: 'fadeUp .3s ease' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: '1px solid rgba(255,255,255,.07)', borderRadius: 8, color: G.mut, cursor: 'pointer', fontSize: 12, marginBottom: 20, padding: '8px 14px' }}>← Zpět</button>
            {(() => {
              const t = tickets.find(t => t.session_id === selected)
              const st = STATUS_META[t?.status || 'open']
              return (
                <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${st.color}, transparent)` }} />
                  <div style={{ padding: '16px 24px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.mut }}>#{selected.slice(0,8).toUpperCase()}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{t?.subject}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, fontSize: 9, fontFamily: 'Syne Mono,monospace', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {st.pulse && <div style={{ width: 5, height: 5, borderRadius: '50%', background: st.color, animation: 'pulse 1.4s infinite' }} />}
                      {st.icon} {st.label}
                    </span>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto' }}>
                    {messages.map((m, i) => {
                      const isUser = m.role === 'user'
                      const msgText = m.message?.startsWith('📧') ? (m.message.split(' | ')?.[1] || m.message) : m.message
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', animation: 'fadeUp .2s ease' }}>
                          {!isUser && <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>👑</div>}
                          <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isUser ? 'linear-gradient(135deg,#F0B429,#C8880A)' : 'rgba(255,255,255,.06)', color: isUser ? '#000' : G.wht, fontSize: 13, lineHeight: 1.55 }}>
                            {!isUser && <div style={{ fontSize: 9, color: 'rgba(240,180,41,.5)', marginBottom: 3, fontFamily: 'Syne Mono,monospace' }}>PODPORA</div>}
                            {msgText}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
