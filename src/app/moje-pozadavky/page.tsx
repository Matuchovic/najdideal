'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const G = { bg:'#020208', gl:'rgba(255,255,255,.04)', br:'rgba(255,255,255,.08)', wht:'#F0EBE1', mut:'rgba(240,235,225,.45)', g:'#F0B429', grn:'#00E676' }

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  open:        { label: 'Nový',           color: '#4D9FFF', bg: 'rgba(77,159,255,.1)',   icon: '🔵' },
  in_progress: { label: 'V řešení',       color: '#F0B429', bg: 'rgba(240,180,41,.1)',   icon: '⚙️' },
  resolved:    { label: 'Vyřešeno',       color: '#00E676', bg: 'rgba(0,230,118,.1)',    icon: '✅' },
  closed:      { label: 'Ukončen',        color: '#888',    bg: 'rgba(255,255,255,.05)', icon: '🔒' },
}

interface Ticket {
  session_id: string
  subject: string
  email: string
  status: string
  created_at: string
  last_message: string
}

export default function MojePozadavky() {
  const supabase = createClient()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      loadTickets(user.email || '')
    })
  }, [])

  async function loadTickets(email: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select('session_id, message, created_at, status')
      .ilike('message', `📧 ${email}%`)
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }

    const map = new Map<string, Ticket>()
    data.forEach((m: any) => {
      if (!map.has(m.session_id)) {
        const parts = m.message?.split(' | ')
        map.set(m.session_id, {
          session_id: m.session_id,
          email: email,
          subject: parts?.[1] || 'Bez předmětu',
          status: m.status || 'open',
          created_at: m.created_at,
          last_message: '',
        })
      }
    })

    // Načti status z posledních system zpráv
    for (const [sid, ticket] of map) {
      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('message, status, created_at')
        .eq('session_id', sid)
        .order('created_at', { ascending: false })
        .limit(5)
      if (msgs) {
        const statusMsg = msgs.find(m => m.message?.startsWith('__STATUS__'))
        if (statusMsg) ticket.status = statusMsg.message.replace('__STATUS__', '')
        const lastUserMsg = msgs.find(m => !m.message?.startsWith('__STATUS__') && !m.message?.startsWith('📧'))
        if (lastUserMsg) ticket.last_message = lastUserMsg.message
      }
    }

    setTickets(Array.from(map.values()))
    setLoading(false)
  }

  async function openTicket(sid: string) {
    setSelected(sid)
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true })
    setMessages((data || []).filter(m => !m.message?.startsWith('__STATUS__')))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.mut }}>
      Načítám...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.wht, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link href="/dashboard" style={{ color: G.mut, textDecoration: 'none', fontSize: 12 }}>← Dashboard</Link>
          <h1 style={{ fontFamily: 'Syne Mono,monospace', fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: G.g, margin: 0 }}>Moje požadavky</h1>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: G.mut }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
            <div style={{ fontSize: 14 }}>Zatím žádné požadavky</div>
            <Link href="/" style={{ display: 'inline-block', marginTop: 16, color: G.g, fontSize: 12 }}>Otevřít chat na hlavní stránce →</Link>
          </div>
        ) : !selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.map(t => {
              const st = STATUS_META[t.status] || STATUS_META.open
              return (
                <div key={t.session_id} onClick={() => openTicket(t.session_id)} style={{ padding: '18px 20px', background: G.gl, border: `1px solid ${G.br}`, borderRadius: 14, cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 24 }}>{st.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: G.wht, marginBottom: 4 }}>{t.subject}</div>
                    {t.last_message && <div style={{ fontSize: 12, color: G.mut, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.last_message}</div>}
                    <div style={{ fontSize: 10, color: G.mut, marginTop: 4, fontFamily: 'Syne Mono,monospace' }}>{new Date(t.created_at).toLocaleString('cs-CZ')}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, fontSize: 10, fontFamily: 'Syne Mono,monospace', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{st.label}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: G.mut, cursor: 'pointer', fontSize: 12, marginBottom: 20, padding: 0 }}>← Zpět na seznam</button>
            <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.g }}>#{selected.slice(0,8)}</span>
                {(() => { const t = tickets.find(t => t.session_id === selected); const st = STATUS_META[t?.status || 'open']; return <span style={{ padding: '3px 8px', borderRadius: 5, background: st.bg, color: st.color, fontSize: 9, fontFamily: 'Syne Mono,monospace', fontWeight: 700 }}>{st.label}</span> })()}
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
                {messages.map((m, i) => {
                  const isUser = m.role === 'user'
                  const msgText = m.message?.startsWith('📧') ? (m.message.split(' | ')?.[1] || m.message) : m.message
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isUser ? G.g : 'rgba(255,255,255,.06)', color: isUser ? '#000' : G.wht, fontSize: 13, lineHeight: 1.5 }}>
                        {!isUser && <div style={{ fontSize: 9, color: 'rgba(240,180,41,.5)', marginBottom: 3, fontFamily: 'Syne Mono,monospace' }}>PODPORA</div>}
                        {msgText}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
