import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, lockScroll } from "../lib/smooth.js";

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

// Repeating bento rhythm for the board (4-column grid on desktop).
const SPANS = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];
// deterministic tilt per tile so server and client render the same thing
const tilt = (i) => [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9, -1.9][i % 7];

/** A photo board with settle-in motion, hover lift and a keyboard lightbox. */
const Gallery = ({ items, title }) => {
  const [open, setOpen] = useState(-1);
  const board = useRef(null);
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-tile]").forEach((el, i) => {
        gsap.from(el, {
          y: 90,
          rotate: tilt(i) * 4,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          clearProps: "transform,opacity", // hand back to the CSS tilt/hover
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, board);
    return () => ctx.revert();
  }, [items]);

  useEffect(() => {
    if (open < 0) return;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  return (
    <>
      <div ref={board} className="grid auto-rows-[44vw] grid-cols-2 gap-3 md:auto-rows-[15vw] md:grid-cols-4 md:gap-4 xl:auto-rows-[220px]">
        {items.map((src, i) => (
          <button
            key={src}
            type="button"
            data-tile
            onClick={() => setOpen(i)}
            style={{ "--tilt": `${tilt(i)}deg` }}
            className={`group relative overflow-hidden bg-ink-700 outline-offset-4 transition-[transform,box-shadow] duration-700 ease-expo [transform:rotate(var(--tilt))] hover:z-10 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] hover:[transform:rotate(0deg)_scale(1.03)] ${
              items.length === 1 ? "col-span-2 row-span-2 md:col-span-4 md:row-span-3" : i === 0 ? "col-span-2 row-span-2" : ""
            } ${items.length === 1 ? "" : SPANS[i % SPANS.length]}`}
            aria-label={`Open ${isVideo(src) ? "video" : "photo"} ${i + 1} of ${items.length}`}
          >
            {isVideo(src) ? (
              <>
                <video src={`${src}#t=0.5`} muted playsInline preload="metadata" className="size-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                  <span className="flex size-14 items-center justify-center rounded-full bg-signal pl-1 text-ink transition-transform duration-500 group-hover:scale-110">
                    ▶
                  </span>
                </span>
              </>
            ) : (
              <img
                src={src}
                alt={`${title} — photo ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
              />
            )}
            <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-bone opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open >= 0 && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur"
            onClick={close}
          >
            <div className="wrap flex items-center justify-between py-4" onClick={(e) => e.stopPropagation()}>
              <span className="label">
                {String(open + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={close}
                autoFocus
                aria-label="Close gallery"
                className="flex size-11 items-center justify-center rounded-full border border-bone/20 text-xl hover:border-bone"
              >
                ×
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 md:px-20">
              {isVideo(items[open]) ? (
                <video key={items[open]} src={items[open]} controls autoPlay playsInline className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()} />
              ) : (
                <motion.img
                  key={items[open]}
                  src={items[open]}
                  alt={`${title} — photo ${open + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-h-full max-w-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {items.length > 1 && (
                <>
                  <button type="button" aria-label="Previous" onClick={(e) => (e.stopPropagation(), step(-1))} className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-bone/20 bg-ink/60 hover:border-bone md:left-6">
                    ←
                  </button>
                  <button type="button" aria-label="Next" onClick={(e) => (e.stopPropagation(), step(1))} className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-bone/20 bg-ink/60 hover:border-bone md:right-6">
                    →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
