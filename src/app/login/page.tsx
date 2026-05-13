'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => window.location.replace('/dashboard'), 2400)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#020208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn { from { opacity: 0; transform: scale(.6) } to { opacity: 1; transform: scale(1) } }
        @keyframes fadeUp2 { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes glow2 { 0%,100% { box-shadow: 0 0 40px rgba(0,230,118,.3) } 50% { box-shadow: 0 0 80px rgba(0,230,118,.6) } }
        @keyframes dash2 { from { stroke-dashoffset: 100 } to { stroke-dashoffset: 0 } }
        @keyframes progress2 { from { width: 0% } to { width: 100% } }
      `}} />
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ display: 'inline-block', marginBottom: 32, animation: 'scaleIn .6s cubic-bezier(.34,1.56,.64,1) both' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(0,230,118,.08)', border: '2px solid rgba(0,230,118,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'glow2 2s ease-in-out infinite' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path d="M26 8C16.06 8 8 16.06 8 26c0 5.52 2.24 10.52 5.86 14.14" stroke="#00E676" strokeWidth="2" strokeLinecap="round" style={{strokeDasharray:100,strokeDashoffset:100,animation:'dash2 .8s ease .4s forwards'}}/>
              <path d="M26 14c-6.63 0-12 5.37-12 12 0 3.87 1.84 7.32 4.69 9.56" stroke="#00E676" strokeWidth="2" strokeLinecap="round" style={{strokeDasharray:80,strokeDashoffset:80,animation:'dash2 .7s ease .6s forwards'}}/>
              <path d="M26 20c-3.31 0-6 2.69-6 6 0 2.04.1 3.5 1.5 4.5" stroke="#00E676" strokeWidth="2" strokeLinecap="round" style={{strokeDasharray:60,strokeDashoffset:60,animation:'dash2 .6s ease .8s forwards'}}/>
              <path d="M38 12c2.5 3.5 4 7.6 4 12" stroke="#00E676" strokeWidth="2" strokeLinecap="round" style={{strokeDasharray:60,strokeDashoffset:60,animation:'dash2 .7s ease .5s forwards'}}/>
              <circle cx="38" cy="38" r="9" fill="#020208" stroke="rgba(0,230,118,.3)" strokeWidth="1"/>
              <path d="M34 38l3 3 6-6" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:20,strokeDashoffset:20,animation:'dash2 .4s ease 1.2s forwards'}}/>
            </svg>
          </div>
        </div>
        <div style={{ animation: 'fadeUp2 .6s .5s ease both', opacity: 0 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#00E676', marginBottom: 12 }}>✓ Ověřeno</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,8vw,52px)', letterSpacing: 5, color: '#F0EBE1', marginBottom: 8, lineHeight: 1 }}>PŘIHLÁŠENÍ</h2>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,8vw,52px)', letterSpacing: 5, color: '#00E676', marginBottom: 20, lineHeight: 1, textShadow: '0 0 40px rgba(0,230,118,.4)' }}>PROBĚHLO ÚSPĚŠNĚ</h2>
          <p style={{ fontSize: 13, color: 'rgba(240,235,225,.38)', fontWeight: 300, lineHeight: 1.7 }}>Přesměrovávám tě do dashboardu…</p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 180, height: 2, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#00E676,#F0B429)', borderRadius: 2, animation: 'progress2 2.2s ease forwards' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-void-1000 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-display text-xl text-black">ND</div>
            <span className="font-display text-2xl tracking-widest">NAJDI<span className="text-gold-500">DEAL</span></span>
          </Link>
          <h1 className="font-display text-4xl tracking-widest text-white mb-2">PŘIHLÁŠENÍ</h1>
          <p className="font-body text-void-400 text-sm">Přihlás se a najdi dealy jako první</p>
        </div>
        <div className="glass-gold rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">E-mail</label>
              <input name="email" type="email" required placeholder="vas@email.cz" className="input" />
            </div>
            <div>
              <label className="input-label">Heslo</label>
              <div className="relative">
                <input name="password" type={show ? 'text' : 'password'} required placeholder="••••••••" className="input pr-12" />
                <button type="button" onClick={() => setShow(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-void-400 hover:text-void-200 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/reset-password" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider transition-colors">Zapomenuté heslo?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn btn-gold-lg w-full justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Přihlásit se</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="font-body text-sm text-void-400">Nemáš účet?{' '}<Link href="/register" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">Zaregistruj se zdarma</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}