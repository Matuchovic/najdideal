import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { User, Save } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ROLE_META } from '@/lib/types'

export const metadata = { title: 'Profil' }

async function updateProfile(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('profiles').update({
    full_name:      formData.get('full_name') as string,
    bio:            formData.get('bio') as string,
    telegram_handle:formData.get('telegram_handle') as string,
    city:           formData.get('city') as string,
  }).eq('id', user.id)

  revalidatePath('/profile')
}

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const roleMeta = ROLE_META[profile.role as keyof typeof ROLE_META]

  return (
    <div className="max-w-2xl space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-white">PROFIL</h1>
        <p className="font-body text-void-400 text-sm mt-1">Správa osobních informací</p>
      </div>

      {/* Avatar + role */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center font-display text-3xl text-gold-400 flex-shrink-0">
          {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-xl font-700 text-white">{profile.full_name}</h2>
            <span className="badge" style={{ background: `${roleMeta.color}15`, color: roleMeta.color, border: `1px solid ${roleMeta.color}25` }}>
              {roleMeta.icon} {roleMeta.label}
            </span>
          </div>
          <p className="font-body text-sm text-void-400">{profile.email}</p>
          <p className="font-heading text-xs text-void-500 mt-0.5">Člen od {formatDate(profile.created_at)}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[['Uložené', profile.deals_saved], ['Zobrazené', profile.deals_viewed], ['Série dní', profile.streak_days]].map(([lbl, val]) => (
          <div key={lbl as string} className="stat-card text-center">
            <div className="font-display text-3xl text-gold-500 mb-1">{val}</div>
            <div className="font-heading text-[10px] text-void-400 uppercase tracking-wider">{lbl as string}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card p-6">
        <h3 className="font-heading text-sm font-700 text-void-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <User className="w-4 h-4" /> Osobní informace
        </h3>
        <form action={updateProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Celé jméno</label>
              <input name="full_name" type="text" defaultValue={profile.full_name ?? ''} className="input" />
            </div>
            <div>
              <label className="input-label">Město</label>
              <input name="city" type="text" defaultValue={profile.city ?? ''} placeholder="Praha" className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">Telegram handle</label>
            <input name="telegram_handle" type="text" defaultValue={profile.telegram_handle ?? ''} placeholder="@username" className="input" />
          </div>
          <div>
            <label className="input-label">Bio</label>
            <textarea name="bio" rows={3} defaultValue={profile.bio ?? ''} placeholder="Pár slov o tobě..." className="input resize-none" />
          </div>
          <button type="submit" className="btn btn-gold">
            <Save className="w-4 h-4" /> Uložit změny
          </button>
        </form>
      </div>
    </div>
  )
}
