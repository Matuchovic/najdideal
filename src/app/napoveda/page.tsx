'use client'
import { useState } from 'react'
import Link from 'next/link'

export const metadata = { title: 'Nápověda', description: 'Návody a pomoc s používáním NajdiDeal platformy.' }


const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const CATEGORIES = [
  { emoji:'🚀', title:'Jak začít', color:G.grn, articles:[
    { q:'Jak se zaregistruji?', a:'Klikni na Začít zdarma na hlavní stránce. Stačí email a heslo. Registrace trvá 30 sekund.' },
    { q:'Co mohu dělat zdarma?', a:'Zdarma můžeš prohlížet všechny inzeráty. Pro kontaktování prodejce, přidávání inzerátů a upozornění potřebuješ Standard nebo Premium.' },
    { q:'Jak fungují upozornění?', a:'Nastav si co hledáš. Jakmile přibyde nabídka která odpovídá, okamžitě tě upozorníme.' },
    { q:'Jak nastavím profil?', a:'Jdi do Nastavení v horním menu. Tam změníš jméno, email, heslo a profilové informace.' },
  ]},
  { emoji:'🛒', title:'Marketplace', color:G.gold, articles:[
    { q:'Jak přidám inzerát?', a:'V marketplace klikni na Přidat inzerát. Vyplň název, popis, cenu, kategorii a přidej fotky.' },
    { q:'Jak upravím nebo smažu inzerát?', a:'Jdi do sekce Moje inzeráty. U každého inzerátu najdeš tlačítka Upravit a Smazat.' },
    { q:'Jaké kategorie jsou dostupné?', a:'Nemovitosti, Auta, Elektronika, Oblečení, Nábytek a Ostatní.' },
    { q:'Jak kontaktuji prodejce?', a:'Na detailu inzerátu uvidíš telefon a tlačítko pro chat. Dostupné od Standard plánu.' },
    { q:'Jak funguje chat?', a:'Klikni na Otevřít chat s prodejcem na detailu inzerátu. Chat je v reálném čase.' },
  ]},
  { emoji:'👑', title:'Členství', color:G.pur, articles:[
    { q:'Jaký je rozdíl mezi Standard a Premium?', a:'Standard (299 Kč) nabízí upozornění a kontakt na prodejce. Premium (699 Kč) přidává upozornění JAKO PRVNÍ, boost zdarma a ověřený badge.' },
    { q:'Jak zruším předplatné?', a:'Jdi do Nastavení, sekce Moje členství, Zrušit předplatné. Přístup máš do konce období.' },
    { q:'Co je zakladatelská cena?', a:'Kdo se přihlásí teď platí tuto cenu navždy. V budoucnu ceny zdražíme pro nové zákazníky.' },
    { q:'Mohu kdykoliv upgradovat?', a:'Ano. Upgrade je okamžitý. Downgrade se projeví od příštího fakturačního období.' },
  ]},
  { emoji:'⚡', title:'Boost inzerátů', color:G.org, articles:[
    { q:'Co je Boost inzerátu?', a:'Boost zvýrazní inzerát a zobrazí ho výše. Více lidí ho uvidí a prodáš rychleji.' },
    { q:'Kolik stojí Boost?', a:'7 dní – 79 Kč. 30 dní – 199 Kč. Nahoře 1 týden – 299 Kč. Premium dostává 1 boost zdarma měsíčně.' },
    { q:'Jak aktivuji Boost?', a:'V Moje inzeráty klikni na Boost u inzerátu. Vyber plán a zaplať kartou. Aktivuje se okamžitě.' },
    { q:'Jak dlouho Boost trvá?', a:'Podle plánu – 7 nebo 30 dní. Po uplynutí se automaticky deaktivuje.' },
  ]},
  { emoji:'💬', title:'Chat a zprávy', color:G.blu, articles:[
    { q:'Kde najdu všechny zprávy?', a:'V horním menu klikni na ikonu 💬 nebo jdi na /marketplace/zpravy.' },
    { q:'Jak poznám novou zprávu?', a:'V menu se zobrazí badge s počtem nepřečtených zpráv. Pošleme také email upozornění.' },
    { q:'Je chat bezpečný?', a:'Ano. Zprávy vidí pouze účastníci konverzace. Nikdy nesdílej citlivé údaje v chatu.' },
  ]},
  { emoji:'⚙️', title:'Účet a nastavení', color:'rgba(240,235,225,.6)', articles:[
    { q:'Jak změním heslo?', a:'Jdi do Nastavení, sekce Heslo. Pokud jsi heslo zapomněl, použij Zapomenuté heslo na přihlašovací stránce.' },
    { q:'Jak smažu účet?', a:'Kontaktuj nás na info@najdideal.cz. Smazání provedeme do 7 pracovních dní.' },
    { q:'Kde najdu faktury?', a:'Faktury jsou zasílány emailem. Sekce faktur v nastavení je v přípravě.' },
  ]},
  { emoji:'🔒', title:'Platby a bezpečnost', color:G.grn, articles:[
    { q:'Jak jsou platby zabezpečeny?', a:'Platby jsou přes zabezpečenou bránu. Čísla karet nejsou ukládána na našich serverech.' },
    { q:'Jaké platební metody přijímáte?', a:'Visa a Mastercard. Apple Pay a Google Pay přidáváme brzy.' },
    { q:'Co se stane po zrušení předplatného?', a:'Přístup máš do konce zaplaceného období. Pak se přepne na Zdarma plán.' },
    { q:'Vrátíte mi peníze?', a:'Při technických problémech na naší straně ano. Kontaktuj nás do 48 hodin od platby.' },
  ]},
  { emoji:'🏢', title:'Pro firmy (B2B)', color:G.blu, articles:[
    { q:'Nabízíte podmínky pro firmy?', a:'Ano. Pro realitní makléře, autobazary a výkupce máme speciální firemní plány.' },
    { q:'Kolik stojí firemní přístup?', a:'Ověřený prodejce 499 Kč, Makléř 1 990 Kč, Autobazar 2 490 Kč, Zastavárna 990 Kč měsíčně.' },
    { q:'Jak se přihlásím k B2B?', a:'Vyplň formulář na stránce Pro firmy (/b2b) a ozveme se do 24 hodin.' },
    { q:'Mohu mít firemní profil s logem?', a:'Ano, firemní plány zahrnují profil s logem, popisem a kontakty.' },
  ]},
]

