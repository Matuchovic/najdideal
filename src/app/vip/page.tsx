'use client'
import Link from 'next/link'
import { useState } from 'react'

const plans = [
  { tier: 'FREE', price: '0', per: 'navždy', color: 'rgba(240,235,225,.38)', desc: 'Základní přístup', features: ['Základní dealy každý den', 'Veřejné alerty'], locked: ['VIP dealy a flipy', 'Rychlé alerty jako první', 'AI příležitosti', 'Soukromá komunita', 'VIP obsah'] },
  { tier: 'VIP', price: '499', per: 'měsíc', color: '#F0B429', desc: 'Nejoblíbenější volba', features: ['Vše z Free', 'VIP dealy a flipy', 'Rychlé alerty jako první', 'Soukromá komunita'], locked: ['AI deep scan', 'Dedikovaný support', 'Ultra alerty 24/7'] },
  { tier: 'VIP PRO', price: '999', per: 'měsíc', color: '#4D9FFF', desc: 'Pro seriózní hráče', features: ['Vše z VIP', 'AI deep scan', 'Dedikovaný support', 'Trend predictions'], locked: ['Ultra alerty 24/7'] },
  { tier: 'VIP ULTRA', price: '1999', per: 'měsíc', color: '#9B5DE5', desc: 'Ultra výhoda', features: ['Vše z VIP PRO', 'Ultra alerty 24/7', 'AI profit scoring', 'Priority support'], locked: [] },
  { tier: 'VIP MAX', price: '2799', per: 'měsíc', color: '#FF6B35', desc: 'Inner circle – jen pro elitu', features: ['Vše z VIP ULTRA', 'Osobní deal konzultace', 'Exkluzivní mastermind', 'First-access all deals', 'Max priority'], locked: [] },
]

const recs = [
  { tier: 'VIP – 499 Kč/měsíc', desc: 'Pro začátek stačí VIP. Dostaneš prověřené flipy a alerty s reálným profit potenciálem 2 000–5 000 Kč měsíčně.' },
  { tier: 'VIP PRO – 999 Kč/měsíc', desc: 'Pro 10 000+ Kč potřebuješ VIP PRO s AI deep scanem, trend predictions a dedikovanou podporou.' },
  { tier: 'VIP ULTRA – 1 999 Kč/měsíc', desc: 'Pro pasivní příjem doporučujeme VIP ULTRA – AI profit scoring a ultra alerty 24/7.' },
  { tier: 'VIP MAX – 2 799 Kč/měsíc', desc: 'Pokud chceš maximum, VIP MAX je inner circle. Osobní konzultace, first-access a mastermind skupina.' },
]

