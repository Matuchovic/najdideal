'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const CATS = [
  {emoji:'🏠',label:'Nemovitosti',color:'#4D9FFF',desc:'Byty, domy, chaty, pozemky',count:'1 240+',shape:'house'},
  {emoji:'🚗',label:'Auta & Motorky',color:'#00E676',desc:'Osobní, SUV, motocykly',count:'890+',shape:'car'},
  {emoji:'📱',label:'Elektronika',color:'#9B5DE5',desc:'Telefony, notebooky, foto',count:'3 100+',shape:'circuit'},
  {emoji:'👗',label:'Oblečení & Móda',color:'#F0B429',desc:'Značkové, vintage, sport',count:'2 400+',shape:'diamond'},
  {emoji:'🛋',label:'Nábytek & Dům',color:'#FF6B35',desc:'Nábytek, dekorace, zahrada',count:'760+',shape:'grid'},
  {emoji:'🛒',label:'Ostatní',color:'rgba(240,235,225,.7)',desc:'Vše co jinde nenajdeš',count:'5 000+',shape:'random'},
]

function pts(shape:string,n:number,sz:number){
  const r=[],cx=sz/2,cy=sz/2
  for(let i=0;i<n;i++){
    const t=i/n
    if(shape==='house'){
      if(t<.4)r.push({x:cx-30+t*150,y:cy+20})
      else if(t<.7){const s=(t-.4)/.3;r.push({x:cx-30+s*60,y:cy+20-s*40})}
      else{const s=(t-.7)/.3;r.push({x:cx+30-s*60,y:cy-20+s*40})}
    }else if(shape==='car'){const a=t*Math.PI*2;r.push({x:cx+50*Math.cos(a),y:cy+20*Math.sin(a)})}
    else if(shape==='circuit'){r.push({x:cx-28+(i%8)*8,y:cy-16+Math.floor(i/8)*8})}
    else if(shape==='diamond'){const a=t*Math.PI*2,rad=35+Math.sin(a*4)*15;r.push({x:cx+rad*Math.cos(a),y:cy+rad*Math.sin(a)})}
    else if(shape==='grid'){r.push({x:cx-24+(i%7)*8,y:cy-16+Math.floor(i/7)*8})}
    else{const a=t*Math.PI*2;r.push({x:cx+40*Math.cos(a)+(Math.random()*20-10),y:cy+40*Math.sin(a)+(Math.random()*20-10)})}
  }
  return r
}

function toRgb(c:string){
  if(c.startsWith('rgba')||c.startsWith('rgb'))return '240,235,225'
  const m=c.replace('#','').match(/.{2}/g)
  return m ? m.map(h=>parseInt(h,16)).join(',') : '240,235,225'
}

function PCanvas({cat,hov}:{cat:typeof CATS[0],hov:boolean}){
  const ref=useRef<HTMLCanvasElement>(null),anim=useRef(0),pars=useRef<any[]>([])
  const W=120,H=120,N=48
  useEffect(()=>{
    const cv=ref.current;if(!cv)return
    const ctx=cv.getContext('2d');if(!ctx)return;cv.width=W;cv.height=H
    const sp=pts(cat.shape,N,W)
    if(pars.current.length===0){
      pars.current=sp.map((p,i)=>({x:W/2+(Math.random()-.5)*W,y:H/2+(Math.random()-.5)*H,tx:p.x,ty:p.y,vx:0,vy:0,sz:Math.random()*2+1,a:0,d:i*20,t:Date.now()}))
    }
    const rgb=toRgb(cat.color)
    const draw=()=>{
      ctx.clearRect(0,0,W,H)
      pars.current.forEach((p,i)=>{
        if(Date.now()-p.t-p.d<0)return
        if(hov){
          if(!p.ex){const a=Math.random()*Math.PI*2,s=Math.random()*6+2;p.ex=Math.cos(a)*s;p.ey=Math.sin(a)*s}
          p.x+=p.ex;p.y+=p.ey;p.ex*=.92;p.ey*=.92;p.a=Math.max(0,p.a-.02)
        }else{
          p.ex=undefined;p.ey=undefined
          const dx=p.tx-p.x,dy=p.ty-p.y
          p.vx+=dx*.12;p.vy+=dy*.12;p.vx*=.72;p.vy*=.72;p.x+=p.vx;p.y+=p.vy;p.a=Math.min(1,p.a+.04)
        }
        ctx.save();ctx.globalAlpha=p.a*.85
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*3)
        g.addColorStop(0,'rgba('+rgb+',.9)');g.addColorStop(1,'rgba('+rgb+',0)')
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.sz*3,0,Math.PI*2);ctx.fill()
        ctx.fillStyle='rgba('+rgb+',1)';ctx.beginPath();ctx.arc(p.x,p.y,p.sz*.8,0,Math.PI*2);ctx.fill()
        ctx.restore()
        if(!hov){
          pars.current.slice(i+1,i+4).forEach(p2=>{
            const dx=p2.x-p.x,dy=p2.y-p.y,d=Math.sqrt(dx*dx+dy*dy)
            if(d<18){ctx.save();ctx.globalAlpha=(1-d/18)*.3*p.a;ctx.strokeStyle='rgba('+rgb+',1)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.restore()}
          })
        }
      })
      anim.current=requestAnimationFrame(draw)
    }
    draw()
    return ()=>cancelAnimationFrame(anim.current)
  },[hov,cat])
  return <canvas ref={ref} width={W} height={H} style={{width:W,height:H}} />
}

