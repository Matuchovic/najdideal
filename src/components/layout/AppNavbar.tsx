'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, Crown, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { cn, getInitials } from '@/lib/utils'
import { logout } from '@/lib/supabase/actions'
import type { Profile } from '@/lib/types'
import { useNotifications } from '@/lib/hooks'

interface AppNavbarProps {
  profile: Profile
}

export function AppNavbar({ profile }: AppNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 glass-dark border-b border-white/[0.05]" />
      <div className="relative flex items-center justify-between h-full px-6 max-w-screen-2xl mx-auto">

        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-display text-[15px] text-black font-black relative overflow-hidden">
            <span className="relative z-10">ND</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <span className="font-display text-xl text-white tracking-widest hidden sm:block">
            NAJDI<span className="text-gold-500">DEAL</span>
          </span>
        </Link>

        {/* Center: Search */}
        <Link href="/search" className={cn(
          'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 group',
          pathname === '/search'
            ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
            : 'bg-void-800/60 border-white/[0.06] text-void-400 hover:border-white/10 hover:text-void-200'
        )}>
          <Search className="w-3.5 h-3.5" />
          <span className="font-heading text-xs font-600 tracking-wider">Hledat dealy...</span>
          <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-void-700 text-void-400 font-mono">⌘K</kbd>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* VIP Badge */}
          {profile.role === 'vip' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-vip">
              <Crown className="w-3 h-3" />
              <span className="font-heading text-[11px] font-700 tracking-widest">VIP</span>
            </div>
          )}
          {profile.role === 'admin' && (
            <Link href="/admin" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-red">
              <span className="font-heading text-[11px] font-700 tracking-widest">ADMIN</span>
            </Link>
          )}

          {/* Notifications */}
          <Link href="/notifications" className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <Bell className="w-4 h-4 text-void-400 group-hover:text-void-200 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center font-heading text-[9px] font-700 text-black">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gold-500/20 border border-gold-500/25 flex items-center justify-center font-heading text-xs font-700 text-gold-400">
                {getInitials(profile.full_name)}
              </div>
              <span className="hidden sm:block font-heading text-sm font-600 text-void-200 max-w-[100px] truncate">
                {profile.full_name?.split(' ')[0] ?? 'Uživatel'}
              </span>
              <ChevronDown className={cn('w-3.5 h-3.5 text-void-400 transition-transform duration-200', menuOpen && 'rotate-180')} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 z-20 glass-gold rounded-xl overflow-hidden shadow-premium animate-slide-down">
                  <div className="p-3 border-b border-white/[0.06]">
                    <p className="font-heading text-sm font-600 text-void-200 truncate">{profile.full_name}</p>
                    <p className="font-body text-xs text-void-400 truncate">{profile.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-void-300 hover:text-white">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-heading text-sm font-600">Profil</span>
                    </Link>
                    <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-void-300 hover:text-white">
                      <Settings className="w-3.5 h-3.5" />
                      <span className="font-heading text-sm font-600">Nastavení</span>
                    </Link>
                    {profile.role !== 'vip' && profile.role !== 'admin' && (
                      <Link href="/membership" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/15 transition-colors text-gold-400 mt-1">
                        <Crown className="w-3.5 h-3.5" />
                        <span className="font-heading text-sm font-700">Upgradovat na VIP</span>
                      </Link>
                    )}
                  </div>
                  <div className="p-1.5 border-t border-white/[0.06]">
                    <form action={logout}>
                      <button type="submit" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-void-400 hover:text-red-400 w-full">
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="font-heading text-sm font-600">Odhlásit se</span>
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
