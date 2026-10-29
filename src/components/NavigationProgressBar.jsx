"use client";

import { useEffect, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const barRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  const trickleTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const safetyTimerRef = useRef(null);

  const updateProgress = useCallback((val) => {
    progressRef.current = val;
    if (barRef.current) {
      barRef.current.style.width = `${val}%`;
      barRef.current.style.transitionDuration = val === 100 ? "100ms" : "250ms";
    }
  }, []);

  const finishProgress = useCallback(() => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    updateProgress(100);

    finishTimerRef.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = "0";
      }
      finishTimerRef.current = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        updateProgress(0);
      }, 250);
    }, 120);
  }, [updateProgress]);

  const startProgress = useCallback(() => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
      containerRef.current.style.display = "block";
    }
    updateProgress(28);

    trickleTimerRef.current = setInterval(() => {
      if (progressRef.current >= 85) {
        if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
        return;
      }
      const diff = 85 - progressRef.current;
      const step = Math.max(1, Math.floor(diff * 0.15));
      updateProgress(progressRef.current + step);
    }, 150);

    safetyTimerRef.current = setTimeout(() => {
      finishProgress();
    }, 6000);
  }, [updateProgress, finishProgress]);

  useEffect(() => {
    finishProgress();
  }, [pathname, searchParams, finishProgress]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      const currentUrl = window.location.pathname + window.location.search;
      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        const targetPath = targetUrl.pathname + targetUrl.search;

        if (targetPath !== currentUrl) {
          startProgress();
        }
      } catch {
        // Safe fallback if URL parsing fails
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [startProgress]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ display: "none", opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
    >
      <div
        ref={barRef}
        className="h-[3px] bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-300 transition-all ease-out relative"
        style={{
          width: "0%",
          boxShadow: "0 0 10px rgba(45, 212, 191, 0.8), 0 0 5px rgba(52, 211, 153, 0.6)",
        }}
      >
        <div className="absolute right-0 top-0 h-[3px] w-6 bg-white blur-[2px] opacity-80" />
      </div>
    </div>
  );
}

export default function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
