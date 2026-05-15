import NajdiBot from '@/components/ui/NajdiBot'
import { AppBar } from '@/components/layout/AppBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-1000" style={{ position: 'relative' }}>
      <AppBar />
      <main className="p-4 md:p-6">{children}</main>
      <NajdiBot />
    </div>
  )
}
