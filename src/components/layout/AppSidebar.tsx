'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Zap, Bookmark, Bell, Search,
  Crown, Settings, User, TrendingUp, Tag, Shield,
  BarChart3, Users, PlusCircle, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface SidebarProps { profile: Profile }

const NAV_MAIN = [
  { href: '/dashboard',     label: 'Přehled',        icon: LayoutDashboard },
  { href: '/alerts',        label: 'Alerty',          icon: Zap },
  { href: '/deals',         label: 'Všechny dealy',   icon: TrendingUp },
  { href: '/saved',         label: 'Uložené',         icon: Bookmark },
  { href: '/notifications', label: 'Notifikace',      icon: Bell },
  { href: '/search',        label: 'Hledat',          icon: Search },
]

const NAV_ACCOUNT = [
  { href: '/profile',  label: 'Profil',      icon: User },
  { href: '/settings', label: 'Nastavení',   icon: Settings },
]

const NAV_ADMIN = [
  { href: '/admin',              label: 'Admin přehled', icon: Shield },
  { href: '/admin/deals',        label: 'Správa dealů',  icon: Tag },
  { href: '/admin/deals/new',    label: 'Nový deal',     icon: PlusCircle },
  { href: '/admin/users',        label: 'Uživatelé',     icon: Users },
  { href: '/admin/analytics',    label: 'Analytika',     icon: BarChart3 },
  { href: '/admin/alerts',       label: 'Alerty',        icon: Zap },
]

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link href={href} className={cn('sidebar-link', active && 'active')}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="w-3 h-3 opacity-50" />}
    </Link>
  )
}

export function AppSidebar({ profile }: SidebarProps) {
  const isAdmin = profile.role === 'admin'
  const isVip   = profile.role === 'vip' || profile.role === 'admin'

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 z-40 flex flex-col border-r border-white/[0.04] overflow-y-auto">
      <div className="absolute inset-0 bg-void-950/80 backdrop-blur-xl" />

      <div className="relative flex flex-col h-full p-3">

        {/* VIP Upgrade Banner */}
        {!isVip && (
          <Link href="/membership" className="block mb-4 p-3 rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/20 hover:border-gold-500/35 transition-colors group">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-gold-500" />
              <span className="font-heading text-xs font-700 text-gold-500 tracking-wider uppercase">VIP přístup</span>
            </div>
            <p className="font-body text-[11px] text-void-400 leading-relaxed">Odemkni exkluzivní dealy a alerty</p>
            <div className="mt-2 flex items-center gap-1 font-heading text-[11px] font-700 text-gold-500 group-hover:gap-2 transition-all">
              Upgradovat <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        )}

        {/* Main Nav */}
        <div className="mb-4">
          <p className="px-3 mb-2 font-heading text-[10px] font-700 tracking-[0.15em] text-void-500 uppercase">Hlavní menu</p>
          <nav className="space-y-0.5">
            {NAV_MAIN.map(item => <NavLink key={item.href} {...item} />)}
          </nav>
        </div>

        {/* Account */}
        <div className="mb-4">
          <p className="px-3 mb-2 font-heading text-[10px] font-700 tracking-[0.15em] text-void-500 uppercase">Účet</p>
          <nav className="space-y-0.5">
            {NAV_ACCOUNT.map(item => <NavLink key={item.href} {...item} />)}
          </nav>
        </div>

        {/* Admin */}
        {isAdmin && (
          <div className="mb-4">
            <p className="px-3 mb-2 font-heading text-[10px] font-700 tracking-[0.15em] text-red-400/60 uppercase">Admin panel</p>
            <nav className="space-y-0.5">
              {NAV_ADMIN.map(item => <NavLink key={item.href} {...item} />)}
            </nav>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* User info at bottom */}
        <div className="p-3 rounded-xl bg-void-800/50 border border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center font-heading text-sm font-700 text-gold-400 flex-shrink-0">
              {(profile.full_name?.[0] ?? 'U').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-xs font-600 text-void-200 truncate">{profile.full_name ?? 'Uživatel'}</p>
              <p className="font-body text-[10px] text-void-500 truncate">{profile.email}</p>
            </div>
            <div className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              profile.role === 'admin' ? 'bg-red-400' : profile.role === 'vip' ? 'bg-gold-500' : 'bg-void-500'
            )} />
          </div>
        </div>
      </div>
    </aside>
  )
}
