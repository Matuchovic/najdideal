'use client'
import Link from 'next/link'
import NajdiBot from '@/components/ui/NajdiBot'
import { useState } from 'react'

export const metadata = { title: 'VIP Členství', description: 'Získej VIP přístup k nejlepším dealům dřív než ostatní. Od 299 Kč/měsíc.' }


const plans = [
  { tier: 'ZDARMA', price: '0', per: 'navždy', color: 'rgba(240,235,225,.4)', desc: 'Pro vyzkoušení', features: ['Základní nabídky každý den', 'Zobrazení všech inzerátů', 'Přístup k marketplace'], locked: ['Okamžitá upozornění', 'Kontakt na prodejce', 'Přidávání inzerátů', 'Uložená hledání', 'Hlídač ceny'], featured: false },
  { tier: 'STANDARD', price: '299', per: 'měsíc', color: '#F0B429', desc: 'Pro aktivní nakupující a prodejce', features: ['Vše ze Zdarma', 'Okamžitá upozornění na nabídky', 'Kontakt na prodejce (tel + zprávy)', 'Až 5 inzerátů měsíčně', 'Soukromá komunita', 'Uložená hledání', 'Historie cen', 'Hlídač ceny – upozorní při slevě'], locked: ['Upozornění jako první', 'Až 20 inzerátů měsíčně', 'Boost inzerátu zdarma', 'Ověřený prodejce badge'], featured: true },
  { tier: 'PREMIUM', price: '699', per: 'měsíc', color: '#4D9FFF', desc: 'Pro maximální výhodu', features: ['Vše ze Standard', 'Upozornění jako první – dřív než ostatní', 'Až 20 inzerátů měsíčně', '1× Boost inzerátu zdarma měsíčně', 'Ověřený prodejce badge', 'Odhad správné ceny produktu', 'Statistiky inzerátů', 'Prioritní podpora do 4 hodin'], locked: [], featured: false },
]

const quiz = [
  { q: 'Chci jen prohlížet nabídky zdarma', rec: 0, tier: 'ZDARMA – 0 Kč', desc: 'Základní přístup bez poplatků. Prohlížíš inzeráty a vidíš nabídky. Kdykoliv upgraduj.', href: '/dashboard' },
  { q: 'Chci nakupovat výhodněji nebo prodávat', rec: 1, tier: 'STANDARD – 299 Kč/měsíc', desc: 'Okamžitá upozornění, kontakt na prodejce, až 5 inzerátů měsíčně. Nejoblíbenější volba.', href: '/dashboard' },
  { q: 'Chci být první u každé dobré nabídky', rec: 2, tier: 'PREMIUM – 699 Kč/měsíc', desc: 'Upozornění jako první, až 20 inzerátů, boost zdarma měsíčně a ověřený prodejce badge.', href: '/dashboard' },
  { q: 'Jsem firma, makléř nebo autobazar', rec: -1, tier: 'B2B – Firemní přístup', desc: 'Speciální podmínky pro firmy. Neomezené inzeráty, firemní profil a zvýrazněné zobrazení.', href: '/b2b' },
]

const G = {
  gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF',
  wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)',
  gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)',
}

