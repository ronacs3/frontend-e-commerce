export default function BlogLoading() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-slate-900/90 p-8 md:p-12 rounded-xl space-y-4">
        <div className="h-6 w-36 rounded-full bg-slate-700" />
        <div className="h-10 w-72 sm:w-96 rounded-lg bg-slate-700" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-800" />
      </div>

      {/* Featured Article Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 h-72 sm:h-96 rounded-2xl bg-slate-100 skeleton-shimmer" />
        <div className="lg:col-span-5 space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-8 w-full rounded-lg bg-slate-200" />
          <div className="h-8 w-4/5 rounded-lg bg-slate-200" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div className="h-8 w-28 rounded-full bg-slate-200" />
            <div className="h-9 w-32 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="space-y-6">
        <div className="h-7 w-48 rounded-md bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden space-y-4 p-4"
            >
              <div className="h-48 w-full rounded-xl bg-slate-100 skeleton-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-6 w-full rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
