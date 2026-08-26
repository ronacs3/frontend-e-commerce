"use client";

import { useState } from "react";
import { DEFAULT_IMAGE } from "@/utils/formatters";

export default function ProductImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_IMAGE);

  return (
    <img
      src={imgSrc}
      alt={alt || "Product image"}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setImgSrc(DEFAULT_IMAGE)}
    />
  );
}
