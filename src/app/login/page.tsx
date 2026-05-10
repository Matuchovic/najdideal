'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const password = fd.get('password') as string

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    await supabase.auth.setSession({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    })

    window.location.href = '/dashboard'
  }

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
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
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
              <Link href="/reset-password" className="font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider transition-colors">
                Zapomenuté heslo?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn btn-gold-lg w-full justify-center">
              {loading
                ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><span>Přihlásit se</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="font-body text-sm text-void-400">
              Nemáš účet?{' '}
              <Link href="/register" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
                Zaregistruj se zdarma
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}