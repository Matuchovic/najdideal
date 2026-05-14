'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const MOODS = {
  idle:    { eye: '#F0B429', mouth: 'M 30 44 Q 40 48 50 44', chest: 'READY' },
  happy:   { eye: '#FFD45E', mouth: 'M 28 42 Q 40 52 52 42', chest: 'HAPPY' },
  listen:  { eye: '#FF3B5C', mouth: 'M 32 44 Q 40 47 48 44', chest: 'SLYŠIM' },
  think:   { eye: '#4D9FFF', mouth: 'M 30 45 Q 40 43 50 45', chest: 'MYSLIM' },
  deal:    { eye: '#00E676', mouth: 'M 26 41 Q 40 56 54 41', chest: 'DEAL!' },
  vip:     { eye: '#9B5DE5', mouth: 'M 28 42 Q 40 51 52 42', chest: 'VIP' },
}

const PAGE_MSGS: Record<string, string[]> = {
  '/dashboard': ['Vítej v Deal Room! 💰', 'Koukni na nové dealy dole 👇', 'Řekni mi co hledáš 🎤'],
  '/deals':     ['Tady jsou všechny dealy! 🔥', 'Použij filtry nahoře 👆', 'Řekni "nejlepší flip" 🎤'],
  '/vip':       ['VIP přístup = víc dealů! 👑', 'STANDARD jen 299 Kč/měsíc', 'PREMIUM má AI příležitosti 🤖'],
  '/':          ['Najdi deal dřív než ostatní! 💰', 'Zaregistruj se zdarma 👇', 'Řekni mi co hledáš 🎤'],
}

const TIPS = [
  '💡 Marketplace flip = průměrně +3 500 Kč profit',
  '💡 Pondělí ráno = nejlepší čas na nové dealy',
  '💡 VIP alerty přijdou 2h před ostatními',
  '💡 iPhone flip = nejrychlejší obrat, 24-48h',
  '💡 RTX karty na Bazoši jsou podhodnocené o 20%',
]

interface NajdiBotProps {
  mood?: keyof typeof MOODS
  autoTips?: boolean
}

