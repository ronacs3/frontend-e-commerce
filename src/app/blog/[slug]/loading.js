export default function BlogPostLoading() {
  return (
    <article className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Back button & Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-32 rounded-xl bg-slate-200" />
      </div>

      {/* Title & Metadata Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-28 rounded-full bg-teal-100" />
        <div className="h-10 w-full sm:w-5/6 rounded-lg bg-slate-200" />
        <div className="h-10 w-2/3 rounded-lg bg-slate-200" />
        <div className="flex items-center gap-4 pt-2">
          <div className="h-5 w-32 rounded bg-slate-100" />
          <div className="h-5 w-24 rounded bg-slate-100" />
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="h-80 sm:h-96 w-full rounded-3xl bg-slate-100 skeleton-shimmer" />

      {/* Article Content Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-11/12 rounded bg-slate-200" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-8 w-48 rounded bg-slate-200 mt-6" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
      </div>
    </article>
  );
}
