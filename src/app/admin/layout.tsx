import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Shield, LayoutDashboard, Tag, Users, BarChart3, Zap, PlusCircle, LogOut, ChevronRight } from 'lucide-react'
import { logout } from '@/lib/supabase/actions'

const NAV = [
  { href: '/admin',           label: 'Přehled',       icon: LayoutDashboard },
  { href: '/admin/deals',     label: 'Dealy',         icon: Tag },
  { href: '/admin/deals/new', label: 'Nový deal',     icon: PlusCircle },
  { href: '/admin/users',     label: 'Uživatelé',     icon: Users },
  { href: '/admin/analytics', label: 'Analytika',     icon: BarChart3 },
  { href: '/admin/alerts',    label: 'Alerty',        icon: Zap },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role,full_name,email').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-void-1000 flex">
      {/* Admin Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/[0.05] flex flex-col">
        <div className="absolute inset-y-0 left-0 w-60 bg-void-950/90 backdrop-blur-xl" style={{ position: 'sticky', top: 0, height: '100vh' }}>
          {/* Logo */}
          <div className="p-5 border-b border-white/[0.05]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-display text-sm tracking-widest text-white">NAJDIDEAL</div>
                <div className="font-heading text-[10px] text-red-400 tracking-widest uppercase">Admin panel</div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="sidebar-link group">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </Link>
            ))}
          </nav>

          {/* Back to app */}
          <div className="mt-auto p-3 border-t border-white/[0.05]">
            <Link href="/dashboard" className="sidebar-link mb-1">
              <LayoutDashboard className="w-4 h-4" /> Zpět do aplikace
            </Link>
            <form action={logout}>
              <button type="submit" className="sidebar-link w-full text-left text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" /> Odhlásit se
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="font-heading text-xs font-700 text-red-400 tracking-wider uppercase">Admin · {profile.full_name}</span>
          </div>
          <div className="font-body text-xs text-void-500">{profile.email}</div>
        </div>
        {children}
      </main>
    </div>
  )
}
