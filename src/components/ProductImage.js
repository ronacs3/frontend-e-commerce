"use client";

import { useState } from "react";

const DEFAULT_IMAGE = "/images/default-image.jpg";

export default function ProductImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_IMAGE);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(DEFAULT_IMAGE)}
    />
  );
}
