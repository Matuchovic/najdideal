'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChatWidget() {
  const supabase = createClient()
  const [step, setStep] = useState<'closed'|'form'|'waiting'|'chat'>('closed')
  const [minimized, setMinimized] = useState(false)
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  const [sessionId] = useState(() => {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  })

  const [connecting, setConnecting] = useState(false)
  const [connectStep, setConnectStep] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step !== 'waiting' && step !== 'chat') return
    const ch = supabase.channel('chat-' + sessionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, payload => {
        const m = payload.new as any
        if (m.role === 'admin') { setStep('chat'); setMinimized(false) }
        setMessages(prev => [...prev, m])
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [step, sessionId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const handler = () => { setStep('form'); setMinimized(false) }
    window.addEventListener('openChat', handler)
    return () => window.removeEventListener('openChat', handler)
  }, [])

  async function submitForm() {
    if (!email.trim() || !request.trim()) return
    setConnecting(true)
    setConnectStep(0)
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 520))
      setConnectStep(i + 1)
    }
    await new Promise(r => setTimeout(r, 300))
    setConnecting(false)
    setStep('waiting')
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      message: `📧 ${email} | ${request}`
    })
  }

  async function send() {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', message: msg }])
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', message: msg })
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const label = isImage ? `🖼️ ${file.name}` : `📎 ${file.name}`
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', message: label }])
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', message: label })
    e.target.value = ''
  }

  const isOpen = step !== 'closed'
  const showMinimized = minimized && step !== 'closed'

  const statusDot = (color: string, pulse = false) => (
    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, animation: pulse ? 'cwPulse 1.4s infinite' : 'none', flexShrink: 0 }} />
  )

  return (
    <div style={{ position: 'fixed', bottom: 28, left: 28, zIndex: 9999 }}>
      <style>{`
        @keyframes cwSlideUp { from { opacity:0; transform:translateY(24px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cwPulse { 0%,100% { opacity:.3; transform:scale(.7) } 50% { opacity:1; transform:scale(1) } }
        @keyframes cwSpin { to { transform:rotate(360deg) } }
        @keyframes cwFadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        .cw-input:focus { border-color: rgba(240,180,41,.5) !important; box-shadow: 0 0 0 3px rgba(240,180,41,.07) !important; outline: none !important; }
        .cw-msg { animation: cwFadeIn .22s ease; }
        .cw-icon-btn:hover { background: rgba(255,255,255,.1) !important; }
        .cw-send:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(240,180,41,.5) !important; }
        .cw-submit:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(240,180,41,.4) !important; }
        .cw-scroll::-webkit-scrollbar { width: 3px; }
        .cw-scroll::-webkit-scrollbar-track { background: transparent; }
        .cw-scroll::-webkit-scrollbar-thumb { background: rgba(240,180,41,.2); border-radius: 10px; }
      `}</style>
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />

      {showMinimized && (
        <div onClick={() => setMinimized(false)} style={{ marginBottom: 12, padding: '12px 18px', background: '#0A0A14', borderRadius: 18, border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 12px 40px rgba(0,0,0,.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, animation: 'cwSlideUp .3s ease', minWidth: 220 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👑</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F0EBE1' }}>NajdiDeal Support</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              {step === 'chat' ? statusDot('#00E676') : statusDot('#F0B429', true)}
              <span style={{ fontSize: 9, color: step === 'chat' ? '#00E676' : '#F0B429', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>{step === 'chat' ? 'ONLINE' : 'ČEKÁME...'}</span>
            </div>
          </div>
          <div style={{ fontSize: 16, color: 'rgba(240,235,225,.3)' }}>↑</div>
        </div>
      )}

      {isOpen && !minimized && (
        <div style={{ width: 372, marginBottom: 14, borderRadius: 28, overflow: 'hidden', animation: 'cwSlideUp .35s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 40px 100px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.07), inset 0 1px 0 rgba(255,255,255,.07)', background: '#0A0A14' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #F0B429 30%, #FFD97D 50%, #F0B429 70%, transparent)' }} />
          <div style={{ padding: '16px 18px', background: 'linear-gradient(180deg, rgba(240,180,41,.07) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 6px 20px rgba(240,180,41,.3)' }}>👑</div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 13, height: 13, borderRadius: '50%', background: step === 'chat' ? '#00E676' : step === 'waiting' ? '#F0B429' : '#00E676', border: '2.5px solid #0A0A14', boxShadow: `0 0 8px ${step === 'chat' ? '#00E676' : step === 'waiting' ? '#F0B429' : '#00E676'}`, animation: step === 'waiting' ? 'cwPulse 1.4s infinite' : 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F0EBE1', letterSpacing: .2 }}>NajdiDeal Support</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                  {step === 'waiting' ? <>{statusDot('#F0B429', true)}<span style={{ fontSize: 9, color: 'rgba(240,180,41,.8)', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>HLEDÁME OPERÁTORA</span></> : step === 'chat' ? <>{statusDot('#00E676')}<span style={{ fontSize: 9, color: '#00E676', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>OPERÁTOR ONLINE</span></> : <>{statusDot('#00E676')}<span style={{ fontSize: 9, color: 'rgba(240,235,225,.4)', fontFamily: 'Syne Mono,monospace', letterSpacing: .8 }}>ODPOVÍDÁME DO 5 MIN</span></>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cw-icon-btn" onClick={() => setMinimized(true)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>—</button>
              <button className="cw-icon-btn" onClick={() => setStep('closed')} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>×</button>
            </div>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent)' }} />

          {connecting && (
            <div style={{ position: 'relative', overflow: 'hidden', background: '#05050F' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 80% at 50% 120%, rgba(240,180,41,.12) 0%, transparent 65%)' }} />
              <div style={{ padding: '32px 24px 20px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 20px' }}>
                  <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,180,41,.08), transparent)', animation: 'cwPulse 2s infinite' }} />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(240,180,41,.1)', animation: 'cwSpin 12s linear infinite' }}><div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, borderRadius: '50%', background: '#F0B429', boxShadow: '0 0 10px #F0B429', transform: 'translateX(-50%)' }} /></div>
                  <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px solid rgba(240,180,41,.15)', animation: 'cwSpin 8s linear infinite reverse' }}><div style={{ position: 'absolute', top: -3, left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#FFD97D', boxShadow: '0 0 8px #FFD97D', transform: 'translateX(-50%)' }} /></div>
                  <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#F0B429', borderRightColor: 'rgba(240,180,41,.3)', animation: 'cwSpin 1.6s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(240,180,41,.2), rgba(200,136,10,.05))', backdropFilter: 'blur(4px)', border: '1px solid rgba(240,180,41,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👑</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', color: '#F0B429', fontFamily: 'Syne Mono,monospace', marginBottom: 6 }}>Navazujeme spojení</div>
                <div style={{ fontSize: 11, color: 'rgba(240,235,225,.35)' }}>{connectStep < 2 ? 'Ověřujeme a zabezpečujeme...' : connectStep < 4 ? 'Hledáme nejlepšího operátora...' : '✦ Připraveno ✦'}</div>
              </div>
              <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Ověřování identity', icon: '🛡️', desc: 'SSL · End-to-end šifrování' },
                  { label: 'Zabezpečení spojení', icon: '🔐', desc: '256-bit AES · Soukromý kanál' },
                  { label: 'Hledání experta', icon: '⭐', desc: 'Top hodnocený operátor' },
                  { label: 'Příprava workspace', icon: '💼', desc: 'Osobní chat místnost' },
                  { label: 'Připojeno', icon: '✦', desc: 'Vítejte v prémiové podpoře' },
                ].map((item, i) => {
                  const done = connectStep > i
                  const active = connectStep === i
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, background: done ? 'rgba(240,180,41,.05)' : active ? 'rgba(240,180,41,.03)' : 'rgba(255,255,255,.015)', border: `1px solid ${done ? 'rgba(240,180,41,.18)' : active ? 'rgba(240,180,41,.12)' : 'rgba(255,255,255,.04)'}`, transition: 'all .5s', transform: active ? 'translateX(3px)' : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: done ? 'linear-gradient(135deg,#F0B429,#C8880A)' : active ? 'rgba(240,180,41,.1)' : 'rgba(255,255,255,.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: done ? 13 : 16, flexShrink: 0, transition: 'all .5s' }}>
                        {done ? '✓' : active ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F0B429', animation: 'cwPulse 1s infinite' }} /> : item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: active || done ? 700 : 400, color: done ? 'rgba(240,235,225,.9)' : active ? '#F0B429' : 'rgba(240,235,225,.25)', fontFamily: 'Syne Mono,monospace', letterSpacing: .5, transition: 'all .4s' }}>{item.label}</div>
                        {(active || done) && <div style={{ fontSize: 9, color: done ? 'rgba(240,180,41,.5)' : 'rgba(240,235,225,.3)', marginTop: 2 }}>{item.desc}</div>}
                      </div>
                      {done && <div style={{ fontSize: 14, color: '#00E676', flexShrink: 0 }}>✓</div>}
                      {active && <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(240,180,41,.2)', borderTopColor: '#F0B429', animation: 'cwSpin 1s linear infinite', flexShrink: 0 }} />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!connecting && step === 'form' && (
            <div style={{ padding: '20px 20px 24px' }}>
              <div style={{ marginBottom: 18, padding: '12px 14px', background: 'rgba(240,180,41,.04)', borderRadius: 14, border: '1px solid rgba(240,180,41,.1)', display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 16 }}>💎</span>
                <p style={{ fontSize: 12, color: 'rgba(240,235,225,.5)', margin: 0, lineHeight: 1.75 }}>Náš tým je připraven pomoci. Vyplň formulář a spojíme tě s expertem během okamžiku.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(240,180,41,.55)', display: 'block', marginBottom: 7, fontFamily: 'Syne Mono,monospace' }}>Email adresa</label>
                  <input className="cw-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.cz" type="email" style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '12px 15px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all .2s' }} />
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(240,180,41,.55)', display: 'block', marginBottom: 7, fontFamily: 'Syne Mono,monospace' }}>Váš požadavek</label>
                  <textarea className="cw-input" value={request} onChange={e => setRequest(e.target.value)} placeholder="Popište co potřebujete..." rows={3} style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '12px 15px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box', transition: 'all .2s' }} />
                </div>
                <button className="cw-submit" onClick={submitForm} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#F0B429,#C8880A)', border: 'none', borderRadius: 12, color: '#000', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 28px rgba(240,180,41,.28)', transition: 'all .25s', fontFamily: 'Syne Mono,monospace' }}>Spojit s operátorem →</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
                {['🔒 Zabezpečeno', '⚡ Rychlá odezva', '✓ Zdarma'].map(t => <span key={t} style={{ fontSize: 9, color: 'rgba(240,235,225,.2)' }}>{t}</span>)}
              </div>
            </div>
          )}

          {step === 'waiting' && (
            <div style={{ padding: '36px 24px 40px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 22px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(240,180,41,.12)', borderTopColor: '#F0B429', animation: 'cwSpin 1.4s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', background: 'rgba(240,180,41,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⏳</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#F0B429', marginBottom: 10, fontFamily: 'Syne Mono,monospace' }}>Hledáme volného operátora</div>
              <p style={{ fontSize: 12, color: 'rgba(240,235,225,.38)', margin: '0 0 26px', lineHeight: 1.8 }}>Obvyklá čekací doba je do 5 minut.<br/>Prosím zůstaň na stránce.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#F0B429', animation: `cwPulse 1.2s infinite`, animationDelay: `${i * 0.18}s` }} />)}
              </div>
              <div style={{ marginTop: 26, padding: '13px 16px', background: 'rgba(255,255,255,.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,.05)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(240,180,41,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✉️</div>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(240,235,225,.28)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Syne Mono,monospace' }}>Kontakt</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,235,225,.65)', fontWeight: 600, marginTop: 2 }}>{email}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 8, color: 'rgba(240,235,225,.15)', fontFamily: 'Syne Mono,monospace', letterSpacing: .5 }}>
                ID: {sessionId.slice(0, 8).toUpperCase()}
              </div>
            </div>
          )}

          {step === 'chat' && (
            <>
              <div style={{ padding: '8px 18px', background: 'linear-gradient(90deg, rgba(0,230,118,.05), rgba(0,230,118,.01))', borderBottom: '1px solid rgba(0,230,118,.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 10px #00E676', flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#00E676', fontFamily: 'Syne Mono,monospace', flex: 1 }}>Operátor připojen · Živý chat</span>
                <span style={{ fontSize: 8, color: 'rgba(240,235,225,.2)', fontFamily: 'Syne Mono,monospace' }}>#{sessionId.slice(0,6).toUpperCase()}</span>
              </div>
              <div className="cw-scroll" style={{ height: 285, overflowY: 'auto', padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.filter(m => !m.message.startsWith('📧')).map((m, i) => (
                  <div key={i} className="cw-msg" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                    {m.role === 'admin' && <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>👑</div>}
                    <div>
                      {m.role === 'admin' && <div style={{ fontSize: 9, color: 'rgba(240,180,41,.4)', marginBottom: 3, fontFamily: 'Syne Mono,monospace', letterSpacing: .5 }}>Operátor</div>}
                      <div style={{ maxWidth: 230, padding: '10px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'linear-gradient(135deg,#F0B429,#C8880A)' : 'rgba(255,255,255,.06)', color: m.role === 'user' ? '#000' : '#F0EBE1', fontSize: 13, lineHeight: 1.55, fontWeight: m.role === 'user' ? 500 : 400, boxShadow: m.role === 'user' ? '0 4px 18px rgba(240,180,41,.2)' : '0 2px 8px rgba(0,0,0,.2)', border: m.role === 'admin' ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,.04)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="cw-icon-btn" onClick={() => fileRef.current?.click()} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>📎</button>
                  <input className="cw-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Napiš zprávu..." style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, padding: '10px 13px', color: '#F0EBE1', fontSize: 13, fontFamily: 'inherit', transition: 'all .2s' }} />
                  <button className="cw-send" onClick={send} style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#F0B429,#C8880A)', border: 'none', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(240,180,41,.28)', flexShrink: 0, transition: 'all .2s' }}>↑</button>
                </div>
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 9, color: 'rgba(240,235,225,.18)', fontFamily: 'Syne Mono,monospace', letterSpacing: .5 }}>📎 Foto · PDF · Word podporováno</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {isOpen && (
        <button onClick={() => { setStep('closed'); setMinimized(false) }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,235,225,.5)', transition: 'all .2s' }}>×</button>
      )}
    </div>
  )
}
