import { useEffect, useRef, useState } from "react";
import { markEntered, setIntroProgress, shouldShowIntro } from "../lib/intro.js";
import { lockScroll } from "../lib/smooth.js";

const MIN_MS = 2600;

/** First-visit intro: the loader is the city powering up. The overlay is see-through,
 *  its progress switches the hero city on window by window (see Hero), and at 100 the
 *  counter fades as "Gotham AI" rises into the same spot. */
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
      setIntroProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // once loaded, hold a beat on the lit city, then hand over to the hero
  useEffect(() => {
    if (progress < 1 || leaving) return;
    const id = setTimeout(() => {
      setLeaving(true);
      lockScroll(false);
      markEntered();
      setTimeout(() => setShow(false), 800);
    }, 350);
    return () => clearTimeout(id);
  }, [progress, leaving]);

  if (!show) return null;

  const pct = String(Math.round(progress * 100)).padStart(3, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Gotham AI"
      className={`fixed inset-0 z-[90] flex flex-col text-bone transition-opacity duration-700 ${leaving ? "opacity-0" : ""}`}
    >
      <div className="wrap flex flex-1 flex-col pb-8 pt-24 md:pb-10 md:pt-28">
        {/* sits where the wordmark lands, so the number hands over to "Gotham AI" */}
        <div className="mt-auto mb-[7.5rem] md:mb-[6.5rem]">
          <p className="label mb-3">Powering up the city</p>
          <p className="display text-[19.5vw] tabular-nums leading-[0.82] text-bone/90 [font-feature-settings:'tnum'] 2xl:text-[18rem]" aria-live="off">
            {pct}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
