'use client'
import { useEffect, useState, useRef } from 'react'
import type { ChatMessage } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const G = { bg:'#020208', gl:'rgba(255,255,255,.04)', br:'rgba(255,255,255,.08)', wht:'#F0EBE1', mut:'rgba(240,235,225,.45)', g:'#F0B429', grn:'#00E676', red:'#FF3B5C', blu:'#4D9FFF' }

type SessionStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

const STATUS_META: Record<SessionStatus, { label: string; color: string; bg: string }> = {
  open:        { label: 'Nový',         color: '#4D9FFF', bg: 'rgba(77,159,255,.15)' },
  in_progress: { label: 'V řešení',     color: '#F0B429', bg: 'rgba(240,180,41,.15)' },
  resolved:    { label: 'Vyřešeno',     color: '#00E676', bg: 'rgba(0,230,118,.15)' },
  closed:      { label: 'Případ ukončen', color: 'rgba(240,235,225,.3)', bg: 'rgba(255,255,255,.05)' },
}

interface Session {
  session_id: string
  message: string
  created_at: string
  role: string
  status: SessionStatus
  email?: string
}

export default function AdminChat() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<string|null>(null)
  const [activeStatus, setActiveStatus] = useState<SessionStatus>('open')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadSessions()
    const ch = supabase.channel('admin-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
        loadSessions()
        if (activeSession) loadMessages(activeSession)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [activeSession])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadSessions() {
    const { data } = await supabase.from('chat_messages').select('session_id, message, created_at, role, status').order('created_at', { ascending: false })
    if (!data) return
    const map = new Map<string, Session>()
    data.forEach((m: any) => {
      if (!map.has(m.session_id)) map.set(m.session_id, m)
      // Aktualizuj status pokud je novější
      const existing = map.get(m.session_id)!
      if (m.status && m.status !== 'open') existing.status = m.status
      // Extrahuj email z první zprávy
      if (m.message?.startsWith('📧')) {
        const parts = m.message.split(' | ')
        existing.email = parts[0]?.replace('📧 ', '')
        existing.message = parts[1] || m.message
      }
    })
    setSessions(Array.from(map.values()))
  }

  async function loadMessages(sid: string) {
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at', { ascending: true })
    setMessages(data || [])
    const s = sessions.find(s => s.session_id === sid)
    if (s) setActiveStatus(s.status || 'open')
  }

  async function selectSession(sid: string) {
    setActiveSession(sid)
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at', { ascending: true })
    setMessages(data || [])
    const s = sessions.find(s => s.session_id === sid)
    setActiveStatus(s?.status || 'open')
    const hasAdminMsg = (data || []).some((m: ChatMessage) => m.role === 'admin')
    if (!hasAdminMsg) {
      await supabase.from('chat_messages').insert({ session_id: sid, role: 'admin', message: 'Dobrý den! Jak vám můžeme pomoci? 👋', status: 'in_progress' })
      await updateStatus(sid, 'in_progress')
    }
  }

  async function sendMessage() {
    if (!input.trim() || !activeSession) return
    await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'admin', message: input.trim() })
    setInput('')
  }

  async function updateStatus(sid: string, status: SessionStatus) {
    // Ulož status jako speciální systémovou zprávu
    await supabase.from('chat_messages').insert({ session_id: sid, role: 'system', message: `__STATUS__${status}`, status })
    setActiveStatus(status)
    setSessions(prev => prev.map(s => s.session_id === sid ? { ...s, status } : s))
    // Pošli klientovi info zprávu
    const labels: Record<SessionStatus, string> = {
      open: 'Případ otevřen',
      in_progress: 'Váš případ je nyní v řešení ⚙️',
      resolved: 'Váš případ byl vyřešen ✅',
      closed: 'Případ byl ukončen. Děkujeme za kontakt 👋',
    }
    if (status !== 'open') {
      await supabase.from('chat_messages').insert({ session_id: sid, role: 'admin', message: labels[status] })
    }
  }

  const activeSessionData = sessions.find(s => s.session_id === activeSession)
  const request = messages.find(m => m.message?.startsWith('📧'))
  const requestText = request?.message?.split(' | ')?.[1] || ''

  return (
    <div style={{ display: 'flex', height: '100vh', background: G.bg, color: G.wht, fontFamily: 'system-ui,sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: `1px solid ${G.br}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin" style={{ color: G.mut, textDecoration: 'none', fontSize: 12 }}>← Admin</Link>
          <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.g }}>Požadavky</span>
          <span style={{ marginLeft: 'auto', background: 'rgba(240,180,41,.15)', color: G.g, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontFamily: 'Syne Mono,monospace' }}>{sessions.length}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.length === 0 && <div style={{ padding: 20, fontSize: 12, color: G.mut }}>Žádné konverzace</div>}
          {sessions.map(s => {
            const st = STATUS_META[s.status || 'open']
            return (
              <div key={s.session_id} onClick={() => selectSession(s.session_id)} style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: `1px solid ${G.br}`, background: activeSession === s.session_id ? 'rgba(240,180,41,.08)' : 'transparent', borderLeft: activeSession === s.session_id ? `3px solid ${G.g}` : '3px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.g }}>#{s.session_id.slice(0,8)}</span>
                  <span style={{ fontSize: 9, fontFamily: 'Syne Mono,monospace', color: st.color, background: st.bg, padding: '2px 6px', borderRadius: 4 }}>{st.label}</span>
                </div>
                {s.email && <div style={{ fontSize: 10, color: G.g, marginBottom: 2 }}>📧 {s.email}</div>}
                <div style={{ fontSize: 11, color: G.mut, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.message}</div>
                <div style={{ fontFamily: 'Syne Mono,monospace', fontSize: 8, color: G.mut, marginTop: 4 }}>{new Date(s.created_at).toLocaleString('cs-CZ')}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeSession ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.mut, fontSize: 13 }}>Vyber požadavek vlevo</div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '12px 24px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.g }}>SESSION #{activeSession.slice(0,8)}</div>
                {activeSessionData?.email && <div style={{ fontSize: 11, color: G.mut, marginTop: 2 }}>📧 {activeSessionData.email}</div>}
              </div>
              {requestText && (
                <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(240,180,41,.06)', border: '1px solid rgba(240,180,41,.15)', borderRadius: 8, fontSize: 12, color: 'rgba(240,235,225,.7)' }}>
                  <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 8, color: G.g, marginRight: 6 }}>POŽADAVEK:</span>
                  {requestText}
                </div>
              )}
              {/* Status buttony */}
              <div style={{ display: 'flex', gap: 6 }}>
                {(Object.entries(STATUS_META) as [SessionStatus, typeof STATUS_META[SessionStatus]][]).map(([key, meta]) => (
                  <button key={key} onClick={() => updateStatus(activeSession, key)} style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${activeStatus === key ? meta.color : G.br}`, background: activeStatus === key ? meta.bg : 'transparent', color: activeStatus === key ? meta.color : G.mut, fontFamily: 'Syne Mono,monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s' }}>
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zprávy */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.filter(m => !m.message?.startsWith('__STATUS__')).map(m => {
                const isUser = m.role === 'user'
                const isAdmin = m.role === 'admin'
                const msgText = m.message?.startsWith('📧') ? (m.message.split(' | ')?.[1] || m.message) : m.message
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isAdmin ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isAdmin ? G.g : G.gl, color: isAdmin ? '#000' : G.wht, fontSize: 13, lineHeight: 1.5 }}>
                      {isUser && <div style={{ fontSize: 9, color: 'rgba(240,235,225,.4)', marginBottom: 4, fontFamily: 'Syne Mono,monospace' }}>KLIENT</div>}
                      {msgText}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${G.br}`, display: 'flex', gap: 10 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Odpověz zákazníkovi..." style={{ flex: 1, background: G.gl, border: `1px solid ${G.br}`, borderRadius: 8, padding: '10px 14px', color: G.wht, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={sendMessage} style={{ background: G.g, color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne Mono,monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>Odeslat</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
