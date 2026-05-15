import NajdiBot from '@/components/ui/NajdiBot'
import { AppBar } from '@/components/layout/AppBar'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-void-1000" style={{ position: 'relative' }}>
      <AppBar isAdmin={isAdmin} />
      <main className="p-4 md:p-6">{children}</main>
      <NajdiBot />
    </div>
  )
}
