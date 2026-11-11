import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export async function startSmoothScroll() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const { default: Lenis } = await import("lenis");
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  // `force` so it still works while scrolling is locked (e.g. menu closing)
  if (lenis) {
    lenis.resize(); // the page may have just changed height (route change)
    lenis.scrollTo(el ?? 0, { offset: 0, duration: 1.4, force: true, ...opts });
  }
  else if (el) el.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth" });
  else window.scrollTo({ top: 0, behavior: opts.immediate ? "auto" : "smooth" });
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export { gsap, ScrollTrigger };
