export default function ZpravyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-1000">
      {children}
    </div>
  )
}