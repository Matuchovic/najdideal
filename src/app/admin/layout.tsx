import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Shield, LayoutDashboard, Tag, Users, BarChart3, Zap, PlusCircle, LogOut, ChevronRight } from 'lucide-react'
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
        .al{display:flex;min-height:100vh}
        .al-sidebar{width:220px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.06);background:rgba(13,13,16,.95);backdrop-filter:blur(20px);position:sticky;top:0;height:100vh;display:flex;flex-direction:column}
        .al-main{flex:1;min-width:0;padding:28px 24px}
        .al-mobile-nav{display:none;position:sticky;top:0;z-index:100;background:rgba(2,2,8,.97);backdrop-filter:blur(32px);border-bottom:1px solid rgba(255,255,255,.06)}
        .al-mobile-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px}
        .al-mobile-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 12px 10px}
        .al-mobile-scroll::-webkit-scrollbar{display:none}
        .al-mobile-links{display:flex;gap:6px;min-width:max-content}
        .al-mlink{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:rgba(240,235,225,.5);font-family:'Syne Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:all .2s}
        .al-mlink:hover{background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.25);color:#F0B429}
        .al-slink{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;color:rgba(240,235,225,.4);font-family:'Syne Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;transition:all .2s;margin-bottom:2px}
        .al-slink:hover{background:rgba(255,255,255,.05);color:rgba(240,235,225,.9)}
        @media(max-width:768px){
          .al{display:block}
          .al-sidebar{display:none}
          .al-mobile-nav{display:block}
          .al-main{padding:16px}
        }
      `}</style>

      {/* MOBILE NAV */}
      <div className="al-mobile-nav">
        <div className="al-mobile-header">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>🛡️</div>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3,color:'#F0EBE1'}}>ADMIN</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <Link href="/dashboard" style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.4)',textDecoration:'none',border:'1px solid rgba(255,255,255,.07)',padding:'5px 10px',borderRadius:6}}>← Zpět</Link>
            <form action={logout} style={{display:'inline'}}>
              <button type="submit" style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(255,59,92,.7)',background:'rgba(255,59,92,.06)',border:'1px solid rgba(255,59,92,.15)',padding:'5px 10px',borderRadius:6,cursor:'pointer'}}>🚪</button>
            </form>
          </div>
        </div>
        <div className="al-mobile-scroll">
          <div className="al-mobile-links">
            {NAV.map(({ href, label, emoji }) => (
              <Link key={href} href={href} className="al-mlink">{emoji} {label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="al">
        {/* Sidebar */}
        <aside className="al-sidebar">
          <div style={{padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/admin" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🛡️</div>
              <div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:3,color:'#F0EBE1'}}>NAJDIDEAL</div>
                <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'#f87171',letterSpacing:1}}>Admin panel</div>
              </div>
            </Link>
          </div>
          <nav style={{padding:10,flex:1,overflowY:'auto'}}>
            {NAV.map(({ href, label, emoji }) => (
              <Link key={href} href={href} className="al-slink">
                <span style={{fontSize:14}}>{emoji}</span>
                <span style={{flex:1}}>{label}</span>
                <ChevronRight size={10} style={{opacity:.25}} />
              </Link>
            ))}
          </nav>
          <div style={{padding:10,borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <Link href="/dashboard" className="al-slink" style={{marginBottom:4}}>
              <LayoutDashboard size={14} /> Zpět do aplikace
            </Link>
            <form action={logout}>
              <button type="submit" className="al-slink" style={{width:'100%',textAlign:'left',color:'#f87171',cursor:'pointer',background:'none',border:'none',padding:'8px 12px'}}>
                <LogOut size={14} /> Odhlásit se
              </button>
            </form>
          </div>
          <div style={{padding:'10px 16px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.3)',letterSpacing:1,marginBottom:2}}>{profile.full_name}</div>
            <div style={{fontFamily:"'Syne Mono',monospace",fontSize:8,color:'rgba(240,235,225,.2)'}}>{profile.email}</div>
          </div>
        </aside>

        {/* Main */}
        <main className="al-main">
          {children}
        </main>
      </div>
    </div>
  )
}
