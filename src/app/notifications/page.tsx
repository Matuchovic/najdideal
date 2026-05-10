import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Bell, Check } from 'lucide-react'
import { formatRelative } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const metadata = { title: 'Notifikace' }

async function markAllRead(userId: string) {
  'use server'
  const supabase = createClient()
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
  revalidatePath('/notifications')
}

export default async function NotificationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifs } = await supabase
    .from('notifications').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(50)

  const unread = (notifs ?? []).filter(n => !n.is_read).length

  const ICONS: Record<string, string> = { deal: '💰', alert: '⚡', system: '🔔', membership: '👑', welcome: '🎉' }

  return (
    <div className="space-y-6 max-w-2xl pb-24 lg:pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-white">NOTIFIKACE</h1>
          <p className="font-body text-void-400 text-sm mt-1">{unread > 0 ? `${unread} nepřečtených` : 'Vše přečteno'}</p>
        </div>
        {unread > 0 && (
          <form action={markAllRead.bind(null, user.id)}>
            <button type="submit" className="btn btn-ghost">
              <Check className="w-3.5 h-3.5" />
              Označit vše jako přečtené
            </button>
          </form>
        )}
      </div>

      <div className="space-y-2">
        {(notifs ?? []).map(n => (
          <div key={n.id} className={`card p-4 flex items-start gap-4 transition-all ${!n.is_read ? 'border-gold-500/15' : ''}`}>
            {!n.is_read && <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5" />}
            <div className="w-10 h-10 rounded-xl bg-void-800 flex items-center justify-center text-xl flex-shrink-0">
              {ICONS[n.type] ?? '🔔'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-heading text-sm font-700 ${n.is_read ? 'text-void-300' : 'text-white'}`}>{n.title}</h3>
                <span className="font-heading text-[11px] text-void-500 flex-shrink-0">{formatRelative(n.created_at)}</span>
              </div>
              {n.body && <p className="font-body text-xs text-void-400 mt-0.5 leading-relaxed">{n.body}</p>}
              {n.link && (
                <a href={n.link} className="inline-flex items-center gap-1 mt-2 font-heading text-xs text-gold-500 hover:text-gold-400 tracking-wider uppercase transition-colors">
                  Zobrazit →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {(notifs ?? []).length === 0 && (
        <div className="text-center py-24">
          <Bell className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-display text-2xl tracking-widest text-void-400 mb-2">ŽÁDNÉ NOTIFIKACE</h3>
          <p className="font-body text-sm text-void-500">Nové notifikace se zobrazí zde.</p>
        </div>
      )}
    </div>
  )
}
