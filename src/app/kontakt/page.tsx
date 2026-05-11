'use client'
import { useState } from 'react'

export default function KontaktPage() {
  const [sent, setSent] = useState(false)
  const S = { bg: '#020208', wht: '#F0EBE1', g: '#F0B429', mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)' }
  const inputStyle = { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 9, color: S.wht, fontFamily: 'Syne, sans-serif', fontSize: 13, outline: 'none' }
  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.wht, fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: '120px 56px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>📬 Kontakt</div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px,8vw,100px)', letterSpacing: 4, lineHeight: .85, marginBottom: 20 }}>NAPIŠ <span style={{ color: S.g }}>NÁM</span></h1>
            <p style={{ fontSize: 13, color: S.mut, marginBottom: 48, fontWeight: 300, lineHeight: 1.9 }}>Odpovídáme do 24 hodin. Pro VIP členy do 4 hodin.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '✉', label: 'Email', val: 'info@najdideal.cz', href: 'mailto:info@najdideal.cz' },
                { icon: '✈', label: 'Telegram', val: '@NajdiDeal', href: 'https://t.me/' },
                { icon: '🏢', label: 'Sídlo firmy', val: 'Hosabut s.r.o. · Děčínská 552/1 · Střížkov · 180 00 Praha', href: null },
                { icon: '🔢', label: 'IČO', val: '23338342', href: null },
              ].map(c => (
                <div key={c.label} style={{ background: S.gl, backdropFilter: 'blur(24px)', border: `1px solid ${S.br}`, borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(240,180,41,.08)', border: '1px solid rgba(240,180,41,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.g, marginBottom: 4 }}>{c.label}</div>
                    {c.href ? <a href={c.href} style={{ fontSize: 13, color: S.wht, textDecoration: 'none', fontWeight: 500 }}>{c.val}</a> : <div style={{ fontSize: 12, color: S.wht, fontWeight: 300, lineHeight: 1.6 }}>{c.val}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: S.gl, backdropFilter: 'blur(32px)', border: `1px solid ${S.br}`, borderRadius: 18, padding: 44, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, marginBottom: 6 }}>POŠLI ZPRÁVU</h2>
            <p style={{ fontSize: 11, color: S.mut, marginBottom: 28, fontWeight: 300 }}>Vyplň formulář a ozveme se ti.</p>
            {sent ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>ODESLÁNO!</h3>
                <p style={{ fontSize: 12, color: S.mut, fontWeight: 300 }}>Ozveme se do 24 hodin.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }}>
                {[{ l: 'Jméno', n: 'name', t: 'text', p: 'Tvoje jméno' }, { l: 'Email', n: 'email', t: 'email', p: 'vas@email.cz' }, { l: 'Předmět', n: 'subject', t: 'text', p: 'O co jde?' }].map(f => (
                  <div key={f.n} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.mut, marginBottom: 5 }}>{f.l}</label>
                    <input type={f.t} name={f.n} placeholder={f.p} required style={inputStyle} />
                  </div>
                ))}
                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.mut, marginBottom: 5 }}>Zpráva</label>
                  <textarea name="message" placeholder="Napiš svou zprávu…" required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: 16, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: '#F0B429', color: '#000', boxShadow: '0 8px 28px rgba(240,180,41,.25)' }}>Odeslat zprávu →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}