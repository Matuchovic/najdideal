'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Crown, Bell, Shield, LogOut, Copy, Check, ChevronRight, Clock, Star, Zap, Mail, Edit2 } from 'lucide-react'
import Link from 'next/link'


const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.08)', gold3:'rgba(240,180,41,.06)', gold4:'rgba(240,180,41,.18)',
  grn:'#00E676', grn2:'rgba(0,230,118,.08)',
  blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35', red:'#FF3B5C',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)', mut2:'rgba(240,235,225,.2)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const TIER_CONFIG: Record<string, { label: string; color: string; emoji: string; level: number; nextPlan?: string; nextPrice?: string }> = {
  free:      { level:1, label:'FREE',      color:G.mut,  emoji:'🔓', nextPlan:'VIP',       nextPrice:'499 Kč/měsíc' },
  vip:       { level:2, label:'VIP',       color:G.gold, emoji:'👑', nextPlan:'VIP PRO',   nextPrice:'999 Kč/měsíc' },
  vip_pro:   { level:3, label:'VIP PRO',   color:G.blu,  emoji:'🚀', nextPlan:'VIP ULTRA', nextPrice:'1 999 Kč/měsíc' },
  vip_ultra: { level:4, label:'VIP ULTRA', color:G.pur,  emoji:'⚡', nextPlan:'VIP MAX',   nextPrice:'2 799 Kč/měsíc' },
  vip_max:   { level:5, label:'VIP MAX',   color:G.org,  emoji:'💎' },
  admin:     { level:99, label:'ADMIN',    color:G.gold, emoji:'🔧' },
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: any }) {
  return (
    <div style={{ background: G.gl, backdropFilter: 'blur(28px) saturate(160%)', border: `1px solid ${G.br}`, borderRadius: 16, overflow: 'hidden', position: 'relative', ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)' }} />
      {children}
    </div>
  )
}

function SectionTitle({ icon: Icon, title, color = G.gold }: { icon: any; title: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 22px', borderBottom: `1px solid ${G.br}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}10`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color={color} />
      </div>
      <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color }}>{title}</span>
    </div>
  )
}

