import ProductDetails from "@/components/ProductDetails";

// ================= FETCH PRODUCT (SERVER) =================
async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return undefined;
  return res.json();
}

// ================= METADATA (SERVER ONLY) =================
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
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

// ================= PAGE (SERVER COMPONENT) =================
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="text-center mt-10">Không tìm thấy sản phẩm</div>;
  }

  return <ProductDetails product={product} />;
}
