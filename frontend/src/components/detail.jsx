// Building blocks shared by event and project pages, so both read as one system.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, scrollToTarget } from "../lib/smooth.js";
import { Reveal } from "./ui.jsx";

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2">
      <Link to="/" className="hover:text-bone">
        Gotham AI
      </Link>
      {items.map((c) => (
        <span key={c.label} className="flex items-center gap-2">
          <span aria-hidden className="text-bone/20">
            /
          </span>
          {c.to ? (
            <Link to={c.to} className="hover:text-bone">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-bone-dim">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Chip({ children, tone = "default", className = "" }) {
  const tones = {
    default: "border-bone/20 text-bone-dim",
    signal: "border-signal/60 text-signal",
    solid: "border-signal bg-signal text-ink",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Image that drifts slightly against the scroll — the page's macro motion. */
export function ParallaxImage({ src, alt = "", className = "", amount = 8 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const img = ref.current.querySelector("img");
    const t = gsap.fromTo(
      img,
      { yPercent: -amount, scale: 1.12 },
      { yPercent: amount, scale: 1.12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
    );
    return () => t.scrollTrigger?.kill();
  }, [amount]);
  return (
    <div ref={ref} className={`overflow-hidden bg-ink-700 ${className}`}>
      <img src={src} alt={alt} className="size-full object-cover" decoding="async" />
    </div>
  );
}

/** Key facts in a hairline grid. `items` = [[label, value], …] (falsy entries skipped). */
export function MetaStrip({ items }) {
  const list = items.filter(Boolean);
  return (
    <Reveal stagger={0.05} as="dl" className="grid grid-cols-2 border-y border-bone/10 sm:grid-cols-3 lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr">
      {list.map(([k, v]) => (
        <div key={k} className="border-bone/10 py-5 pr-4 [&:not(:last-child)]:lg:border-r lg:px-5 lg:first:pl-0">
          <dt className="label">{k}</dt>
          <dd className="mt-2 text-lg leading-snug text-bone">{v}</dd>
        </div>
      ))}
    </Reveal>
  );
}

/** Sticky in-page navigation that tracks which section is on screen. */
export function SectionTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id);
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tabs]);
  if (tabs.length < 2) return null;
  return (
    <div className="sticky top-0 z-30 border-b border-bone/10 bg-ink/80 backdrop-blur-md">
      <nav aria-label="On this page" className="wrap flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(`#${t.id}`, { offset: -70 });
            }}
            aria-current={active === t.id ? "true" : undefined}
            className={`relative shrink-0 rounded-full px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
              active === t.id ? "bg-bone text-ink" : "text-bone-dim hover:text-bone"
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-2 opacity-50">{t.count}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function Block({ id, label, title, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div className="wrap">
        <div className="mb-10 flex items-baseline justify-between gap-6 border-b border-bone/10 pb-5 md:mb-14">
          <h2 id={`${id}-title`} className="display text-5xl md:text-6xl">
            {title}
          </h2>
          {label && <span className="label shrink-0">{label}</span>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Numbered statements — used for event highlights and project capabilities. */
export function NumberedList({ items, large = false }) {
  return (
    <Reveal as="ol" stagger={0.06} className={large ? "" : "grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2"}>
      {items.map((t, i) =>
        large ? (
          <li key={t} className="flex items-baseline gap-5 border-b border-bone/10 py-5 first:pt-0 md:gap-8">
            <span className="w-8 shrink-0 font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-2xl leading-snug text-bone md:text-[2rem] md:leading-[1.15]">{t}</span>
          </li>
        ) : (
          <li key={t} className="flex gap-4 bg-ink p-5 transition-colors duration-300 hover:bg-ink-800">
            <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-bone">{t}</span>
          </li>
        ),
      )}
    </Reveal>
  );
}

/** Renders the structured `sections` array from the data files. */
export function Sections({ sections }) {
  return (
    <div className="space-y-12">
      {sections.map((s) => (
        <Reveal key={s.title} className="grid gap-4 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-10">
          <h3 className="font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-bone-mute">{s.title}</h3>
          <div>
            {s.text && <p className="text-lg leading-relaxed text-bone-dim">{s.text}</p>}
            {s.items?.length > 0 && (
              <ul className={`space-y-3 ${s.text ? "mt-5" : ""}`}>
                {s.items.map((it) => (
                  <li key={it} className="relative pl-6 text-lg leading-relaxed text-bone-dim">
                    <span aria-hidden className="absolute left-0 top-[0.75em] h-px w-3 bg-signal" />
                    {it}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Big previous / next navigation at the end of a detail page. */
export function PrevNext({ prev, next, kind }) {
  const cell = (item, dir) =>
    item ? (
      <Link
        to={item.to}
        className={`group flex flex-col gap-4 p-8 transition-colors duration-500 hover:bg-ink-800 md:p-12 ${dir === "next" ? "md:items-end md:text-right" : ""}`}
      >
        <span className="label">{dir === "next" ? `Next ${kind} →` : `← Previous ${kind}`}</span>
        <span className="display text-4xl transition-colors duration-500 group-hover:text-signal md:text-6xl">{item.title}</span>
        {item.meta && <span className="font-mono text-xs text-bone-mute">{item.meta}</span>}
      </Link>
    ) : (
      <div className="hidden md:block" />
    );
  return (
    <nav aria-label={`More ${kind}s`} className="grid border-t border-bone/10 md:grid-cols-2 md:divide-x md:divide-bone/10">
      {cell(prev, "prev")}
      {cell(next, "next")}
    </nav>
  );
}
