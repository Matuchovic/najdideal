'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'



function FaqSection() {
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


function ScannerStatus() {
  const [count, setCount] = useState(0)
  const [pct, setPct] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 2400, start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(ease * 2341))
      setPct(Math.round(ease * 94))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started])
  return (
    <div ref={ref} style={{position:'absolute',bottom:-48,left:0,right:0,background:'rgba(2,2,8,.95)',backdropFilter:'blur(24px)',border:'1px solid rgba(240,180,41,.2)',borderRadius:12,padding:'14px 18px',zIndex:12,display:'flex',alignItems:'center',gap:12,boxShadow:'0 8px 40px rgba(0,0,0,.6)'}}>
      <div style={{width:7,height:7,borderRadius:'50%',background:'#00E676',flexShrink:0,boxShadow:'0 0 8px #00E676',animation:'nodeGlow 1.5s ease-in-out infinite'}} />
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:'#00E676',letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>AI Scanner · Live</div>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:'rgba(240,235,225,.7)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          Analyzuji <span style={{color:'#F0B429',fontWeight:700}}>{count.toLocaleString('cs-CZ')}</span> nabídek_
        </div>
      </div>
      <div style={{textAlign:'center',flexShrink:0}}>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,color:'#F0B429',letterSpacing:1,lineHeight:1,textShadow:'0 0 20px rgba(240,180,41,.5)'}}>{pct}%</div>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:7,color:'rgba(240,235,225,.3)',letterSpacing:1,textTransform:'uppercase'}}>Confidence</div>
      </div>
    </div>
  )
}

