'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <html lang="cs">
      <body className="min-h-screen bg-[#060608] flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="text-[140px] leading-none font-black text-[#1C1C22] select-none mb-4 tracking-widest" style={{ fontFamily: 'sans-serif' }}>
            500
          </div>
          <h1 className="text-3xl font-black tracking-widest text-white mb-3" style={{ fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
            NĚCO SE POKAZILO
          </h1>
          <p className="text-[#6B6B78] text-sm mb-8 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
            Nastala neočekávaná chyba. Zkus to prosím znovu nebo se vrať na hlavní stránku.
          </p>
          {error.digest && (
            <p className="text-xs text-[#3f3e50] mb-6 font-mono">Kód chyby: {error.digest}</p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] text-black font-bold text-sm tracking-wider uppercase transition-all hover:bg-[#FFD54F]">
              <RefreshCw className="w-4 h-4" /> Zkusit znovu
            </button>
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-sm tracking-wider uppercase transition-all hover:border-white/20">
              <ArrowLeft className="w-4 h-4" /> Hlavní stránka
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