export function ParticleMarketplace() {
  const [hov,setHov]=useState(-1)
  const [mp,setMp]=useState({x:0,y:0})
  const secRef=useRef<HTMLDivElement>(null)
  const [vis,setVis]=useState([false,false,false,false,false,false])
  const G={g:'#F0B429',wht:'#F0EBE1',mut:'rgba(240,235,225,.38)',gl:'rgba(255,255,255,.026)',br:'rgba(255,255,255,.07)'}

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          CATS.forEach((_,i)=>setTimeout(()=>setVis(p=>{const n=[...p];n[i]=true;return n}),i*120))
          obs.disconnect()
        }
      })
    },{threshold:.1})
    if(secRef.current)obs.observe(secRef.current as Element)
    return ()=>obs.disconnect()
  },[])

  return (
    <section ref={secRef} onMouseMove={e=>{const r=secRef.current?.getBoundingClientRect();if(r)setMp({x:e.clientX-r.left,y:e.clientY-r.top})}} style={{position:'relative',zIndex:10,padding:'clamp(80px,10vw,120px) clamp(20px,5vw,56px)',background:'linear-gradient(180deg,#020208 0%,#06060E 100%)',overflow:'hidden'}}>
      <style>{`
        @keyframes glowP{0%,100%{opacity:.3}50%{opacity:.8}}
        .ptag{transition:all .3s}
      `}</style>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(240,180,41,.05) 0%,transparent 70%)',filter:'blur(80px)',left:mp.x-250,top:mp.y-250,transition:'left .6s ease,top .6s ease',pointerEvents:'none',zIndex:0}} />
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(240,180,41,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.012) 1px,transparent 1px)',backgroundSize:'50px 50px',maskImage:'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 80%)',pointerEvents:'none'}} />
      <div style={{position:'relative',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 18px',borderRadius:100,background:'rgba(240,180,41,.06)',border:'1px solid rgba(240,180,41,.18)',marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#F0B429',display:'inline-block',animation:'glowP 2s ease-in-out infinite'}} />
            <span style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:2.5,textTransform:'uppercase',color:'#F0B429'}}>Marketplace · Vše na jednom místě</span>
          </div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(46px,7vw,96px)',letterSpacing:3,lineHeight:.85,marginBottom:16}}>PRODEJ CO MÁŠ.<br/><span style={{color:'#F0B429'}}>NAJDI CO HLEDÁŠ.</span></h2>
          <p style={{fontSize:15,color:'rgba(240,235,225,.38)',fontWeight:300,maxWidth:480,margin:'0 auto',lineHeight:1.85}}>Kup výhodně. Prodej rychle. Flipni se ziskem.<br/>Najeď myší na kategorii a sleduj jak se data rozletí.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
          {CATS.map((cat,i)=>(
            <div key={cat.label} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(-1)} style={{background:hov===i?cat.color+'08':'rgba(255,255,255,.026)',backdropFilter:'blur(32px) saturate(180%)',border:'1px solid '+(hov===i?cat.color+'44':'rgba(255,255,255,.07)'),borderRadius:20,padding:'24px 20px',position:'relative',overflow:'hidden',cursor:'pointer',transition:'all .5s cubic-bezier(.34,1.56,.64,1)',transform:vis[i]?(hov===i?'translateY(-10px) scale(1.02)':'translateY(0)'):'translateY(48px) scale(.94)',opacity:vis[i]?1:0,boxShadow:hov===i?'0 40px 100px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)':'none'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,'+cat.color+',transparent)',opacity:hov===i?1:.2,transition:'opacity .4s'}} />
              <div style={{position:'absolute',top:12,right:12,fontFamily:'Syne Mono,monospace',fontSize:8,color:cat.color,background:cat.color+'10',border:'1px solid '+cat.color+'22',padding:'3px 9px',borderRadius:100}}>{cat.count}</div>
              <div style={{marginBottom:12,height:120,display:'flex',alignItems:'center'}}>
                {vis[i]&&<PCanvas cat={cat} hov={hov===i} />}
              </div>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,color:'#F0EBE1',marginBottom:4}}>{cat.label}</div>
              <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:'rgba(240,235,225,.38)',marginBottom:14,letterSpacing:.5}}>{cat.desc}</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {['Koupit','Prodat','Flipnout'].map(a=>(
                  <span key={a} className="ptag" style={{fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',padding:'4px 10px',borderRadius:100,background:cat.color+'10',border:'1px solid '+cat.color+'28',color:cat.color}}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(255,255,255,.04)',borderRadius:14,overflow:'hidden',margin:'48px 0'}}>
          {[{n:'13 390+',l:'Aktivních inzerátů',c:'#F0B429'},{n:'2 341+',l:'Spokojených uživatelů',c:'#00E676'},{n:'79 Kč',l:'Nejlevnější boost',c:'#4D9FFF'}].map(s=>(
            <div key={s.l} style={{background:'rgba(6,6,14,.92)',padding:'24px',textAlign:'center'}}>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(28px,4vw,44px)',color:s.c,letterSpacing:2,lineHeight:1,marginBottom:6}}>{s.n}</div>
              <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'rgba(240,235,225,.38)'}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center'}}>
          <Link href="/marketplace" style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:'uppercase',background:'#F0B429',color:'#000',padding:'17px 40px',borderRadius:10,textDecoration:'none',boxShadow:'0 8px 32px rgba(240,180,41,.25)',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-4px)';(e.currentTarget as any).style.boxShadow='0 22px 56px rgba(240,180,41,.5)'}} onMouseLeave={e=>{(e.currentTarget as any).style.transform='';(e.currentTarget as any).style.boxShadow='0 8px 32px rgba(240,180,41,.25)'}}>
            Přejít do marketplace →
          </Link>
          <p style={{fontFamily:'Syne Mono,monospace',fontSize:9,color:'rgba(240,235,225,.38)',marginTop:14,letterSpacing:1}}>Přidání inzerátu zdarma · Bez registrace pro prohlížení</p>
        </div>
      </div>
    </section>
  )
}