function Row({ label, value, action, danger = false }: { label: string; value?: string; action?: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: `1px solid rgba(255,255,255,.04)`, gap: 12 }}>
      <div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: danger ? G.red : G.mut, marginBottom: value ? 3 : 0 }}>{label}</div>
        {value && <div style={{ fontSize: 13, color: G.wht, fontWeight: 400 }}>{value}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

function Toggle({ value, onChange, color = G.grn }: { value: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? color : 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .3s', boxShadow: '0 2px 6px rgba(0,0,0,.3)', display: 'block' }} />
    </button>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [notifEmailDigest, setNotifEmailDigest] = useState(false)
  const [notifNewDeals, setNotifNewDeals] = useState(false)
  const [notifLive, setNotifLive] = useState(false)
  const [notifNewsletter, setNotifNewsletter] = useState(false)
  const [notifLoaded, setNotifLoaded] = useState(false)
  const [telegramId, setTelegramId] = useState('')
  const [savingNotif, setSavingNotif] = useState(false)
  const [notifMsg, setNotifMsg] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [notifications, setNotifications] = useState({ email: true, deals: true, alerts: true, newsletter: false })
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile({ ...data, email: user.email })
      setNotifEmailDigest(data?.notify_email_digest === true)
      setNotifNewDeals(data?.notify_new_deals === true)
      setNotifLive(data?.notify_live === true)
      setNotifNewsletter(data?.notify_newsletter === true)
      setTelegramId(data?.telegram_chat_id ?? '')
      setNotifLoaded(true)
      setNewName(data?.full_name || '')
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const handleFocus = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data } = await supabase
        .from('profiles')
        .select('notify_email_digest,notify_new_deals,notify_live,notify_newsletter,telegram_chat_id')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setNotifEmailDigest(data.notify_email_digest === true)
        setNotifNewDeals(data.notify_new_deals === true)
        setNotifLive(data.notify_live === true)
        setNotifNewsletter(data.notify_newsletter === true)
        setTelegramId(data.telegram_chat_id ?? '')
        setNotifLoaded(true)
      }
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleFocus()
    })
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('pageshow', handleFocus)
    }
  }, [])

  const tier = TIER_CONFIG[profile?.role ?? 'free'] ?? TIER_CONFIG.free
  const isVip = tier.level >= 2

  // Simulace dat členství
  const memberSince = profile?.created_at ? new Date(profile.created_at) : new Date()
  const vipExpiry = isVip ? new Date(memberSince.getTime() + 30 * 24 * 60 * 60 * 1000) : null
  const daysLeft = vipExpiry ? Math.max(0, Math.ceil((vipExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0

  const copyId = () => {
    navigator.clipboard.writeText(profile?.id || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveNotifications = async () => {
    setSavingNotif(true)
    setNotifMsg('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('profiles').update({
        notify_email_digest: notifEmailDigest,
        notify_new_deals: notifNewDeals,
        notify_live: notifLive,
        notify_newsletter: notifNewsletter,
        telegram_chat_id: telegramId || null,
      }).eq('id', user.id)
      if (error) {
        setSavingNotif(false)
        setNotifMsg('Chyba: ' + error.message)
        return
      }
    } else {
      setSavingNotif(false)
      setNotifMsg('Chyba: Nejsi přihlášen.')
      return
    }
    setSavingNotif(false)
    setNotifMsg('Nastavení uloženo.')
    setTimeout(() => setNotifMsg(''), 3000)
  }

  const savePassword = async () => {
    setPasswordMsg('')
    setPasswordError('')
    if (newPassword.length < 6) { setPasswordError('Heslo musí mít alespoň 6 znaků.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Hesla se neshodují.'); return }
    setSavingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) { setPasswordError(error.message); return }
    setPasswordMsg('Heslo bylo úspěšně změněno.')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const saveName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ full_name: newName }).eq('id', user.id)
    setProfile((p: any) => ({ ...p, full_name: newName }))
    setEditName(false)
    setSavingName(false)
  }

  const logout = async () => {
    setLogoutLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .settings-wrap{padding:16px !important}
          .vb-grid{grid-template-columns:1fr !important}
          .features-wrap{flex-wrap:wrap !important}
        }`}</style>

      {/* HEADER */}
      <div style={{ animation: 'fadeUp .6s ease both', marginBottom: 8 }}>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>⚙️ Nastavení účtu</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px,6vw,56px)', letterSpacing: 4, lineHeight: 1, color: G.wht }}>
          SPRÁVA <span style={{ color: G.gold }}>ÚČTU</span>
        </h1>
      </div>

      {/* VIP STATUS CARD */}
      <Card style={{ border: `1px solid ${tier.color}28`, background: `${tier.color}04`, animation: 'fadeUp .6s .05s ease both' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${tier.color},transparent)` }} />
        <div style={{ padding: '24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${tier.color}15`, border: `1px solid ${tier.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{tier.emoji}</div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 3, color: tier.color, lineHeight: 1 }}>{tier.label} přístup</div>
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: 1, marginTop: 2 }}>
                    Člen od {memberSince.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* VIP COUNTDOWN */}
              {isVip && vipExpiry && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: `${tier.color}08`, border: `1px solid ${tier.color}20`, borderRadius: 10, marginBottom: 12 }}>
                  <Clock size={13} color={tier.color} />
                  <div>
                    <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: tier.color, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
                      {daysLeft > 5 ? `Platné ještě ${daysLeft} dní` : `⚠️ Vyprší za ${daysLeft} dní!`}
                    </div>
                    <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>
                      Obnoví se {vipExpiry.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURES */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  tier.level >= 1 && '✓ Základní dealy',
                  tier.level >= 2 && '✓ VIP dealy',
                  tier.level >= 2 && '✓ Rychlé alerty',
                  tier.level >= 2 && '✓ Komunita',
                  tier.level >= 3 && '✓ AI deep scan',
                  tier.level >= 3 && '✓ Trend predictions',
                  tier.level >= 4 && '✓ Ultra alerty 24/7',
                  tier.level >= 5 && '✓ Osobní konzultace',
                  tier.level >= 5 && '✓ Mastermind',
                ].filter(Boolean).map(f => (
                  <span key={f as string} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, background: `${tier.color}08`, border: `1px solid ${tier.color}18`, color: tier.color }}>{f}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              {tier.nextPlan && (
                <Link href="/vip" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: tier.color, color: '#000', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', textAlign: 'center', boxShadow: `0 6px 20px ${tier.color}33` }}>
                  ↑ {tier.nextPlan}
                </Link>
              )}
              {isVip && (
                <button onClick={() => setShowCancel(!showCancel)} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: 'transparent', color: G.mut, border: `1px solid rgba(255,255,255,.08)`, padding: '8px 14px', borderRadius: 7, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Zrušit předplatné
                </button>
              )}
            </div>
          </div>

          {/* CANCEL CONFIRM */}
          {showCancel && (
            <div style={{ marginTop: 16, padding: '16px 18px', background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.18)', borderRadius: 10 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: G.wht, marginBottom: 6 }}>Opravdu chceš zrušit předplatné?</div>
              <div style={{ fontSize: 11, color: G.mut, marginBottom: 14, fontWeight: 300 }}>Přístup budeš mít až do konce aktuálního období. Zrušení není možné vrátit zpět.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={async () => {
                setCancelLoading(true)
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  await supabase.from('profiles').update({ 
                    role: 'free',
                    subscription_cancelled_at: new Date().toISOString()
                  }).eq('id', user.id)
                  setProfile((p: any) => ({ ...p, role: 'free' }))
                }
                setCancelLoading(false)
                setShowCancel(false)
                // Hard reload - vynutí nové načtení z databáze
                setTimeout(() => { window.location.href = '/dashboard' }, 1500)
              }} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: G.red, color: '#fff', padding: '9px 16px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>
                  {cancelLoading ? 'Rušení…' : 'Ano, zrušit'}
                </button>
                <button onClick={() => setShowCancel(false)} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: 'rgba(255,255,255,.05)', color: G.mut, padding: '9px 16px', borderRadius: 7, border: `1px solid ${G.br}`, cursor: 'pointer' }}>
                  Ponechat
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* PROFILE */}
      <Card style={{ animation: 'fadeUp .6s .1s ease both' }}>
        <SectionTitle icon={User} title="Profil" />
        <Row label="Jméno" value={profile?.full_name || '–'} action={
          editName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveName()} style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${G.br}`, borderRadius: 7, padding: '7px 12px', color: G.wht, fontFamily: "'Syne', sans-serif", fontSize: 12, outline: 'none', width: 160 }} autoFocus />
              <button onClick={saveName} disabled={savingName} style={{ background: G.gold, color: '#000', border: 'none', borderRadius: 6, padding: '7px 12px', fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', textTransform: 'uppercase' }}>
                {savingName ? '…' : 'Uložit'}
              </button>
              <button onClick={() => { setEditName(false); setNewName(profile?.full_name || '') }} style={{ background: 'rgba(255,255,255,.05)', color: G.mut, border: `1px solid ${G.br}`, borderRadius: 6, padding: '7px 12px', fontFamily: "'Syne Mono', monospace", fontSize: 9, cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setEditName(true)} style={{ background: 'rgba(255,255,255,.05)', color: G.mut, border: `1px solid ${G.br}`, borderRadius: 6, padding: '7px 12px', fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Edit2 size={11} /> Upravit
            </button>
          )
        } />
        <Row label="Email" value={profile?.email || '–'} />
        <Row label="Člen od" value={memberSince.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <div style={{ borderBottom: 'none' }}>
          <Row label="ID účtu" value={profile?.id?.slice(0, 8) + '…' || '–'} action={
            <button onClick={copyId} style={{ background: 'rgba(255,255,255,.05)', color: copied ? G.grn : G.mut, border: `1px solid ${copied ? 'rgba(0,230,118,.2)' : G.br}`, borderRadius: 6, padding: '7px 12px', fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s' }}>
              {copied ? <><Check size={11} /> Zkopírováno</> : <><Copy size={11} /> Kopírovat</>}
            </button>
          } />
        </div>
      </Card>

      {/* NOTIFICATIONS */}
      <Card style={{ animation: 'fadeUp .6s .15s ease both' }}>
        <SectionTitle icon={Bell} title="Notifikace" color={G.grn} />
        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { key: 'email_digest', label: 'Email souhrn dealů', desc: 'Dostávej souhrn dealů emailem', val: notifEmailDigest, set: setNotifEmailDigest, emoji: '📧' },
            { key: 'new_deals', label: 'Nové dealy', desc: 'Upozornění na čerstvé příležitosti', val: notifNewDeals, set: setNotifNewDeals, emoji: '🔔' },
            { key: 'live', label: 'Live alerty', desc: 'Okamžité alerty přes Telegram', val: notifLive, set: setNotifLive, emoji: '⚡' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Týdenní přehled a tipy', val: notifNewsletter, set: setNotifNewsletter, emoji: '📰' },
          ].map((n, i, arr) => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: i < arr.length - 1 ? `1px solid ${G.br}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: n.val ? 'rgba(0,230,118,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${n.val ? 'rgba(0,230,118,.2)' : G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all .3s', flexShrink: 0 }}>{n.emoji}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: G.wht, marginBottom: 2 }}>{n.label}</div>
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: .5 }}>{n.desc}</div>
                </div>
              </div>
              <button onClick={() => n.set(!n.val)} style={{ width: 48, height: 26, borderRadius: 100, background: n.val ? G.grn : 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: n.val ? 25 : 3, transition: 'left .3s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 2px 6px rgba(0,0,0,.3)' }} />
              </button>
            </div>
          ))}

          {/* TELEGRAM */}
          <div style={{ marginTop: 16, padding: '16px', background: 'rgba(77,159,255,.04)', border: '1px solid rgba(77,159,255,.15)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>✈️</span>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: G.wht }}>Telegram Chat ID</div>
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>Pro live alerty přes Telegram</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={telegramId} onChange={e => setTelegramId(e.target.value)} placeholder="Např. 123456789" style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,.05)', border: `1px solid ${G.br}`, borderRadius: 8, color: G.wht, fontFamily: "'Syne Mono', monospace", fontSize: 12, outline: 'none' }} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,159,255,.4)' }} onBlur={e => { e.currentTarget.style.borderColor = G.br }} />
            </div>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut, marginTop: 8, lineHeight: 1.6 }}>
              Jak získat Chat ID: Napiš @userinfobot na Telegramu a pošli /start
            </div>
          </div>

          {notifMsg && <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.2)', borderRadius: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn }}>{notifMsg}</div>}

          <button onClick={saveNotifications} disabled={savingNotif} style={{ marginTop: 16, width: '100%', padding: '13px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.grn, color: '#000', boxShadow: '0 6px 20px rgba(0,230,118,.25)', transition: 'all .3s' }}>
            {savingNotif ? 'Ukládám…' : 'Uložit nastavení'}
          </button>
        </div>
      </Card>

      {/* SECURITY */}
      <Card style={{ animation: 'fadeUp .6s .2s ease both' }}>
        <SectionTitle icon={Shield} title="Zabezpečení" color={G.pur} />
        <div style={{ padding: '8px 0 20px' }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.pur, marginBottom: 16 }}>🔒 Změna hesla</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, marginBottom: 6 }}>Nové heslo</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimálně 6 znaků" style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.05)', border: `1px solid ${G.br}`, borderRadius: 9, color: G.wht, fontFamily: "'Syne', sans-serif", fontSize: 13, outline: 'none', transition: 'border-color .2s' }} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(155,93,229,.4)' }} onBlur={e => { e.currentTarget.style.borderColor = G.br }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, marginBottom: 6 }}>Potvrď heslo</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Zopakuj nové heslo" style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.05)', border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? 'rgba(255,59,92,.4)' : confirmPassword && confirmPassword === newPassword ? 'rgba(0,230,118,.4)' : G.br}`, borderRadius: 9, color: G.wht, fontFamily: "'Syne', sans-serif", fontSize: 13, outline: 'none', transition: 'border-color .2s' }} onFocus={e => { e.currentTarget.style.borderColor = 'rgba(155,93,229,.4)' }} onBlur={e => { e.currentTarget.style.borderColor = G.br }} />
              {confirmPassword && confirmPassword === newPassword && <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn, marginTop: 5 }}>✓ Hesla se shodují</div>}
              {confirmPassword && confirmPassword !== newPassword && <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: '#FF3B5C', marginTop: 5 }}>✗ Hesla se neshodují</div>}
            </div>
            {passwordError && <div style={{ padding: '10px 12px', background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.2)', borderRadius: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: '#FF3B5C' }}>{passwordError}</div>}
            {passwordMsg && <div style={{ padding: '10px 12px', background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.2)', borderRadius: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.grn }}>{passwordMsg}</div>}
            <button onClick={savePassword} disabled={savingPassword || !newPassword || !confirmPassword} style={{ padding: '12px', borderRadius: 9, border: 'none', cursor: savingPassword ? 'default' : 'pointer', fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: newPassword && confirmPassword ? G.pur : 'rgba(255,255,255,.06)', color: newPassword && confirmPassword ? '#fff' : G.mut, transition: 'all .3s', boxShadow: newPassword && confirmPassword ? '0 6px 20px rgba(155,93,229,.25)' : 'none' }}>
              {savingPassword ? 'Ukládám…' : 'Uložit heslo'}
            </button>
          </div>
        </div>
        <div style={{ borderBottom: 'none', paddingTop: 16, borderTop: `1px solid ${G.br}` }}>
          <Row label="Dvoufaktorové ověření" value="Není aktivní" action={
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: 1, textTransform: 'uppercase' }}>Brzy</span>
          } />
        </div>
      </Card>

      {/* SUPPORT */}
      <Card style={{ animation: 'fadeUp .6s .25s ease both' }}>
        <SectionTitle icon={Star} title="Podpora" color={G.grn} />
        {[
          { label: 'FAQ', desc: 'Časté otázky a odpovědi', href: '/faq' },
          { label: 'Kontaktovat podporu', desc: 'Odpovídáme do 24 hodin', href: '/kontakt' },
          { label: 'Telegram komunita', desc: 'Soukromá skupina členů', href: 'https://t.me/' },
        ].map((item, i) => (
          <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: i < 2 ? `1px solid rgba(255,255,255,.04)` : 'none', textDecoration: 'none', gap: 12, transition: 'background .2s' }} onMouseEnter={e => { (e.currentTarget as any).style.background = 'rgba(255,255,255,.03)' }} onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent' }}>
            <div>
              <div style={{ fontSize: 13, color: G.wht, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: .5 }}>{item.desc}</div>
            </div>
            <ChevronRight size={15} color={G.mut} />
          </Link>
        ))}
      </Card>

      {/* LOGOUT */}
      <Card style={{ animation: 'fadeUp .6s .3s ease both' }}>
        <div style={{ padding: '6px 0' }}>
          <button onClick={logout} disabled={logoutLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'none', border: 'none', cursor: 'pointer', transition: 'background .2s' }} onMouseEnter={e => { (e.currentTarget as any).style.background = 'rgba(255,59,92,.06)' }} onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,59,92,.1)', border: '1px solid rgba(255,59,92,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={14} color={G.red} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.red }}>
                  {logoutLoading ? 'Odhlašování…' : 'Odhlásit se'}
                </div>
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut, letterSpacing: .5 }}>Bezpečně se odhlásit z účtu</div>
              </div>
            </div>
            <ChevronRight size={15} color={G.red} />
          </button>
        </div>
      </Card>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut, letterSpacing: 1, marginBottom: 6 }}>NAJDIDEAL · HOSABUT S.R.O. · IČO: 23338342</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[{ l: 'GDPR', h: '/gdpr' }, { l: 'Podmínky', h: '/obchodni-podminky' }, { l: 'Kontakt', h: '/kontakt' }].map(lk => (
            <Link key={lk.l} href={lk.h} style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut, letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none', transition: 'color .2s' }} onMouseEnter={e => { (e.currentTarget as any).style.color = G.gold }} onMouseLeave={e => { (e.currentTarget as any).style.color = G.mut }}>{lk.l}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}