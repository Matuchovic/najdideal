import Link from 'next/link'

const jobs = [
  { icon: '📢', title: 'Správce marketingu', type: 'Plný úvazek · Remote', desc: 'Hledáme zkušeného marketéra pro správu sociálních sítí, tvorbu obsahu a growth strategie. Budeš budovat brand NajdiDeal a přivádět nové členy.', skills: ['Social media marketing', 'Content creation', 'Growth hacking', 'Analytika'] },
  { icon: '🔍', title: 'Hledač dealů', type: 'Částečný úvazek · Remote', desc: 'Tvůj úkol je denně hledat nejlepší marketplace příležitosti, ověřovat profit potenciál a přidávat je do systému. Prémium za každý schválený deal.', skills: ['Marketplace knowledge', 'Analytické myšlení', 'Důslednost', 'Rychlost'] },
  { icon: '💻', title: 'IT specialista', type: 'Plný úvazek · Remote', desc: 'Hledáme fullstack vývojáře pro rozvoj platformy NajdiDeal. Next.js, Supabase, AI integrace. Pracuješ na produktu, který roste každý měsíc.', skills: ['Next.js / React', 'TypeScript', 'Supabase / PostgreSQL', 'AI/ML základy'] },
]

export default function KarieraPage() {
  const S = { bg: '#020208', wht: '#F0EBE1', g: '#F0B429', mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)' }
  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.wht, fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: '120px 56px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>🚀 Kariéra</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px,8vw,110px)', letterSpacing: 4, lineHeight: .85, marginBottom: 20 }}>PŘIPOJ SE <span style={{ color: S.g }}>K TÝMU</span></h1>
        <p style={{ fontSize: 14, color: S.mut, marginBottom: 64, fontWeight: 300, lineHeight: 1.9, maxWidth: 520 }}>Budujeme nejlepší deal platformu v ČR a SK. Hledáme lidi, kteří chtějí být součástí rychle rostoucího startupu.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 64 }}>
          {[{ n: '2 341+', l: 'Aktivních členů' }, { n: '247', l: 'Dealů měsíčně' }, { n: '100%', l: 'Remote tým' }].map(s => (
            <div key={s.l} style={{ background: S.gl, backdropFilter: 'blur(24px)', border: `1px solid ${S.br}`, borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, color: S.g, letterSpacing: 2, lineHeight: 1, textShadow: '0 0 40px rgba(240,180,41,.3)' }}>{s.n}</div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.mut, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: 3, marginBottom: 28 }}>OTEVŘENÉ <span style={{ color: S.g }}>POZICE</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 64 }}>
          {jobs.map(j => (
            <div key={j.title} style={{ background: S.gl, backdropFilter: 'blur(28px)', border: `1px solid ${S.br}`, borderRadius: 16, padding: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(240,180,41,.07)', border: '1px solid rgba(240,180,41,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{j.icon}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 5 }}>{j.title}</h3>
                  <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>{j.type}</div>
                  <p style={{ fontSize: 12, color: S.mut, lineHeight: 1.85, fontWeight: 300, marginBottom: 14, maxWidth: 500 }}>{j.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {j.skills.map(s => <span key={s} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 11px', borderRadius: 100, background: 'rgba(240,180,41,.07)', border: '1px solid rgba(240,180,41,.16)', color: S.g }}>{s}</span>)}
                  </div>
                </div>
                <a href={`mailto:info@najdideal.cz?subject=Zájem o pozici: ${j.title}`} style={{ flexShrink: 0, background: S.g, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 22px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>Reagovat →</a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(240,180,41,.04)', border: '1px solid rgba(240,180,41,.18)', borderRadius: 18, padding: 56, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
          <div style={{ fontSize: 32, marginBottom: 14 }}>🌟</div>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px,4vw,44px)', letterSpacing: 3, marginBottom: 12 }}>NENAŠEL JSI SVOJI POZICI?</h3>
          <p style={{ fontSize: 13, color: S.mut, marginBottom: 28, fontWeight: 300, maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.8 }}>Pošli nám svůj životopis. Rosteme rychle a vždy hledáme talentované lidi.</p>
          <a href="mailto:info@najdideal.cz?subject=Spontánní přihláška" style={{ background: '#F0B429', color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', borderRadius: 8, textDecoration: 'none' }}>Poslat životopis →</a>
        </div>
      </div>
    </div>
  )
}