export default function VipPage() {
  const [goal, setGoal] = useState(-1)
  return (
    <div style={{ background: '#020208', minHeight: '100vh', color: '#F0EBE1', fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: '120px 56px 80px', maxWidth: 1300, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#F0B429', marginBottom: 14 }}>👑 Exkluzivní přístup</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px,8vw,110px)', letterSpacing: 4, lineHeight: .85, marginBottom: 20 }}>
            VYBER SI <span style={{ color: '#F0B429' }}>VIP ÚROVEŇ</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(240,235,225,.38)', fontWeight: 300, maxWidth: 520, margin: '0 auto', lineHeight: 1.9 }}>Čím vyšší úroveň, tím dřív dostaneš ty nejlepší příležitosti. Zruš kdykoliv.</p>
        </div>

        {/* QUIZ */}
        <div style={{ background: 'rgba(240,180,41,.03)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 20, padding: 48, marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#F0B429', marginBottom: 10 }}>🤖 AI Doporučení</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(24px,4vw,44px)', letterSpacing: 3, color: '#F0EBE1' }}>JAKÁ VIP ÚROVEŇ JE PRO TEBE?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 28 }}>
            {['Chci vydělat extra 2 000–5 000 Kč měsíčně', 'Chci vydělat 10 000+ Kč měsíčně', 'Chci pasivní příjem z AI a affiliate', 'Chci maximum ze všech příležitostí'].map((q, i) => (
              <button key={i} onClick={() => setGoal(i)} style={{ background: goal === i ? 'rgba(240,180,41,.08)' : 'rgba(255,255,255,.026)', border: `1px solid ${goal === i ? 'rgba(240,180,41,.3)' : 'rgba(255,255,255,.07)'}`, borderRadius: 12, padding: '18px 16px', color: goal === i ? '#F0B429' : 'rgba(240,235,225,.38)', fontFamily: 'Syne, sans-serif', fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all .3s', fontWeight: 300, lineHeight: 1.5 }}>{q}</button>
            ))}
          </div>
          {goal >= 0 && (
            <div style={{ textAlign: 'center', padding: 28, background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.18)', borderRadius: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, color: '#F0B429', marginBottom: 8 }}>{recs[goal].tier}</div>
              <p style={{ fontSize: 12, color: 'rgba(240,235,225,.38)', fontWeight: 300, lineHeight: 1.75, maxWidth: 400, margin: '0 auto 20px' }}>{recs[goal].desc}</p>
              <a href="#plans" style={{ background: '#F0B429', color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', borderRadius: 8, textDecoration: 'none' }}>Vybrat tento plán</a>
            </div>
          )}
        </div>

        {/* PLANS */}
        <div id="plans" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 56 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: i === 1 ? 'rgba(240,180,41,.04)' : i === 4 ? 'rgba(255,107,53,.04)' : 'rgba(255,255,255,.026)', backdropFilter: 'blur(28px)', border: `1px solid ${i === 1 ? 'rgba(240,180,41,.25)' : i === 4 ? 'rgba(255,107,53,.25)' : 'rgba(255,255,255,.07)'}`, borderRadius: 18, padding: '36px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${p.color},transparent)` }} />
              {(i === 1 || i === 4) && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: i === 1 ? '#F0B429' : '#FF6B35', color: i === 1 ? '#000' : '#fff', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px', borderRadius: '0 0 7px 7px' }}>{i === 1 ? 'Nejoblíbenější' : 'Elite'}</div>}
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: p.color, marginBottom: 6, marginTop: i === 1 || i === 4 ? 14 : 0 }}>{p.tier}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,235,225,.38)', marginBottom: 20, fontWeight: 300 }}>{p.desc}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, letterSpacing: 2, color: p.color, lineHeight: 1, marginBottom: 4, textShadow: `0 0 30px ${p.color}44` }}>{p.price}<span style={{ fontSize: 20 }}> Kč</span></div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: 'rgba(240,235,225,.38)', marginBottom: 22 }}>za {p.per}</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 18 }} />
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {p.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(240,235,225,.75)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontWeight: 300 }}><span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#00E676', flexShrink: 0 }}>✓</span>{f}</li>)}
                {p.locked.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(240,235,225,.38)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontWeight: 300, opacity: .38 }}><span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(240,235,225,.38)', flexShrink: 0 }}>✗</span>{f}</li>)}
              </ul>
              <button onClick={() => alert('Platby spouštíme brzy! info@najdideal.cz 🚀')} style={{ width: '100%', padding: 14, borderRadius: 10, border: i === 0 ? '1px solid rgba(255,255,255,.08)' : 'none', cursor: 'pointer', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: i === 0 ? 'rgba(255,255,255,.05)' : p.color, color: i === 0 ? '#F0EBE1' : '#000' }}>{i === 0 ? 'Připojit zdarma' : 'Vybrat ' + p.tier}</button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {['✓ Zrušení kdykoliv', '✓ Bezpečná platba', '✓ Okamžitý přístup', '✓ Bez závazků'].map(t => <div key={t} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, color: '#00E676' }}>{t}</div>)}
        </div>
      </div>
    </div>
  )
}