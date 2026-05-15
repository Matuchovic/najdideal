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
  const [speaking, setSpeaking] = useState(false)
  const [talking, setTalking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
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
      console.log('Speaking:', text)
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) { console.error('TTS error:', res.status, await res.text()); throw new Error('TTS failed') }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = (e) => { console.error('Audio error:', e); setSpeaking(false) }
      try {
        await audio.play()
        console.log('Audio playing OK')
      } catch(playErr) {
        console.error('Play failed:', playErr)
        setSpeaking(false)
      }
    } catch(err) {
      console.error('Speak error:', err)
      setSpeaking(false)
    }
  }, [])

  const typeMsg = useCallback((text: string) => {
    if (typeRef.current) clearInterval(typeRef.current)
    setMessage('')
    setTalking(true)
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

  // Lip sync interval
  useEffect(() => {
    if (!talking) { setMouthOpen(false); return }
    const id = setInterval(() => setMouthOpen(o => !o), 150)
    return () => clearInterval(id)
  }, [talking])

  const ec = m.eye

  return (
    <>
      <style>{`
        @keyframes ndBI{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes ndBB{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-14px) scale(1.06)}}
        @keyframes ndBP{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes ndTP{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ndWV{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.2);opacity:.2}}
        @keyframes ndMO{0%{d:path('M 30 44 Q 40 46 50 44')}100%{d:path('M 30 44 Q 40 52 50 44')}}
        @keyframes ndMO{0%{d:path('M 30 44 Q 40 46 50 44')}100%{d:path('M 30 44 Q 40 52 50 44')}}
        .ndb-i{animation:ndBI 3s ease-in-out infinite}
        .ndb-b{animation:ndBB .4s ease!important}
        .ndb-p{animation:ndBP .3s cubic-bezier(.34,1.56,.64,1)}
      `}</style>

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>

        {open && (
          <div className="ndb-p" style={{ background: 'rgba(6,4,16,.98)', border: '1px solid rgba(240,180,41,.2)', borderRadius: 24, width: 300, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.04)' }}>

            {/* Gold top line */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #F0B429 30%, #FFD97D 50%, #F0B429 70%, transparent)' }} />

            {/* Header */}
            <div style={{ padding: '14px 16px', background: 'linear-gradient(180deg, rgba(240,180,41,.06) 0%, transparent 100%)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#F0B429,#C8880A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: listening ? '#FF3B5C' : '#00E676', border: '2px solid #060410', boxShadow: `0 0 6px ${listening ? '#FF3B5C' : '#00E676'}` }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 11, fontWeight: 700, color: '#F0EBE1', letterSpacing: .5 }}>ND Asistent</div>
                <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, color: listening ? '#FF3B5C' : '#00E676', letterSpacing: 1, textTransform: 'uppercase' }}>{listening ? '🔴 Naslouchám...' : '● Online · AI powered'}</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.4)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent)' }} />

            {/* AI Message */}
            <div style={{ padding: '12px 16px', background: 'rgba(240,180,41,.03)', borderBottom: '1px solid rgba(240,180,41,.06)', minHeight: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0B429', flexShrink: 0, animation: 'ndTP 2s infinite' }} />
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: '#F0EBE1', lineHeight: 1.65, margin: 0 }}>
                {message}<span style={{ animation: 'ndTP 1s infinite', fontFamily: 'monospace', color: '#F0B429' }}>▋</span>
              </p>
            </div>

            {/* Voice */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <button onClick={toggleVoice} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 12, border: `1px solid ${listening ? 'rgba(255,59,92,.4)' : 'rgba(240,180,41,.25)'}`, background: listening ? 'rgba(255,59,92,.1)' : 'rgba(240,180,41,.06)', cursor: 'pointer', fontFamily: "'Syne Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: listening ? '#FF3B5C' : '#F0B429', transition: 'all .2s' }}>
                {listening ? (
                  <>
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
                      {[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, borderRadius: 2, background: '#FF3B5C', height: `${6 + i * 2}px`, animation: `ndWV ${.25 + i * .08}s ease-in-out infinite`, animationDelay: `${i * .06}s` }} />)}
                    </div>
                    Zastav nahrávání
                  </>
                ) : (
                  <><span style={{ fontSize: 16 }}>🎤</span> Mluv se mnou</>
                )}
              </button>
              {transcript && <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, color: 'rgba(240,235,225,.35)', padding: '6px 8px', marginTop: 6, background: 'rgba(255,255,255,.02)', borderRadius: 8, fontStyle: 'italic' }}>{transcript}</div>}
            </div>

            {/* Quick actions grid */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, color: 'rgba(240,235,225,.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Rychlé akce</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {[
                  { icon: '💰', label: 'Dnešní dealy', href: '/dashboard', color: '#F0B429' },
                  { icon: '👑', label: 'VIP členství', href: '/vip', color: '#9B5DE5' },
                  { icon: '📊', label: 'Moje profity', href: '/dashboard', color: '#00E676' },
                  { icon: '🔔', label: 'Nastavit alert', href: '/dashboard', color: '#4D9FFF' },
                  { icon: '🏠', label: 'Dashboard', href: '/dashboard', color: '#F0B429' },
                  { icon: '💬', label: 'Live podpora', action: 'chat', color: '#00E676' },
                ].map((item, i) => (
                  item.href ? (
                    <a key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, textDecoration: 'none', transition: 'all .15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `rgba(${item.color === '#F0B429' ? '240,180,41' : item.color === '#00E676' ? '0,230,118' : item.color === '#4D9FFF' ? '77,159,255' : '155,93,229'},.07)`; (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.06)' }}>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, color: 'rgba(240,235,225,.6)', letterSpacing: .5 }}>{item.label}</span>
                      <span style={{ marginLeft: 'auto', color: item.color, fontSize: 10 }}>→</span>
                    </a>
                  ) : (
                    <button key={i} onClick={() => window.dispatchEvent(new Event('openChat'))} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.15)', borderRadius: 10, cursor: 'pointer', transition: 'all .15s' }}>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, color: '#00E676', letterSpacing: .5 }}>{item.label}</span>
                      <span style={{ marginLeft: 'auto', color: '#00E676', fontSize: 10 }}>→</span>
                    </button>
                  )
                ))}
              </div>
            </div>

            {/* AI Tips */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, color: 'rgba(240,235,225,.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>🤖 AI Tipy dne</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { tip: 'iPhone 15 Pro na Bazosi pod cenou — AI skóre 97%', tag: '🔥 HOT', color: '#F0B429' },
                  { tip: 'Nejlepší čas prodávat elektroniku: pondělí ráno', tag: '💡 TIP', color: '#4D9FFF' },
                  { tip: 'VIP členové vydělali průměrně 4 235 Kč tento měsíc', tag: '👑 VIP', color: '#9B5DE5' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,.04)' }}>
                    <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 7, color: t.color, fontWeight: 700, whiteSpace: 'nowrap', marginTop: 1 }}>{t.tag}</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: 'rgba(240,235,225,.55)', lineHeight: 1.5 }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice test + stats */}
            <div style={{ padding: '10px 16px 14px', display: 'flex', gap: 8 }}>
              <button onClick={() => speak('Zdravím! Jsem ND Asistent. Jsem zde aby jsem ti pomohl najít nejlepší dealy v České republice a Slovensku.')} style={{ flex: 1, padding: '8px', background: 'rgba(0,230,118,.07)', border: '1px solid rgba(0,230,118,.2)', borderRadius: 10, color: '#00E676', cursor: 'pointer', fontFamily: "'Syne Mono',monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                {speaking ? '🔊 Mluvím...' : '🔊 Test hlasu'}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,.05)' }}>
                <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 13, fontWeight: 700, color: '#F0B429' }}>2341</span>
                <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 7, color: 'rgba(240,235,225,.3)', letterSpacing: .5 }}>ČLENŮ</span>
              </div>
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
              <path d={talking && mouthOpen ? 'M 28 42 Q 40 54 52 42' : m.mouth} fill={talking && mouthOpen ? `${ec}11` : "none"} stroke={ec} strokeWidth="1.8" strokeLinecap="round" style={{ transition: 'd 0.1s ease', filter: talking ? `drop-shadow(0 0 3px ${ec})` : "none" }}/>
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
