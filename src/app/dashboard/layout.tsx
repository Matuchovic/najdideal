import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'
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
        <div className="dn-logo-wrap">
          <a href="/" style={{display:'flex',alignItems:'center',gap:'9px',textDecoration:'none'}}>
            <div style={{width:28,height:28,borderRadius:6,background:'linear-gradient(145deg,#FFD45E 0%,#F0B429 45%,#C8880A 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:12,fontWeight:900,color:'#000',flexShrink:0,boxShadow:'0 0 16px rgba(240,180,41,.6)',position:'relative',overflow:'hidden'}}>
              <span style={{position:'absolute',top:0,left:0,right:0,height:'55%',background:'linear-gradient(180deg,rgba(255,255,255,.4) 0%,transparent 100%)',borderRadius:'6px 6px 0 0'}} />
              <span style={{position:'relative'}}>ND</span>
            </div>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:5,color:'#F0EBE1',whiteSpace:'nowrap'}}>
              NAJDI<span style={{color:'#F0B429'}}>DEAL</span>
            </span>
          </a>
        </div>
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