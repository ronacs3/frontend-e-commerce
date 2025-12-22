import ProductDetails from "@/components/ProductDetails";

// ================= FETCH PRODUCT =================
async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// ================= METADATA =================
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Sản phẩm không tồn tại" };
  }
  return {
    title: `${product.name} | E-Commerce Shop`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      type: "website",
    },
  };
}

// ================= PAGE =================
export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <div className="text-center mt-10">Không tìm thấy sản phẩm</div>;
  }

  return <ProductDetails product={product} />;
}
