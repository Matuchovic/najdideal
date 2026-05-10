export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-1000">
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}