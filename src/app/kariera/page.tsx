'use client'
import { useEffect, useRef, useState } from 'react'

const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const JOBS = [
  { emoji:'📢', title:'Správce marketingu', type:'Plný úvazek · Remote', color:G.gold, salary:'40 000 – 70 000 Kč', urgency:'🔥 Urgentní', desc:'Budeš hlavní hlas NajdiDeal. Spravuješ sociální sítě, vytváříš obsah který prodává a škáluješ brand na celý trh ČR a SK.', skills:['Social media','Content creation','Growth hacking','Analytika'], perks:['Bonusy za výkon','Flexibilní čas','Equity možnost'] },
  { emoji:'🔍', title:'Hledač dealů', type:'Částečný úvazek · Remote', color:G.grn, salary:'Prémium za deal', urgency:'⚡ Otevřené', desc:'Jsi nos firmy. Každý den lovíš nejlepší flip příležitosti. Za každý schválený deal dostaneš prémium. Čím víc najdeš, tím víc vyděláš.', skills:['Marketplace knowledge','Analytické myšlení','Důslednost','Rychlost'], perks:['Provize z dealů','Vlastní tempo','Neomezený výdělek'] },
  { emoji:'💻', title:'IT specialista', type:'Plný úvazek · Remote', color:G.blu, salary:'60 000 – 100 000 Kč', urgency:'🔥 Urgentní', desc:'Stavíš produkt který mění to jak lidé vydělávají online. Next.js, Supabase, AI integrace. Žádná korporátní byrokracie – jen build, ship, repeat.', skills:['Next.js / React','TypeScript','Supabase / PostgreSQL','AI/ML'], perks:['Nejnovější tech stack','Přímý vliv na produkt','Equity možnost'] },
]

const PERKS = [
  { emoji:'🌍', title:'100% Remote', desc:'Pracuj odkudkoliv. Kancelář není podmínkou.' },
  { emoji:'⚡', title:'Rychlý růst', desc:'Startup tempo. Žádná korporátní byrokracie.' },
  { emoji:'💰', title:'Bonusy & Equity', desc:'Podílíš se na úspěchu firmy přímo.' },
  { emoji:'🤖', title:'AI First', desc:'Pracuješ s nejnovějšími AI nástroji každý den.' },
  { emoji:'🎯', title:'Přímý dopad', desc:'Tvoje práce ovlivňuje tisíce lidí okamžitě.' },
  { emoji:'👑', title:'VIP přístup', desc:'Plný VIP MAX přístup k platformě zdarma.' },
]

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 2000
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.round(ease * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, end])
  return <div ref={ref}>{val.toLocaleString('cs-CZ')}{suffix}</div>
}