function ArticleItem({ article }: { article: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${G.br}`, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'left' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, color: open ? G.wht : 'rgba(240,235,225,.85)', transition: 'color .2s', lineHeight: 1.5 }}>{article.q}</span>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: open ? G.gold : 'rgba(255,255,255,.06)', border: `1px solid ${open ? 'rgba(240,180,41,.3)' : G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: open ? '#000' : G.mut, flexShrink: 0, transition: 'all .3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height .35s ease' }}>
        <p style={{ fontSize: 13, color: G.mut, lineHeight: 1.85, fontWeight: 300, paddingBottom: 18 }}>{article.a}</p>
      </div>
    </div>
  )
}

export default function NapovedaPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = search.length > 1
    ? CATEGORIES.flatMap(c => c.articles
        .filter(a => a.q.toLowerCase().includes(search.toLowerCase()) || a.a.toLowerCase().includes(search.toLowerCase()))
        .map(a => ({ ...a, cat: c.title, color: c.color, emoji: c.emoji })))
    : []

  return (
    <div style={{ background: '#020208', minHeight: '100vh', color: G.wht, fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes ambOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
        @keyframes ambOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        @keyframes scanLine{0%{top:0%;opacity:0}5%{opacity:.6}95%{opacity:.6}100%{top:100%;opacity:0}}
        @media(max-width:900px){
          .help-grid{grid-template-columns:1fr !important}
          .cat-nav{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:8px !important;position:static !important;top:auto !important}
        }
        @media(max-width:600px){
          .cat-nav{grid-template-columns:repeat(2,1fr) !important}
        }
      `}</style>

      {/* AMBIENT */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 700, height: 700, background: 'radial-gradient(circle,rgba(240,180,41,.07) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', animation: 'ambOrb1 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle,rgba(77,159,255,.06) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', animation: 'ambOrb2 15s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(240,180,41,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.018) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%,black 0%,transparent 75%)' }} />
      </div>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,2,8,.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${G.br}`, padding: '0 clamp(20px,5vw,56px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 4, color: G.wht, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: G.gold, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000' }}>ND</div>
          NAJDI<span style={{ color: G.gold }}>DEAL</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/kontakt" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, textDecoration: 'none' }}>Kontakt</Link>
          <Link href="/dashboard" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#000', background: G.gold, padding: '7px 16px', borderRadius: 6, textDecoration: 'none' }}>Do aplikace →</Link>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* HERO */}
        <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${G.br}` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(240,180,41,.05) 0%,transparent 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.5),transparent)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,230,118,.4),transparent)', animation: 'scanLine 5s ease-in-out infinite', pointerEvents: 'none' }} />

          <div style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,56px) clamp(48px,6vw,80px)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(240,180,41,.06)', border: '1px solid rgba(240,180,41,.2)', marginBottom: 20, animation: 'fadeUp .6s ease both' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, display: 'inline-block', animation: 'glow 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: G.gold }}>Centrum nápovědy · Online 24/7</span>
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,100px)', letterSpacing: 4, lineHeight: .86, marginBottom: 24, animation: 'fadeUp .7s .06s ease both', opacity: 0, animationFillMode: 'forwards' }}>
              JAK TI MŮŽEME<br /><span style={{ color: G.gold }}>POMOCI?</span>
            </h1>

            {/* SEARCH */}
            <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto', animation: 'fadeUp .7s .12s ease both', opacity: 0, animationFillMode: 'forwards' }}>
              <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Hledej v nápovědě..."
                style={{ width: '100%', padding: '16px 18px 16px 50px', background: 'rgba(255,255,255,.06)', border: `1px solid ${G.br}`, borderRadius: 14, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 15, outline: 'none', transition: 'border-color .2s', backdropFilter: 'blur(20px)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(240,180,41,.4)' }}
                onBlur={e => { e.currentTarget.style.borderColor = G.br }}
              />
            </div>

            {/* SEARCH RESULTS */}
            {search.length > 1 && (
              <div style={{ maxWidth: 540, margin: '12px auto 0', background: 'rgba(6,6,14,.95)', border: `1px solid ${G.br}`, borderRadius: 12, overflow: 'hidden', textAlign: 'left' }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: '20px', fontSize: 13, color: G.mut }}>Nic nenalezeno. <Link href="/kontakt" style={{ color: G.gold, textDecoration: 'none' }}>Kontaktuj nás</Link>.</div>
                ) : filtered.map((a, i) => (
                  <button key={i} onClick={() => { const cat = CATEGORIES.findIndex(c => c.title === a.cat); setActiveCategory(cat); setSearch('') }} style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', borderBottom: `1px solid ${G.br}`, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16 }}>{a.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, color: G.wht, fontWeight: 500, marginBottom: 2 }}>{a.q}</div>
                      <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut, letterSpacing: 1, textTransform: 'uppercase' }}>{a.cat}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,56px) 120px' }}>
          <div className="help-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }}>

            {/* SIDEBAR */}
            <div className="cat-nav" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'sticky', top: 80 }}>
              {CATEGORIES.map((cat, i) => (
                <button key={i} onClick={() => setActiveCategory(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1px solid ${activeCategory === i ? cat.color + '33' : G.br}`, background: activeCategory === i ? cat.color + '08' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', color: activeCategory === i ? G.wht : G.mut }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.emoji}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: activeCategory === i ? 600 : 300 }}>{cat.title}</span>
                  {activeCategory === i && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />}
                </button>
              ))}
            </div>

            {/* ARTICLES */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${G.br}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: CATEGORIES[activeCategory].color + '12', border: `1px solid ${CATEGORIES[activeCategory].color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{CATEGORIES[activeCategory].emoji}</div>
                <div>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 3, color: G.wht, lineHeight: 1 }}>{CATEGORIES[activeCategory].title}</h2>
                  <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, letterSpacing: 1, marginTop: 4 }}>{CATEGORIES[activeCategory].articles.length} článků</div>
                </div>
              </div>
              <div>
                {CATEGORIES[activeCategory].articles.map((a, i) => (
                  <ArticleItem key={i} article={a} />
                ))}
              </div>

              {/* KONTAKT BOX */}
              <div style={{ marginTop: 40, padding: '28px', background: 'rgba(240,180,41,.03)', border: '1px solid rgba(240,180,41,.15)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#F0B429,transparent)' }} />
                <div style={{ fontSize: 36 }}>💬</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, marginBottom: 6 }}>Nenašel jsi odpověď?</div>
                  <p style={{ fontSize: 12, color: G.mut, lineHeight: 1.7, fontWeight: 300 }}>Napiš nám a odpovíme do 24 hodin.</p>
                </div>
                <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, background: G.gold, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0 }}>
                  Kontaktovat →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}