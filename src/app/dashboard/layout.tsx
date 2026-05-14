import Link from 'next/link'
import NajdiBot from '@/components/ui/NajdiBot'
import { BackButton } from '@/components/ui/BackButton'
import { LogoutButton } from '@/components/ui/LogoutButton'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-void-1000">
      <style>{`
        .dn{height:60px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(2,2,8,.88);backdrop-filter:blur(32px) saturate(180%);display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:relative;overflow:hidden}
        .dn-left{display:flex;align-items:center;flex-shrink:0}
        .dn-center{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;text-decoration:none}
        .dn-right{display:flex;align-items:center;gap:5px;flex-shrink:0}
        .db{display:inline-flex;align-items:center;justify-content:center;font-size:15px;color:rgba(240,235,225,.5);text-decoration:none;width:32px;height:32px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:rgba(255,255,255,.04);transition:all .2s;cursor:pointer;flex-shrink:0}
        .db:hover{color:#F0B429;border-color:rgba(240,180,41,.3);background:rgba(240,180,41,.06)}
        .db-admin{display:inline-flex;align-items:center;gap:5px;font-family:'Syne Mono',monospace;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:rgba(240,180,41,.12);color:#F0B429;border:1px solid rgba(240,180,41,.3);border-radius:8px;padding:6px 10px;text-decoration:none;white-space:nowrap;transition:all .2s}
        .db-admin:hover{background:rgba(240,180,41,.22);border-color:rgba(240,180,41,.5)}
        @keyframes ndPulse{0%,100%{box-shadow:0 0 12px rgba(240,180,41,.55),0 0 28px rgba(240,180,41,.28),inset 0 1px 0 rgba(255,255,255,.35)}50%{box-shadow:0 0 22px rgba(240,180,41,.95),0 0 50px rgba(240,180,41,.5),inset 0 1px 0 rgba(255,255,255,.35)}}
        @keyframes ndShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes ndRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .nd-icon{width:30px;height:30px;border-radius:7px;background:linear-gradient(145deg,#FFD45E 0%,#F0B429 45%,#C8880A 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;flex-shrink:0;animation:ndPulse 2.8s ease-in-out infinite}
        .nd-icon-shine{position:absolute;top:0;left:0;right:0;height:55%;background:linear-gradient(180deg,rgba(255,255,255,.4) 0%,transparent 100%);border-radius:7px 7px 0 0;pointer-events:none}
        .nd-icon-ring{position:absolute;inset:-2px;border-radius:9px;border:1.5px dashed rgba(240,180,41,.35);animation:ndRing 8s linear infinite;pointer-events:none}
        .nd-icon-text{font-family:'Bebas Neue',sans-serif;font-size:13px;font-weight:900;color:#000;position:relative;letter-spacing:0.5px}
        .nd-text{font-family:'Bebas Neue',sans-serif;font-size:19px;letter-spacing:5px;white-space:nowrap}
        .nd-najdi{color:#F0EBE1}
        .nd-deal{background:linear-gradient(90deg,#F0B429 0%,#FFD97D 40%,#F0B429 60%,#C8880A 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:ndShimmer 3s linear infinite}
        @media(min-width:640px){.dn{padding:0 24px}}
      `}</style>
      <nav className="dn">
        <div className="dn-left"><BackButton /></div>
        <Link href="/" className="dn-center">
          <div className="nd-icon">
            <div className="nd-icon-shine" />
            <div className="nd-icon-ring" />
            <span className="nd-icon-text">ND</span>
          </div>
          <span className="nd-text">
            <span className="nd-najdi">NAJDI</span><span className="nd-deal">DEAL</span>
          </span>
        </Link>
        <div className="dn-right">
          {isAdmin && (
            <Link href="/admin" className="db-admin" title="Admin Panel">
              🔧 ADMIN
            </Link>
          )}
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
