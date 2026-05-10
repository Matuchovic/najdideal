import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Settings, Bell, Shield, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Nastavení' }

async function updateNotifications(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({
    notifications_enabled: formData.get('notifications_enabled') === 'on',
    email_alerts: formData.get('email_alerts') === 'on',
  }).eq('id', user.id)
  revalidatePath('/settings')
}

async function updatePassword(formData: FormData) {
  'use server'
  const supabase = createClient()
  const password = formData.get('password') as string
  const confirm  = formData.get('confirm') as string
  if (password !== confirm) return
  await supabase.auth.updateUser({ password })
  revalidatePath('/settings')
}

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  return (
    <div className="max-w-2xl space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white">NASTAVENÍ</h1>
        <p className="font-body text-void-400 text-sm mt-1">Správa účtu a preferencí</p>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifikace
        </h3>
        <form action={updateNotifications} className="space-y-4">
          {[
            { name: 'notifications_enabled', label: 'Push notifikace', desc: 'Dostávej notifikace o nových dealech přímo v aplikaci', checked: profile.notifications_enabled },
            { name: 'email_alerts',          label: 'E-mailové alerty', desc: 'Dostávej nejlepší dealy na e-mail', checked: profile.email_alerts },
          ].map(({ name, label, desc, checked }) => (
            <label key={name} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-void-800/50 border border-white/[0.04] cursor-pointer hover:border-white/[0.08] transition-colors">
              <div>
                <p className="font-heading text-sm font-600 text-void-200">{label}</p>
                <p className="font-body text-xs text-void-500 mt-0.5">{desc}</p>
              </div>
              <div className="relative flex-shrink-0 mt-0.5">
                <input type="checkbox" name={name} defaultChecked={checked} className="sr-only peer" />
                <div className="w-10 h-6 rounded-full bg-void-700 peer-checked:bg-gold-500 transition-colors border border-white/10 peer-checked:border-gold-500/50" />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white peer-checked:translate-x-4 transition-transform shadow-sm" />
              </div>
            </label>
          ))}
          <button type="submit" className="btn btn-gold">Uložit nastavení</button>
        </form>
      </div>

      {/* Password */}
      <div className="card p-6">
        <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Bezpečnost
        </h3>
        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="input-label">Nové heslo</label>
            <input name="password" type="password" placeholder="Min. 8 znaků" className="input" minLength={8} />
          </div>
          <div>
            <label className="input-label">Potvrdit heslo</label>
            <input name="confirm" type="password" placeholder="Zopakuj heslo" className="input" minLength={8} />
          </div>
          <button type="submit" className="btn btn-gold">Změnit heslo</button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Účet
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-xl bg-void-800/50 border border-white/[0.04]">
            <div>
              <p className="font-heading text-xs font-600 text-void-400 uppercase tracking-wider">E-mail</p>
              <p className="font-body text-sm text-void-200 mt-0.5">{profile.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-void-800/50 border border-white/[0.04]">
            <div>
              <p className="font-heading text-xs font-600 text-void-400 uppercase tracking-wider">ID účtu</p>
              <p className="font-mono text-xs text-void-500 mt-0.5">{profile.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-500/15">
        <h3 className="font-heading text-sm font-700 text-red-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Nebezpečná zóna
        </h3>
        <p className="font-body text-sm text-void-500 mb-4">Smazání účtu je nevratné. Všechna tvá data budou trvale odstraněna.</p>
        <button className="btn btn-danger" onClick={() => alert('Pro smazání účtu kontaktuj podporu na info@najdideal.cz')}>
          <Trash2 className="w-3.5 h-3.5" /> Smazat účet
        </button>
      </div>
    </div>
  )
}
