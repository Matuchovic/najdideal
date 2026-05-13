'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const PLANS = [
  { id:'boost_7', label:'Boost 7 dní', days:7, price:79, color:G.mut, icon:'⚡', desc:'Zobraz se výše po dobu 7 dní.', best:false },
  { id:'boost_30', label:'Boost 30 dní', days:30, price:199, color:G.gold, icon:'🔥', desc:'Nejoblíbenější. Celý měsíc výše ve výsledcích.', best:true },
  { id:'featured_7', label:'Nahoře 1 týden', days:7, price:299, color:G.blu, icon:'👑', desc:'Úplně nahoře v kategorii po celý týden.', best:false },
]

export default function BoostPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('boost_30')
  const [step, setStep] = useState<'select'|'payment'|'success'|'error'>('select')
  const [processing, setProcessing] = useState(false)
  const [cardNum, setCardNum] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('listings').select('*').eq('id', params.id).eq('user_id', user.id).single()
      if (!data) { router.push('/marketplace/moje'); return }
      setListing(data)
      setLoading(false)
    })
  }, [params.id])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cardNum.replace(/s/g,'').length < 16) return
    if (cardExp.length < 5) return
    if (cardCvc.length < 3) return
    if (!cardName.trim()) return

    setProcessing(true)

    // Simulace platební brány - zde bude Stripe/GoPay
    await new Promise(r => setTimeout(r, 2000))

    // Simulace: 90% úspěch, 10% neúspěch
    const success = Math.random() > 0.1

    if (!success) {
      setProcessing(false)
      setStep('error')
      return
    }

    // Aktivovat boost v databázi
    const plan = PLANS.find(p => p.id === selected)!
    const boostUntil = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString()
    
    const supabase = createClient()
    const { error } = await supabase.from('listings').update({
      is_boosted: selected !== 'featured_7',
      is_featured: selected === 'featured_7',
      boost_until: boostUntil,
      boost_type: selected,
      updated_at: new Date().toISOString(),
    }).eq('id', params.id)

    setProcessing(false)
    
    if (error) {
      setStep('error')
    } else {
      setStep('success')
    }
  }

  const formatCard = (val: string) => {
    const v = val.replace(/D/g,'').slice(0,16)
    return v.replace(/(.{4})/g,'$1 ').trim()
  }

  const formatExp = (val: string) => {
    const v = val.replace(/D/g,'').slice(0,4)
    if (v.length >= 2) return v.slice(0,2) + '/' + v.slice(2)
    return v
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{width:36,height:36,border:'2px solid rgba(240,180,41,.2)',borderTop:'2px solid #F0B429',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const selectedPlan = PLANS.find(p => p.id === selected)!

  // SUCCESS
  if (step === 'success') return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 20px'}}>
      <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div>
        <div style={{fontSize:72,marginBottom:20,animation:'scaleIn .6s cubic-bezier(.34,1.56,.64,1) both'}}>⚡</div>
        <div style={{animation:'fadeUp .5s .3s ease both',opacity:0}}>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:42,letterSpacing:4,color:G.wht,marginBottom:10}}>BOOST AKTIVOVÁN</h2>
          <p style={{fontSize:13,color:G.mut,marginBottom:8,fontWeight:300}}>Platba proběhla úspěšně.</p>
          <p style={{fontSize:12,color:G.mut,marginBottom:28,fontWeight:300}}>
            Tvůj inzerát je zvýrazněný do <strong style={{color:G.gold}}>{new Date(Date.now() + selectedPlan.days * 24 * 60 * 60 * 1000).toLocaleDateString('cs-CZ', {day:'numeric',month:'long',year:'numeric'})}</strong>.
          </p>
          <Link href="/marketplace/moje" style={{background:G.gold,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'14px 28px',borderRadius:8,textDecoration:'none'}}>
            Zpět na moje inzeráty
          </Link>
        </div>
      </div>
    </div>
  )

  // ERROR
  if (step === 'error') return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 20px'}}>
      <div>
        <div style={{fontSize:72,marginBottom:20}}>❌</div>
        <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:42,letterSpacing:4,color:G.wht,marginBottom:10}}>PLATBA SELHALA</h2>
        <p style={{fontSize:13,color:G.mut,marginBottom:8,fontWeight:300}}>Platba nebyla zpracována.</p>
        <p style={{fontSize:12,color:G.mut,marginBottom:28,fontWeight:300}}>Zkontroluj údaje karty a zkus to znovu.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>setStep('payment')} style={{background:G.gold,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'14px 28px',borderRadius:8,border:'none',cursor:'pointer'}}>
            Zkusit znovu
          </button>
          <Link href="/marketplace/moje" style={{background:'rgba(255,255,255,.05)',color:G.mut,fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'14px 28px',borderRadius:8,textDecoration:'none',border:`1px solid ${G.br}`}}>
            Zpět
          </Link>
        </div>
      </div>
    </div>
  )

  const inputStyle = {
    width:'100%',
    padding:'13px 16px',
    background:'rgba(255,255,255,.05)',
    border:`1px solid ${G.br}`,
    borderRadius:9,
    color:G.wht,
    fontFamily:'Syne, sans-serif',
    fontSize:14,
    outline:'none',
  }

  return (
    <div style={{maxWidth:600,margin:'0 auto',paddingBottom:80}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <Link href="/marketplace/moje" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'Syne Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:G.mut,textDecoration:'none',marginBottom:24,padding:'7px 12px',border:`1px solid ${G.br}`,borderRadius:6,background:G.gl}}>
        <ArrowLeft size={12} /> Zpět
      </Link>

      {/* HEADER */}
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:'Syne Mono,monospace',fontSize:9,letterSpacing:3,textTransform:'uppercase',color:G.gold,marginBottom:8}}>⚡ Boost inzerátu</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(32px,6vw,52px)',letterSpacing:4,color:G.wht,lineHeight:1}}>
          ZOBRAZ SE <span style={{color:G.gold}}>NAHOŘE</span>
        </h1>
      </div>

      {/* INZERÁT PREVIEW */}
      {listing && (
        <div style={{background:G.gl,backdropFilter:'blur(24px)',border:`1px solid ${G.br}`,borderRadius:14,padding:'16px 20px',marginBottom:28,display:'flex',alignItems:'center',gap:14}}>
          {listing.images?.[0] && <img src={listing.images[0]} alt="" style={{width:52,height:52,borderRadius:10,objectFit:'cover',flexShrink:0}} />}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:700,color:G.wht,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{listing.title}</div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,color:G.gold,marginTop:2}}>{listing.price ? `${Number(listing.price).toLocaleString('cs-CZ')} Kč` : 'Cena dohodou'}</div>
          </div>
          {listing.is_boosted && listing.boost_until && (
            <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.grn,letterSpacing:1,textTransform:'uppercase',background:'rgba(0,230,118,.08)',border:'1px solid rgba(0,230,118,.2)',borderRadius:6,padding:'4px 8px',flexShrink:0}}>
              ⚡ Boosted do {new Date(listing.boost_until).toLocaleDateString('cs-CZ')}
            </div>
          )}
        </div>
      )}

      {step === 'select' && (
        <>
          {/* VÝBĚR PLÁNU */}
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
            {PLANS.map(p => (
              <div key={p.id} onClick={()=>setSelected(p.id)} style={{background:selected===p.id?`${p.color}08`:G.gl,backdropFilter:'blur(24px)',border:`2px solid ${selected===p.id?p.color+'44':G.br}`,borderRadius:14,padding:'18px 20px',cursor:'pointer',transition:'all .2s',position:'relative',overflow:'hidden'}}>
                {p.best && <div style={{position:'absolute',top:-1,right:16,background:G.gold,color:'#000',fontFamily:'Syne Mono,monospace',fontSize:7,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'3px 10px',borderRadius:'0 0 6px 6px'}}>Nejoblíbenější</div>}
                {selected===p.id && <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:p.color,borderRadius:'14px 0 0 14px'}} />}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${p.color}12`,border:`1px solid ${p.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{p.icon}</div>
                    <div>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:13,fontWeight:700,color:selected===p.id?G.wht:'rgba(240,235,225,.7)',marginBottom:2}}>{p.label}</div>
                      <div style={{fontSize:11,color:G.mut,fontWeight:300}}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,color:p.color,letterSpacing:1,lineHeight:1}}>{p.price} Kč</div>
                    <div style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,marginTop:2}}>jednorázově</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={()=>setStep('payment')} style={{width:'100%',padding:'16px',borderRadius:10,border:'none',cursor:'pointer',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',background:G.gold,color:'#000',boxShadow:'0 8px 28px rgba(240,180,41,.3)'}}>
            Pokračovat k platbě · {selectedPlan.price} Kč →
          </button>
        </>
      )}

      {step === 'payment' && (
        <div style={{background:G.gl,backdropFilter:'blur(32px)',border:`1px solid ${G.br}`,borderRadius:18,padding:32,position:'relative',overflow:'hidden',animation:'fadeUp .4s ease both'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#F0B429,transparent)'}} />
          
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:3,color:G.wht}}>PLATBA</h2>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:24,color:G.gold,letterSpacing:1}}>{selectedPlan.price} Kč</div>
          </div>

          <div style={{padding:'10px 14px',background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.15)',borderRadius:9,marginBottom:24,fontFamily:'Syne Mono,monospace',fontSize:9,color:G.grn,letterSpacing:1}}>
            🔒 Platba je zabezpečena šifrováním · Údaje karty nejsou ukládány
          </div>

          <form onSubmit={handlePayment} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Jméno na kartě</label>
              <input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="Jan Novák" required style={inputStyle} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor=G.br}} />
            </div>
            <div>
              <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Číslo karty</label>
              <input value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" required maxLength={19} style={{...inputStyle,letterSpacing:2,fontFamily:'Syne Mono,monospace'}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor=G.br}} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
              <div>
                <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>Platnost (MM/RR)</label>
                <input value={cardExp} onChange={e=>setCardExp(formatExp(e.target.value))} placeholder="12/27" required maxLength={5} style={{...inputStyle,fontFamily:'Syne Mono,monospace',letterSpacing:2}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor=G.br}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Syne Mono,monospace',fontSize:8,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:G.mut,marginBottom:6}}>CVC</label>
                <input value={cardCvc} onChange={e=>setCardCvc(e.target.value.replace(/D/g,'').slice(0,3))} placeholder="123" required maxLength={3} style={{...inputStyle,fontFamily:'Syne Mono,monospace',letterSpacing:4}} onFocus={e=>{e.currentTarget.style.borderColor='rgba(240,180,41,.4)'}} onBlur={e=>{e.currentTarget.style.borderColor=G.br}} />
              </div>
            </div>

            {/* APPLE PAY + GOOGLE PAY */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10,marginBottom:4}}>
              <button type="button" onClick={()=>alert('Apple Pay bude brzy dostupné. Připojujeme platební bránu.')} style={{padding:'13px',borderRadius:10,border:'1px solid rgba(255,255,255,.12)',background:'#000',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.3)'}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.12)'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <span style={{color:'#fff',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:1}}>Apple Pay</span>
              </button>
              <button type="button" onClick={()=>alert('Google Pay bude brzy dostupné. Připojujeme platební bránu.')} style={{padding:'13px',borderRadius:10,border:'1px solid rgba(255,255,255,.12)',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .2s'}} onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='rgba(240,180,41,.4)'}} onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='rgba(255,255,255,.12)'}}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/></svg>
                <span style={{color:'#000',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:1}}>Google Pay</span>
              </button>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0'}}>
              <div style={{flex:1,height:1,background:'rgba(255,255,255,.08)'}} />
              <span style={{fontFamily:'Syne Mono,monospace',fontSize:8,color:G.mut,letterSpacing:2,textTransform:'uppercase'}}>nebo kartou</span>
              <div style={{flex:1,height:1,background:'rgba(255,255,255,.08)'}} />
            </div>

          <div style={{height:1,background:'rgba(255,255,255,.06)',margin:'4px 0'}} />

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0'}}>
              <span style={{fontFamily:'Syne Mono,monospace',fontSize:10,color:G.mut}}>Celkem k zaplacení</span>
              <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,color:G.gold,letterSpacing:1}}>{selectedPlan.price} Kč</span>
            </div>

            <button type="submit" disabled={processing} style={{width:'100%',padding:'17px',borderRadius:10,border:'none',cursor:processing?'default':'pointer',fontFamily:'Syne Mono,monospace',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',background:processing?'rgba(240,180,41,.4)':G.gold,color:'#000',boxShadow:processing?'none':'0 8px 28px rgba(240,180,41,.3)',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'all .3s'}}>
              {processing
                ? <><div style={{width:16,height:16,border:'2px solid rgba(0,0,0,.3)',borderTop:'2px solid #000',borderRadius:'50%',animation:'spin 1s linear infinite'}} /> Zpracovávám platbu…</>
                : <>🔒 Zaplatit {selectedPlan.price} Kč</>
              }
            </button>

            <button type="button" onClick={()=>setStep('select')} disabled={processing} style={{background:'none',border:'none',cursor:'pointer',fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut,letterSpacing:1,textTransform:'uppercase',padding:'8px'}}>
              ← Zpět na výběr plánu
            </button>
          </form>
        </div>
      )}

      <div style={{display:'flex',justifyContent:'center',gap:24,marginTop:20,flexWrap:'wrap'}}>
        {[{icon:'🔒',t:'Bezpečná platba'},{icon:'⚡',t:'Okamžitá aktivace'},{icon:'✓',t:'Bez závazků'}].map(i=>(
          <div key={i.t} style={{display:'flex',alignItems:'center',gap:6,fontFamily:'Syne Mono,monospace',fontSize:9,color:G.mut}}><span>{i.icon}</span>{i.t}</div>
        ))}
      </div>
    </div>
  )
}