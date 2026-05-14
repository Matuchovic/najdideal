'use client'
import { useState, useEffect, useRef } from 'react'

const MOODS = {
  idle:  { eye: '#F0B429', mouth: 'M 30 44 Q 40 48 50 44', texts: ['Čekám na tvůj pokyn... 💤', 'Skenuju dealy na pozadí 🔍', 'Status: STANDBY ✅'] },
  happy: { eye: '#FFD45E', mouth: 'M 28 42 Q 40 52 52 42', texts: ['Vítej zpátky! 😄', 'Dnes je skvělý den na flip! ☀️', 'Jsem ready! 💪'] },
  deal:  { eye: '#FFD700', mouth: 'M 26 40 Q 40 56 54 40', texts: ['💰 NOVÝ DEAL NALEZEN!', '🚨 Profit alert! Koukni na dealy!', '🤑 Tohle nechceš minout!'] },
  scan:  { eye: '#00E676', mouth: 'M 32 44 Q 40 48 48 44', texts: ['🤖 Skenuju databázi...', '⚡ AI analýza aktivní', '📊 Kalkuluji profit margin...'] },
  vip:   { eye: '#9B5DE5', mouth: 'M 29 42 Q 40 50 51 42', texts: ['👑 VIP mode aktivován!', '💎 Exkluzivní přístup odemčen', '✨ Vítej mezi elitou!'] },
}

const TIPS = [
  '💡 Tip: Marketplace flip elektroniky má nejvyšší ROI',
  '💡 Tip: RTX karty na Bazoši jsou podhodnocené o 15-30%',
  '💡 Tip: Pondělí ráno = nejlepší čas na nové dealy',
  '💡 Tip: VIP alerty přijdou 2h před ostatními',
  '💡 Tip: iPhone flip = průměrně +3 500 Kč profit',
  '💡 Tip: Sleduj trend produkty - jsou první na vzestupu',
  '💡 Tip: AI scanner generuje 8 dealů denně pro VIP',
]

interface NajdiBotProps {
  mood?: 'idle' | 'happy' | 'deal' | 'scan' | 'vip'
  autoTips?: boolean
}

