import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blogPosts";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { formatDate } from "@/utils/formatters";

export const metadata = {
  title: "Tin Tức & Đánh Giá Công Nghệ | TechShop Blog",
  description: "Cập nhật các bài viết đánh giá laptop, tư vấn chọn mua smartphone, mẹo sử dụng đồ công nghệ mới nhất từ các chuyên gia TechShop.",
  keywords: ["tin tức công nghệ", "đánh giá laptop", "review điện thoại", "tư vấn mua sắm", "mẹo công nghệ"],
};

export default function BlogListPage() {
  const featuredPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs inline-flex items-center gap-1.5">
            <BookOutlined /> TechShop Blog & News
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Tin Tức & Tư Vấn <span className="text-indigo-400">Công Nghệ</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tổng hợp bài đánh giá sản phẩm chuyên sâu, tư vấn chọn mua thiết bị phù hợp nhu cầu và cập nhật các mẹo hay công nghệ mới nhất.
          </p>
        </div>
      </div>

      {/* Featured Article Card */}
      {featuredPost && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white font-bold text-xs shadow-md">
              {featuredPost.category}
            </span>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <CalendarOutlined /> {formatDate(featuredPost.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ClockCircleOutlined /> {featuredPost.readTime}
              </span>
            </div>

            <Link href={`/blog/${featuredPost.slug}`}>
              <h2 className="text-2xl font-black text-slate-900 hover:text-indigo-600 transition leading-snug">
                {featuredPost.title}
              </h2>
            </Link>

            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
              {featuredPost.summary}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <UserOutlined />
                </div>
                <span className="text-xs font-bold text-slate-700">{featuredPost.author}</span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
              >
                <span>Đọc bài viết</span>
                <ArrowRightOutlined />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Bài viết nổi bật khác</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
              <div className="relative w-full h-48 bg-slate-100">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span><CalendarOutlined /> {formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span><ClockCircleOutlined /> {post.readTime}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h4 className="font-extrabold text-slate-800 text-base line-clamp-2 hover:text-indigo-600 transition leading-snug">
                      {post.title}
                    </h4>
                  </Link>

                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{post.author}</span>
                  <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-indigo-600 hover:underline">
                    Đọc tiếp →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
