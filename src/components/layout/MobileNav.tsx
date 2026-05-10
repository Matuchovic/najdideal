'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, Bookmark, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import { useNotifications } from '@/lib/hooks'

const NAV = [
  { href: '/dashboard',     label: 'Přehled', icon: LayoutDashboard },
  { href: '/alerts',        label: 'Alerty',  icon: Zap },
  { href: '/saved',         label: 'Uložené', icon: Bookmark },
  { href: '/notifications', label: 'Oznámení',icon: Bell },
  { href: '/profile',       label: 'Profil',  icon: User },
]

export function MobileNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="absolute inset-0 glass-dark border-t border-white/[0.05]" />
      <div className="relative flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          const isBell = href === '/notifications'
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1 relative">
              <div className={cn(
                'p-2 rounded-xl transition-all duration-200',
                active ? 'bg-gold-500/15' : 'hover:bg-white/5'
              )}>
                <Icon className={cn('w-5 h-5 transition-colors', active ? 'text-gold-500' : 'text-void-400')} />
                {isBell && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center font-heading text-[9px] font-700 text-black">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={cn('font-heading text-[10px] font-600 tracking-wide', active ? 'text-gold-400' : 'text-void-500')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
