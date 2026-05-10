'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/lib/supabase/actions'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await resetPassword(fd)
      if (result?.error) toast.error(result.error)
      if (result?.success) setSent(true)
    })
  }

  return (
    <div className="min-h-screen bg-void-1000 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 font-heading text-xs text-void-400 hover:text-void-200 tracking-wider uppercase transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Zpět na přihlášení
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-display text-xl text-black">ND</div>
            <span className="font-display text-2xl tracking-widest">NAJDI<span className="text-gold-500">DEAL</span></span>
          </Link>
          <h1 className="font-display text-4xl tracking-widest text-white mb-2">RESET HESLA</h1>
          <p className="font-body text-void-400 text-sm">Zadej svůj e-mail a pošleme ti odkaz pro reset</p>
        </div>

        <div className="glass-gold rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h3 className="font-display text-2xl tracking-widest text-white mb-2">EMAIL ODESLÁN!</h3>
              <p className="font-body text-sm text-void-400 mb-6 leading-relaxed">
                Zkontroluj svou e-mailovou schránku a klikni na odkaz pro reset hesla.
              </p>
              <Link href="/login" className="btn btn-outline w-full justify-center">
                Zpět na přihlášení
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="input-label">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void-400" />
                  <input name="email" type="email" required placeholder="vas@email.cz" className="input pl-12" />
                </div>
              </div>
              <button type="submit" disabled={isPending} className="btn btn-gold-lg w-full justify-center">
                {isPending
                  ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : 'Odeslat reset odkaz'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