export default function NajdiBot({ mood = 'happy', autoTips = true }: NajdiBotProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [currentMood, setCurrentMood] = useState<keyof typeof MOODS>(mood)
  const [message, setMessage] = useState('')
  const [blink, setBlink] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 })
  const [clicks, setClicks] = useState(0)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const msgRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<any>(null)

  const m = MOODS[currentMood]

  useEffect(() => {
    setVoiceSupported(!!(( window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
  }, [])


  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string) => {
    try {
      setSpeaking(true)
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => setSpeaking(false)
      await audio.play()
    } catch {
      setSpeaking(false)
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(text)
        utt.lang = 'cs-CZ'; utt.rate = 1.0; utt.pitch = 0.85
        utt.onend = () => setSpeaking(false)
        window.speechSynthesis.speak(utt)
      }
    }
  }, [])

  const typeMsg = useCallback((text: string) => {
    if (typeRef.current) clearInterval(typeRef.current)
    setMessage('')
    let i = 0
    typeRef.current = setInterval(() => {
      setMessage(text.slice(0, i++))
      if (i > text.length && typeRef.current) clearInterval(typeRef.current)
    }, 28)
  }, [])

  useEffect(() => {
    if (msgRef.current) clearInterval(msgRef.current)
    const pageMsgs = PAGE_MSGS[pathname] || PAGE_MSGS['/']
    typeMsg(pageMsgs[0])
    speak(pageMsgs[0])
    let ti = 1
    msgRef.current = setInterval(() => {
      if (autoTips && Math.random() > 0.6) {
        typeMsg(TIPS[tipIndex % TIPS.length])
        setTipIndex(i => i + 1)
      } else {
        typeMsg(pageMsgs[ti % pageMsgs.length])
        ti++
      }
    }, 4000)
    return () => { if (msgRef.current) clearInterval(msgRef.current) }
  }, [pathname, currentMood])

  useEffect(() => {
    const iv = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 3500)
    return () => clearInterval(iv)
  }, [])

  function processVoice(text: string) {
    const t = text.toLowerCase().trim()
    setTranscript('"' + text + '"')
    setCurrentMood('think')
    if (msgRef.current) clearInterval(msgRef.current)
    typeMsg('🤔 Přemýšlím...')

    setTimeout(() => {
      let response = ''
      let newMood: keyof typeof MOODS = 'deal'

      if (t.match(/elektronik|telefon|laptop|macbook|iphone|rtx|gpu|počítač/)) {
        response = '💻 Našel jsem dealy na elektroniku! MacBook Air +8 990 Kč, RTX 3060 +3 300 Kč. Přesměrovávám...'
        setTimeout(() => router.push('/deals?cat=marketplace_flip'), 2000)
      } else if (t.match(/vip|premium|členství|koupit|upgrade|standard/)) {
        response = '👑 VIP = STANDARD 299 Kč nebo PREMIUM 699 Kč. Jdu na VIP stránku...'
        setTimeout(() => router.push('/vip'), 2000)
        newMood = 'vip'
      } else if (t.match(/flip|marketplace|co je flip/)) {
        response = '🔄 Marketplace flip = koupíš levně na Bazoši, prodáš draze jinde. Průměr +3 500 Kč!'
        newMood = 'happy'
      } else if (t.match(/deal|dealy|zobraz|ukaz|nabídky|najdi/)) {
        response = '💰 Máme 16 aktivních dealů! Přesměrovávám...'
        setTimeout(() => router.push('/deals'), 1800)
      } else if (t.match(/dashboard|domů/)) {
        response = '🏠 Jdeme na dashboard!'
        setTimeout(() => router.push('/dashboard'), 1500)
        newMood = 'happy'
      } else if (t.match(/ahoj|hello|čau|nazdar/)) {
        response = '👋 Ahoj! Jsem NajdiDeal Bot. Řekni co hledáš!'
        newMood = 'happy'
      } else if (t.match(/profit|vydělat|peníze/)) {
        response = '💰 Průměrný VIP člen vydělá +7 200 Kč/měsíc na flipování!'
      } else if (t.match(/pomoc|help|co umíš/)) {
        response = '🤖 Umím: najít dealy, vysvětlit flip, ukázat VIP. Zkus "najdi deal na iPhone"!'
        newMood = 'happy'
      } else {
        response = `🤔 Nerozuměl jsem "${text}". Zkus "najdi deal" nebo "co je flip"!`
        newMood = 'idle'
      }

      setCurrentMood(newMood)
      typeMsg(response)
      speak(response)
    }, 700)
  }

  function toggleVoice() {
    if (!voiceSupported) {
      typeMsg('❌ Hlasový vstup: použij Chrome nebo Safari!')
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'cs-CZ'
    rec.continuous = false
    rec.interimResults = true
    recognitionRef.current = rec

    rec.onstart = () => {
      setListening(true)
      setCurrentMood('listen')
      if (msgRef.current) clearInterval(msgRef.current)
      typeMsg('Poslouchám... mluv! 🎤')
      setTranscript('...')
    }
    rec.onresult = (e: any) => {
      const interim = Array.from(e.results).map((r: any) => r[0].transcript).join('')
      setTranscript('"' + interim + '"')
      if (e.results[e.results.length - 1].isFinal) processVoice(interim)
    }
    rec.onend = () => { setListening(false); setCurrentMood('idle') }
    rec.onerror = (e: any) => {
      setListening(false); setCurrentMood('idle')
      if (e.error === 'not-allowed') typeMsg('❌ Povol mikrofon v nastavení prohlížeče!')
      else if (e.error === 'no-speech') typeMsg('🤔 Nic jsem neslyšel. Zkus znovu!')
    }
    rec.start()
  }

  function handleBotClick() {
    const nc = clicks + 1
    setClicks(nc)
    setBounce(true)
    setTimeout(() => setBounce(false), 400)
    if (!open) { setOpen(true); return }
    if (msgRef.current) clearInterval(msgRef.current)
    const msgs = ['Auu! 😄', 'Jsem robot, ne hračka! 🤖', `Klik #${nc}!`, 'Zkus hlasový vstup! 🎤']
    typeMsg(msgs[nc % msgs.length])
    if (nc % 7 === 0) setCurrentMood('deal')
  }

  const ec = m.eye

  return (
    <>
      <style>{`
        @keyframes ndBI{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes ndBB{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-14px) scale(1.06)}}
        @keyframes ndBP{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes ndTP{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ndWV{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.2);opacity:.2}}
        .ndb-i{animation:ndBI 3s ease-in-out infinite}
        .ndb-b{animation:ndBB .4s ease!important}
        .ndb-p{animation:ndBP .3s cubic-bezier(.34,1.56,.64,1)}
      `}</style>

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>

        {open && (
          <div className="ndb-p" style={{ background: 'rgba(10,8,20,.97)', border: '1px solid rgba(240,180,41,.3)', borderRadius: 20, padding: 16, width: 280, boxShadow: '0 20px 60px rgba(0,0,0,.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: listening ? '#FF3B5C' : '#00E676', boxShadow: `0 0 8px ${listening ? '#FF3B5C' : '#00E676'}` }} />
              <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(240,235,225,.5)' }}>
                {listening ? 'Naslouchám...' : 'ND Bot · Online'}
              </span>
              <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(240,235,225,.3)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ background: 'rgba(240,180,41,.05)', border: '1px solid rgba(240,180,41,.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 10, minHeight: 52, display: 'flex', alignItems: 'center' }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: '#F0EBE1', lineHeight: 1.6, margin: 0 }}>
                {message}<span style={{ animation: 'ndTP 1s infinite', fontFamily: 'monospace' }}> █</span>
              </p>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <button onClick={toggleVoice} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, border: `1px solid ${listening ? 'rgba(255,59,92,.5)' : 'rgba(240,180,41,.3)'}`, background: listening ? 'rgba(255,59,92,.15)' : 'rgba(240,180,41,.08)', cursor: 'pointer', fontFamily: "'Syne Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: listening ? '#FF3B5C' : '#F0B429', transition: 'all .2s' }}>
                  <span style={{ fontSize: 14 }}>{listening ? '⏹' : '🎤'}</span>
                  {listening ? 'Zastav' : 'Mluv se mnou'}
                </button>
                {listening && (
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 20 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ width: 3, borderRadius: 2, background: '#FF3B5C', height: `${8 + i * 3}px`, animation: `ndWV ${.3 + i * .1}s ease-in-out infinite`, animationDelay: `${i * .08}s` }} />
                    ))}
                  </div>
                )}
              </div>
              {transcript && (
                <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, color: 'rgba(240,235,225,.4)', padding: '4px 8px', background: 'rgba(255,255,255,.02)', borderRadius: 6 }}>
                  {transcript}
                </div>
              )}
              {!voiceSupported && (
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: 'rgba(255,107,53,.7)', marginTop: 4 }}>
                  🎤 Hlasový vstup vyžaduje Chrome nebo Safari
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[{ href: '/deals', icon: '💰', label: 'Zobrazit dealy' }, { href: '/vip', icon: '👑', label: 'VIP přístup' }, { href: '/dashboard', icon: '🏠', label: 'Dashboard' }].map(l => (
                <a key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 9, textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,180,41,.2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.05)' }}>
                  <span style={{ fontSize: 14 }}>{l.icon}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: 'rgba(240,235,225,.6)' }}>{l.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(240,235,225,.2)' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {!open && <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#FF3B5C', border: '2px solid #020208', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>!</div>}
          {listening && <>
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(255,59,92,.4)', animation: 'ndWV 1s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1px solid rgba(255,59,92,.2)', animation: 'ndWV 1s ease-in-out infinite .2s', pointerEvents: 'none' }} />
          </>}
          <div className={bounce ? 'ndb-b' : 'ndb-i'} onClick={handleBotClick} style={{ cursor: 'pointer', filter: `drop-shadow(0 8px 24px ${listening ? 'rgba(255,59,92,.4)' : 'rgba(240,180,41,.3)'})` }}>
            <svg ref={svgRef} width="96" height="116" viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg"
              onMouseMove={e => {
                if (!svgRef.current) return
                const r = svgRef.current.getBoundingClientRect()
                setEyePos({ x: Math.max(-1, Math.min(1, (e.clientX-r.left-40)/40))*3, y: Math.max(-1, Math.min(1, (e.clientY-r.top-40)/40))*2 })
              }}
              onMouseLeave={() => setEyePos({ x:0, y:0 })}>
              <defs>
                <radialGradient id="h2" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#2a1f4a"/><stop offset="100%" stopColor="#0f0a20"/></radialGradient>
                <radialGradient id="b2" cx="40%" cy="25%" r="60%"><stop offset="0%" stopColor="#1e1838"/><stop offset="100%" stopColor="#0a0818"/></radialGradient>
                <radialGradient id="g2" cx="35%" cy="30%" r="65%"><stop offset="0%" stopColor="#FFE066"/><stop offset="50%" stopColor="#F0B429"/><stop offset="100%" stopColor="#A86800"/></radialGradient>
                <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="white" stopOpacity=".2"/><stop offset="100%" stopColor="white" stopOpacity="0"/></linearGradient>
              </defs>
              <ellipse cx="40" cy="92" rx="24" ry="4" fill="rgba(0,0,0,.4)"/>
              <rect x="25" y="72" width="10" height="14" rx="4" fill="url(#b2)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="45" y="72" width="10" height="14" rx="4" fill="url(#b2)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <ellipse cx="30" cy="86" rx="7" ry="4" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <ellipse cx="50" cy="86" rx="7" ry="4" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="8" y="50" width="9" height="20" rx="4" fill="url(#b2)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="63" y="50" width="9" height="20" rx="4" fill="url(#b2)" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <circle cx="12" cy="72" r="5" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <circle cx="68" cy="72" r="5" fill="#0a0818" stroke="rgba(240,180,41,.2)" strokeWidth="1"/>
              <rect x="18" y="46" width="44" height="34" rx="10" fill="url(#b2)" stroke="rgba(240,180,41,.25)" strokeWidth="1.5"/>
              <rect x="18" y="46" width="44" height="16" rx="10" fill="url(#s2)"/>
              <rect x="26" y="54" width="28" height="18" rx="5" fill="#040812" stroke={`${ec}44`} strokeWidth="1"/>
              <text x="40" y="62" textAnchor="middle" fontFamily="Courier New,monospace" fontSize="5" fill="#00E676" opacity=".7">ND BOT</text>
              <text x="40" y="70" textAnchor="middle" fontFamily="Courier New,monospace" fontSize="6" fontWeight="bold" fill={ec}>{m.chest}</text>
              <circle cx="21" cy="52" r="2.5" fill={ec} opacity=".8"/>
              <circle cx="59" cy="52" r="2.5" fill={listening ? '#FF3B5C' : '#4D9FFF'} opacity=".8"/>
              <rect x="33" y="40" width="14" height="8" rx="3" fill="url(#b2)" stroke="rgba(240,180,41,.15)" strokeWidth="1"/>
              <rect x="12" y="8" width="56" height="36" rx="12" fill="url(#h2)" stroke={listening ? 'rgba(255,59,92,.5)' : 'rgba(240,180,41,.3)'} strokeWidth="1.5"/>
              <rect x="14" y="10" width="52" height="16" rx="10" fill="url(#s2)"/>
              <rect x="18" y="14" width="44" height="26" rx="6" fill="#040812" stroke={`${ec}55`} strokeWidth="1.5"/>
              <g style={{ transformOrigin:'28px 27px', transform: blink?'scaleY(0.05)':'scaleY(1)', transition:'transform .08s' }}>
                <ellipse cx={28+eyePos.x} cy={27+eyePos.y} rx="6" ry="5" fill={ec} style={{ filter:`drop-shadow(0 0 3px ${ec})` }}/>
                <ellipse cx={28+eyePos.x} cy={27+eyePos.y} rx="3" ry="3" fill="#1a0800"/>
                <circle cx={26.5+eyePos.x} cy={25.5+eyePos.y} r="1.5" fill="white" opacity=".9"/>
              </g>
              <g style={{ transformOrigin:'52px 27px', transform: blink?'scaleY(0.05)':'scaleY(1)', transition:'transform .08s' }}>
                <ellipse cx={52+eyePos.x} cy={27+eyePos.y} rx="6" ry="5" fill={ec} style={{ filter:`drop-shadow(0 0 3px ${ec})` }}/>
                <ellipse cx={52+eyePos.x} cy={27+eyePos.y} rx="3" ry="3" fill="#1a0800"/>
                <circle cx={50.5+eyePos.x} cy={25.5+eyePos.y} r="1.5" fill="white" opacity=".9"/>
              </g>
              <rect x="22" y="34" width="36" height="8" rx="4" fill="#060312" stroke={`${ec}33`} strokeWidth="1"/>
              <path d={m.mouth} fill="none" stroke={ec} strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="24" r="4" fill="#0a0818" stroke={`${ec}44`} strokeWidth="1"/>
              <circle cx="12" cy="24" r="2" fill={ec} opacity=".6"/>
              <circle cx="68" cy="24" r="4" fill="#0a0818" stroke={`${ec}44`} strokeWidth="1"/>
              <circle cx="68" cy="24" r="2" fill={ec} opacity=".6"/>
              <rect x="38" y="1" width="4" height="10" rx="2" fill={`${ec}80`}/>
              <circle cx="40" cy="1" r="4" fill={ec} style={{ filter:`drop-shadow(0 0 4px ${ec})` }}/>
              <rect x="28" y="10" width="24" height="8" rx="3" fill="url(#g2)"/>
              <text x="40" y="16.5" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="6" fill="#1a0800">ND</text>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