export default function VipPage() {
  const [goal, setGoal] = useState(-1)

  return (
    <div style={{ background: '#020208', minHeight: '100vh', color: G.wht, fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .vip-wrap{padding:100px 20px 60px !important}
          .vip-grid{grid-template-columns:1fr !important}
          .quiz-grid{grid-template-columns:1fr 1fr !important}
        }
        @media(max-width:480px){
          .quiz-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div className="vip-wrap" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,56px) 80px', maxWidth: 1100, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 14 }}>Přístup</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,8vw,110px)', letterSpacing: 4, lineHeight: .85, marginBottom: 20 }}>
            VYBER SI <span style={{ color: G.gold }}>PŘÍSTUP</span>
          </h1>
          <p style={{ fontSize: 14, color: G.mut, fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.9 }}>
            Začni zdarma. Upgraduj kdykoliv. Zruš kdykoliv bez závazků.
          </p>
        </div>

        {/* QUIZ */}
        <div style={{ background: 'rgba(240,180,41,.03)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 20, padding: 'clamp(24px,4vw,48px)', marginBottom: 56, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 10 }}>Pomůžeme ti vybrat</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(22px,4vw,40px)', letterSpacing: 3, color: G.wht }}>CO HLAVNĚ HLEDÁŠ?</h2>
          </div>
          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }}>
            {quiz.map((q, i) => (
              <button key={i} onClick={() => setGoal(i)} style={{ background: goal === i ? 'rgba(240,180,41,.08)' : G.gl, border: `1px solid ${goal === i ? 'rgba(240,180,41,.3)' : G.br}`, borderRadius: 12, padding: '18px 16px', color: goal === i ? G.gold : G.mut, fontFamily: 'Syne, sans-serif', fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all .3s', fontWeight: 300, lineHeight: 1.5 }}>{q.q}</button>
            ))}
          </div>
          {goal >= 0 && (
            <div style={{ textAlign: 'center', padding: '24px 28px', background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.18)', borderRadius: 14, animation: 'fadeUp .4s ease both' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: 3, color: G.gold, marginBottom: 8 }}>{quiz[goal].tier}</div>
              <p style={{ fontSize: 12, color: G.mut, fontWeight: 300, lineHeight: 1.75, maxWidth: 400, margin: '0 auto 20px' }}>{quiz[goal].desc}</p>
              <a href={quiz[goal].href} style={{ background: quiz[goal].rec === -1 ? G.blu : G.gold, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', borderRadius: 8, textDecoration: 'none' }}>{quiz[goal].rec === -1 ? 'Přejít na B2B →' : 'Zobrazit plán →'}</a>
            </div>
          )}
        </div>

        {/* PLANS */}
        <div id="plans" className="vip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 36 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: p.featured ? 'rgba(240,180,41,.04)' : G.gl, backdropFilter: 'blur(28px)', border: `1px solid ${p.featured ? 'rgba(240,180,41,.25)' : G.br}`, borderRadius: 18, padding: '36px 28px', position: 'relative', overflow: 'hidden', transition: 'transform .3s' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${p.color},transparent)` }} />
              {p.featured && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: G.gold, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px', borderRadius: '0 0 7px 7px' }}>Nejoblíbenější</div>}
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: p.color, marginBottom: 6, marginTop: p.featured ? 14 : 0 }}>{p.tier}</div>
              <div style={{ fontSize: 11, color: G.mut, marginBottom: 20, fontWeight: 300 }}>{p.desc}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, letterSpacing: 2, color: p.featured ? G.gold : i === 2 ? G.blu : G.wht, lineHeight: 1, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 20 }}> Kč</span></div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, marginBottom: 20 }}>za {p.per}</div>
              {p.featured && <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.grn, marginBottom: 14 }}>🔒 Zakladatelská cena – zdraží se</div>}
              <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 18 }} />
              <ul style={{ listStyle: 'none', marginBottom: 24, padding: 0 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'rgba(240,235,225,.75)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontWeight: 300 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: G.grn, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </li>
                ))}
                {p.locked.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: G.mut, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontWeight: 300, opacity: .4 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: G.mut, flexShrink: 0, marginTop: 1 }}>✗</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" style={{ display: 'block', width: '100%', padding: '14px', borderRadius: 10, border: i === 0 ? `1px solid ${G.br}` : 'none', cursor: 'pointer', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: i === 0 ? 'rgba(255,255,255,.05)' : p.featured ? G.gold : G.blu, color: i === 0 ? G.wht : '#000', textDecoration: 'none', textAlign: 'center', boxShadow: p.featured ? '0 8px 24px rgba(240,180,41,.25)' : i === 2 ? '0 8px 24px rgba(77,159,255,.2)' : 'none' }}>
                {i === 0 ? 'Začít zdarma' : `Vybrat ${p.tier}`}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          {['✓ Zrušení kdykoliv', '✓ Bezpečná platba', '✓ Okamžitý přístup', '✓ Bez závazků'].map(t => (
            <div key={t} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, color: G.grn }}>{t}</div>
          ))}
        </div>

      </div>
    </div>
  )
}