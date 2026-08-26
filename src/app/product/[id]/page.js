import ProductDetails from "@/components/ProductDetails";

async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      next: { revalidate: 60 }, // ISR Cache 60s
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Sản phẩm không tồn tại - TechShop" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";
  const productUrl = `${baseUrl}/product/${product._id}`;
  const description = product.description?.substring(0, 160) || `Mua ngay ${product.name} chính hãng tại TechShop.`;

  return {
    title: product.name,
    description: description,
    keywords: [product.name, product.category, "chính hãng", "TechShop"],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | TechShop`,
      description: description,
      url: productUrl,
      type: "article",
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto my-12 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-500 text-sm">Sản phẩm bạn đang tìm kiếm có thể đã ngưng kinh doanh hoặc đường dẫn không đúng.</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";

  // Product Structured Data Schema.org JSON-LD
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "TechShop",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product._id}`,
      priceCurrency: "VND",
      price: product.price,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.countInStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "TechShop",
      },
    },
    ...(product.numReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating || 5,
            reviewCount: product.numReviews,
          },
        }
      : {}),
  };

  // Breadcrumb Schema.org JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category || "Sản phẩm",
        item: `${baseUrl}/?category=${encodeURIComponent(product.category || "")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${baseUrl}/product/${product._id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, breadcrumbSchema]),
        }}
      />
      <ProductDetails product={product} />
    </>
  );
}
