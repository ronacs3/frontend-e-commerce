export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-44 rounded-lg bg-slate-200" />
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex gap-4 border-b border-slate-200 pb-3">
          <div className="h-8 w-28 rounded-lg bg-teal-100" />
          <div className="h-8 w-28 rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-4 max-w-xl">
          <div className="h-10 w-full rounded-lg bg-slate-100" />
          <div className="h-10 w-full rounded-lg bg-slate-100" />
          <div className="h-10 w-full rounded-lg bg-slate-100" />
          <div className="h-10 w-36 rounded-lg bg-slate-200 mt-4" />
        </div>
      </div>
    </div>
  );
}
