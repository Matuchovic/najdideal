import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Shield, LayoutDashboard, Tag, Users, BarChart3, Zap, PlusCircle, LogOut, ChevronRight } from 'lucide-react'
import { logout } from '@/lib/supabase/actions'

const NAV = [
  { href: '/admin',           label: 'Přehled',   icon: LayoutDashboard },
  { href: '/admin/deals',     label: 'Dealy',     icon: Tag },
  { href: '/admin/deals/new', label: 'Nový deal', icon: PlusCircle },
  { href: '/admin/users',     label: 'Uživatelé', icon: Users },
  { href: '/admin/analytics', label: 'Analytika', icon: BarChart3 },
  { href: '/admin/alerts',    label: 'Alerty',    icon: Zap },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role,full_name,email').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-void-1000">
      <style>{`
        /* ── Mobile top nav ── */
        .admin-topnav{display:none;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(2,2,8,.95);backdrop-filter:blur(32px);padding:0 12px;position:sticky;top:0;z-index:100}
        .admin-topnav::-webkit-scrollbar{display:none}
        .admin-topnav-inner{display:flex;align-items:center;gap:4px;padding:10px 0;min-width:max-content}
        .admin-toplink{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:rgba(240,235,225,.5);font-family:'Syne Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:all .2s;flex-shrink:0}
        .admin-toplink:hover,.admin-toplink.active{background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.28);color:#F0B429}
        .admin-toplink-logout{color:rgba(255,59,92,.6);border-color:rgba(255,59,92,.15);background:rgba(255,59,92,.04)}
        .admin-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(2,2,8,.95);backdrop-filter:blur(32px);position:sticky;top:0;z-index:101}

        /* ── Desktop sidebar ── */
        .admin-sidebar{display:flex}

        @media(max-width:768px){
          .admin-sidebar{display:none}
          .admin-topnav{display:block}
          .admin-header{display:flex}
        }
        @media(min-width:769px){
          .admin-topnav{display:none}
          .admin-header{display:none}
        }

        .sidebar-link{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;color:rgba(240,235,225,.45);font-family:'Syne Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;transition:all .2s;margin-bottom:2px}
        .sidebar-link:hover{background:rgba(255,255,255,.05);color:rgba(240,235,225,.9)}
      `}</style>

      {/* MOBILE HEADER */}
      <div className="admin-header">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:14}}>🛡️</span>
          </div>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:3,color:'#F0EBE1'}}>ADMIN</div>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'#ef4444',letterSpacing:1}}>PANEL</div>
          </div>
        </div>
        <Link href="/dashboard" style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.4)',textDecoration:'none',border:'1px solid rgba(255,255,255,.07)',padding:'6px 10px',borderRadius:6}}>← Zpět</Link>
      </div>

      {/* MOBILE TOP NAV */}
      <div className="admin-topnav">
        <div className="admin-topnav-inner">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="admin-toplink">{label}</Link>
          ))}
          <form action={logout} style={{display:'inline'}}>
            <button type="submit" className="admin-toplink admin-toplink-logout">🚪 Odhlásit</button>
          </form>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="admin-sidebar" style={{minHeight:'100vh'}}>
        {/* Sidebar */}
        <aside style={{width:240,flexShrink:0,borderRight:'1px solid rgba(255,255,255,.05)',background:'rgba(13,13,16,.9)',backdropFilter:'blur(20px)',position:'sticky',top:0,height:'100vh',display:'flex',flexDirection:'column'}}>
          <div style={{padding:20,borderBottom:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/admin" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🛡️</div>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:3,color:'#F0EBE1'}}>NAJDIDEAL</div>
                <div style={{fontFamily:"'Syne Mono',monospace",fontSize:9,color:'#f87171',letterSpacing:1}}>Admin panel</div>
              </div>
            </Link>
          </div>
          <nav style={{padding:12,flex:1}}>
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="sidebar-link">
                <Icon size={14} style={{flexShrink:0}} />
                <span style={{flex:1}}>{label}</span>
                <ChevronRight size={12} style={{opacity:.3}} />
              </Link>
            ))}
          </nav>
          <div style={{padding:12,borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/dashboard" className="sidebar-link" style={{marginBottom:4}}>
              <LayoutDashboard size={14} /> Zpět do aplikace
            </Link>
            <form action={logout}>
              <button type="submit" className="sidebar-link" style={{width:'100%',textAlign:'left',color:'#f87171',cursor:'pointer',background:'none',border:'none'}}>
                <LogOut size={14} /> Odhlásit se
              </button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <main style={{flex:1,minWidth:0,padding:'32px 24px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:100,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)'}}>
              <Shield size={12} style={{color:'#f87171'}} />
              <span style={{fontFamily:"'Syne Mono',monospace",fontSize:10,fontWeight:700,color:'#f87171',letterSpacing:1,textTransform:'uppercase'}}>Admin · {profile.full_name}</span>
            </div>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:10,color:'rgba(240,235,225,.3)'}}>{profile.email}</div>
          </div>
          {children}
        </main>
      </div>

      {/* MOBILE MAIN */}
      <div style={{display:'block',padding:'16px'}} className="admin-mobile-main">
        <style>{`.admin-sidebar ~ .admin-mobile-main{display:none}@media(max-width:768px){.admin-mobile-main{display:block!important}}`}</style>
        {children}
      </div>
    </div>
  )
}