// ─── iPhone Phone Mockup Component ───────────────────────────────────────────
function PhoneMockup() {
  const [screen, setScreen] = useState<'home'|'ai'|'deals'|'alerts'>('home')
  const [liveCount, setLiveCount] = useState(47)
  const [statusIdx, setStatusIdx] = useState(0)
  const [scanPct, setScanPct] = useState(0)
  const [scanFound, setScanFound] = useState(0)
  const [scanning, setScanning] = useState(false)
  const scanRef = useRef<ReturnType<typeof setInterval>|null>(null)

  const statuses = ['AI analyzuje dealy…','Skenování trhů…','Nové příležitosti!','Live monitoring ✓']

  useEffect(() => {
    const i1 = setInterval(() => setLiveCount(p => Math.max(40, p + (Math.random()>.5?1:-1))), 4000)
    const i2 = setInterval(() => setStatusIdx(p => (p+1)%4), 3800)
    return () => { clearInterval(i1); clearInterval(i2) }
  }, [])

  const runScan = () => {
    if (scanning) return
    setScanning(true); setScanPct(0); setScanFound(0)
    let p = 0, f = 0
    scanRef.current = setInterval(() => {
      p += Math.random()*3.5+1
      if (Math.random()>.65) f++
      setScanPct(Math.min(Math.round(p),100))
      setScanFound(f)
      if (p >= 100) { clearInterval(scanRef.current!); setScanning(false) }
    }, 80)
  }

  const G = {
    gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', red:'#FF3B5C',
    wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
    bg:'#020208', bg2:'#06060E', bg3:'#0d1018',
    gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
  }

  const deals = [
    {e:'📱',n:'iPhone 15 Pro 256GB',cat:'Marketplace Flip',p:'+7 200 Kč',hot:true},
    {e:'🤖',n:'Jasper AI Affiliate',cat:'Affiliate',p:'35% prov.',small:true},
    {e:'💻',n:'MacBook Air M2',cat:'Marketplace Flip',locked:true},
    {e:'🎮',n:'RTX 3060 Ti 8GB',cat:'Marketplace Flip',p:'+3 300 Kč'},
    {e:'🎧',n:'AirPods Pro 2. gen',cat:'Marketplace Flip',p:'+2 790 Kč'},
    {e:'🌀',n:'Dyson V15 Detect',cat:'Trend Produkt',p:'+4 800 Kč'},
    {e:'🕹️',n:'PS5 Slim bundle',cat:'Marketplace Flip',p:'+3 800 Kč'},
  ]

  const s: Record<string,React.CSSProperties> = {
    screen: {display:'flex',flexDirection:'column'},
    pad: {padding:'16px 14px 0'},
    h1: {fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:3,lineHeight:1.05,color:G.wht,marginBottom:8},
    mono: {fontFamily:'Syne Mono,monospace'},
    syne: {fontFamily:'Syne,sans-serif'},
  }

  return (
    <div style={{
      position:'relative',
      animation:'phoneFloat 7s ease-in-out infinite',
      filter:'drop-shadow(0 60px 120px rgba(0,0,0,.9)) drop-shadow(0 0 80px rgba(240,180,41,.06))',
      zIndex:10,
    }}>
      <style>{`
        @keyframes phoneFloat{0%,100%{transform:translateY(0) rotate(-1deg)}40%{transform:translateY(-20px) rotate(.4deg)}70%{transform:translateY(-12px) rotate(-.5deg)}}
        @keyframes phoneShadow{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.4}40%{transform:translateX(-50%) scaleX(.72);opacity:.18}}
        @keyframes brainPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
        @keyframes progFill{from{width:0}to{width:var(--w,87%)}}
        @keyframes pingGold{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.8)}55%{box-shadow:0 0 0 4px transparent}}
        @keyframes pingRed{0%,100%{box-shadow:0 0 0 0 rgba(255,59,92,.7)}55%{box-shadow:0 0 0 4px transparent}}
        @keyframes scrIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tickerPhone{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>

      {/* ── PHONE FRAME ── */}
      <div style={{
        width:290,
        borderRadius:50,
        background:'linear-gradient(160deg,#2a2a3e 0%,#101018 45%,#1a1a28 100%)',
        border:'1.5px solid rgba(255,255,255,.12)',
        boxShadow:`
          inset 0 1px 0 rgba(255,255,255,.15),
          inset 0 -1px 0 rgba(0,0,0,.55),
          0 0 0 1px rgba(255,255,255,.04),
          0 0 0 8px #0c0c1a,
          0 0 0 9px rgba(255,255,255,.055),
          0 0 0 10px #060610,
          0 70px 140px rgba(0,0,0,.95),
          0 30px 60px rgba(0,0,0,.7)
        `,
        overflow:'visible',
        position:'relative',
      }}>
        {/* Side buttons */}
        {[
          {style:{left:-3,top:86,width:3,height:26}},
          {style:{left:-3,top:122,width:3,height:48}},
          {style:{left:-3,top:180,width:3,height:48}},
          {style:{right:-3,top:148,width:3,height:70}},
        ].map((b,i) => (
          <div key={i} style={{position:'absolute',background:'linear-gradient(to right,#1a1a28,#0f0f1a)',borderRadius:2,...b.style}} />
        ))}

        {/* Screen */}
        <div style={{background:G.bg,borderRadius:42,margin:4,overflow:'hidden',height:600,position:'relative'}}>

          {/* Dynamic Island */}
          <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',width:84,height:26,background:'#000',borderRadius:13,zIndex:60,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:9,gap:5,boxShadow:'0 0 0 1px rgba(255,255,255,.05)'}}>
            <div style={{width:9,height:9,borderRadius:'50%',background:'#111',border:'1px solid rgba(255,255,255,.05)'}} />
            <div style={{width:5,height:5,borderRadius:'50%',background:'rgba(0,230,118,.55)'}} />
          </div>

          {/* Status bar */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 20px 5px',position:'relative',zIndex:20}}>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:G.wht}}>9:41</div>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'flex-end',gap:2}}>
                {[4,7,10,13].map(h => <div key={h} style={{width:3,height:h,background:'rgba(240,235,225,.75)',borderRadius:1}} />)}
              </div>
              <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:'rgba(240,235,225,.8)'}}>5G</div>
              <div style={{width:21,height:11,border:'1.5px solid rgba(240,235,225,.55)',borderRadius:3,position:'relative',display:'flex',alignItems:'center',padding:'1.5px'}}>
                <div style={{width:'82%',height:'100%',background:G.grn,borderRadius:1}} />
                <div style={{position:'absolute',right:-4,top:'50%',transform:'translateY(-50%)',width:3,height:6,background:'rgba(240,235,225,.35)',borderRadius:'0 1px 1px 0'}} />
              </div>
            </div>
          </div>

          {/* App content */}
          <div style={{height:484,overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none',paddingBottom:70}}>

            {/* ── HOME ── */}
            {screen === 'home' && (
              <div style={{animation:'scrIn .3s ease'}}>
                <div style={s.pad}>
                  {/* Pills */}
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>
                    <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 9px',borderRadius:100,background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.2)'}}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:G.grn,animation:'ping 2s ease-in-out infinite',flexShrink:0}} />
                      <span style={{...s.mono,fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',color:G.grn}}>{Math.round(liveCount)} online</span>
                    </div>
                    <div style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:100,background:G.gl,border:`1px solid ${G.br}`}}>
                      <span style={{...s.mono,fontSize:9,letterSpacing:'1px',color:G.mut}}>{statuses[statusIdx]}</span>
                    </div>
                  </div>
                  {/* H1 */}
                  <div style={{...s.h1}}>KAŽDÝ DEN<br/><span style={{background:'linear-gradient(135deg,#F0B429 0%,#FFD97D 48%,#F0B429 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmer 5s linear infinite'}}>VÝHODNÉ<br/>NABÍDKY.</span></div>
                  <p style={{...s.syne,fontSize:11,color:G.mut,fontWeight:300,lineHeight:1.6,marginBottom:14}}>My je najdeme za tebe. Nakup levněji. Prodej za víc.</p>
                  <div style={{display:'flex',gap:7,marginBottom:14}}>
                    <button style={{flex:1,...s.mono,fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:G.gold,color:'#000',padding:'10px 12px',borderRadius:10,border:'none',cursor:'pointer',boxShadow:'0 4px 18px rgba(240,180,41,.35)'}}>Zobrazit dealy</button>
                    <button style={{...s.mono,fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:'rgba(255,255,255,.04)',border:`1px solid ${G.br}`,color:G.wht,padding:'10px 13px',borderRadius:10,cursor:'pointer'}}>👑 VIP</button>
                  </div>
                </div>
                {/* Stats strip */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:G.br,margin:'0 14px 12px',borderRadius:11,overflow:'hidden'}}>
                  {[{n:'2 341',l:'Nabídek'},{n:'247',l:'Dealů/měs'},{n:'98%',l:'AI přesnost'}].map(s2 => (
                    <div key={s2.l} style={{background:G.bg2,padding:'11px 6px',textAlign:'center'}}>
                      <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:19,color:G.gold,letterSpacing:1,lineHeight:1}}>{s2.n}</div>
                      <div style={{...s.mono,fontSize:7,color:G.mut,letterSpacing:'1px',textTransform:'uppercase',marginTop:2}}>{s2.l}</div>
                    </div>
                  ))}
                </div>
                {/* Upgrade pill */}
                <div style={{margin:'0 14px 12px',borderRadius:11,border:'1px solid rgba(240,180,41,.22)',padding:'12px 14px',background:'rgba(240,180,41,.04)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#F0B429,transparent)'}} />
                  <div>
                    <div style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:G.gold,marginBottom:2}}>↑ Upgraduj na VIP</div>
                    <div style={{fontSize:10,color:G.mut,fontWeight:300}}>Exkluzivní dealy, alerty, komunita</div>
                  </div>
                  <button style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:G.gold,color:'#000',padding:'8px 11px',borderRadius:7,border:'none',cursor:'pointer',flexShrink:0,boxShadow:'0 4px 14px rgba(240,180,41,.3)'}}>499 Kč</button>
                </div>
                {/* Mini ticker */}
                <div style={{overflow:'hidden',borderTop:`1px solid ${G.br}`,borderBottom:`1px solid ${G.br}`,padding:'7px 0',marginBottom:12,background:'rgba(0,230,118,.02)'}}>
                  <div style={{display:'flex',whiteSpace:'nowrap',animation:'tickerPhone 20s linear infinite'}}>
                    {['📱 +7 200 Kč','🤖 35% recurring','💻 +8 990 Kč','🎮 +3 300 Kč','🎧 +2 790 Kč','🕹️ +3 800 Kč','📱 +7 200 Kč','🤖 35% recurring','💻 +8 990 Kč','🎮 +3 300 Kč','🎧 +2 790 Kč','🕹️ +3 800 Kč'].map((t,i) => (
                      <span key={i} style={{...s.mono,fontSize:9,color:G.mut,padding:'0 14px',display:'inline-flex',alignItems:'center',gap:5}}>
                        {t.split(' ')[0]} <span style={{color:G.grn,fontWeight:700}}>{t.split(' ').slice(1).join(' ')}</span>
                        <span style={{color:'rgba(240,180,41,.2)',marginLeft:10}}>✦</span>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Deals */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',marginBottom:9}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:13}}>🔥</span>
                    <span style={{...s.mono,fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:G.wht}}>Dnešní top dealy</span>
                  </div>
                  <span style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:G.gold,cursor:'pointer'}}>Vše →</span>
                </div>
                <div style={{padding:'0 14px',display:'flex',flexDirection:'column',gap:7}}>
                  {deals.slice(0,4).map((d,i) => (
                    <div key={i} style={{background:d.hot?'rgba(240,180,41,.03)':G.gl,border:`1px solid ${d.hot?'rgba(240,180,41,.2)':G.br}`,borderRadius:11,padding:'11px 12px',display:'flex',alignItems:'center',gap:10,position:'relative',overflow:'hidden',cursor:'pointer'}}>
                      {d.hot && <div style={{position:'absolute',top:0,left:'5%',right:'5%',height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.55),transparent)'}} />}
                      {d.hot && <div style={{position:'absolute',top:8,right:10,width:5,height:5,borderRadius:'50%',background:G.gold,animation:'pingGold 2s ease-in-out infinite'}} />}
                      <div style={{fontSize:22,lineHeight:1,flexShrink:0}}>{d.e}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...s.syne,fontSize:11,fontWeight:700,color:G.wht,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{d.n}</div>
                        <div style={{...s.mono,fontSize:8,color:G.mut,letterSpacing:'1px',textTransform:'uppercase'}}>{d.cat}</div>
                      </div>
                      {d.locked ? (
                        <div style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:G.gold,background:'rgba(240,180,41,.1)',border:'1px solid rgba(240,180,41,.25)',borderRadius:5,padding:'3px 7px',flexShrink:0}}>🔒 VIP</div>
                      ) : (
                        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:d.small?14:17,color:G.grn,letterSpacing:.5,flexShrink:0,textShadow:'0 0 10px rgba(0,230,118,.35)'}}>{d.p}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── AI ── */}
            {screen === 'ai' && (
              <div style={{padding:'16px 14px 0',animation:'scrIn .3s ease'}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:3,color:G.wht,marginBottom:4}}>AI ENGINE</div>
                <p style={{...s.syne,fontSize:11,color:G.mut,fontWeight:300,marginBottom:13}}>Inteligentní skenování 2 341 nabídek v reálném čase.</p>
                {/* AI orb box */}
                <div style={{background:'linear-gradient(135deg,rgba(240,180,41,.08),rgba(77,159,255,.05),rgba(155,93,229,.06))',border:'1px solid rgba(240,180,41,.15)',borderRadius:16,padding:'18px 14px',marginBottom:12,position:'relative',overflow:'hidden',textAlign:'center'}}>
                  <div style={{position:'absolute',top:-40,left:'50%',transform:'translateX(-50%)',width:180,height:180,background:'radial-gradient(circle,rgba(240,180,41,.09),transparent 70%)',borderRadius:'50%',pointerEvents:'none'}} />
                  <div style={{width:54,height:54,borderRadius:15,background:'linear-gradient(135deg,#F0B429,#FFD97D,#F0B429)',margin:'0 auto 10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,position:'relative',boxShadow:'0 0 28px rgba(240,180,41,.42)'}}>
                    <div style={{position:'absolute',inset:-3,borderRadius:18,border:'1px solid rgba(240,180,41,.4)',animation:'brainPulse 3s ease-in-out infinite'}} />
                    🧠
                  </div>
                  <div style={{...s.mono,fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:G.gold,marginBottom:8}}>NAJDI AI MATCH ENGINE</div>
                  <div style={{height:3,background:'rgba(255,255,255,.07)',borderRadius:2,marginBottom:6,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${scanPct}%`,background:'linear-gradient(90deg,#F0B429,#00E676)',borderRadius:2,transition:'width .1s linear'}} />
                  </div>
                  <div style={{...s.mono,fontSize:9,color:G.mut,marginBottom:12}}>{scanning ? `Analyzuji… ${scanPct}% · Nalezeno ${scanFound} dealů` : scanFound > 0 ? `✓ Hotovo · Nalezeno ${scanFound} příležitostí` : 'Přesnost 98 % · 2 341 nabídek'}</div>
                  <button onClick={runScan} disabled={scanning} style={{...s.mono,fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:scanning?'rgba(240,180,41,.15)':G.gold,color:scanning?G.gold:'#000',padding:'8px 16px',borderRadius:8,border:'none',cursor:scanning?'default':'pointer',boxShadow:scanning?'none':'0 4px 16px rgba(240,180,41,.3)',transition:'all .25s'}}>
                    {scanning ? '⏳ Skenuji…' : '⚡ Spustit AI scan'}
                  </button>
                </div>
                {/* Feature grid */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:12}}>
                  {[{i:'🎯',t:'Smart Match',s:'Osobní profil'},{i:'📊',t:'AI Analýza',s:'Cenové trendy'},{i:'🔔',t:'Chytrá upoz.',s:'Okamžité alerty'},{i:'⚡',t:'Predikce cen',s:'30denní výhled'},{i:'🌍',t:'Lokality AI',s:'Mapa příležitostí'},{i:'💎',t:'VIP Přístup',s:'Skryté nabídky'}].map(f => (
                    <div key={f.t} style={{background:G.gl,border:`1px solid ${G.br}`,borderRadius:11,padding:'11px 10px',cursor:'pointer'}}>
                      <div style={{fontSize:18,marginBottom:6}}>{f.i}</div>
                      <div style={{...s.syne,fontSize:11,fontWeight:700,color:G.wht,marginBottom:2}}>{f.t}</div>
                      <div style={{...s.mono,fontSize:8,color:G.mut}}>{f.s}</div>
                    </div>
                  ))}
                </div>
                {/* Live scan */}
                <div style={{background:G.gl,border:`1px solid ${G.br}`,borderRadius:11,padding:'12px 13px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(255,59,92,.1)',border:'1px solid rgba(255,59,92,.22)',borderRadius:100,padding:'2px 8px'}}>
                      <div style={{width:5,height:5,borderRadius:'50%',background:G.red,animation:'pingRed 1.5s ease-in-out infinite',flexShrink:0}} />
                      <span style={{...s.mono,fontSize:7,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:G.red}}>LIVE</span>
                    </div>
                    <span style={{...s.syne,fontSize:12,fontWeight:700,color:G.wht}}>Aktivní skenování</span>
                  </div>
                  {[{i:'🚗',n:'Audi RS6 Avant 2024',v:'Praha · 3 890 000 Kč',tag:'NOVÉ',tc:G.grn,tbg:'rgba(0,230,118,.1)'},{i:'🏠',n:'Byt 3+kk Dejvice',v:'Praha · −180 000 Kč sleva',tag:'SLEVA',tc:'#4D9FFF',tbg:'rgba(77,159,255,.1)'},{i:'⌚',n:'Rolex Submariner',v:'Brno · 189 000 Kč',tag:'HOT',tc:G.red,tbg:'rgba(255,59,92,.1)'}].map((item,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:i<2?8:0}}>
                      <div style={{width:28,height:28,borderRadius:7,background:G.bg3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{item.i}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...s.syne,fontSize:11,fontWeight:600,color:G.wht,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.n}</div>
                        <div style={{...s.mono,fontSize:8,color:G.mut}}>{item.v}</div>
                      </div>
                      <div style={{...s.mono,fontSize:7,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:item.tc,background:item.tbg,border:`1px solid ${item.tc}33`,borderRadius:4,padding:'2px 6px',flexShrink:0}}>{item.tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DEALS ── */}
            {screen === 'deals' && (
              <div style={{padding:'16px 14px 0',animation:'scrIn .3s ease'}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:3,color:G.wht,marginBottom:11}}>DEALY</div>
                <div style={{display:'flex',alignItems:'center',gap:7,background:G.bg2,border:`1px solid ${G.br}`,borderRadius:10,padding:'0 12px',height:38,marginBottom:11}}>
                  <span style={{fontSize:13,opacity:.4}}>🔍</span>
                  <span style={{...s.syne,fontSize:11,color:G.mut}}>Hledat dealy…</span>
                </div>
                <div style={{display:'flex',gap:6,marginBottom:13,overflowX:'auto',scrollbarWidth:'none'}}>
                  {['Vše','🔄 Flip','🤖 AI','📈 Trend','💎 Luxus'].map((c,i) => (
                    <button key={c} style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',padding:'5px 11px',borderRadius:18,flexShrink:0,border:`1px solid ${i===0?'rgba(240,180,41,.35)':G.br}`,background:i===0?'rgba(240,180,41,.12)':G.gl,color:i===0?G.gold:G.mut,cursor:'pointer',whiteSpace:'nowrap'}}>{c}</button>
                  ))}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {deals.map((d,i) => (
                    <div key={i} style={{background:d.hot?'rgba(240,180,41,.03)':G.gl,border:`1px solid ${d.hot?'rgba(240,180,41,.2)':G.br}`,borderRadius:11,padding:'11px 12px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',position:'relative',overflow:'hidden'}}>
                      {d.hot && <div style={{position:'absolute',top:0,left:'5%',right:'5%',height:1,background:'linear-gradient(90deg,transparent,rgba(240,180,41,.55),transparent)'}} />}
                      <div style={{fontSize:22,lineHeight:1,flexShrink:0}}>{d.e}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...s.syne,fontSize:11,fontWeight:700,color:G.wht,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{d.n}</div>
                        <div style={{...s.mono,fontSize:8,color:G.mut,letterSpacing:'1px',textTransform:'uppercase'}}>{d.cat}</div>
                      </div>
                      {d.locked ? <div style={{...s.mono,fontSize:8,fontWeight:700,color:G.gold,background:'rgba(240,180,41,.1)',border:'1px solid rgba(240,180,41,.25)',borderRadius:5,padding:'3px 7px',flexShrink:0}}>🔒 VIP</div>
                        : <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:d.small?13:16,color:G.grn,letterSpacing:.5,flexShrink:0,textShadow:'0 0 10px rgba(0,230,118,.35)'}}>{d.p}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ALERTS ── */}
            {screen === 'alerts' && (
              <div style={{padding:'16px 14px 0',animation:'scrIn .3s ease'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:3,color:G.wht}}>ALERTY</div>
                  <div style={{...s.mono,fontSize:8,color:G.gold,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>Označit vše</div>
                </div>
                <p style={{...s.syne,fontSize:11,color:G.mut,fontWeight:300,marginBottom:13}}>3 nové · aktualizováno právě teď</p>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {[
                    {type:'vip',color:G.gold,ico:'👑',ibg:'rgba(240,180,41,.08)',ibr:'rgba(240,180,41,.2)',t:'VIP Exkluzivní flip alert',b:'iPhone 15 Pro za 15 000 Kč – tržní hodnota 22 500 Kč.',vip:true,unread:true},
                    {type:'ai',color:'#4D9FFF',ico:'🤖',ibg:'rgba(77,159,255,.08)',ibr:'rgba(77,159,255,.2)',t:'AI příležitost detekována',b:'Jasper AI affiliate – 35 % recurring provize.'},
                    {type:'tr',color:G.grn,ico:'📈',ibg:'rgba(0,230,118,.08)',ibr:'rgba(0,230,118,.2)',t:'Trend produkt týdne',b:'RTX 3060 Ti – poptávka +92 % za 7 dní.',unread:true},
                    {type:'vip',color:G.gold,ico:'👑',ibg:'rgba(240,180,41,.08)',ibr:'rgba(240,180,41,.2)',t:'MacBook Air M2 VIP deal',b:'Koupeno 26 000 Kč. Tržní hodnota 34 990 Kč.',vip:true,locked:true},
                    {type:'pur',color:'#9B5DE5',ico:'⚡',ibg:'rgba(155,93,229,.08)',ibr:'rgba(155,93,229,.2)',t:'AI Cenový alert',b:'AirPods Pro 2 – cena klesla o 2 100 Kč na Aukro.'},
                  ].map((a,i) => (
                    <div key={i} style={{background:G.gl,border:`1px solid ${G.br}`,borderLeft:`2px solid ${a.color}`,borderRadius:'0 11px 11px 0',padding:'11px 12px',display:'flex',alignItems:'flex-start',gap:9,cursor:'pointer',position:'relative',overflow:'hidden',transition:'opacity .3s'}} onClick={e => (e.currentTarget.style.opacity='.5')}>
                      <div style={{width:30,height:30,borderRadius:8,background:a.ibg,border:`1px solid ${a.ibr}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{a.ico}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...s.syne,fontSize:11,fontWeight:700,color:G.wht,marginBottom:2,filter:a.locked?'blur(3px)':'none'}}>{a.t}</div>
                        <div style={{fontSize:10,color:G.mut,fontWeight:300,lineHeight:1.5,filter:a.locked?'blur(3px)':'none'}}>{a.b}</div>
                      </div>
                      {a.vip && !a.locked && <div style={{...s.mono,fontSize:7,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:G.gold,background:'rgba(240,180,41,.1)',border:'1px solid rgba(240,180,41,.25)',borderRadius:4,padding:'2px 6px',flexShrink:0,alignSelf:'flex-start'}}>VIP</div>}
                      {a.unread && !a.locked && <div style={{width:6,height:6,borderRadius:'50%',background:a.color,flexShrink:0,marginTop:4,boxShadow:`0 0 5px ${a.color}`}} />}
                      {a.locked && (
                        <div style={{position:'absolute',inset:0,background:'rgba(2,2,8,.72)',backdropFilter:'blur(2px)',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                          <span style={{fontSize:12}}>🔒</span>
                          <span style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:G.gold}}>VIP Alert</span>
                          <button style={{...s.mono,fontSize:8,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',background:G.gold,color:'#000',padding:'4px 9px',borderRadius:5,border:'none',cursor:'pointer'}}>Odemknout</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom nav dock */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'0 7px 13px',zIndex:40}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:5}}>
              <div style={{width:90,height:4,borderRadius:2,background:'rgba(255,255,255,.13)'}} />
            </div>
            <div style={{background:'rgba(5,5,16,.92)',backdropFilter:'blur(22px)',border:`1px solid ${G.br}`,borderRadius:26,padding:'9px 3px',display:'flex',justifyContent:'space-around',alignItems:'center',boxShadow:'0 -2px 30px rgba(0,0,0,.75)'}}>
              {([['home','🏠','Domů'],['ai','🧠','AI'],['deals','🔥','Dealy'],['alerts','🔔','Alerty']] as const).map(([id,ico,lbl]) => (
                <button key={id} onClick={() => setScreen(id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,background:screen===id?'rgba(240,180,41,.09)':'none',border:'none',cursor:'pointer',padding:'5px 10px',borderRadius:14,position:'relative',transition:'background .2s'}}>
                  <span style={{fontSize:20,filter:screen===id?'none':'grayscale(1) opacity(.38)',transition:'all .25s'}}>{ico}</span>
                  <span style={{fontFamily:'Syne Mono,monospace',fontSize:8,letterSpacing:'.5px',textTransform:'uppercase',color:screen===id?G.gold:'rgba(240,235,225,.3)',transition:'color .2s'}}>{lbl}</span>
                  {id==='alerts' && screen!=='alerts' && <div style={{position:'absolute',top:3,right:4,width:13,height:13,borderRadius:'50%',background:G.red,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontSize:7,fontWeight:700,color:'#fff',border:'1.5px solid #020208'}}>3</div>}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Shadow */}
      <div style={{position:'absolute',bottom:-38,left:'50%',transform:'translateX(-50%)',width:210,height:26,background:'rgba(0,0,0,.62)',borderRadius:'50%',filter:'blur(20px)',animation:'phoneShadow 7s ease-in-out infinite'}} />
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

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
  const alerts = [
    {e:'📱',n:'Tomáš P.',b:'právě flipoval iPhone 15 Pro',a:'+7 200 Kč'},
    {e:'🤖',n:'Jakub M.',b:'registroval Jasper AI affiliate',a:'+35% provize'},
    {e:'🎮',n:'Petra K.',b:'prodala RTX 3060 Ti',a:'+4 100 Kč'},
    {e:'💻',n:'Martin V.',b:'flipoval MacBook Air M2',a:'+8 990 Kč'},
    {e:'👑',n:'Eliška R.',b:'vstoupila do VIP komunity',a:'🎉 Vítej!'},
  ]

  useEffect(() => {
    let si = 0
    const iv1 = setInterval(() => { si = (si+1)%5; setAiStatus(statuses[si]) }, 4000)
    const iv2 = setInterval(() => setOnline(p => Math.max(40, p + (Math.random()>.5?1:-1))), 4200)
    const iv3 = setInterval(() => { if(Math.random()>.8) setMembers(p => p+1) }, 12000)
    const iv4 = setInterval(() => setViews(p => p.map((v) => Math.random()>.6 ? v + Math.floor(Math.random()*3)+1 : v)), 2500)
    let ai = 0
    const showN = () => {
      setLiveAlert(alerts[ai++ % alerts.length])
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

  const deals = [
    {e:'📱',b:'TOP DEAL',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'iPhone 15 Pro 256GB',buy:'15 000 Kč',sell:'22 500 Kč',p:'+7 000 Kč',s:'Marketplace Flip'},
    {e:'🤖',b:'AI TOOL',bc:'rgba(77,159,255,.08)',bc2:'rgba(77,159,255,.18)',bc3:G.blu,n:'Jasper AI Affiliate',buy:'Provize 35%',sell:'Recurring',p:'Pasivní příjem',s:'Affiliate'},
    {e:'💻',b:'VIP ONLY',bc:'rgba(155,93,229,.08)',bc2:'rgba(155,93,229,.18)',bc3:G.pur,n:'MacBook Air M2',buy:'26 000 Kč',sell:'34 990 Kč',p:'+8 990 Kč',s:'Marketplace Flip'},
    {e:'🎮',b:'FLIP ALERT',bc:'rgba(240,180,41,.08)',bc2:'rgba(240,180,41,.2)',bc3:G.g,n:'RTX 3060 Ti 8GB',buy:'5 200 Kč',sell:'8 500 Kč',p:'+3 300 Kč',s:'Marketplace Flip'},
    {e:'🎧',b:'HOT DEAL',bc:'rgba(255,59,92,.08)',bc2:'rgba(255,59,92,.18)',bc3:'#FF3B5C',n:'AirPods Pro 2',buy:'4 200 Kč',sell:'6 990 Kč',p:'+2 790 Kč',s:'Marketplace Flip'},
    {e:'🌀',b:'TREND',bc:'rgba(0,230,118,.06)',bc2:'rgba(0,230,118,.14)',bc3:G.grn,n:'Dyson V15 Detect',buy:'8 900 Kč',sell:'14 200 Kč',p:'+4 800 Kč',s:'Trend Produkt'},
  ]

  const tickerItems = ['iPhone 15 Pro +7 000 Kč','Jasper AI 35% provize','RTX 3060 Ti +3 300 Kč','MacBook Air M2 +8 990 Kč','AirPods Pro 2 +2 790 Kč','PS5 Slim +3 800 Kč','Dyson V15 +4 800 Kč']
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
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) both'}}>KAŽDÝ DEN</span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .08s both'}}>JSOU TAM</span>
            <span style={{display:'block',animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .16s both'}}>
              <span style={{background:'linear-gradient(90deg,#F0EBE1 0%,#F0B429 25%,#FFD97D 50%,#F0B429 75%,#F0EBE1 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite, textGlow 3s ease-in-out infinite'}}>VÝHODNÉ</span>
            </span>
            <span style={{display:'block',color:G.wht,animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .24s both'}}>NABÍDKY.</span>
          </h1>
          <div style={{animation:'fadeU .9s cubic-bezier(.16,1,.3,1) .32s both'}}>
            <p style={{fontSize:22,color:G.wht,lineHeight:1.5,maxWidth:480,marginBottom:12,fontWeight:600,letterSpacing:.5}}>Většina lidí je přehlédne.</p>
            <p style={{fontSize:16,color:G.mut,lineHeight:1.88,maxWidth:460,marginBottom:40,fontWeight:300}}>My je najdeme za tebe. Nakup levněji. Prodej za víc.<br/>Nepropásni dobrou příležitost.</p>
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
            <div key={i} className="dc" style={{position:'relative',overflow:'hidden',background:G.gl,backdropFilter:'blur(32px) saturate(180%)',border:`1px solid ${G.br}`,borderRadius:16,padding:24,transition:'transform .5s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .5s'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'55%',background:'linear-gradient(180deg,rgba(255,255,255,.04) 0%,transparent 100%)',borderRadius:'16px 16px 0 0',pointerEvents:'none'}} />
              <span style={{display:'inline-flex',alignItems:'center',gap:4,fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'4px 10px',borderRadius:100,marginBottom:16,background:d.bc,color:d.bc3,border:`1px solid ${d.bc2}`}}>{d.b}</span>
              <span style={{fontSize:44,display:'block',marginBottom:14,filter:'drop-shadow(0 0 8px rgba(240,180,41,.15))'}}>{d.e}</span>
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
        <div style={{marginTop:64,position:'relative',borderRadius:20,overflow:'hidden',border:'1px solid rgba(240,180,41,.2)',padding:'56px 64px',background:'rgba(240,180,41,.025)',animation:'vipGlow 4s ease-in-out infinite'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#F0B429,transparent)'}} />
          <div className="vip-banner-grid" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'center'}}>
            <div>
              <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:G.g,display:'flex',alignItems:'center',gap:8,marginBottom:14}}>👑 Exkluzivní VIP členství</div>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(32px,5vw,60px)',letterSpacing:4,color:G.wht,marginBottom:14,lineHeight:.9}}>ZÍSKEJ PŘÍSTUP K <span style={{color:G.g}}>NEJLEPŠÍM</span> DEALŮM JAKO PRVNÍ</h3>
              <p style={{fontSize:13,color:G.mut,fontWeight:300,lineHeight:1.8,maxWidth:520}}>VIP členové dostávají alerty dříve. Průměrný VIP člen vydělá 4 235 Kč měsíčně navíc.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:20}}>
                {['⚡ Instant alerty','🤖 AI příležitosti','🛒 Exkluzivní flipy','👥 Komunita','🔒 VIP obsah'].map(t => <span key={t} style={{fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'5px 12px',borderRadius:100,background:'rgba(240,180,41,.07)',border:'1px solid rgba(240,180,41,.18)',color:G.g}}>{t}</span>)}
              </div>
            </div>
            <div className="vip-banner-cta" style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:12,flexShrink:0}}>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:72,color:G.g,letterSpacing:2,lineHeight:1,textShadow:'0 0 50px rgba(240,180,41,.35)'}}>499<span style={{fontSize:28}}> Kč</span></div>
              <div style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:G.mut,letterSpacing:2,textTransform:'uppercase',marginTop:-4}}>za měsíc · zruš kdykoliv</div>
              <Link href="/vip" style={{background:G.g,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'14px 28px',borderRadius:8,textDecoration:'none',whiteSpace:'nowrap',boxShadow:'0 8px 32px rgba(240,180,41,.28)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-4px)';(e.currentTarget as any).style.boxShadow='0 22px 56px rgba(240,180,41,.5)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.28)'}}>🔒 Vstoupit do VIP →</Link>
            </div>
          </div>
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
              <div style={{width:28,height:28,background:G.g,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#000'}}>ND</div>
              NAJDI<span style={{color:G.g}}>DEAL</span>
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
    </div>
  )
}
