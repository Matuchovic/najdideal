export default function GdprPage() {
export const metadata = { title: 'Ochrana osobních údajů', description: 'Informace o zpracování osobních údajů dle GDPR.' }

  const S = { bg: '#020208', wht: '#F0EBE1', g: '#F0B429', mut: 'rgba(240,235,225,.38)', gl: 'rgba(255,255,255,.026)', br: 'rgba(255,255,255,.07)' }
  const sections = [["1. Správce osobních údajů","Správcem osobních údajů je společnost Hosabut s.r.o., IČO: 23338342, se sídlem Děčínská 552/1, Střížkov, 180 00 Praha. Kontaktní email: info@najdideal.cz"],["2. Jaké údaje zpracováváme","Zpracováváme pouze údaje nezbytné pro provoz služby: jméno a příjmení, emailovou adresu, informace o předplatném a platbách, technické údaje o přístupu k platformě."],["3. Účel zpracování","Vaše údaje používáme výhradně pro: poskytování služeb platformy NajdiDeal, zasílání alertů a notifikací, správu předplatného a fakturaci, zlepšování kvality naší služby."],["4. Právní základ zpracování","Zpracování je založeno na: plnění smlouvy (poskytování služby), oprávněném zájmu (bezpečnost platformy), vašem souhlasu (marketingová komunikace), splnění zákonné povinnosti."],["5. Doba uchování","Osobní údaje uchováváme po dobu trvání smluvního vztahu a následně po dobu stanovenou zákonem (typicky 5–10 let pro účetní doklady)."],["6. Vaše práva","Máte právo na přístup ke svým údajům, jejich opravu nebo výmaz, omezení zpracování, přenositelnost dat, odvolání souhlasu a podání stížnosti u ÚOOÚ. Kontakt: info@najdideal.cz"],["7. Předávání třetím stranám","Vaše údaje neprodáváme třetím stranám. Sdílíme je pouze s poskytovateli nezbytných služeb (platební brána, email provider, hosting)."],["8. Cookies","Používáme technické cookies nezbytné pro fungování platformy. Analytické cookies používáme pouze s vaším souhlasem."],["9. Kontakt","Pro dotazy ohledně osobních údajů: info@najdideal.cz nebo písemně: Hosabut s.r.o., Děčínská 552/1, 180 00 Praha."]]
  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.wht, fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: 'clamp(90px,12vw,120px) clamp(20px,5vw,56px) 80px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>🔒 Právní dokumenty</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', letterSpacing: 4, lineHeight: .85, marginBottom: 16 }}>OCHRANA OSOBNÍCH <span style={{ color: S.g }}>ÚDAJŮ</span></h1>
        <p style={{ fontSize: 13, color: S.mut, marginBottom: 56, fontWeight: 300 }}>Platné od 1. 1. 2026 · Hosabut s.r.o.</p>
        {sections.map(([h, t]: string[]) => (
          <div key={h} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Syne Mono, monospace', fontSize: 13, fontWeight: 700, color: S.g, marginBottom: 12, letterSpacing: 1 }}>{h}</h2>
            <p style={{ fontSize: 13, color: 'rgba(240,235,225,.6)', lineHeight: 1.9, fontWeight: 300, borderLeft: '2px solid rgba(240,180,41,.2)', paddingLeft: 20 }}>{t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}