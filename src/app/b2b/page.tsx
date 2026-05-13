'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const PLANS = [
  {
    id:'seller',
    emoji:'⭐',
    title:'Ověřený prodejce',
    subtitle:'Pro aktivní prodejce',
    price:499,
    color:G.gold,
    features:[
      'Badge Ověřený prodejce na všech inzerátech',
      'Prioritní zobrazení ve výsledcích',
      'Zvýrazněný profil prodejce',
      'Až 20 inzerátů měsíčně',
      'Statistiky inzerátů',
      'Důvěryhodnost pro kupující',
    ],
    cta:'Aktivovat badge',
  },
  {
    id:'realtor',
    emoji:'🏠',
    title:'Realitní makléř',
    subtitle:'Pro realitní profesionály',
    price:1990,
    color:G.blu,
    features:[
      'Neomezené inzeráty nemovitostí',
      'Firemní profil s logem',
      'Badge Realitní kancelář',
      'Prioritní zobrazení v kategorii Nemovitosti',
      'Statistiky a analytika',
      'Dedikovaná podpora',
    ],
    cta:'Kontaktovat nás',
  },
  {
    id:'dealer',
    emoji:'🚗',
    title:'Autobazar',
    subtitle:'Pro prodejce vozidel',
    price:2490,
    color:G.grn,
    features:[
      'Neomezené inzeráty vozidel',
      'Firemní profil s logem a popisem',
      'Badge Ověřený autobazar',
      'Zvýrazněný profil v kategorii Auta',
      'Prioritní zobrazení',
      'Dedikovaná podpora + onboarding',
    ],
    cta:'Kontaktovat nás',
  },
  {
    id:'pawnshop',
    emoji:'💎',
    title:'Zastavárna & Výkup',
    subtitle:'Pro výkupní provozovny',
    price:990,
    color:G.pur,
    features:[
      'Neomezené inzeráty',
      'Firemní profil',
      'Badge Ověřená provozovna',
      'Zobrazení v relevantních kategoriích',
      'Statistiky',
      'Emailová podpora',
    ],
    cta:'Kontaktovat nás',
  },
]

