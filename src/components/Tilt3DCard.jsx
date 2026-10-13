"use client";

import { useRef, useCallback, useEffect } from "react";

export default function Tilt3DCard({
  children,
  className = "",
  maxTilt = 7,
  perspective = 1000,
  scale = 1.015,
  glare = true,
  glareOpacity = 0.18,
  glareColor = "rgba(255, 255, 255, 0.25)",
  as: Component = "div",
  ...props
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates (-1 to 1)
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      const rotX = -(normY * maxTilt).toFixed(2);
      const rotY = (normX * maxTilt).toFixed(2);

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        card.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        if (glare && glareRef.current) {
          const glareX = ((x / rect.width) * 100).toFixed(1);
          const glareY = ((y / rect.height) * 100).toFixed(1);
          glareRef.current.style.opacity = `${glareOpacity}`;
          glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor} 0%, rgba(255, 255, 255, 0) 65%)`;
        }
      });
    },
    [maxTilt, perspective, scale, glare, glareOpacity, glareColor]
  );

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.15s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease-out, border-color 0.3s ease-out";
    card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, [perspective, glare]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      {...props}
    >
      {children}

      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            mixBlendMode: "overlay",
          }}
        />
      )}
    </Component>
  );
}