export default function NajdiBot({ mood = 'happy', autoTips = true }: NajdiBotProps) {
  const [open, setOpen] = useState(false)
  const [currentMood, setCurrentMood] = useState(mood)
  const [message, setMessage] = useState('')
  const [blink, setBlink] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 })
  const [clicks, setClicks] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const msgRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const m = MOODS[currentMood]

  function typeMsg(text: string) {
    setMessage('')
    let i = 0
    const iv = setInterval(() => {
      setMessage(text.slice(0, i++))
      if (i > text.length) clearInterval(iv)
    }, 28)
  }

  useEffect(() => {
    typeMsg(m.texts[0])
    let ti = 1
    if (msgRef.current) clearInterval(msgRef.current)
    msgRef.current = setInterval(() => {
      if (autoTips && Math.random() > 0.5) {
        typeMsg(TIPS[tipIndex % TIPS.length])
        setTipIndex(i => i + 1)
      } else {
        typeMsg(m.texts[ti % m.texts.length])
        ti++
      }
    }, 4000)
    return () => { if (msgRef.current) clearInterval(msgRef.current) }
  }, [currentMood])

  useEffect(() => {
    const blinkIv = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkIv)
  }, [])

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  function handleBotClick() {
    const newClicks = clicks + 1
    setClicks(newClicks)
    setBounce(true)
    setTimeout(() => setBounce(false), 400)
    if (!open) { setOpen(true); return }
    const clickMsgs = ['Auu! 😄', 'Jsem robot, ne hračka! 🤖', `Klik #${newClicks}!`, 'Každý klik = 1 deal hledání 🔍', 'OK uznávám, je to zábava... 😄']
    typeMsg(clickMsgs[newClicks % clickMsgs.length])
    if (newClicks % 5 === 0) setCurrentMood('deal')
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    const mx = (e.clientX - r.left - 40) / 40
    const my = (e.clientY - r.top - 40) / 40
    setEyePos({ x: Math.max(-1, Math.min(1, mx)) * 3, y: Math.max(-1, Math.min(1, my)) * 2 })
  }

  const eyeColor = m.eye
  const mouthD = m.mouth

  return (
    <>
      <style>{`
        @keyframes ndBotIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes ndBotBounce{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-14px) scale(1.06)}60%{transform:translateY(-8px) scale(1.03)}}
        @keyframes ndBotPop{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes ndBotPulse{0%,100%{box-shadow:0 0 0 0 rgba(240,180,41,.4)}70%{box-shadow:0 0 0 10px rgba(240,180,41,0)}}
        @keyframes ndBotScan{0%{transform:translateY(-30px)}100%{transform:translateY(30px)}}
        @keyframes ndBotBlink{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.05)}}
        @keyframes ndBotType{0%,100%{opacity:1}50%{opacity:0}}
        .ndbot-bubble{animation:ndBotIdle 3s ease-in-out infinite}
        .ndbot-bubble.bounce{animation:ndBotBounce .4s ease!important}
        .ndbot-btn{animation:ndBotPulse 2s infinite}
        .ndbot-panel{animation:ndBotPop .3s cubic-bezier(.34,1.56,.64,1)}
      `}</style>

      {/* FLOATING BUTTON + PANEL */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

        {/* CHAT PANEL */}
        {open && (
          <div className="ndbot-panel" style={{ background: 'rgba(10,8,20,.97)', border: '1px solid rgba(240,180,41,.3)', borderRadius: 20, padding: '16px', width: 260, boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 40px rgba(240,180,41,.08)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676' }} />
              <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(240,235,225,.5)' }}>ND Bot · Online</span>
              <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(240,235,225,.3)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>

            {/* Message */}
            <div style={{ background: 'rgba(240,180,41,.05)', border: '1px solid rgba(240,180,41,.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, minHeight: 48, display: 'flex', alignItems: 'center' }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: '#F0EBE1', lineHeight: 1.6, margin: 0 }}>
                {message}<span style={{ animation: 'ndBotType 1s infinite', fontFamily: 'monospace', fontSize: 11 }}> █</span>
              </p>
            </div>

            {/* Mood buttons */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {(['happy', 'deal', 'scan', 'vip'] as const).map(md => (
                <button key={md} onClick={() => setCurrentMood(md)} style={{ padding: '5px 10px', borderRadius: 20, border: `1px solid ${currentMood === md ? 'rgba(240,180,41,.4)' : 'rgba(255,255,255,.08)'}`, background: currentMood === md ? 'rgba(240,180,41,.1)' : 'rgba(255,255,255,.03)', fontFamily: "'Syne Mono',monospace", fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: currentMood === md ? '#F0B429' : 'rgba(240,235,225,.4)', cursor: 'pointer', transition: 'all .2s' }}>
                  {{ happy: '😄', deal: '💰', scan: '🤖', vip: '👑' }[md]} {md}
                </button>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { href: '/deals', icon: '💰', label: 'Zobrazit dealy' },
                { href: '/vip', icon: '👑', label: 'VIP přístup' },
                { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
              ].map(l => (
                <a key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 9, textDecoration: 'none', transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,180,41,.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.05)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.02)' }}>
                  <span style={{ fontSize: 14 }}>{l.icon}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: 'rgba(240,235,225,.6)', fontWeight: 500 }}>{l.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(240,235,225,.2)', fontSize: 12 }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* BOT AVATAR BUTTON */}
        <div style={{ position: 'relative' }}>
          {/* Notification dot */}
          {!open && (
            <div style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#FF3B5C', border: '2px solid #020208', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 10, color: 'white', fontWeight: 700 }}>!</div>
          )}

          <div
            className={`ndbot-bubble${bounce ? ' bounce' : ''}`}
            onClick={handleBotClick}
            style={{ cursor: 'pointer', filter: 'drop-shadow(0 12px 32px rgba(240,180,41,.5))' }}
          >
            <svg ref={svgRef} width="96" height="116" viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" onMouseMove={handleMouseMove} onMouseLeave={() => setEyePos({ x: 0, y: 0 })}>
              <defs>
                <radialGradient id="nbHG" cx="40%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#2a1f4a"/>
                  <stop offset="100%" stopColor="#0f0a20"/>
                </radialGradient>
                <radialGradient id="nbBG" cx="40%" cy="25%" r="60%">
                  <stop offset="0%" stopColor="#1e1838"/>
                  <stop offset="100%" stopColor="#0a0818"/>
                </radialGradient>
                <radialGradient id="nbGG" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#FFE066"/>
                  <stop offset="50%" stopColor="#F0B429"/>
                  <stop offset="100%" stopColor="#A86800"/>
                </radialGradient>
                <linearGradient id="nbSG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity=".2"/>
                  <stop offset="100%" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <clipPath id="nbSC">
                  <rect x="18" y="18" width="44" height="30" rx="5"/>
                </clipPath>
              </defs>

              {/* Shadow */}
              <ellipse cx="40" cy="92" rx="24" ry="4" fill="rgba(0,0,0,.4)"/>

              {/* Legs */}
              <rect x="25" y="72" width="10" height="14" rx="4" fill="url(#nbBG)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="45" y="72" width="10" height="14" rx="4" fill="url(#nbBG)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <ellipse cx="30" cy="86" rx="7" ry="4" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <ellipse cx="50" cy="86" rx="7" ry="4" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>

              {/* Arms */}
              <rect x="8" y="50" width="9" height="20" rx="4" fill="url(#nbBG)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="63" y="50" width="9" height="20" rx="4" fill="url(#nbBG)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <circle cx="12" cy="72" r="5" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <circle cx="68" cy="72" r="5" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>

              {/* Body */}
              <rect x="18" y="46" width="44" height="34" rx="10" fill="url(#nbBG)" stroke="rgba(240,180,41,.25)" strokeWidth="1.5"/>
              <rect x="18" y="46" width="44" height="16" rx="10" fill="url(#nbSG)"/>
              {/* Chest screen */}
              <rect x="26" y="54" width="28" height="18" rx="5" fill="#040812" stroke={`${eyeColor}44`} strokeWidth="1"/>
              <text x="40" y="62" textAnchor="middle" fontFamily="Courier New,monospace" fontSize="5" fill="#00E676" opacity=".7">ND BOT</text>
              <text x="40" y="70" textAnchor="middle" fontFamily="Courier New,monospace" fontSize="6" fontWeight="bold" fill={eyeColor}>ACTIVE</text>
              {/* Chest scan */}
              {currentMood === 'scan' && (
                <g clipPath="url(#nbSC)">
                  <rect x="18" y="0" width="44" height="1.5" fill="rgba(0,230,118,.6)" style={{ animation: 'ndBotScan 1s linear infinite' }}/>
                </g>
              )}
              {/* Side LED */}
              <circle cx="21" cy="52" r="2.5" fill={eyeColor} style={{ animation: 'ndBotPulse 2s infinite' }}/>
              <circle cx="59" cy="52" r="2.5" fill="#4D9FFF" style={{ animation: 'ndBotPulse 2.5s infinite .5s' }}/>

              {/* Neck */}
              <rect x="33" y="40" width="14" height="8" rx="3" fill="url(#nbBG)" stroke="rgba(240,180,41,.15)" strokeWidth="1"/>

              {/* Head */}
              <rect x="12" y="8" width="56" height="36" rx="12" fill="url(#nbHG)" stroke="rgba(240,180,41,.3)" strokeWidth="1.5"/>
              <rect x="14" y="10" width="52" height="16" rx="10" fill="url(#nbSG)"/>

              {/* Face screen */}
              <rect x="18" y="14" width="44" height="26" rx="6" fill="#040812" stroke={`${eyeColor}55`} strokeWidth="1.5"/>

              {/* Eyes */}
              <g style={{ transformOrigin: '28px 27px', transform: blink ? 'scaleY(0.05)' : 'scaleY(1)', transition: 'transform 0.08s' }}>
                <ellipse cx={28 + eyePos.x} cy={27 + eyePos.y} rx="6" ry="5" fill={eyeColor} style={{ filter: `drop-shadow(0 0 3px ${eyeColor})` }}/>
                <ellipse cx={28 + eyePos.x} cy={27 + eyePos.y} rx="3" ry="3" fill="#1a0800"/>
                <circle cx={26.5 + eyePos.x} cy={25.5 + eyePos.y} r="1.5" fill="white" opacity=".9"/>
              </g>
              <g style={{ transformOrigin: '52px 27px', transform: blink ? 'scaleY(0.05)' : 'scaleY(1)', transition: 'transform 0.08s' }}>
                <ellipse cx={52 + eyePos.x} cy={27 + eyePos.y} rx="6" ry="5" fill={eyeColor} style={{ filter: `drop-shadow(0 0 3px ${eyeColor})` }}/>
                <ellipse cx={52 + eyePos.x} cy={27 + eyePos.y} rx="3" ry="3" fill="#1a0800"/>
                <circle cx={50.5 + eyePos.x} cy={25.5 + eyePos.y} r="1.5" fill="white" opacity=".9"/>
              </g>

              {/* Mouth */}
              <rect x="22" y="34" width="36" height="8" rx="4" fill="#060312" stroke={`${eyeColor}33`} strokeWidth="1"/>
              <path d={mouthD} fill="none" stroke={eyeColor} strokeWidth="1.8" strokeLinecap="round"/>

              {/* Ear bolts */}
              <circle cx="12" cy="24" r="4" fill="#0a0818" stroke={`${eyeColor}44`} strokeWidth="1"/>
              <circle cx="12" cy="24" r="2" fill={eyeColor} opacity=".6"/>
              <circle cx="68" cy="24" r="4" fill="#0a0818" stroke={`${eyeColor}44`} strokeWidth="1"/>
              <circle cx="68" cy="24" r="2" fill={eyeColor} opacity=".6"/>

              {/* Antenna */}
              <rect x="38" y="1" width="4" height="10" rx="2" fill={`${eyeColor}80`}/>
              <circle cx="40" cy="1" r="4" fill={eyeColor} style={{ filter: `drop-shadow(0 0 4px ${eyeColor})`, animation: 'ndBotPulse 1.5s infinite' }}/>

              {/* ND badge */}
              <rect x="28" y="10" width="24" height="8" rx="3" fill="url(#nbGG)"/>
              <text x="40" y="16.5" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="6" fill="#1a0800">ND</text>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
