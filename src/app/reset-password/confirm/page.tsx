'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const G = {
  gold:'#F0B429', grn:'#00E676', red:'#FF3B5C',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

export default function ResetConfirmPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    // Zpracuj token z URL hash
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    if (accessToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? '',
      }).then(({ error }) => {
        if (error) setError('Odkaz je neplatný nebo vypršel. Požádej o nový reset hesla.')
        else setReady(true)
      })
    } else {
      // Zkus přes onAuthStateChange
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') setReady(true)
      })
      setTimeout(() => setReady(true), 2000)
      return () => subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Heslo musí mít alespoň 6 znaků.'); return }
    if (password !== confirm) { setError('Hesla se neshodují.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 3000)
  }

  if (success) return (
    <div style={{ background: '#020208', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Syne, sans-serif' }}>
      <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: 'scaleIn .6s cubic-bezier(.34,1.56,.64,1) both' }}>✅</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, letterSpacing: 4, color: G.wht, marginBottom: 10, animation: 'fadeUp .5s .3s ease both', opacity: 0, animationFillMode: 'forwards' }}>HESLO ZMĚNĚNO</h2>
        <p style={{ fontSize: 13, color: G.mut, marginBottom: 8, fontWeight: 300, animation: 'fadeUp .5s .4s ease both', opacity: 0, animationFillMode: 'forwards' }}>Tvoje heslo bylo úspěšně změněno.</p>
        <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, color: G.grn, animation: 'fadeUp .5s .5s ease both', opacity: 0, animationFillMode: 'forwards' }}>Přesměrovávám do aplikace…</p>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#020208', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Syne, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ambOrb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Ambient */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(240,180,41,.07) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'ambOrb 12s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(77,159,255,.05) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'ambOrb 15s ease-in-out infinite 2s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(240,180,41,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(240,180,41,.015) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 80%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp .6s ease both' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: G.gold, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#000', fontFamily: 'Bebas Neue, sans-serif' }}>ND</div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 4, color: G.wht }}>NAJDI<span style={{ color: G.gold }}>DEAL</span></span>
          </Link>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,48px)', letterSpacing: 4, color: G.wht, lineHeight: 1, marginBottom: 10 }}>NOVÉ HESLO</h1>
          <p style={{ fontSize: 13, color: G.mut, fontWeight: 300, lineHeight: 1.7 }}>Zadej své nové heslo pro přihlášení.</p>
        </div>

        {/* Form */}
        <div style={{ background: 'rgba(255,255,255,.026)', backdropFilter: 'blur(32px)', border: `1px solid ${G.br}`, borderRadius: 20, padding: 'clamp(24px,5vw,40px)', position: 'relative', overflow: 'hidden', animation: 'fadeUp .6s .1s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.4),transparent)' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 8 }}>Nové heslo</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimálně 6 znaků"
                required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,.05)', border: `1px solid ${G.br}`, borderRadius: 10, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(240,180,41,.4)' }}
                onBlur={e => { e.currentTarget.style.borderColor = G.br }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 8 }}>Potvrď heslo</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Zopakuj nové heslo"
                required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,.05)', border: `1px solid ${confirm && confirm !== password ? 'rgba(255,59,92,.4)' : confirm && confirm === password ? 'rgba(0,230,118,.4)' : G.br}`, borderRadius: 10, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(240,180,41,.4)' }}
                onBlur={e => { e.currentTarget.style.borderColor = confirm && confirm !== password ? 'rgba(255,59,92,.4)' : confirm && confirm === password ? 'rgba(0,230,118,.4)' : G.br }}
              />
              {confirm && confirm === password && <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.grn, marginTop: 6 }}>✓ Hesla se shodují</div>}
              {confirm && confirm !== password && <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.red, marginTop: 6 }}>✗ Hesla se neshodují</div>}
            </div>

            {error && (
              <div style={{ padding: '12px 14px', background: 'rgba(255,59,92,.06)', border: '1px solid rgba(255,59,92,.2)', borderRadius: 9, fontFamily: 'Syne Mono, monospace', fontSize: 10, color: G.red }}>
                ✗ {error}
              </div>
            )}

            <button type="submit" disabled={loading || !ready} style={{ width: '100%', padding: '16px', borderRadius: 10, border: 'none', cursor: loading ? 'default' : 'pointer', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: loading ? 'rgba(240,180,41,.4)' : G.gold, color: '#000', boxShadow: loading ? 'none' : '0 8px 28px rgba(240,180,41,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all .3s', marginTop: 4 }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Ukládám…</>
                : 'Nastavit nové heslo →'
              }
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, animation: 'fadeUp .6s .2s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <Link href="/login" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.mut, textDecoration: 'none', letterSpacing: 1 }}>← Zpět na přihlášení</Link>
        </div>
      </div>
    </div>
  )
}