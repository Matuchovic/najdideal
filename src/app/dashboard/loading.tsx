export default function Loading() {
  return (
    <div className="space-y-8 pb-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-10 w-64 rounded-xl shimmer" />
          <div className="h-4 w-40 rounded shimmer" />
        </div>
        <div className="h-10 w-36 rounded-xl shimmer hidden sm:block" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card space-y-3">
            <div className="w-8 h-8 rounded-lg shimmer" />
            <div className="h-9 w-16 rounded shimmer" />
            <div className="h-3 w-24 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 rounded shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl shimmer" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded shimmer" />
                    <div className="h-3 w-14 rounded shimmer" />
                  </div>
                </div>
                <div className="w-4 h-4 rounded shimmer" />
              </div>
              <div className="h-5 w-3/4 rounded shimmer" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded shimmer" />
                <div className="h-3 w-4/5 rounded shimmer" />
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.04]">
                <div className="h-3 w-20 rounded shimmer" />
                <div className="h-7 w-24 rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