export default function B2BPage() {
  const [hov, setHov] = useState(-1)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({name:'',email:'',company:'',type:'',message:''})
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  return (
    <div style={{background:'#020208',minHeight:'100vh',color:G.wht,fontFamily:'Syne, sans-serif'}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(0,230,118,.6)}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
      `}</style>

      {/* AMBIENT */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',right:'-5%',width:600,height:600,background:'radial-gradient(circle,rgba(240,180,41,.06) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(80px)'}} />
        <div style={{position:'absolute',bottom:'-10%',left:'-5%',width:500,height:500,background:'radial-gradient(circle,rgba(77,159,255,.05) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(80px)'}} />
      </div>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(2,2,8,.88)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'0 clamp(20px,5vw,56px)',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:4,color:G.wht,textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,background:G.gold,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#000'}}>ND</div>
          NAJDI<span style={{color:G.gold}}>DEAL</span>
        </Link>
        <Link href="/marketplace" style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,textDecoration:'none',padding:'7px 14px',border:'1px solid rgba(255,255,255,.08)',borderRadius:6}}>
          Marketplace →
        </Link>
      </nav>

      <div style={{position:'relative',zIndex:10}}>

        {/* HERO */}
        <section style={{padding:'clamp(80px,12vw,140px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)',textAlign:'center',maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'7px 20px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.2)',marginBottom:32,animation:'fadeUp .7s ease both'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,display:'inline-block',animation:'ping 2s infinite',flexShrink:0}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:10,letterSpacing:2,color:G.grn}}>Firemní přístup · Speciální podmínky</span>
          </div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(56px,10vw,130px)',letterSpacing:4,lineHeight:.86,marginBottom:24,animation:'fadeUp .8s .08s ease both',opacity:0,animationFillMode:'forwards'}}>
            PRODÁVEJTE<br/>VÍCE.<br/><span style={{color:G.gold}}>S NAMI.</span>
          </h1>
          <p style={{fontSize:'clamp(14px,2vw,17px)',color:G.mut,lineHeight:1.9,maxWidth:560,margin:'0 auto 48px',fontWeight:300,animation:'fadeUp .8s .2s ease both',opacity:0,animationFillMode:'forwards'}}>
            NajdiDeal nabízí speciální podmínky pro firmy, makléře, autobazary a výkupní provozovny. Oslovte tisíce aktivních kupujících každý den.
          </p>
          <div style={{display:'flex',gap:32,justifyContent:'center',flexWrap:'wrap',animation:'fadeUp .8s .3s ease both',opacity:0,animationFillMode:'forwards'}}>
            {[{n:'2 341+',l:'Aktivních uživatelů'},{n:'13 000+',l:'Inzerátů měsíčně'},{n:'4.8★',l:'Hodnocení platformy'}].map(s=>(
              <div key={s.l} style={{textAlign:'center'}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:G.gold,letterSpacing:2,lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut,letterSpacing:1,textTransform:'uppercase',marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PLANS */}
        <section style={{padding:'0 clamp(20px,5vw,56px) clamp(80px,10vw,120px)',maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:12}}>Firemní plány</div>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(40px,6vw,80px)',letterSpacing:3,lineHeight:.88}}>VYBERTE SVŮJ <span style={{color:G.gold}}>PLÁN</span></h2>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
            {PLANS.map((p,i)=>(
              <div key={p.id} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(-1)} style={{background:hov===i?p.color+'06':G.gl,backdropFilter:'blur(32px)',border:'1px solid '+(hov===i?p.color+'33':G.br),borderRadius:20,padding:'32px 28px',position:'relative',overflow:'hidden',transition:'all .4s cubic-bezier(.34,1.56,.64,1)',transform:hov===i?'translateY(-8px)':'translateY(0)',boxShadow:hov===i?'0 32px 80px rgba(0,0,0,.5)':'none'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,'+p.color+',transparent)',opacity:hov===i?1:.25,transition:'opacity .3s'}} />
                <div style={{fontSize:36,marginBottom:16,transition:'transform .4s cubic-bezier(.34,1.56,.64,1)',transform:hov===i?'scale(1.15) rotate(-8deg)':'scale(1)'}}>{p.emoji}</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:p.color,marginBottom:4}}>{p.title}</div>
                <div style={{fontSize:11,color:G.mut,marginBottom:20,fontWeight:300}}>{p.subtitle}</div>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:52,color:hov===i?p.color:G.wht,letterSpacing:2,lineHeight:1,marginBottom:4,transition:'color .3s'}}>{p.price}<span style={{fontSize:20}}> Kč</span></div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut,marginBottom:20}}>za měsíc</div>
                <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:20}} />
                <ul style={{listStyle:'none',padding:0,marginBottom:28}}>
                  {p.features.map(f=>(
                    <li key={f} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:12,color:'rgba(240,235,225,.72)',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontWeight:300}}>
                      <span style={{color:p.color,flexShrink:0,marginTop:1}}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={'#kontakt'} style={{display:'block',width:'100%',padding:'14px',borderRadius:10,fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',textAlign:'center',textDecoration:'none',background:hov===i?p.color:'rgba(255,255,255,.06)',color:hov===i?'#000':G.wht,border:hov===i?'none':'1px solid rgba(255,255,255,.1)',transition:'all .3s',boxShadow:hov===i?'0 8px 28px '+p.color+'44':'none'}}>{p.cta}</a>
              </div>
            ))}
          </div>
        </section>

        {/* VÝHODY */}
        <section style={{padding:'0 clamp(20px,5vw,56px) clamp(80px,10vw,120px)',maxWidth:900,margin:'0 auto'}}>
          <div style={{background:'rgba(240,180,41,.03)',border:'1px solid rgba(240,180,41,.15)',borderRadius:20,padding:'clamp(40px,6vw,64px)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,'+G.gold+',transparent)'}} />
            <div style={{textAlign:'center',marginBottom:48}}>
              <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(36px,5vw,72px)',letterSpacing:3,lineHeight:.88,marginBottom:14}}>PROČ PRODÁVAT<br/><span style={{color:G.gold}}>S NAJDIDEAL?</span></h2>
              <p style={{fontSize:13,color:G.mut,fontWeight:300,lineHeight:1.85}}>Platforma která roste každý měsíc. Vaše inzeráty uvidí tisíce aktivních kupujících.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
              {[
                {emoji:'👁',title:'Vysoká viditelnost',desc:'Vaše inzeráty vidí tisíce aktivních kupujících každý den.'},
                {emoji:'⚡',title:'Okamžité upozornění',desc:'Kupující dostávají notifikace o nových inzerátech okamžitě.'},
                {emoji:'📊',title:'Přehledná analytika',desc:'Vidíte kolik lidí vidělo a kontaktovalo vás ohledně inzerátu.'},
                {emoji:'🔒',title:'Ověřený profil',desc:'Badge důvěryhodnosti zvyšuje konverzi a zájem kupujících.'},
              ].map(v=>(
                <div key={v.title} style={{textAlign:'center'}}>
                  <div style={{fontSize:32,marginBottom:12}}>{v.emoji}</div>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.gold,marginBottom:8}}>{v.title}</div>
                  <p style={{fontSize:12,color:G.mut,lineHeight:1.75,fontWeight:300}}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAKTNÍ FORMULÁŘ */}
        <section id="kontakt" style={{padding:'0 clamp(20px,5vw,56px) clamp(80px,10vw,140px)',maxWidth:640,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:12}}>Kontakt</div>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(40px,6vw,80px)',letterSpacing:3,lineHeight:.88}}>POJĎME SE<br/><span style={{color:G.gold}}>DOMLUVIT.</span></h2>
            <p style={{fontSize:13,color:G.mut,marginTop:16,fontWeight:300,lineHeight:1.85}}>Vyplňte formulář a ozveme se vám do 24 hodin.</p>
          </div>

          {sent ? (
            <div style={{textAlign:'center',padding:'48px 24px',background:G.gl,border:'1px solid rgba(0,230,118,.2)',borderRadius:16}}>
              <div style={{fontSize:56,marginBottom:16}}>✅</div>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:3,color:G.wht,marginBottom:8}}>OZVEME SE VÁM</h3>
              <p style={{fontSize:13,color:G.mut,fontWeight:300}}>Vaše zpráva dorazila. Odpovíme do 24 hodin.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
                <div>
                  <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Jméno *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="Jan Novák" style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:9,color:G.wht,fontFamily:'Syne,sans-serif',fontSize:13,outline:'none'}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}} />
                </div>
                <div>
                  <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Email *</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required type="email" placeholder="jan@firma.cz" style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:9,color:G.wht,fontFamily:'Syne,sans-serif',fontSize:13,outline:'none'}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Firma / Název provozovny</label>
                <input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="Realitní kancelář XY s.r.o." style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:9,color:G.wht,fontFamily:'Syne,sans-serif',fontSize:13,outline:'none'}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Typ podnikání *</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} required style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:9,color:form.type?G.wht:G.mut,fontFamily:'Syne,sans-serif',fontSize:13,outline:'none'}}>
                  <option value="">Vyberte typ...</option>
                  <option value="realtor">Realitní makléř / kancelář</option>
                  <option value="dealer">Autobazar</option>
                  <option value="pawnshop">Zastavárna / Výkup</option>
                  <option value="seller">Aktivní prodejce</option>
                  <option value="other">Jiné</option>
                </select>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Zpráva</label>
                <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={4} placeholder="Řekněte nám víc o vašem podnikání a co od spolupráce očekáváte..." style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:9,color:G.wht,fontFamily:'Syne,sans-serif',fontSize:13,outline:'none',resize:'vertical'}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}} />
              </div>
              <button type="submit" disabled={sending} style={{padding:'16px',borderRadius:10,border:'none',cursor:sending?'default':'pointer',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:'uppercase',background:G.gold,color:'#000',boxShadow:'0 8px 28px rgba(240,180,41,.3)',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'all .3s'}}>
                {sending ? 'Odesílám...' : 'Odeslat poptávku →'}
              </button>
              <p style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,textAlign:'center',letterSpacing:1}}>Odpovídáme do 24 hodin · info@najdideal.cz</p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}