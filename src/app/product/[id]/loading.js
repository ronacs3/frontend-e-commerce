export default function ProductLoading() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-pulse">
      {/* Navigation Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-9 w-36 rounded-xl bg-slate-200" />
        <div className="h-4 w-28 rounded bg-slate-100" />
      </div>

      {/* Main Product Card Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image Box */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full h-[420px] bg-slate-50 rounded-2xl p-6 border border-slate-100 skeleton-shimmer" />
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-blue-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>

            <div className="h-8 w-full rounded-lg bg-slate-200" />
            <div className="h-8 w-3/4 rounded-lg bg-slate-200" />

            <div className="flex items-center gap-3 pt-1">
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="h-5 w-24 rounded bg-slate-100" />
            </div>

            <div className="h-10 w-44 rounded-lg bg-slate-200 mt-4" />

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-4/6 rounded bg-slate-100" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-32 rounded-xl bg-slate-100" />
              <div className="h-12 flex-1 rounded-xl bg-blue-700/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
