import { useEffect, useRef, useState } from "react";
import { MARK_DOT, MARK_PATH, MARK_STROKE } from "../lib/mark.js";
import { markEntered, shouldShowIntro } from "../lib/intro.js";
import { lockScroll } from "../lib/smooth.js";

const MIN_MS = 1800;

/** First-visit intro: the mark draws itself while assets load, then the page
 *  opens on its own. */
const Intro = () => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const target = useRef(0);

  useEffect(() => {
    if (!shouldShowIntro()) return;
    setShow(true);
    lockScroll(true);
    const t0 = performance.now();
    const tasks = [
      document.fonts?.ready,
      import("../three/gothamScene.js"),
      new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }))),
    ].filter(Boolean);
    let done = 0;
    tasks.forEach((p) => Promise.resolve(p).finally(() => (target.current = ++done / tasks.length)));

    let raf;
    let p = 0;
    const tick = (t) => {
      // never faster than MIN_MS, never ahead of real loading
      const cap = Math.min(1, (t - t0) / MIN_MS);
      p += (Math.min(target.current, cap) - p) * 0.12;
      if (p > 0.995) p = 1;
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // once loaded, hold a beat on the finished mark, then open
  useEffect(() => {
    if (progress < 1 || leaving) return;
    const id = setTimeout(() => {
      setLeaving(true);
      lockScroll(false);
      markEntered();
      setTimeout(() => setShow(false), 1100);
    }, 450);
    return () => clearTimeout(id);
  }, [progress, leaving]);

  if (!show) return null;

  const pct = String(Math.round(progress * 100)).padStart(3, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Gotham AI"
      // no clip/transform while counting (keeps text on the crisp, non-composited
      // path); the slide-away transition is only attached when leaving
      className={`fixed inset-0 z-[90] flex flex-col bg-ink text-bone ${leaving ? "-translate-y-full transition-transform duration-1000 ease-expo" : ""}`}
    >
      <div className="wrap flex items-center justify-between pt-6">
        <span className="label">Gotham AI</span>
        <span className="label">JSPM&apos;s RSCOE · Pune</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <svg viewBox="140 120 740 740" className="w-28 md:w-36" shapeRendering="geometricPrecision" aria-hidden>
          <path
            d={MARK_PATH}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth={MARK_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset={1 - Math.min(1, progress * 1.15)}
          />
          <circle
            {...MARK_DOT}
            className="fill-signal transition-transform duration-700 ease-expo"
            style={{ transformOrigin: `${MARK_DOT.cx}px ${MARK_DOT.cy}px`, transform: `scale(${progress > 0.85 ? 1 : 0})` }}
          />
        </svg>

        <div className="text-center">
          <p className="display text-7xl tabular-nums leading-none text-bone [font-feature-settings:'tnum'] md:text-8xl" aria-live="off">
            {pct}
          </p>
          <p className="label mt-4">Loading</p>
        </div>
      </div>

      <div className="wrap pb-6">
        <div className="h-px w-full bg-bone/10">
          <div className="h-px origin-left bg-signal" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </div>
  );
};

export default Intro;
