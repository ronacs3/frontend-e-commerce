"use client";

import { useEffect, useRef } from "react";

const REVEAL_TARGETS = [
  ".benefits-strip > div",
  ".section-heading",
  ".collection-card",
  ".catalog-sidebar",
  ".product-card",
  ".catalog-empty",
  ".editorial-banner",
  ".footer-main > div",
  ".site-main > :not(.storefront)",
].join(",");

export default function MotionEffects() {
  const progressRef = useRef(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.querySelector(".site-main");
    const footer = document.querySelector(".store-footer");
    const seen = new WeakSet();
    const pending = new Set();
    let frame = 0;

    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const scheduleProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const reveal = (element) => {
      element.dataset.revealState = "visible";
      pending.delete(element);
    };

    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.target.isConnected) {
          observer.unobserve(entry.target);
          pending.delete(entry.target);
          continue;
        }
        if (entry.target.matches(".hero")) {
          entry.target.dataset.motionActive = String(entry.isIntersecting && !preference.matches);
        } else if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }) : null;

    const prepare = (root) => {
      if (!(root instanceof Element)) return;
      if (!preference.matches && observer) {
        const targets = [...(root.matches(REVEAL_TARGETS) ? [root] : []), ...root.querySelectorAll(REVEAL_TARGETS)];
        for (const element of targets) {
          if (seen.has(element)) continue;
          seen.add(element);
          // A short stagger follows each row without delaying a long product list.
          const siblings = Array.from(element.parentElement?.children || []);
          const order = siblings.indexOf(element) % 3;
          element.style.setProperty("--reveal-delay", `${Math.max(0, order) * 75}ms`);
          element.dataset.revealState = "pending";
          pending.add(element);
          observer.observe(element);
        }
        const hero = root.matches(".hero") ? root : root.querySelector(".hero");
        if (hero) observer.observe(hero);
      }
      scheduleProgress();
    };

    const showFocusedElement = (event) => {
      const element = event.target.closest?.('[data-reveal-state="pending"]');
      if (element) {
        reveal(element);
        observer?.unobserve(element);
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) {
        for (const element of pending) {
          reveal(element);
          observer?.unobserve(element);
        }
        document.querySelectorAll(".hero").forEach(hero => { hero.dataset.motionActive = "false"; });
      } else {
        if (main) prepare(main);
        document.querySelectorAll(".hero").forEach(hero => observer?.observe(hero));
      }
    };

    if (main) prepare(main);
    if (footer) prepare(footer);
    // App Router can replace catalog content without remounting the root layout.
    const mutations = new MutationObserver((records) => {
      for (const record of records) for (const node of record.addedNodes) prepare(node);
      for (const element of pending) {
        if (!element.isConnected) {
          pending.delete(element);
          observer?.unobserve(element);
        }
      }
    });
    if (main) mutations.observe(main, { childList: true, subtree: true });
    const resize = "ResizeObserver" in window ? new ResizeObserver(scheduleProgress) : null;
    if (main) resize?.observe(main);
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    document.addEventListener("focusin", showFocusedElement);
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      resize?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      document.removeEventListener("focusin", showFocusedElement);
      preference.removeEventListener("change", onPreferenceChange);
      document.querySelectorAll("[data-reveal-state]").forEach(element => {
        delete element.dataset.revealState;
        element.style.removeProperty("--reveal-delay");
      });
      document.querySelectorAll("[data-motion-active]").forEach(element => { delete element.dataset.motionActive; });
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}
