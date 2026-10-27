export default function CartLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-44 rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-20 w-20 rounded-xl bg-slate-100 skeleton-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/4 rounded bg-slate-100" />
              </div>
              <div className="h-9 w-24 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
            </div>
          </div>
          <div className="h-12 w-full rounded-xl bg-teal-700/30 mt-4" />
        </div>
      </div>
    </div>
  );
}
