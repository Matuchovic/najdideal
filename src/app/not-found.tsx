import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void-1000 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 text-center max-w-lg">
        <div className="font-display text-[180px] lg:text-[220px] leading-none text-void-800 select-none mb-0 tracking-widest">
          404
        </div>
        <div className="-mt-8 mb-6">
          <h1 className="font-display text-4xl tracking-widest text-white mb-3">STRÁNKA NENALEZENA</h1>
          <p className="font-body text-void-400 text-sm leading-relaxed">
            Stránka, kterou hledáš, neexistuje nebo byla přesunuta.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            <ArrowLeft className="w-4 h-4" /> Zpět na hlavní stránku
          </Link>
          <Link href="/deals" className="btn btn-outline">
            <Search className="w-4 h-4" /> Procházet dealy
          </Link>
        </div>
      </div>
    </div>
  )
}