export default function KarieraPage() {
  const [hovJob, setHovJob] = useState(-1)
  const [hovPerk, setHovPerk] = useState(-1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div style={{ background:'#020208', minHeight:'100vh', color:G.wht, fontFamily:'Syne, sans-serif', overflowX:'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(0,230,118,.6)}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes scan{0%{top:-5%}100%{top:105%}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-30px)}}
      `}</style>

      {/* AMBIENT */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-20%',right:'-10%',width:700,height:700,background:'radial-gradient(circle,rgba(240,180,41,.07) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(80px)',animation:'orb 14s ease-in-out infinite'}} />
        <div style={{position:'absolute',bottom:'-10%',left:'-10%',width:500,height:500,background:'radial-gradient(circle,rgba(155,93,229,.06) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(80px)',animation:'orb 10s ease-in-out infinite .5s'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(240,180,41,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.018) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 5%,transparent 75%)'}} />
        <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)',animation:'scan 8s linear infinite'}} />
      </div>

      {/* HERO */}
      <section style={{position:'relative',zIndex:10,padding:'clamp(120px,14vw,180px) clamp(20px,5vw,80px) clamp(80px,10vw,120px)',textAlign:'center',maxWidth:1000,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'7px 20px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.2)',marginBottom:36,animation:'fadeUp .7s ease both'}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:G.grn,display:'inline-block',animation:'ping 2s infinite',flexShrink:0}} />
          <span style={{fontFamily:'Syne Mono, monospace',fontSize:10,letterSpacing:2.5,textTransform:'uppercase',color:G.grn}}>3 otevřené pozice · Okamžitý nástup</span>
        </div>

        <h1 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(64px,13vw,152px)',letterSpacing:'clamp(4px,1vw,10px)',lineHeight:.84,marginBottom:32,animation:'fadeUp .8s .08s ease both',animationFillMode:'forwards',opacity:0}}>
          <span style={{display:'block',color:G.wht}}>PŘIPOJ SE</span>
          <span style={{display:'block',background:`linear-gradient(135deg,${G.gold} 0%,#FFD97D 50%,${G.gold} 100%)`,backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite'}}>K TÝMU</span>
          <span style={{display:'block',color:G.wht}}>KTERÝ ROSTE.</span>
        </h1>

        <p style={{fontSize:'clamp(14px,2vw,17px)',color:G.mut,lineHeight:1.9,maxWidth:560,margin:'0 auto 52px',fontWeight:300,animation:'fadeUp .8s .2s ease both',animationFillMode:'forwards',opacity:0}}>
          Budujeme <strong style={{color:'rgba(240,235,225,.85)',fontWeight:600}}>nejlepší deal platformu v ČR a SK</strong>. Hledáme výjimečné lidi kteří chtějí mít skutečný dopad.
        </p>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,maxWidth:560,margin:'0 auto 64px',animation:'fadeUp .8s .32s ease both',animationFillMode:'forwards',opacity:0}}>
          {[{val:2341,suf:'+',label:'Aktivních členů'},{val:247,suf:'',label:'Dealů měsíčně'},{val:100,suf:'%',label:'Remote tým'}].map(s => (
            <div key={s.label} style={{background:G.gl,backdropFilter:'blur(24px)',border:`1px solid ${G.br}`,borderRadius:14,padding:'22px 12px'}}>
              <div style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(32px,5vw,52px)',color:G.gold,letterSpacing:2,lineHeight:1,textShadow:'0 0 40px rgba(240,180,41,.35)',marginBottom:6}}>
                <Counter end={s.val} suffix={s.suf} />
              </div>
              <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,letterSpacing:2,textTransform:'uppercase',color:G.mut}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,animation:'fadeUp .8s .44s ease both',animationFillMode:'forwards',opacity:0}}>
          <span style={{fontFamily:'Syne Mono, monospace',fontSize:9,letterSpacing:2,textTransform:'uppercase',color:G.mut}}>Scroll dolů</span>
          <div style={{width:1,height:40,background:'linear-gradient(180deg,rgba(240,180,41,.4),transparent)',animation:'glow 2s ease-in-out infinite'}} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',padding:'18px 0',position:'relative',zIndex:10}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'marquee 22s linear infinite'}}>
          {[...Array(2)].map((_,r) => ['REMOTE PRÁCE','RYCHLÝ RŮST','AI FIRST','EQUITY','100% REMOTE','BUILD & SHIP','VÝJIMEČNÝ TÝM','REÁLNÝ DOPAD'].map(w => (
            <span key={`${r}-${w}`} style={{display:'inline-flex',alignItems:'center',gap:24,padding:'0 32px',fontFamily:'Bebas Neue, sans-serif',fontSize:28,letterSpacing:4,color:'rgba(240,235,225,.055)'}}>
              {w} <span style={{color:'rgba(240,180,41,.12)',fontSize:14}}>✦</span>
            </span>
          )))}
        </div>
      </div>

      {/* WHY */}
      <section style={{position:'relative',zIndex:10,padding:'clamp(80px,10vw,120px) clamp(20px,5vw,80px)',maxWidth:1200,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:14}}>🏆 Proč NajdiDeal</div>
          <h2 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(40px,7vw,88px)',letterSpacing:4,lineHeight:.88}}>MÍSTO KDE <span style={{color:G.gold}}>ZÁLEŽÍ</span><br />CO DĚLÁŠ.</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
          {PERKS.map((p,i) => (
            <div key={p.title} onMouseEnter={()=>setHovPerk(i)} onMouseLeave={()=>setHovPerk(-1)} style={{background:hovPerk===i?'rgba(255,255,255,.046)':G.gl,backdropFilter:'blur(24px)',border:`1px solid ${hovPerk===i?'rgba(240,180,41,.22)':G.br}`,borderRadius:16,padding:'28px 24px',position:'relative',overflow:'hidden',transition:'all .4s cubic-bezier(.34,1.56,.64,1)',transform:hovPerk===i?'translateY(-6px)':'translateY(0)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent)',opacity:hovPerk===i?1:0,transition:'opacity .3s'}} />
              <div style={{fontSize:32,marginBottom:14,transition:'transform .4s cubic-bezier(.34,1.56,.64,1)',transform:hovPerk===i?'scale(1.2) rotate(-8deg)':'scale(1)'}}>{p.emoji}</div>
              <h4 style={{fontFamily:'Syne Mono, monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.gold,marginBottom:8}}>{p.title}</h4>
              <p style={{fontSize:12,color:G.mut,lineHeight:1.75,fontWeight:300}}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOBS */}
      <section style={{position:'relative',zIndex:10,padding:'0 clamp(20px,5vw,80px) clamp(80px,10vw,120px)',maxWidth:1000,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:14}}>🔥 Otevřené pozice</div>
          <h2 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(40px,7vw,88px)',letterSpacing:4,lineHeight:.88}}>NAJDI SVOU <span style={{color:G.gold}}>ROLI.</span></h2>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {JOBS.map((j,i) => (
            <div key={j.title} onMouseEnter={()=>setHovJob(i)} onMouseLeave={()=>setHovJob(-1)} style={{background:hovJob===i?`${j.color}06`:G.gl,backdropFilter:'blur(32px) saturate(180%)',border:`1px solid ${hovJob===i?j.color+'33':G.br}`,borderRadius:20,overflow:'hidden',position:'relative',transition:'all .5s cubic-bezier(.34,1.56,.64,1)',transform:hovJob===i?'translateY(-8px) scale(1.01)':'translateY(0)',boxShadow:hovJob===i?`0 40px 100px rgba(0,0,0,.6),0 0 0 1px ${j.color}22`:'0 4px 24px rgba(0,0,0,.3)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${j.color},transparent)`,opacity:hovJob===i?1:.3,transition:'opacity .4s'}} />
              <div style={{position:'absolute',top:-60,right:-60,width:220,height:220,background:`radial-gradient(circle,${j.color}14 0%,transparent 70%)`,borderRadius:'50%',filter:'blur(30px)',opacity:hovJob===i?1:0,transition:'opacity .5s',pointerEvents:'none'}} />
              <div style={{padding:'32px 32px 28px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:20,flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <div style={{width:60,height:60,borderRadius:16,background:`${j.color}12`,border:`1px solid ${j.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,transition:'transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s',transform:hovJob===i?'scale(1.15) rotate(-8deg)':'scale(1)',boxShadow:hovJob===i?`0 0 32px ${j.color}44`:'none',flexShrink:0}}>{j.emoji}</div>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5,flexWrap:'wrap'}}>
                        <span style={{fontFamily:'Syne Mono, monospace',fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',padding:'3px 10px',borderRadius:100,background:`${j.color}10`,border:`1px solid ${j.color}25`,color:j.color}}>{j.urgency}</span>
                        <span style={{fontFamily:'Syne Mono, monospace',fontSize:9,color:G.mut}}>{j.type}</span>
                      </div>
                      <h3 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(22px,3vw,32px)',letterSpacing:3,color:G.wht,lineHeight:1}}>{j.title}</h3>
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontFamily:'Syne Mono, monospace',fontSize:8,color:G.mut,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Odměna</div>
                    <div style={{fontFamily:'Bebas Neue, sans-serif',fontSize:22,color:j.color,letterSpacing:1,textShadow:hovJob===i?`0 0 24px ${j.color}66`:'none',transition:'text-shadow .4s'}}>{j.salary}</div>
                  </div>
                </div>
                <p style={{fontSize:13,color:'rgba(240,235,225,.65)',lineHeight:1.85,fontWeight:300,marginBottom:20}}>{j.desc}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
                  {j.skills.map(s=><span key={s} style={{fontFamily:'Syne Mono, monospace',fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',padding:'5px 12px',borderRadius:100,background:`${j.color}08`,border:`1px solid ${j.color}18`,color:j.color}}>{s}</span>)}
                </div>
                <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:16}} />
                <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:24}}>
                  {j.perks.map(p=><div key={p} style={{display:'flex',alignItems:'center',gap:6,fontFamily:'Syne Mono, monospace',fontSize:9,color:G.grn}}><span>✓</span>{p}</div>)}
                </div>
                <a href={`mailto:info@najdideal.cz?subject=Zájem o pozici: ${j.title}`} style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:'Syne Mono, monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',background:j.color,color:'#000',padding:'14px 28px',borderRadius:10,textDecoration:'none',boxShadow:hovJob===i?`0 16px 48px ${j.color}55`:`0 6px 24px ${j.color}33`,transition:'all .35s',transform:hovJob===i?'scale(1.03)':'scale(1)'}}>
                  Reagovat na pozici →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* TEAM SECTION */}
      <section style={{position:'relative',zIndex:10,padding:'0 clamp(20px,5vw,80px) clamp(80px,10vw,120px)',maxWidth:1200,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:14}}>👥 Náš tým</div>
          <h2 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(40px,7vw,88px)',letterSpacing:4,lineHeight:.88}}>LIDÉ ZA <span style={{color:G.gold}}>NAJDIDEAL.</span></h2>
          <p style={{fontSize:13,color:G.mut,marginTop:16,fontWeight:300,maxWidth:480,margin:'16px auto 0',lineHeight:1.9}}>Malý tým s velkými ambicemi. Každý z nás přináší něco výjimečného.</p>
        </div>

        {/* TEAM ORBIT ANIMATION */}
        <div style={{position:'relative',height:'clamp(320px,50vw,480px)',margin:'0 auto 64px',maxWidth:480}}>
          <style>{`
            @keyframes orbit1{from{transform:rotate(0deg) translateX(140px) rotate(0deg)}to{transform:rotate(360deg) translateX(140px) rotate(-360deg)}}
            @keyframes orbit2{from{transform:rotate(120deg) translateX(140px) rotate(-120deg)}to{transform:rotate(480deg) translateX(140px) rotate(-480deg)}}
            @keyframes orbit3{from{transform:rotate(240deg) translateX(140px) rotate(-240deg)}to{transform:rotate(600deg) translateX(140px) rotate(-600deg)}}
            @keyframes orbitSlow{from{transform:rotate(0deg) translateX(200px) rotate(0deg)}to{transform:rotate(360deg) translateX(200px) rotate(-360deg)}}
            @keyframes orbitSlow2{from{transform:rotate(180deg) translateX(200px) rotate(-180deg)}to{transform:rotate(540deg) translateX(200px) rotate(-540deg)}}
            @keyframes centerPulse{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.3),0 0 60px rgba(240,180,41,.15)}50%{box-shadow:0 0 0 20px rgba(240,180,41,.0),0 0 100px rgba(240,180,41,.25)}}
            @keyframes ringPulse{0%,100%{opacity:.15}50%{opacity:.35}}
          `}</style>

          {/* CENTER - Logo */}
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:90,height:90,borderRadius:'50%',background:'linear-gradient(135deg,rgba(240,180,41,.2),rgba(240,180,41,.06))',border:'2px solid rgba(240,180,41,.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,animation:'centerPulse 3s ease-in-out infinite'}}>
            <div style={{fontFamily:'Bebas Neue, sans-serif',fontSize:28,color:G.gold,letterSpacing:2}}>ND</div>
          </div>

          {/* RINGS */}
          {[140,200].map((r,i) => (
            <div key={r} style={{position:'absolute',top:'50%',left:'50%',transform:`translate(-50%,-50%)`,width:r*2,height:r*2,borderRadius:'50%',border:'1px dashed rgba(240,180,41,.12)',animation:`ringPulse ${3+i}s ease-in-out infinite ${i*.5}s`}} />
          ))}

          {/* INNER ORBIT - Team core */}
          {[
            {emoji:'👨‍💻',label:'Dev',color:G.blu,anim:'orbit1'},
            {emoji:'📢',label:'Marketing',color:G.gold,anim:'orbit2'},
            {emoji:'🔍',label:'Deals',color:G.grn,anim:'orbit3'},
          ].map(m => (
            <div key={m.label} style={{position:'absolute',top:'50%',left:'50%',animation:`${m.anim} 12s linear infinite`,zIndex:8}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,transform:'translate(-50%,-50%)'}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:`${m.color}15`,border:`2px solid ${m.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,backdropFilter:'blur(8px)',boxShadow:`0 0 20px ${m.color}33`}}>{m.emoji}</div>
                <div style={{fontFamily:'Syne Mono, monospace',fontSize:8,color:m.color,letterSpacing:1,textTransform:'uppercase',background:'rgba(2,2,8,.8)',padding:'2px 6px',borderRadius:4,whiteSpace:'nowrap'}}>{m.label}</div>
              </div>
            </div>
          ))}

          {/* OUTER ORBIT - Extended team */}
          {[
            {emoji:'🤖',label:'AI',color:G.pur,anim:'orbitSlow'},
            {emoji:'📊',label:'Analytics',color:'#FF6B35',anim:'orbitSlow2'},
          ].map(m => (
            <div key={m.label} style={{position:'absolute',top:'50%',left:'50%',animation:`${m.anim} 20s linear infinite`,zIndex:7}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,transform:'translate(-50%,-50%)'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:`${m.color}12`,border:`1px solid ${m.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,backdropFilter:'blur(8px)'}}>{m.emoji}</div>
                <div style={{fontFamily:'Syne Mono, monospace',fontSize:7,color:m.color,letterSpacing:1,textTransform:'uppercase',background:'rgba(2,2,8,.8)',padding:'2px 5px',borderRadius:4,whiteSpace:'nowrap'}}>{m.label}</div>
              </div>
            </div>
          ))}

          {/* YOU badge */}
          <div style={{position:'absolute',bottom:'8%',right:'8%',zIndex:11,animation:'float 3s ease-in-out infinite'}}>
            <div style={{background:'linear-gradient(135deg,rgba(240,180,41,.15),rgba(240,180,41,.06))',border:'1px solid rgba(240,180,41,.35)',borderRadius:12,padding:'10px 16px',backdropFilter:'blur(20px)',boxShadow:'0 8px 32px rgba(240,180,41,.2)'}}>
              <div style={{fontFamily:'Syne Mono, monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.gold,marginBottom:3}}>+ Ty?</div>
              <div style={{fontFamily:'Syne Mono, monospace',fontSize:8,color:G.mut}}>Hledáme tebe</div>
            </div>
          </div>
        </div>

        {/* TEAM VALUES */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
          {[
            {n:'01',title:'Move fast',desc:'Shiupujeme funkce každý týden. Žádná korporátní pomalost.',color:G.gold},
            {n:'02',title:'Own it',desc:'Každý má svoji oblast. Plná zodpovědnost a svoboda rozhodování.',color:G.blu},
            {n:'03',title:'Stay hungry',desc:'Nikdy nejsme spokojeni. Vždy hledáme lepší řešení.',color:G.grn},
            {n:'04',title:'Win together',desc:'Úspěch firmy je úspěch každého z nás. Sdílíme vše.',color:G.pur},
          ].map((v,i) => (
            <div key={v.n} style={{background:G.gl,backdropFilter:'blur(24px)',border:`1px solid ${G.br}`,borderRadius:14,padding:'24px 20px',position:'relative',overflow:'hidden',transition:'all .3s'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${v.color},transparent)`}} />
              <div style={{fontFamily:'Bebas Neue, sans-serif',fontSize:48,color:`${v.color}15`,lineHeight:1,marginBottom:10}}>{v.n}</div>
              <h4 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:22,letterSpacing:2,color:v.color,marginBottom:8}}>{v.title.toUpperCase()}</h4>
              <p style={{fontSize:11,color:G.mut,lineHeight:1.75,fontWeight:300}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{position:'relative',zIndex:10,padding:'0 clamp(20px,5vw,80px) clamp(100px,12vw,160px)',maxWidth:800,margin:'0 auto',textAlign:'center'}}>
        <div style={{position:'relative',background:'rgba(240,180,41,.04)',border:'1px solid rgba(240,180,41,.2)',borderRadius:24,padding:'clamp(48px,8vw,80px) clamp(24px,6vw,80px)',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${G.gold},transparent)`}} />
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(240,180,41,.06) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:56,marginBottom:20,display:'inline-block',animation:'float 4s ease-in-out infinite'}}>🌟</div>
            <h3 style={{fontFamily:'Bebas Neue, sans-serif',fontSize:'clamp(36px,6vw,72px)',letterSpacing:4,color:G.wht,marginBottom:14,lineHeight:.9}}>NENAŠEL JSI<br /><span style={{color:G.gold}}>SVOJI ROLI?</span></h3>
            <p style={{fontSize:14,color:G.mut,fontWeight:300,lineHeight:1.85,maxWidth:440,margin:'0 auto 36px'}}>Rosteme rychle a vždy hledáme výjimečné lidi. Pošli nám svůj profil – vytvoříme roli přímo pro tebe.</p>
            <a href="mailto:info@najdideal.cz?subject=Spontánní přihláška" style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:'Syne Mono, monospace',fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:'uppercase',background:G.gold,color:'#000',padding:'18px 40px',borderRadius:12,textDecoration:'none',boxShadow:'0 12px 48px rgba(240,180,41,.4)',transition:'all .35s cubic-bezier(.34,1.56,.64,1)'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-4px) scale(1.04)';(e.currentTarget as any).style.boxShadow='0 24px 72px rgba(240,180,41,.6)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 12px 48px rgba(240,180,41,.4)'}}>
              Poslat životopis →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
