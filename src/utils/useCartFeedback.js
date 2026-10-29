"use client";

import { useEffect, useRef, useState } from 'react';
import { animateToCart } from '@/lib/cart-animation.mjs';
import { DEFAULT_IMAGE } from '@/utils/formatters';

export default function useCartFeedback() {
  const [adding, setAdding] = useState(false);
  const active = useRef(new Set());
  const timer = useRef(null);
  useEffect(() => () => {
    clearTimeout(timer.current);
    active.current.forEach((cancel) => cancel());
    active.current.clear();
  }, []);
  const feedback = (source, image) => {
    setAdding(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdding(false), 1500);
    const cancel = animateToCart({ source, image, fallbackImage: DEFAULT_IMAGE });
    // Keep only live flights, even during long catalog browsing sessions.
    const cleanup = setTimeout(() => { cancel(); active.current.delete(dispose); }, 1300);
    const dispose = () => { clearTimeout(cleanup); cancel(); };
    active.current.add(dispose);
  };
  return { adding, feedback };
}
