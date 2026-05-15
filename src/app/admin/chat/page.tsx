'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const G = { bg:'#020208', gl:'rgba(255,255,255,.04)', br:'rgba(255,255,255,.08)', wht:'#F0EBE1', mut:'rgba(240,235,225,.45)', g:'#F0B429', grn:'#00E676' }

export default function AdminChat() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<any[]>([])
  const [activeSession, setActiveSession] = useState<string|null>(null)
  const [messages, setMessages] = useState<any[]>([])
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadSessions() {
    const { data } = await supabase.from('chat_messages').select('session_id, message, created_at, role').order('created_at', { ascending: false })
    if (!data) return
    const map = new Map()
    data.forEach(m => { if (!map.has(m.session_id)) map.set(m.session_id, m) })
    setSessions(Array.from(map.values()))
  }

  async function loadMessages(sid: string) {
    const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at', { ascending: true })
    setMessages(data || [])
  }

  function selectSession(sid: string) { setActiveSession(sid); loadMessages(sid) }

  async function sendMessage() {
    if (!input.trim() || !activeSession) return
    await supabase.from('chat_messages').insert({ session_id: activeSession, role: 'admin', message: input.trim() })
    setInput('')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: G.bg, color: G.wht, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ width: 280, borderRight: `1px solid ${G.br}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin" style={{ color: G.mut, textDecoration: 'none', fontSize: 12 }}>← Admin</Link>
          <span style={{ fontFamily: 'Syne Mono,monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.g }}>Live Chat</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.length === 0 && <div style={{ padding: 20, fontSize: 12, color: G.mut }}>Žádné konverzace</div>}
          {sessions.map(s => (
            <div key={s.session_id} onClick={() => selectSession(s.session_id)} style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: `1px solid ${G.br}`, background: activeSession === s.session_id ? 'rgba(240,180,41,.08)' : 'transparent', borderLeft: activeSession === s.session_id ? `3px solid ${G.g}` : '3px solid transparent' }}>
              <div style={{ fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.g, marginBottom: 4 }}>#{s.session_id.slice(0,8)}</div>
              <div style={{ fontSize: 11, color: G.mut, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.message}</div>
              <div style={{ fontFamily: 'Syne Mono,monospace', fontSize: 8, color: G.mut, marginTop: 4 }}>{new Date(s.created_at).toLocaleString('cs-CZ')}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeSession ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.mut, fontSize: 13 }}>Vyber konverzaci vlevo</div>
        ) : (
          <>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${G.br}`, fontFamily: 'Syne Mono,monospace', fontSize: 9, color: G.g }}>SESSION #{activeSession.slice(0,8)}</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'admin' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.role === 'admin' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'admin' ? G.g : G.gl, color: m.role === 'admin' ? '#000' : G.wht, fontSize: 13, lineHeight: 1.5 }}>{m.message}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
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
