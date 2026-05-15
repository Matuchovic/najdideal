import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, ChevronRight, LogOut } from 'lucide-react'
import { logout } from '@/lib/supabase/actions'

const NAV = [
  { href: '/admin',           label: 'Přehled',   emoji: '📊' },
  { href: '/admin/deals',     label: 'Dealy',     emoji: '🏷️' },
  { href: '/admin/deals/new', label: 'Nový deal', emoji: '➕' },
  { href: '/admin/users',     label: 'Uživatelé', emoji: '👥' },
  { href: '/admin/analytics', label: 'Analytika', emoji: '📈' },
  { href: '/admin/alerts',    label: 'Alerty',    emoji: '⚡' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role,full_name,email').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#020208' }}>
      <style>{`
        .adm-wrap{display:flex;min-height:100vh}
        .adm-sidebar{width:220px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.06);background:rgba(13,13,16,.95);position:sticky;top:0;height:100vh;display:flex;flex-direction:column}
        .adm-content{flex:1;min-width:0;padding:28px 24px}
        .adm-topnav{display:none}
        .adm-slink{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;color:rgba(240,235,225,.4);font-family:'Syne Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;transition:all .2s;margin-bottom:2px;border:none;background:none;cursor:pointer;width:100%;text-align:left}
        .adm-slink:hover{background:rgba(255,255,255,.05);color:rgba(240,235,225,.9)}
        .adm-mlink{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:rgba(240,235,225,.5);font-family:'Syne Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:all .2s}
        .adm-mlink:hover{background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.25);color:#F0B429}
        @media(max-width:768px){
          .adm-wrap{display:block}
          .adm-sidebar{display:none}
          .adm-topnav{display:block;position:sticky;top:0;z-index:100;background:rgba(2,2,8,.97);backdrop-filter:blur(32px);border-bottom:1px solid rgba(255,255,255,.06)}
          .adm-content{padding:16px}
        }
      `}</style>

      {/* MOBILE TOP NAV */}
      <div className="adm-topnav">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>🛡️</div>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3,color:'#F0EBE1'}}>ADMIN</span>
          </div>
          <div style={{display:'flex',gap:6}}>
            <Link href="/dashboard" style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.4)',textDecoration:'none',border:'1px solid rgba(255,255,255,.07)',padding:'5px 10px',borderRadius:6}}>← Zpět</Link>
            <form action={logout} style={{display:'inline'}}>
              <button type="submit" style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(255,59,92,.7)',background:'rgba(255,59,92,.06)',border:'1px solid rgba(255,59,92,.15)',padding:'5px 10px',borderRadius:6,cursor:'pointer'}}>🚪</button>
            </form>
          </div>
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',scrollbarWidth:'none',padding:'0 12px 10px'}}>
          <div style={{display:'flex',gap:6,minWidth:'max-content'}}>
            {NAV.map(({ href, label, emoji }) => (
              <Link key={href} href={href} className="adm-mlink">{emoji} {label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN WRAPPER — sidebar + content */}
      <div className="adm-wrap">
        <aside className="adm-sidebar">
          <div style={{padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/admin" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🛡️</div>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:3,color:'#F0EBE1'}}>NAJDIDEAL</div>
                <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'#f87171',letterSpacing:1}}>Admin panel</div>
              </div>
            </Link>
          </div>
          <nav style={{padding:10,flex:1}}>
            {NAV.map(({ href, label, emoji }) => (
              <Link key={href} href={href} className="adm-slink">
                <span style={{fontSize:14}}>{emoji}</span>
                <span style={{flex:1}}>{label}</span>
                <ChevronRight size={10} style={{opacity:.25}} />
              </Link>
            ))}
          </nav>
          <div style={{padding:10,borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/dashboard" className="adm-slink"><LayoutDashboard size={14} />Zpět do aplikace</Link>
            <form action={logout}>
              <button type="submit" className="adm-slink" style={{color:'#f87171'}}>
                <LogOut size={14} />Odhlásit se
              </button>
            </form>
          </div>
          <div style={{padding:'10px 16px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.3)',marginBottom:2}}>{profile.full_name}</div>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.2)'}}>{profile.email}</div>
          </div>
        </aside>

        <main className="adm-content">
          {children}
        </main>
      </div>
    </div>
  )
}
