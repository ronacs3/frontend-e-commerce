export function selectFeaturedProduct(products) {
  const inventory = products.filter((product) => product?._id);
  const available = inventory.filter((product) => product.countInStock > 0);
  return available.find((product) => /tai nghe|headphone/i.test(product.category || '')) || available[0] || inventory[0] || null;
}

export function getProductImages(product) {
  return [...new Set([product?.image, ...(Array.isArray(product?.images) ? product.images : [])])]
    .filter((image) => typeof image === 'string' && image.trim().length > 0);
}

export function clampQuantity(quantity, stock) {
  if (!(stock > 0)) return 0;
  return Math.min(Math.floor(stock), Math.max(1, Math.floor(Number(quantity) || 1)));
}
