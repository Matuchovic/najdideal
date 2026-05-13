import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'
import NajdiLogo from '@/components/ui/NajdiLogo'
import { LogoutButton } from '@/components/ui/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-1000">
      <style>{`
        .dn{height:60px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(2,2,8,.88);backdrop-filter:blur(32px) saturate(180%);display:flex;align-items:center;padding:0 16px;gap:12px;overflow:hidden;position:relative}
        .dn-logo-wrap{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;pointer-events:auto}
        .dn-logo-box{width:28px;height:28px;background:#F0B429;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#000;flex-shrink:0}
        .dn-r{display:flex;align-items:center;gap:5px;justify-content:flex-end}
        .db{display:inline-flex;align-items:center;justify-content:center;font-size:15px;color:rgba(240,235,225,.5);text-decoration:none;width:32px;height:32px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:rgba(255,255,255,.04);transition:all .2s;cursor:pointer;flex-shrink:0}
        .db:hover{color:#F0B429;border-color:rgba(240,180,41,.3);background:rgba(240,180,41,.06)}
        @media(min-width:640px){.dn{padding:0 24px}}
      `}</style>
      <nav className="dn">
        <BackButton />
        <div className="dn-logo-wrap"><NajdiLogo href="/" size="sm" /></div>
        <div className="dn-r">
          <Link href="/marketplace/zpravy" className="db" title="Zprávy">💬</Link>
          <Link href="/settings" className="db" title="Nastavení">⚙️</Link>
          <Link href="/" className="db" title="Domů">🏠</Link>
          <LogoutButton />
        </div>
      </nav>
      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}