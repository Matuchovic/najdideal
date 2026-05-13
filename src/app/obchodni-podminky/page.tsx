export default function ObchodniPodminkyPage() {
  const S = { bg: '#020208', wht: '#F0EBE1', g: '#F0B429', mut: 'rgba(240,235,225,.38)' }
  const sections = [["1. Provozovatel a kontakt","Provozovatelem platformy NajdiDeal je Hosabut s.r.o., IČO: 23338342, sídlem Děčínská 552/1, Střížkov, 180 00 Praha. Kontakt: info@najdideal.cz"],["2. Předmět smlouvy","NajdiDeal poskytuje přístup k informační platformě nabízející dealové příležitosti, AI analýzy a komunitní obsah. Platforma neposkytuje finanční poradenství."],["3. Registrace a účet","Pro přístup k platformě je nutná registrace s platným emailem. Uživatel je zodpovědný za bezpečnost svého účtu. Je zakázáno sdílet přihlašovací údaje."],["4. Předplatné a platby","Předplatné se automaticky obnovuje. Ceny jsou v Kč včetně DPH. Platby jsou zpracovávány zabezpečenou platební bránou. Faktura je zasílána emailem."],["5. Zrušení předplatného","Předplatné lze zrušit kdykoliv v nastavení účtu nebo emailem na info@najdideal.cz. Přístup trvá do konce zaplacené periody."],["6. Práva a povinnosti uživatele","Uživatel se zavazuje: používat platformu pouze pro osobní účely, nesdílet obsah třetím stranám, nepoužívat automatizované nástroje pro scraping dat."],["7. Odpovědnost","NajdiDeal poskytuje informace a doporučení, nikoliv záruky zisku. Provozovatel nenese odpovědnost za ztráty vzniklé na základě informací z platformy."],["8. Reklamace","Reklamace zasílejte na info@najdideal.cz. Reklamaci vyřídíme do 30 dní."],["9. Změny podmínek","Vyhrazujeme si právo tyto podmínky měnit. O podstatných změnách informujeme emailem. Pokračování užívání platformy znamená souhlas."],["10. Rozhodné právo","Tyto podmínky se řídí právním řádem České republiky. Případné spory budou řešeny u příslušného soudu v České republice."]]
  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.wht, fontFamily: 'Syne, sans-serif' }}>
      <div style={{ padding: 'clamp(90px,12vw,120px) clamp(20px,5vw,56px) 80px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: S.g, marginBottom: 12 }}>📄 Právní dokumenty</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', letterSpacing: 4, lineHeight: .85, marginBottom: 16 }}>OBCHODNÍ <span style={{ color: S.g }}>PODMÍNKY</span></h1>
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