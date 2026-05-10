import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-void-1000">
      <AppNavbar profile={profile} />
      <div className="flex pt-16">
        <div className="hidden lg:block w-56 flex-shrink-0">
          <AppSidebar profile={profile} />
        </div>
        <main className="flex-1 min-w-0 p-6 max-w-screen-2xl pb-24 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav profile={profile} />
    </div>
  )
}
