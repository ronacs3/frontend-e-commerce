import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/data/blogPosts";
import ProductCard from "@/components/ProductCard";
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, TagOutlined, ShareAltOutlined } from "@ant-design/icons";
import { formatDate } from "@/utils/formatters";

async function getRelatedCategoryProducts(categoryName) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(categoryName)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Bài viết không tồn tại - TechShop" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";
  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | TechShop Blog`,
    description: post.summary,
    keywords: [post.category, post.title, "TechShop Blog", "công nghệ"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostDetailPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";
  const relatedProducts = await getRelatedCategoryProducts(post.relatedCategory);

  // Article Schema.org JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "TechShop",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    description: post.summary,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
      >
        <ArrowLeftOutlined /> Quay lại trang tin tức
      </Link>

      {/* Main Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-sm space-y-6">
        {/* Article Meta Header */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
              <TagOutlined /> {post.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                <UserOutlined />
              </div>
              <div>
                <div className="font-bold text-slate-800">{post.author}</div>
                <div className="text-[11px] text-slate-400">{post.authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1"><CalendarOutlined /> {formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ClockCircleOutlined /> {post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-100 border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Lead Summary */}
        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm font-semibold leading-relaxed">
          {post.summary}
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none text-slate-700 text-base leading-relaxed space-y-4 pt-2">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-2">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("#### ")) {
              return (
                <h4 key={index} className="text-lg font-bold text-indigo-700 mt-4 mb-2">
                  {paragraph.replace("#### ", "")}
                </h4>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </article>

      {/* Suggested Products Widget based on article topic */}
      {relatedProducts.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Sản phẩm gợi ý liên quan đến bài viết
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
