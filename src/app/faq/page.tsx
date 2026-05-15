'use client'
import { useState } from 'react'
import Link from 'next/link'


const faqs = [
  { q: 'Co je NajdiDeal?', a: 'NajdiDeal je prémiová AI platforma, která denně skenuje stovky nabídek na marketplace platformách, sleduje affiliate programy a trend produkty. Filtrujeme jen ty s reálným profit potenciálem a VIP členové je dostávají jako první.' },
  { q: 'Jak rychle uvidím první profit?', a: 'Záleží na tvé aktivitě. Naši členové průměrně vydělají první profit do 7 dní od připojení. Nejrychlejší dealy – typicky marketplace flipy – se prodají do 24–48 hodin.' },
  { q: 'Je to legální?', a: 'Ano, absolutně. Marketplace flipy jsou standardní obchodní činnost. Kupuješ a prodáváš produkty legálně. Affiliate marketing je standardní online byznys model.' },
  { q: 'Jaký je rozdíl mezi FREE a VIP?', a: 'FREE členové dostávají základní dealy se zpožděním. VIP členové dostávají alerty jako první, mají přístup k exkluzivním dealům, AI příležitostem a soukromé komunitě.' },
  { q: 'Mohu zrušit kdykoliv?', a: 'Ano. Žádné závazky, žádné skryté poplatky. Zrušíš jedním klikem v nastavení účtu. Přístup trvá do konce zaplacené periody.' },
  { q: 'Jak funguje AI skenování?', a: 'Náš AI systém nepřetržitě monitoruje Bazoš, Facebook Marketplace, Aukro, Vinted a stovky dalších zdrojů. Každý deal hodnotí podle profit potenciálu, rychlosti prodeje a tržní poptávky.' },
  { q: 'Co jsou Marketplace Flipy?', a: 'Nakoupíš produkt za nízkou cenu a prodáš ho za tržní cenu. Průměrný profit na flip je 2 000–8 000 Kč. Nejrychlejší flipy trvají méně než 24 hodin.' },
  { q: 'Co jsou AI příležitosti?', a: 'Affiliate programy s vysokými provizemi (10–40%), pasivní příjem nástroje, dropshipping příležitosti a online byznys modely doporučené naším AI systémem.' },
  { q: 'Je zde komunita?', a: 'Ano. VIP členové mají přístup do soukromé Telegram skupiny kde sdílíme tipy, ověřené dealy, strategie a navzájem si pomáháme.' },
  { q: 'Jak se platí?', a: 'Přijímáme platební karty, bankovní převod a Apple/Google Pay. Platby jsou zabezpečeny šifrováním. Faktura přijde automaticky na email.' },
]

export default function FaqPage() {
  const [open, setOpen] = useState(-1)
  const S = { bg: '#020208', wht: '#F0EBE1', g: '#F0B429', mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)' }
  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.wht, fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: 'clamp(90px,12vw,120px) clamp(16px,5vw,56px) 80px', maxWidth: 800, width: '100%', margin: '0 auto' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>❓ Časté dotazy</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px,8vw,110px)', letterSpacing: 4, lineHeight: .85, marginBottom: 20 }}>MÁŠ <span style={{ color: S.g }}>OTÁZKY?</span></h1>
        <p style={{ fontSize: 14, color: S.mut, marginBottom: 56, fontWeight: 300, lineHeight: 1.9 }}>Odpovědi na nejčastější otázky. Nenašel jsi odpověď? Napiš nám na <a href="mailto:info@najdideal.cz" style={{ color: S.g, textDecoration: 'none' }}>info@najdideal.cz</a></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 64 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: S.gl, backdropFilter: 'blur(28px)', border: `1px solid ${open === i ? 'rgba(240,180,41,.22)' : S.br}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .3s' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', padding: '22px 28px', background: 'none', border: 'none', color: S.wht, fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span>{f.q}</span>
                <span style={{ fontSize: 20, color: S.g, transition: 'transform .3s', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 28px 24px' }}>
                  <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 18 }} />
                  <p style={{ fontSize: 13, color: S.mut, lineHeight: 1.88, fontWeight: 300 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 18, padding: 48, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
          <div style={{ fontSize: 32, marginBottom: 14 }}>💬</div>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 3, marginBottom: 10 }}>NENAŠEL JSI ODPOVĚĎ?</h3>
          <p style={{ fontSize: 13, color: S.mut, marginBottom: 28, fontWeight: 300 }}>Napiš nám. Odpovídáme do 24 hodin.</p>
          <Link href="/kontakt" style={{ background: '#F0B429', color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', borderRadius: 8, textDecoration: 'none' }}>Kontaktovat podporu →</Link>
        </div>
      </div>
    </div>
  )
}