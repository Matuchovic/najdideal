'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import FaqSection from '@/components/sections/FaqSection'
import dynamic from 'next/dynamic'
const ScannerStatus = dynamic(() => import('@/components/sections/ScannerStatus'), { ssr: false })
const PhoneMockup = dynamic(() => import('@/components/sections/PhoneMockup'), { ssr: false })
const ChatWidget = dynamic(() => import('@/components/ui/ChatWidget'), { ssr: false })
import { createClient } from '@/lib/supabase/client'
import NajdiLogo from '@/components/ui/NajdiLogo'
import NajdiBot from '@/components/ui/NajdiBot'
import Link from 'next/link'



export default function HomePage() {
  const [aiStatus, setAiStatus] = useState('AI analyzuje 2 341 nabídek právě teď')
  const [online, setOnline] = useState(47)
  const [members, setMembers] = useState(2341)
  const [counted, setCounted] = useState(false)
  const [liveAlert, setLiveAlert] = useState<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [views, setViews] = useState([847, 1203, 623])
  const statsRef = useRef<HTMLDivElement>(null)

  const statuses = ['AI analyzuje 2 341 nabídek právě teď','Nový deal detekován – marketplace flip','AI skener: 94% confidence score','Filtrování: 18 příležitostí prošlo','VIP alert odesílán členům…']
  const alertsRef = useRef<{e:string,n:string,b:string,a:string}[]>([])
  const [alerts, setAlerts] = React.useState([
    {e:'📱',n:'Tomáš P.',b:'právě flipoval iPhone 15 Pro',a:'+7 200 Kč'},
    {e:'🤖',n:'Jakub M.',b:'registroval Jasper AI affiliate',a:'+35% provize'},
    {e:'🎮',n:'Petra K.',b:'prodala RTX 3060 Ti',a:'+4 100 Kč'},
    {e:'💻',n:'Martin V.',b:'flipoval MacBook Air M2',a:'+8 990 Kč'},
    {e:'👑',n:'Eliška R.',b:'vstoupila do VIP komunity',a:'🎉 Vítej!'},
  ])

  useEffect(() => { alertsRef.current = alerts }, [alerts])

  useEffect(() => {
    let si = 0
    const iv1 = setInterval(() => { si = (si+1)%5; setAiStatus(statuses[si]) }, 4000)
    const iv2 = setInterval(() => setOnline(p => Math.max(40, p + (Math.random()>.5?1:-1))), 4200)
    const iv3 = setInterval(() => { if(Math.random()>.8) setMembers(p => p+1) }, 12000)
    const iv4 = setInterval(() => setViews(p => p.map((v) => Math.random()>.6 ? v + Math.floor(Math.random()*3)+1 : v)), 2500)
    let ai = 0
    const showN = () => {
      const list = alertsRef.current.length ? alertsRef.current : alerts
      setLiveAlert(list[ai++ % list.length])
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5200)
    }
    const t1 = setTimeout(() => { showN(); const iv5 = setInterval(showN, 7800); return () => clearInterval(iv5) }, 2500)
    return () => { clearInterval(iv1); clearInterval(iv2); clearInterval(iv3); clearInterval(iv4); clearTimeout(t1) }
  }, [])

  useEffect(() => {
    if (!statsRef.current || counted) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCounted(true); obs.disconnect() }
    }, { threshold: .1 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const G = { g:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)' }

  const [deals, setDeals] = React.useState([
    {e:'📱',b:'TOP DEAL',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'iPhone 15 Pro 256GB',buy:'15 000 Kč',sell:'22 500 Kč',p:'+7 000 Kč',s:'Marketplace Flip',slug:'',img:''},
    {e:'🤖',b:'AI TOOL',bc:'rgba(77,159,255,.08)',bc2:'rgba(77,159,255,.18)',bc3:G.blu,n:'Jasper AI Affiliate',buy:'Provize 35%',sell:'Recurring',p:'Pasivní příjem',s:'Affiliate',slug:'',img:''},
    {e:'💻',b:'VIP ONLY',bc:'rgba(155,93,229,.08)',bc2:'rgba(155,93,229,.18)',bc3:G.pur,n:'MacBook Air M2',buy:'26 000 Kč',sell:'34 990 Kč',p:'+8 990 Kč',s:'Marketplace Flip',slug:'',img:''},
    {e:'🎮',b:'FLIP ALERT',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'RTX 3060 Ti 8GB',buy:'5 200 Kč',sell:'8 500 Kč',p:'+3 300 Kč',s:'Marketplace Flip',slug:'',img:''},
    {e:'🎧',b:'HOT DEAL',bc:'rgba(255,59,92,.08)',bc2:'rgba(255,59,92,.18)',bc3:'#FF3B5C',n:'AirPods Pro 2',buy:'4 200 Kč',sell:'6 990 Kč',p:'+2 790 Kč',s:'Marketplace Flip',slug:'',img:''},
    {e:'🌀',b:'TREND',bc:'rgba(0,230,118,.06)',bc2:'rgba(0,230,118,.14)',bc3:G.grn,n:'Dyson V15 Detect',buy:'8 900 Kč',sell:'14 200 Kč',p:'+4 800 Kč',s:'Trend Produkt',slug:'',img:''},
  ])

  React.useEffect(() => {
    fetch('/api/landing-deals?limit=20')
      .then(r => r.json())
      .then(data => {
        if (data?.deals?.length >= 3) {
          const emojis: Record<string, string> = {
            ai_opportunity: '📱', trend_product: '🚗', profit_alert: '⚽',
            affiliate: '👕', dropshipping: '🛋️', crypto: '🧸', marketplace_flip: '🔄'
          }
          const newAlerts = data.deals.slice(0, 8).map((d: any) => ({
            e: emojis[d.category] || d.emoji || '💰',
            n: 'AI Skener',
            b: \`našla výhodný deal: \${d.title.slice(0, 30)}\`,
            a: d.sell_price ? \`\${d.sell_price.toLocaleString('cs-CZ')} Kč\` : '🔥 Nový',
          }))
          alertsRef.current = newAlerts
          setAlerts(newAlerts)
        }
        if (data?.deals?.length >= 6) {
          const G2 = { g:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5' }
          const badges = ['TOP DEAL','HOT DEAL','NOVÉ','FLIP ALERT','HOT DEAL','TREND']
          const colors = [
            {bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G2.g},
            {bc:'rgba(255,59,92,.08)',bc2:'rgba(255,59,92,.18)',bc3:'#FF3B5C'},
            {bc:'rgba(0,230,118,.06)',bc2:'rgba(0,230,118,.14)',bc3:G2.grn},
            {bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G2.g},
            {bc:'rgba(255,59,92,.08)',bc2:'rgba(255,59,92,.18)',bc3:'#FF3B5C'},
            {bc:'rgba(77,159,255,.08)',bc2:'rgba(77,159,255,.18)',bc3:G2.blu},
          ]
          setDeals(data.deals.slice(0, 6).map((d: any, i: number) => ({
            e: d.emoji || '💰',
            b: d.is_hot ? 'HOT DEAL' : badges[i],
            ...colors[i],
            n: d.title,
            buy: d.sell_price ? `${d.sell_price.toLocaleString('cs-CZ')} Kč` : 'Dohodou',
            sell: '',
            p: d.is_hot ? '🔥 Hot' : '✓ Nové',
            s: 'Bazoš Deal',
            slug: d.slug || '',
            img: d.image_url || '',
          })))
        }
      })
      .catch(() => {})
  }, [])

  const [tickerItems, setTickerItems] = React.useState(['Načítám dealy...'])

  React.useEffect(() => {
    fetch('/api/landing-deals?limit=20')
      .then(r => r.json())
      .then(data => {
        if (data?.deals?.length) {
          setTickerItems(data.deals.map((d: any) => 
            d.sell_price ? `${d.title.slice(0,30)} · ${d.sell_price.toLocaleString('cs-CZ')} Kč` : d.title.slice(0,40)
          ))
        }
      })
      .catch(() => {})
  }, [])
  const mq1 = ['MARKETPLACE FLIPY','AI PŘÍLEŽITOSTI','TREND PRODUKTY','PROFIT ALERTY','VIP KOMUNITA','LIVE DEALY']
  const mq2 = ['PASIVNÍ PŘÍJEM','ČESKÁ KOMUNITA','DŘÍV NEŽ OSTATNÍ','ONLINE PROFIT','REAL DEALS ONLY','VERIFIED PROFITS']

  return (
    <div style={{background:'#020208',color:G.wht,fontFamily:'Syne,sans-serif',overflowX:'hidden'}}>
      <style>{`
        @keyframes fadeU{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(0,230,118,.55)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes oF{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-28px)}}
        @keyframes gP{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes gB{0%,86%,100%{opacity:0;transform:translate(0)}87%{opacity:.9;transform:translate(-6px,2px)}89%{opacity:.9;transform:translate(6px,-2px)}91%{opacity:.5}93%{opacity:0}}
        @keyframes gA{0%,86%,100%{opacity:0;transform:translate(0)}87%{opacity:.7;transform:translate(6px,-2px)}89%{opacity:.7;transform:translate(-6px,2px)}91%{opacity:.4}93%{opacity:0}}
        @keyframes tkS{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes mqS{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes vipGlow{0%,100%{border-color:rgba(240,180,41,.2)}50%{border-color:rgba(240,180,41,.38)}}
        @keyframes count{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanLine{0%{top:0%;opacity:0}5%{opacity:.6}95%{opacity:.6}100%{top:100%;opacity:0}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes textGlow{0%,100%{text-shadow:0 0 40px rgba(240,180,41,.2)}50%{text-shadow:0 0 80px rgba(240,180,41,.5),0 0 120px rgba(240,180,41,.2)}}
        @keyframes nodeGlow{0%,100%{opacity:.7}50%{opacity:1}}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr !important;text-align:center;padding:90px 20px 60px !important}
          .hero-r{display:none !important}
          .hbtns{justify-content:center}
          .proof-row{justify-content:center}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important}
          .deals-grid{grid-template-columns:1fr !important}
          .how-grid{grid-template-columns:1fr !important;gap:10px !important}
          .how-grid>div{border-radius:14px !important}
          .vip-grid{grid-template-columns:1fr !important}
          .vip-banner-grid{grid-template-columns:1fr !important}
          .vip-banner-cta{align-items:flex-start !important}
          .proof-grid{grid-template-columns:1fr !important}
          .proof-left{padding-right:0 !important;border-right:none !important;border-bottom:1px solid rgba(255,255,255,.05);padding-bottom:60px;margin-bottom:60px}
          .proof-right{padding-left:0 !important}
          .pcards-grid{grid-template-columns:1fr 1fr !important}
          .pricing-grid{grid-template-columns:1fr !important;max-width:480px !important;margin-left:auto !important;margin-right:auto !important}
          .sec-pad{padding:80px 20px !important}
          .footer-grid{flex-direction:column !important}
          .footer-cols{flex-direction:column !important;gap:20px !important}
          .cta-box{padding:48px 24px !important;border-radius:18px !important}
          .faq-wrap{padding:80px 20px !important}
          .navbar-links{display:none !important}
          .navbar-inner{padding:0 18px !important}
          .marquee-text{font-size:32px !important}
        }
        @media(max-width:480px){
          .pcards-grid{grid-template-columns:1fr !important}
          .stats-grid{grid-template-columns:1fr 1fr !important}
          .pricing-grid{grid-template-columns:1fr !important;max-width:340px !important}
        }
        .glitch{position:relative;display:inline-block;color:#F0B429;text-shadow:0 0 60px rgba(240,180,41,.4)}
        .glitch::before{content:attr(data-t);position:absolute;top:0;left:0;width:100%;color:#0ff;opacity:0;animation:gB 5.5s steps(1) infinite;clip-path:polygon(0 8%,100% 8%,100% 38%,0 38%)}
        .glitch::after{content:attr(data-t);position:absolute;top:0;left:0;width:100%;color:#f0f;opacity:0;animation:gA 5.5s steps(1) .18s infinite;clip-path:polygon(0 62%,100% 62%,100% 88%,0 88%)}
        .dc:hover{transform:translateY(-11px) scale(1.012)!important;z-index:2}
        .vc:hover{transform:translateY(-10px)!important}
        .tc:hover{transform:translateX(5px)!important}
        .pcard:hover{transform:translateX(4px) translateY(-3px)!important}
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          HERO  –  text vlevo · iPhone vpravo (jako BetImperium)
      ════════════════════════════════════════════════════════════ */}
      <section className="hero-grid" style={{
        minHeight:'100vh',
        display:'grid',
        /* pevné 2 sloupce: text roste, telefon má fixní šířku */
        gridTemplateColumns:'1fr 380px',
        alignItems:'center',
        padding:'100px 56px 80px',
        position:'relative',
        overflow:'hidden',
        gap:48,
      }}>
        {/* dekorativní vrstvy pozadí */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.6),transparent)',zIndex:20,pointerEvents:'none'}} />
        <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:'linear-gradient(180deg,rgba(240,180,41,.04) 0%,transparent 100%)',zIndex:1,pointerEvents:'none'}} />
        <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,230,118,.35),transparent)',animation:'scanLine 6s ease-in-out infinite',zIndex:20,pointerEvents:'none'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(240,180,41,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.025) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse 90% 90% at 50% 50%,black 5%,transparent 75%)',animation:'gP 5s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:700,height:700,background:'radial-gradient(circle,rgba(240,180,41,.1) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(70px)',top:-200,right:-100,animation:'oF 14s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:550,height:550,background:'radial-gradient(circle,rgba(155,93,229,.07) 0%,transparent 70%)',borderRadius:'50%',filter:'blur(70px)',bottom:-100,left:-80,animation:'oF 14s ease-in-out infinite',animationDelay:'-5s',pointerEvents:'none'}} />

        {/* ── LEVÝ SLOUPEC: text (stejný jako originál) ── */}
        <div style={{position:'relative',zIndex:10}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'6px 16px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.18)',backdropFilter:'blur(20px)',marginBottom:32}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,animation:'ping 1.8s infinite',display:'inline-block',flexShrink:0}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:G.grn,transition:'opacity .4s'}}>{aiStatus}</span>
          </div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(64px,10vw,140px)',lineHeight:.86,letterSpacing:4,marginBottom:20}}>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) both'}}>BUDEŠ</span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .08s both'}}>PRVNÍ U</span>
            <span style={{display:'block',animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .16s both'}}>
              <span style={{background:'linear-gradient(90deg,#F0EBE1 0%,#F0B429 25%,#FFD97D 50%,#F0B429 75%,#F0EBE1 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite, textGlow 3s ease-in-out infinite'}}>KAŽDÉHO</span>
            </span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .24s both'}}>VÝHODNÉHO INZERÁTU.</span>
          </h1>
          <div style={{animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .32s both'}}>
            <p style={{fontSize:22,color:G.wht,lineHeight:1.5,maxWidth:480,marginBottom:12,fontWeight:600,letterSpacing:.5}}>Ty budeš první.</p>
            <p style={{fontSize:16,color:G.mut,lineHeight:1.88,maxWidth:460,marginBottom:40,fontWeight:300}}>Hlídáme Bazoš a Vinted za tebe. Jakmile přijde výhodný inzerát — dostaneš notifikaci okamžitě.</p>
          </div>
          <div className="hbtns" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:52,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .44s both'}}>
            <Link href="#dealy" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',background:G.g,color:'#000',padding:'17px 34px',borderRadius:8,textDecoration:'none',transition:'transform .3s,box-shadow .3s',boxShadow:'0 8px 32px rgba(240,180,41,.22)',display:'inline-flex',alignItems:'center',gap:8}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-5px)';(e.currentTarget as any).style.boxShadow='0 24px 64px rgba(240,180,41,.52)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.22)'}}>Zobrazit dnešní nabídky →</Link>
            <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:G.wht,padding:'17px 34px',borderRadius:8,textDecoration:'none',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',backdropFilter:'blur(20px)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.25)';(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as any).style.color=G.wht}}>Začít zdarma</Link>
          </div>
          <div className="proof-row" style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap',animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .56s both'}}>
            <div style={{display:'flex'}}>
              {['T','M','E','J','K'].map((l,i) => <div key={i} style={{width:34,height:34,borderRadius:'50%',border:'2px solid rgba(240,180,41,.2)',background:'linear-gradient(135deg,rgba(240,180,41,.15),rgba(240,180,41,.03))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bebas Neue,sans-serif',fontSize:13,color:G.g,marginLeft:i>0?-9:0}}>{l}</div>)}
            </div>
            <div>
              <div style={{color:G.g,letterSpacing:3,fontSize:12}}>★★★★★</div>
              <div style={{fontSize:11,color:G.mut}}><strong style={{color:G.wht}}>{members.toLocaleString('cs-CZ')}</strong>+ lidí nakupuje chytřeji</div>
            </div>
            <div style={{width:1,height:28,background:'rgba(255,255,255,.1)'}} />
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:G.mut}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,display:'inline-block',animation:'ping 1.8s infinite',flexShrink:0}} />
              <strong style={{color:G.wht}}>{online}</strong> právě hledá nabídky
            </div>
          </div>
        </div>

        {/* ── PRAVÝ SLOUPEC: iPhone telefon ── */}
        <div className="hero-r" style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          position:'relative',
          zIndex:10,
        }}>
          {/* ambient glow za telefonem */}
          <div style={{position:'absolute',width:340,height:500,background:'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(240,180,41,.07) 0%,transparent 65%)',borderRadius:'50%',filter:'blur(30px)',pointerEvents:'none',animation:'oF 8s ease-in-out infinite'}} />
          <PhoneMockup />
        </div>
      </section>

      {/* TICKER */}
      <div style={{position:'relative',zIndex:10,padding:'15px 0',background:'rgba(240,180,41,.015)',borderTop:'1px solid rgba(240,180,41,.07)',borderBottom:'1px solid rgba(240,180,41,.07)',overflow:'hidden'}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'tkS 28s linear infinite'}}>
          {[...tickerItems,...tickerItems].map((t,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:10,padding:'0 36px',fontFamily:'Syne Mono,monospace',fontSize:10,letterSpacing:1,color:'rgba(240,235,225,.28)'}}>{t.split(' ').slice(0,-1).join(' ')} <span style={{color:G.grn,fontWeight:700}}>{t.split(' ').slice(-1)[0]}</span><span style={{color:'rgba(240,180,41,.16)',fontSize:20}}>·</span></span>)}
        </div>
      </div>

      {/* STATS */}
      <div ref={statsRef} className="stats-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        {[{n:247,s:'',l:'Dealů za měsíc'},{n:4235,s:' Kč',l:'Průměrný profit'},{n:18900,s:' Kč',l:'Největší profit'},{n:2341,s:'+',l:'Aktivních členů'}].map(({n,s,l}) => (
          <div key={l} style={{background:'rgba(6,6,14,.92)',backdropFilter:'blur(20px)',padding:'56px 36px',position:'relative',overflow:'hidden'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(50px,5.5vw,84px)',letterSpacing:2,color:G.g,lineHeight:1,textShadow:'0 0 50px rgba(240,180,41,.35)',marginBottom:8,animation:counted?'count .5s ease':'none'}}>
              {counted ? n.toLocaleString('cs-CZ')+s : '0'}
            </div>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.mut}}>{l}</div>
          </div>
        ))}
      </div>

      {/* DEALS */}
      <section id="dealy" className="sec-pad" style={{padding:'120px clamp(16px,5vw,56px)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:60,flexWrap:'wrap',gap:20}}>
          <div>
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:G.grn,animation:'ping 1.8s infinite',display:'inline-block'}} />
              Live · aktualizováno před 2 min
            </div>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,96px)',letterSpacing:3,lineHeight:.85}}>DNEŠNÍ<br/><span style={{color:G.g}}>NABÍDKY</span></h2>
          </div>
          <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.g,textDecoration:'none',padding:'10px 20px',borderRadius:6,background:'rgba(240,180,41,.05)',border:'1px solid rgba(240,180,41,.18)',backdropFilter:'blur(16px)',transition:'all .25s',whiteSpace:'nowrap'}} onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(240,180,41,.1)'}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(240,180,41,.05)'}}>Zobrazit vše →</Link>
        </div>
        <div className="deals-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
          {deals.map((d,i) => (
            <div key={i} className="dc" onClick={() => d.slug && (window.location.href = `/deals/${d.slug}`)} style={{position:'relative',overflow:'hidden',background:G.gl,backdropFilter:'blur(32px) saturate(180%)',border:`1px solid ${G.br}`,borderRadius:16,padding:24,transition:'transform .5s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .5s',cursor: d.slug ? 'pointer' : 'default'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'55%',background:'linear-gradient(180deg,rgba(255,255,255,.04) 0%,transparent 100%)',borderRadius:'16px 16px 0 0',pointerEvents:'none'}} />
              <span style={{display:'inline-flex',alignItems:'center',gap:4,fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'4px 10px',borderRadius:100,marginBottom:16,background:d.bc,color:d.bc3,border:`1px solid ${d.bc2}`}}>{d.b}</span>
              {d.img ? (
                <div style={{width:64,height:64,borderRadius:12,overflow:'hidden',marginBottom:14,border:'1px solid rgba(255,255,255,.08)'}}>
                  <img src={d.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
              ) : (
                <span style={{fontSize:44,display:'block',marginBottom:14,filter:'drop-shadow(0 0 8px rgba(240,180,41,.15))'}}>{d.e}</span>
              )}
              <div style={{fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,marginBottom:16,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.n}</div>
              <div style={{height:1,background:'rgba(255,255,255,.055)',marginBottom:14}} />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}><span style={{color:G.mut,fontFamily:'Syne Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:1}}>Koupeno za</span><span style={{color:G.g,fontWeight:500,fontSize:13}}>{d.buy}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}><span style={{color:G.mut,fontFamily:'Syne Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:1}}>Tržní cena</span><span style={{color:G.wht,fontWeight:500,fontSize:13}}>{d.sell}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,padding:'13px 14px',borderRadius:10,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.12)'}}>
                <span style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,letterSpacing:1,textTransform:'uppercase',display:'flex',alignItems:'center',gap:5}}><span style={{width:4,height:4,borderRadius:'50%',background:G.g,display:'inline-block'}} />{d.s}</span>
                <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,color:G.grn,letterSpacing:1,textShadow:'0 0 24px rgba(0,230,118,.35)',lineHeight:1}}>{d.p}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div style={{padding:'52px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'mqS 22s linear infinite'}}>
          {[...mq1,...mq1].map((w,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:22,padding:'0 36px',fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:5,color:'rgba(240,235,225,.04)'}}>{w}<span style={{color:'rgba(240,180,41,.1)',fontSize:24}}>✦</span></span>)}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{position:'relative',zIndex:10,padding:'80px 0',background:'linear-gradient(180deg,#06060E 0%,#020208 100%)',overflow:'hidden'}}>
        <style>{`
          @keyframes orb1{from{transform:rotate(0deg) translateX(var(--r1)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r1)) rotate(-360deg)}}
          @keyframes orb2{from{transform:rotate(120deg) translateX(var(--r1)) rotate(-120deg)}to{transform:rotate(480deg) translateX(var(--r1)) rotate(-480deg)}}
          @keyframes orb3{from{transform:rotate(240deg) translateX(var(--r1)) rotate(-240deg)}to{transform:rotate(600deg) translateX(var(--r1)) rotate(-600deg)}}
          @keyframes orb4{from{transform:rotate(60deg) translateX(var(--r2)) rotate(-60deg)}to{transform:rotate(420deg) translateX(var(--r2)) rotate(-420deg)}}
          @keyframes orb5{from{transform:rotate(180deg) translateX(var(--r2)) rotate(-180deg)}to{transform:rotate(540deg) translateX(var(--r2)) rotate(-540deg)}}
          @keyframes orb6{from{transform:rotate(300deg) translateX(var(--r2)) rotate(-300deg)}to{transform:rotate(660deg) translateX(var(--r2)) rotate(-660deg)}}
          @keyframes coreRotate{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
          @keyframes coreRotateRev{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}
          @keyframes corePulse{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.4),0 0 40px rgba(240,180,41,.2)}50%{box-shadow:0 0 0 16px rgba(240,180,41,.0),0 0 80px rgba(240,180,41,.4)}}
          @keyframes matrixFall{0%{transform:translateY(-100%);opacity:1}100%{transform:translateY(100vh);opacity:0}}
          @keyframes neuralFlow{0%{stroke-dashoffset:200}100%{stroke-dashoffset:0}}
          @keyframes howCardIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
          @keyframes blink{0%,90%,100%{opacity:1}95%{opacity:.3}}
          .how-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1200px;margin:0 auto;padding:0 56px;}
          .how-scanner{position:relative;--r1:160px;--r2:240px;height:580px;margin-bottom:56px;}
          .how-steps{display:flex;flex-direction:column;gap:6px;}
          @media(max-width:960px){.how-wrap{grid-template-columns:1fr;gap:0;padding:0 24px;}.how-scanner{--r1:110px;--r2:165px;height:380px;margin-bottom:80px;}}
          @media(max-width:480px){.how-scanner{--r1:90px;--r2:135px;height:320px;margin-bottom:72px;}.how-matrix{display:none}}
        `}</style>
        <div style={{textAlign:'center',padding:'0 24px',marginBottom:56}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'#F0B429',marginBottom:12}}>Jak to funguje</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,92px)',letterSpacing:3,lineHeight:.85}}>TAK JEDNODUCHÉ<br/><span style={{color:'#F0B429'}}>TO JE.</span></h2>
        </div>
        <div className="how-wrap">
          <div className="how-scanner">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="how-matrix" style={{position:'absolute',top:0,left:`${i*13+2}%`,width:1,height:'80%',overflow:'hidden',opacity:.12}}>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:'#F0B429',lineHeight:1.4,animation:`matrixFall ${3+i*.4}s linear ${i*.3}s infinite`,whiteSpace:'nowrap',writingMode:'vertical-rl'}}>{'10AIΩ∑∆Σβλ'}</div>
              </div>
            ))}
            <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,230,118,.7),transparent)',animation:'scanLine 3s ease-in-out infinite',zIndex:8,boxShadow:'0 0 12px rgba(0,230,118,.4)'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:'calc(var(--r1) * 2)',height:'calc(var(--r1) * 2)',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px dashed rgba(240,180,41,.18)',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:'calc(var(--r2) * 2)',height:'calc(var(--r2) * 2)',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px dashed rgba(240,180,41,.08)',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:160,height:160,borderRadius:'50%',border:'1px solid rgba(240,180,41,.2)',borderTop:'2px solid rgba(240,180,41,.6)',animation:'coreRotate 8s linear infinite',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',width:120,height:120,borderRadius:'50%',border:'1px solid rgba(0,230,118,.15)',borderRight:'2px solid rgba(0,230,118,.5)',animation:'coreRotateRev 5s linear infinite',pointerEvents:'none'}} />
            <div style={{position:'absolute',top:'42%',left:'50%',transform:'translate(-50%,-50%)',zIndex:10}}>
              <div style={{width:90,height:90,borderRadius:'50%',background:'radial-gradient(circle,rgba(240,180,41,.25) 0%,rgba(240,180,41,.08) 50%,transparent 70%)',border:'2px solid rgba(240,180,41,.5)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',animation:'corePulse 3s ease-in-out infinite',gap:4}}>
                <div style={{fontSize:26}}>🧠</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:6,color:'#F0B429',letterSpacing:2,textTransform:'uppercase',animation:'blink 4s ease-in-out infinite'}}>AI CORE</div>
              </div>
            </div>
            {[{emoji:'📡',label:'Scanning',color:'#00E676',anim:'orb1 12s linear infinite'},{emoji:'⚡',label:'Filtrování',color:'#4D9FFF',anim:'orb2 12s linear infinite'},{emoji:'👑',label:'VIP Alert',color:'#F0B429',anim:'orb3 12s linear infinite'}].map(o => (
              <div key={o.label} style={{position:'absolute',top:'42%',left:'50%',animation:o.anim,zIndex:8}}>
                <div style={{transform:'translate(-50%,-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{width:46,height:46,borderRadius:'50%',background:`${o.color}15`,border:`2px solid ${o.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,backdropFilter:'blur(8px)',boxShadow:`0 0 20px ${o.color}33`}}>{o.emoji}</div>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:7,color:o.color,letterSpacing:1,textTransform:'uppercase',background:'rgba(2,2,8,.88)',padding:'2px 6px',borderRadius:4,whiteSpace:'nowrap',border:`1px solid ${o.color}22`}}>{o.label}</div>
                </div>
              </div>
            ))}
            {[{emoji:'📱',label:'+7 000 Kč',color:'rgba(240,180,41,.8)',anim:'orb4 20s linear infinite'},{emoji:'💻',label:'+8 990 Kč',color:'rgba(0,230,118,.8)',anim:'orb5 20s linear infinite'},{emoji:'🎮',label:'+3 300 Kč',color:'rgba(77,159,255,.8)',anim:'orb6 20s linear infinite'}].map(o => (
              <div key={o.label} style={{position:'absolute',top:'42%',left:'50%',animation:o.anim,zIndex:7}}>
                <div style={{transform:'translate(-50%,-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,backdropFilter:'blur(6px)'}}>{o.emoji}</div>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:10,color:o.color,letterSpacing:1,background:'rgba(2,2,8,.88)',padding:'1px 5px',borderRadius:3,whiteSpace:'nowrap'}}>{o.label}</div>
                </div>
              </div>
            ))}
            <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:6,pointerEvents:'none'}} viewBox="0 0 400 520" preserveAspectRatio="xMidYMid meet">
              {[{x1:55,y1:78,x2:200,y2:218,color:'#00E676'},{x1:305,y1:52,x2:200,y2:218,color:'#4D9FFF'},{x1:355,y1:210,x2:200,y2:218,color:'#9B5DE5'},{x1:320,y1:430,x2:200,y2:218,color:'#F0B429'},{x1:98,y1:445,x2:200,y2:218,color:'#FF6B35'},{x1:32,y1:290,x2:200,y2:218,color:'#00E676'}].map((l,i) => (
                <g key={i}>
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth=".5" strokeOpacity=".15" />
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1" strokeOpacity=".5" strokeDasharray="4 6" style={{animation:`neuralFlow ${2+i*.3}s linear ${i*.4}s infinite`}} />
                </g>
              ))}
            </svg>
            <ScannerStatus />
          </div>
          <div className="how-steps">
            {[{n:'01',icon:'🔍',color:'#00E676',h:'Sledujeme trh za tebe',p:'Procházíme tisíce inzerátů každý den. Auta, nemovitosti, elektroniku, oblečení – vše na jednom místě. Ty nemusíš hledat.'},{n:'02',icon:'✓',color:'#4D9FFF',h:'Vybereme to nejlepší',p:'Zobrazíme ti jen nabídky které skutečně stojí za pozornost. Žádný šum, žádné přehlcení.'},{n:'03',icon:'🔔',color:'#F0B429',h:'Upozorníme tě jako první',p:'Jakmile se objeví dobrá nabídka, okamžitě ti dáme vědět. Dřív než to uvidí ostatní.'}].map((s2,i) => (
              <div key={i} style={{display:'flex',gap:20,alignItems:'flex-start',padding:'22px 24px',background:'rgba(255,255,255,.026)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,.07)',borderLeft:`3px solid ${s2.color}`,borderRadius:12,transition:'all .3s',animation:`howCardIn .6s ${i*.15}s ease both`,marginBottom:10}} onMouseEnter={e=>{(e.currentTarget as any).style.background=`${s2.color}06`;(e.currentTarget as any).style.transform='translateX(6px)'}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,.026)';(e.currentTarget as any).style.transform=''}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:40,color:`${s2.color}25`,lineHeight:1,flexShrink:0}}>{s2.n}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`${s2.color}12`,border:`1px solid ${s2.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{s2.icon}</div>
                    <h3 style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:s2.color}}>{s2.h}</h3>
                  </div>
                  <p style={{fontSize:12,color:'rgba(240,235,225,.45)',lineHeight:1.85,fontWeight:300}}>{s2.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div style={{padding:'52px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',whiteSpace:'nowrap',animation:'mqS 18s linear infinite reverse'}}>
          {[...mq2,...mq2].map((w,i) => <span key={i} style={{display:'inline-flex',alignItems:'center',gap:22,padding:'0 36px',fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:5,color:'rgba(240,235,225,.04)'}}>{w}<span style={{color:'rgba(240,180,41,.1)',fontSize:24}}>✦</span></span>)}
        </div>
      </div>

      {/* VIP SECTION */}
      <section className="sec-pad" style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',background:'linear-gradient(180deg,#020208 0%,#06060E 100%)'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 65% 70% at 50% 50%,rgba(240,180,41,.03) 0%,transparent 70%)'}} />
        <div style={{textAlign:'center',marginBottom:64,position:'relative'}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>👑 Exkluzivní přístup</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,92px)',letterSpacing:3,lineHeight:.85}}>CO ZÍSKÁŠ<br/><span style={{color:G.g}}>VE VIP?</span></h2>
        </div>
        <div className="vip-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,position:'relative'}}>
          {[{n:'01',i:'🔔',h:'Upozornění jako první',p:'Jakmile přibyde dobrá nabídka, okamžitě ti dáme vědět. Dřív než ostatní.'},{n:'02',i:'🎯',h:'Jen relevantní nabídky',p:'Žádný šum. Zobrazujeme ti jen to co ti skutečně sedí.'},{n:'03',i:'💰',h:'Nakup za méně',p:'Porovnáváme ceny za tebe. Vždy víš jestli je nabídka výhodná.'},{n:'04',i:'📦',h:'Prodej jednodušeji',p:'Přidej inzerát za minutu. Oslovíš tisíce lidí kteří aktivně hledají.'},{n:'05',i:'👥',h:'Komunita lidí jako ty',p:'Sdílíme tipy, zkušenosti a dobré nabídky. Nejsi na to sám.'},{n:'06',i:'📊',h:'Přehled trhu',p:'Vidíš co je podhodnocené, co táhne a kde jsou příležitosti.'}].map((v,i) => (
            <div key={i} className="vc" style={{background:'rgba(255,255,255,.022)',backdropFilter:'blur(28px)',border:`1px solid ${G.br}`,borderRadius:16,padding:'40px 32px',position:'relative',overflow:'hidden',transition:'transform .45s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .4s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-10px)';(e.currentTarget as any).style.borderColor='rgba(240,180,41,.2)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.borderColor=G.br}}>
              <div style={{position:'absolute',top:14,right:18,fontFamily:'Bebas Neue,sans-serif',fontSize:72,color:'rgba(240,180,41,.04)',lineHeight:1}}>{v.n}</div>
              <div style={{width:52,height:52,borderRadius:11,background:'rgba(240,180,41,.07)',border:'1px solid rgba(240,180,41,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20}}>{v.i}</div>
              <h3 style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:11}}>{v.h}</h3>
              <p style={{fontSize:12,color:G.mut,lineHeight:1.88,fontWeight:300}}>{v.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="proof-grid sec-pad" style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:0}}>
        <div className="proof-left" style={{paddingRight:88,borderRight:'1px solid rgba(255,255,255,.05)'}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>💰 Ověřené profity</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(38px,5vw,68px)',letterSpacing:3,lineHeight:.85,marginBottom:16}}>LIDÉ KTEŘÍ<br/><span style={{color:G.g}}>TO ZKUSILI.</span></h2>
          <p style={{fontSize:12,color:G.mut,margin:'16px 0 32px',fontWeight:300,lineHeight:1.88}}>Skutečné výsledky skutečných lidí.</p>
          <div className="pcards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10,marginBottom:32}}>
            {[{a:'Ušetřil 8 200 Kč',i:'iPhone 14 Pro · Praha',t:'Nalezeno za 2 dny'},{a:'Prodal za 3 dny',i:'MacBook Air M1 · Brno',t:'Bez zbytečného smlouvání'},{a:'Ušetřil 3 450 Kč',i:'PS5 · Ostrava',t:'Koupil pod tržní cenou'},{a:'Našel za hodinu',i:'RTX 3060 Ti · Plzeň',t:'Nabídka zmizela do 6 hodin'}].map((p,i) => (
              <div key={i} className="pcard" style={{background:'rgba(255,255,255,.022)',backdropFilter:'blur(24px)',border:'1px solid rgba(0,230,118,.1)',borderLeft:'2px solid #00E676',borderRadius:11,padding:20,transition:'transform .3s'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:13,color:G.grn,fontWeight:700,marginBottom:4}}>{p.a}</div>
                <div style={{fontSize:12,color:G.wht,fontWeight:500,marginBottom:4}}>{p.i}</div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut,letterSpacing:.5}}>{p.t}</div>
              </div>
            ))}
          </div>
          <Link href="/dashboard" style={{background:G.g,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'16px 32px',borderRadius:8,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(240,180,41,.22)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-4px)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform=''}}>✈ Zobrazit na platformě</Link>
        </div>
        <div className="proof-right" style={{paddingLeft:88}}>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>⭐ Recenze</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(38px,5vw,68px)',letterSpacing:3,lineHeight:.85,marginBottom:32}}>CO ŘÍKAJÍ<br/><span style={{color:G.g}}>ČLENOVÉ</span></h2>
          {[{av:'T',n:'Tomáš P., Praha',a:'Ušetřil 18 000 Kč',t:'Hledal jsem notebook tři týdny sám a nic. NajdiDeal mi ho našel za dva dny. Zaplatil jsem o 18 000 méně než v obchodě.'},{av:'M',n:'Martin V., Brno',a:'Prodal za 3 dny',t:'Měl jsem auto na prodej dva měsíce bez zájmu. Dal jsem ho sem a do tří dnů byl prodaný. Bez handrkování o cenu.'},{av:'E',n:'Eliška R., Ostrava',a:'Nekupuje jinak',t:'Teď před každým nákupem kouknu sem. Třikrát jsem koupila věc výrazně pod cenou. Prostě to dává smysl.'}].map((r,i) => (
            <div key={i} className="tc" style={{background:'rgba(255,255,255,.02)',backdropFilter:'blur(24px)',border:`1px solid ${G.br}`,borderRadius:13,padding:24,marginBottom:10,position:'relative',overflow:'hidden',transition:'border-color .3s,transform .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.14)'}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor=G.br}}>
              <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:12}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,rgba(240,180,41,.18),rgba(240,180,41,.04))',border:'1px solid rgba(240,180,41,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bebas Neue,sans-serif',fontSize:17,color:G.g,flexShrink:0}}>{r.av}</div>
                <div><div style={{fontSize:12,fontWeight:700}}>{r.n}</div><div style={{color:G.g,fontSize:9,letterSpacing:3}}>★★★★★</div></div>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,color:G.grn,marginLeft:'auto',letterSpacing:1}}>{r.a}</div>
              </div>
              <p style={{fontSize:11,color:G.mut,lineHeight:1.82,fontWeight:300}}>{r.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{position:'relative',zIndex:10,padding:'120px clamp(16px,5vw,56px)',textAlign:'center',background:'linear-gradient(180deg,#06060E 0%,#020208 100%)'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(240,180,41,.025) 0%,transparent 70%)'}} />
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 20px',borderRadius:100,background:'rgba(0,230,118,.06)',border:'1px solid rgba(0,230,118,.2)',marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#00E676',display:'inline-block',animation:'ping 1.8s infinite',flexShrink:0}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:10,letterSpacing:2,color:'#00E676'}}>Zakladatelská cena · Přihlas se teď a platíš méně navždy</span>
          </div>
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.g,marginBottom:12}}>Jednoduchý přístup</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,96px)',letterSpacing:3,lineHeight:.85}}>VYBER SI <span style={{color:G.g}}>PŘÍSTUP</span></h2>
          <p style={{fontSize:14,color:G.mut,marginTop:14,fontWeight:300}}>Začni zdarma · Zruš kdykoliv · Žádné závazky</p>
          <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,maxWidth:920,margin:'56px auto 0'}}>
            {[
              {tier:'ZDARMA',price:'0',per:'navždy',color:G.mut,desc:'Pro vyzkoušení',features:[{on:true,t:'Základní nabídky každý den'},{on:true,t:'Zobrazení všech inzerátů'},{on:true,t:'Přístup k marketplace'},{on:false,t:'Okamžitá upozornění'},{on:false,t:'Kontakt na prodejce'},{on:false,t:'Přidávání inzerátů'},{on:false,t:'Uložená hledání'},{on:false,t:'Hlídač ceny'}],cta:'Začít zdarma',href:'/dashboard',featured:false,note:null},
              {tier:'STANDARD',price:'299',per:'měsíc',color:G.g,desc:'Pro aktivní nakupující a prodejce',features:[{on:true,t:'Vše ze Zdarma'},{on:true,t:'Okamžitá upozornění na nabídky'},{on:true,t:'Kontakt na prodejce (tel + zprávy)'},{on:true,t:'Až 5 inzerátů měsíčně'},{on:true,t:'Soukromá komunita'},{on:true,t:'Uložená hledání'},{on:true,t:'Historie cen'},{on:true,t:'Hlídač ceny – upozorní při slevě'}],cta:'Vybrat Standard',href:'/vip',featured:true,note:'Zakladatelská cena'},
              {tier:'PREMIUM',price:'699',per:'měsíc',color:'#4D9FFF',desc:'Pro maximální výhodu',features:[{on:true,t:'Vše ze Standard'},{on:true,t:'Upozornění JAKO PRVNÍ – dřív než ostatní'},{on:true,t:'Až 20 inzerátů měsíčně'},{on:true,t:'1× Boost inzerátu zdarma měsíčně'},{on:true,t:'Ověřený prodejce badge'},{on:true,t:'Odhad správné ceny produktu'},{on:true,t:'Statistiky tvých inzerátů'},{on:true,t:'Prioritní podpora do 4 hodin'}],cta:'Vybrat Premium',href:'/vip',featured:false,note:'Zakladatelská cena'},
            ].map((p,i) => (
              <div key={i} style={{background:p.featured?'rgba(240,180,41,.04)':i===2?'rgba(77,159,255,.03)':'rgba(255,255,255,.025)',backdropFilter:'blur(36px)',border:`1px solid ${p.featured?'rgba(240,180,41,.28)':i===2?'rgba(77,159,255,.18)':'rgba(255,255,255,.07)'}`,borderRadius:20,padding:'44px 32px',position:'relative',overflow:'hidden',textAlign:'left',transition:'transform .35s,box-shadow .35s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-6px)';(e.currentTarget as any).style.boxShadow='0 32px 80px rgba(0,0,0,.5)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow=''}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${p.color},transparent)`}} />
                {p.featured&&<div style={{position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:G.g,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'5px 16px',borderRadius:'0 0 8px 8px',boxShadow:'0 4px 18px rgba(240,180,41,.38)'}}>Nejoblíbenější</div>}
                <div style={{marginTop:p.featured?14:0}}>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:p.color,marginBottom:4}}>{p.tier}</div>
                  <div style={{fontSize:11,color:G.mut,marginBottom:20,fontWeight:300}}>{p.desc}</div>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:64,letterSpacing:2,lineHeight:1,color:p.featured?G.g:i===2?'#4D9FFF':G.wht}}>{p.price}<span style={{fontSize:22}}> Kč</span></div>
                  <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:G.mut,marginBottom:4}}>za {p.per}</div>
                  {p.note&&<div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:'#00E676',letterSpacing:1,marginBottom:20}}>🔒 {p.note} – cena se zvýší</div>}
                  {!p.note&&<div style={{marginBottom:20}} />}
                  <div style={{height:1,background:'rgba(255,255,255,.06)',marginBottom:20}} />
                  <ul style={{listStyle:'none',marginBottom:28,padding:0}}>
                    {p.features.map((f,j)=>(
                      <li key={j} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:12,color:f.on?'rgba(240,235,225,.78)':G.mut,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontWeight:300,opacity:f.on?1:.4}}>
                        <span style={{width:17,height:17,borderRadius:'50%',background:f.on?'rgba(0,230,118,.08)':'rgba(255,255,255,.04)',border:`1px solid ${f.on?'rgba(0,230,118,.2)':'rgba(255,255,255,.07)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:f.on?'#00E676':G.mut,flexShrink:0,marginTop:1}}>{f.on?'✓':'✗'}</span>
                        {f.t}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} style={{display:'block',width:'100%',padding:'15px',borderRadius:10,fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',textAlign:'center',textDecoration:'none',transition:'all .3s',background:p.featured?G.g:i===2?'#4D9FFF':'rgba(255,255,255,.06)',color:p.featured||i===2?'#000':G.wht,border:p.featured||i===2?'none':'1px solid rgba(255,255,255,.1)',boxShadow:p.featured?'0 8px 28px rgba(240,180,41,.3)':i===2?'0 8px 28px rgba(77,159,255,.25)':''}}>{p.cta}</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{maxWidth:920,margin:'40px auto 0',background:'rgba(255,255,255,.022)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'32px 36px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)'}} />
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap' as const}}>
              <div>
                <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.g,marginBottom:6}}>⚡ Boost inzerátu</div>
                <div style={{fontSize:14,color:G.wht,fontWeight:600,marginBottom:4}}>Prodej rychleji. Zobraz se nahoře.</div>
                <div style={{fontSize:12,color:G.mut,fontWeight:300}}>Tvůj inzerát uvidí víc lidí a prodáš dřív.</div>
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {[{label:'7 dní',price:'79 Kč',color:'rgba(240,235,225,.5)'},{label:'30 dní',price:'199 Kč',color:G.g},{label:'Nahoře 1 týden',price:'299 Kč',color:'#4D9FFF'}].map(b=>(
                  <div key={b.label} style={{background:'rgba(255,255,255,.04)',border:`1px solid ${b.color}33`,borderRadius:12,padding:'14px 20px',textAlign:'center',cursor:'pointer',transition:'all .25s'}} onMouseEnter={e=>{(e.currentTarget as any).style.background=`${b.color}10`;(e.currentTarget as any).style.borderColor=`${b.color}55`}} onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(255,255,255,.04)';(e.currentTarget as any).style.borderColor=`${b.color}33`}}>
                    <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,color:b.color,letterSpacing:1,lineHeight:1}}>{b.price}</div>
                    <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,letterSpacing:1,textTransform:'uppercase',marginTop:4}}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:36,marginTop:32,flexWrap:'wrap'}}>
            {['✓ Zruš kdykoliv','✓ Bezpečná platba','✓ Okamžitý přístup','✓ Žádné skryté poplatky'].map(t=><div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:11,color:'#00E676',fontFamily:'Syne Mono,monospace'}}>{t}</div>)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{position:'relative',zIndex:10,padding:'140px clamp(16px,5vw,56px)',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(240,180,41,.04) 0%,transparent 70%)'}} />
        <div className="cta-box" style={{maxWidth:720,margin:'0 auto',position:'relative',background:'rgba(255,255,255,.025)',backdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:24,padding:'88px 64px',boxShadow:'0 56px 130px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07)'}}>
          <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,#F0B429,transparent)'}} />
          <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:4,textTransform:'uppercase',color:G.g,marginBottom:20}}>Připoj se</div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(52px,10vw,112px)',letterSpacing:5,lineHeight:.86,marginBottom:20}}>PŘESTAŇ<br/>PŘEHLÍŽET<br/><span style={{color:G.g,textShadow:'0 0 56px rgba(240,180,41,.28)'}}>PŘÍLEŽITOSTI.</span></h2>
          <p style={{fontSize:14,color:G.mut,marginBottom:40,fontWeight:300,lineHeight:1.88}}>Přes 2 341 lidí už nakupuje chytřeji.<br/>Začni zdarma. Zruš kdykoliv.</p>
          <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            <Link href="/dashboard" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',background:G.g,color:'#000',padding:'17px 34px',borderRadius:8,textDecoration:'none',boxShadow:'0 8px 32px rgba(240,180,41,.22)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-5px)';(e.currentTarget as any).style.boxShadow='0 24px 64px rgba(240,180,41,.52)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.22)'}}>Začít zdarma</Link>
            <Link href="#dealy" style={{fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:G.wht,padding:'17px 34px',borderRadius:8,textDecoration:'none',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',backdropFilter:'blur(20px)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.25)';(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as any).style.color=G.wht}}>Zobrazit nabídky</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{position:'relative',zIndex:10,padding:'60px 56px 28px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)'}} />
        <div className="footer-grid" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:36,marginBottom:48}}>
          <div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:19,letterSpacing:4,display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <NajdiLogo size="md" href="/" showText={true} />
            </div>
            <p style={{fontSize:11,color:G.mut,maxWidth:200,lineHeight:1.75,fontWeight:300}}>Najdi deal dřív než ostatní. Každý den nové příležitosti.</p>
          </div>
          <div className="footer-cols" style={{display:'flex',gap:56,flexWrap:'wrap'}}>
            {[{h:'Platforma',links:[{l:'Dashboard',href:'/dashboard'},{l:'VIP Členství',href:'/vip'},{l:'FAQ',href:'/faq'},{l:'Nápověda',href:'/napoveda'}]},{h:'Firma',links:[{l:'Kariéra',href:'/kariera'},{l:'Kontakt',href:'/kontakt'},{l:'Pro firmy',href:'/b2b'}]},{h:'Právní',links:[{l:'GDPR',href:'/gdpr'},{l:'Obchodní podmínky',href:'/obchodni-podminky'}]}].map(col => (
              <div key={col.h}>
                <h4 style={{fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:G.mut,marginBottom:14}}>{col.h}</h4>
                {col.links.map(lk => <Link key={lk.l} href={lk.href} style={{display:'block',fontSize:11,color:G.mut,textDecoration:'none',marginBottom:9,fontWeight:300,transition:'color .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.color=G.g}} onMouseLeave={e=>{(e.currentTarget as any).style.color=G.mut}}>{lk.l}</Link>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:24,borderTop:'1px solid rgba(255,255,255,.04)',flexWrap:'wrap',gap:8}}>
          <div style={{fontSize:9,color:G.mut,fontFamily:'Syne Mono,monospace'}}>© 2026 NajdiDeal · Hosabut s.r.o. · IČO: 23338342</div>
          <div style={{fontSize:9,color:G.mut,fontFamily:'Syne Mono,monospace'}}>info@najdideal.cz</div>
        </div>
      </footer>

      {/* LIVE NOTIFICATION */}
      {liveAlert && (
        <div style={{position:'fixed',bottom:28,left:28,zIndex:800,display:'flex',alignItems:'center',gap:13,background:'rgba(6,6,14,.9)',backdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,.07)',borderLeft:'2px solid #00E676',borderRadius:13,padding:'16px 20px',maxWidth:330,transform:showAlert?'translateX(0)':'translateX(-120%)',opacity:showAlert?1:0,transition:'transform .65s cubic-bezier(.34,1.56,.64,1),opacity .4s',boxShadow:'0 22px 72px rgba(0,0,0,.65)'}}>
          <span style={{fontSize:26,flexShrink:0}}>{liveAlert.e}</span>
          <div>
            <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>{liveAlert.n}</div>
            <div style={{fontSize:10,color:G.mut}}>{liveAlert.b}</div>
            <div style={{fontFamily:'Bebas Neue,monospace',fontSize:20,color:G.grn,letterSpacing:1,marginTop:3,textShadow:'0 0 16px rgba(0,230,118,.3)'}}>{liveAlert.a}</div>
          </div>
        </div>
      )}

      {/* LIVE CHAT WIDGET */}
      <ChatWidget />
      <NajdiBot mood="happy" />
    </div>
  )
}
