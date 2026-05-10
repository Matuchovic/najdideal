'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { register } from '@/lib/supabase/actions'
import toast from 'react-hot-toast'

const PERKS = ['Přístup k free dealům každý den', 'Live alerty a oznámení', 'Komunita 2 341+ členů', 'Upgrade na VIP kdykoliv']

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if ((fd.get('password') as string).length < 8) { toast.error('Heslo musí mít alespoň 8 znaků.'); return }
    startTransition(async () => {
      const result = await register(fd)
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-void-1000 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 relative z-10">

        {/* Left: Form */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center font-display text-lg text-black">ND</div>
            <span className="font-display text-xl tracking-widest">NAJDI<span className="text-gold-500">DEAL</span></span>
          </Link>

          <h1 className="font-display text-4xl tracking-widest text-white mb-2">REGISTRACE</h1>
          <p className="font-body text-void-400 text-sm mb-8">Připoj se zdarma a začni nacházet dealy jako první</p>

          <div className="glass-gold rounded-2xl p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Celé jméno</label>
                <input name="full_name" type="text" required placeholder="Jan Novák" className="input" />
              </div>
              <div>
                <label className="input-label">E-mail</label>
                <input name="email" type="email" required placeholder="vas@email.cz" className="input" />
              </div>
              <div>
                <label className="input-label">Heslo</label>
                <div className="relative">
                  <input name="password" type={show ? 'text' : 'password'} required placeholder="Min. 8 znaků" className="input pr-12" minLength={8} />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-void-400 hover:text-void-200 transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="font-body text-[11px] text-void-500 leading-relaxed">
                Registrací souhlasíš s{' '}
                <Link href="/terms" className="text-gold-500 hover:underline">podmínkami použití</Link>
                {' '}a{' '}
                <Link href="/privacy" className="text-gold-500 hover:underline">zásadami ochrany soukromí</Link>.
              </p>

              <button type="submit" disabled={isPending} className="btn btn-gold-lg w-full justify-center">
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <><span>Vytvořit účet zdarma</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
              <p className="font-body text-sm text-void-400">
                Máš účet?{' '}
                <Link href="/login" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">Přihlásit se</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Perks */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
              <div className="live-dot w-1.5 h-1.5" />
              <span className="font-heading text-xs font-700 text-gold-400 tracking-wider uppercase">2 341+ členů</span>
            </div>
            <h2 className="font-display text-5xl tracking-widest text-white leading-none mb-3">
              NAJDI DEAL<br /><span className="text-gradient-gold">DŘÍV NEŽ</span><br />OSTATNÍ.
            </h2>
            <p className="font-body text-void-400 text-sm leading-relaxed">
              Denně filtrujeme stovky nabídek. Ty dostaneš jen ty nejlepší.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="font-body text-sm text-void-300">{perk}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['247', 'Dealů/měsíc'], ['4 235 Kč', 'Průměrný profit'], ['18 900 Kč', 'Největší profit']].map(([val, lbl]) => (
              <div key={lbl} className="p-4 rounded-xl bg-void-900 border border-white/[0.05] text-center">
                <div className="font-display text-2xl text-gold-500 mb-1">{val}</div>
                <div className="font-heading text-[10px] text-void-400 uppercase tracking-wider">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
