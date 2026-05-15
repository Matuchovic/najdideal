'use client'
import { useState } from 'react'

export default function FaqSection() {
  const [open, setOpen] = useState(-1)
  const G = { g:'#F0B429', wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)' }
  const faqs = [
    {q:'Co je NajdiDeal?',a:'NajdiDeal je prémiová AI platforma, která denně skenuje stovky nabídek na marketplace platformách. Filtrujeme jen ty s reálným profit potenciálem a VIP členové je dostávají jako první.'},
    {q:'Jak rychle uvidím první profit?',a:'Naši členové průměrně vydělají první profit do 7 dní. Nejrychlejší dealy – marketplace flipy – se prodají do 24–48 hodin.'},
    {q:'Jaký je rozdíl mezi FREE a VIP?',a:'FREE členové dostávají základní dealy se zpožděním. VIP členové dostávají alerty jako první, mají přístup k exkluzivním dealům, AI příležitostem a soukromé komunitě.'},
    {q:'Mohu zrušit kdykoliv?',a:'Ano. Žádné závazky, žádné skryté poplatky. Zrušíš jedním klikem v nastavení účtu. Přístup trvá do konce zaplacené periody.'},
    {q:'Co jsou Marketplace Flipy?',a:'Nakoupíš produkt za nízkou cenu a prodáš ho za tržní cenu. Průměrný profit na flip je 2 000–8 000 Kč. Nejrychlejší flipy trvají méně než 24 hodin.'},
    {q:'Jak funguje AI skenování?',a:'Náš AI systém nepřetržitě monitoruje Bazoš, Facebook Marketplace, Aukro a stovky dalších zdrojů. Každý deal hodnotí podle profit potenciálu a tržní poptávky.'},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {faqs.map((f,i) => (
        <div key={i} style={{background:G.gl,backdropFilter:'blur(28px)',border:`1px solid ${open===i?'rgba(240,180,41,.22)':G.br}`,borderRadius:14,overflow:'hidden',transition:'border-color .3s'}}>
          <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%',padding:'20px 26px',background:'none',border:'none',color:G.wht,fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:600,textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
            <span>{f.q}</span>
            <span style={{fontSize:20,color:G.g,transition:'transform .3s',transform:open===i?'rotate(45deg)':'none',flexShrink:0}}>+</span>
          </button>
          {open===i&&(
            <div style={{padding:'0 26px 22px'}}>
              <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:16}} />
              <p style={{fontSize:13,color:G.mut,lineHeight:1.88,fontWeight:300}}>{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


