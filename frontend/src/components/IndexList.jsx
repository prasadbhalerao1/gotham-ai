import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/smooth.js";

/**
 * Large numbered rows (events, projects). On pointer devices a preview image
 * follows the cursor; on touch each row shows a thumbnail instead.
 * rows: [{ key, to, num, title, sub, tags: [], right, image, plate }]
 */
const IndexList = ({ rows, label }) => {
  const wrap = useRef(null);
  const preview = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = preview.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
    const onMove = (e) => {
      const r = wrap.current.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const node = wrap.current;
    node.addEventListener("pointermove", onMove);
    return () => node.removeEventListener("pointermove", onMove);
  }, []);

  const current = rows.find((r) => r.key === hovered);

  return (
    <div ref={wrap} className="relative" onPointerLeave={() => setHovered(null)}>
      <ol aria-label={label} className="border-t border-bone/10">
        {rows.map((r) => (
          <li key={r.key}>
            <Link
              to={r.to}
              onPointerEnter={() => setHovered(r.key)}
              onFocus={() => setHovered(r.key)}
              className={`group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 border-b border-bone/10 py-6 transition-colors duration-500 md:grid-cols-[4rem_1fr_auto] md:py-8 ${
                hovered && hovered !== r.key ? "md:opacity-40" : ""
              }`}
            >
              <span className="row-span-2 font-mono text-xs text-bone-mute transition-colors group-hover:text-signal md:row-span-1">
                <span className="mb-2 block size-16 overflow-hidden md:hidden">
                  {r.image ? <img src={r.image} alt="" loading="lazy" className="size-full object-cover" /> : <span className="flex size-full items-center justify-center bg-ink-700 text-bone-dim">{r.num}</span>}
                </span>
                <span className="hidden md:inline">{r.num}</span>
              </span>
              <span className="min-w-0">
                <span className="display block text-[8.5vw] leading-[0.9] transition-transform duration-700 ease-expo group-hover:translate-x-3 sm:text-5xl lg:text-6xl xl:text-7xl">
                  {r.title}
                </span>
                {r.sub && <span className="mt-2 block text-bone-dim">{r.sub}</span>}
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-bone-mute md:col-start-3 md:flex-col md:items-end md:text-right">
                {r.right}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* cursor preview (desktop) */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[opacity,transform] duration-500 ease-expo ${
            current ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <div className="h-[13.75rem] w-[18.75rem] bg-ink-700">
            {current?.image ? <img key={current.image} src={current.image} alt="" className="size-full object-cover" /> : current?.plate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexList;
