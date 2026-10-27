export default function RootLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[80, 95, 110, 85, 100, 90].map((width, idx) => (
          <div
            key={idx}
            style={{ width: `${width}px` }}
            className="h-10 rounded-lg bg-slate-200/80 shrink-0"
          />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
        {/* Filter Aside Skeleton */}
        <aside className="hidden lg:block space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-6 w-32 rounded-md bg-slate-200" />
          <div className="h-10 w-full rounded-lg bg-slate-100" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-full rounded-lg bg-slate-100" />
          </div>
        </aside>

        {/* Product Cards Grid Skeleton */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-teal-100" />
              <div className="h-7 w-48 rounded-md bg-slate-200" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 space-y-4"
              >
                <div className="aspect-[4/3] w-full rounded-md bg-slate-100 skeleton-shimmer" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="h-6 w-24 rounded bg-slate-200" />
                  <div className="h-9 w-20 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
