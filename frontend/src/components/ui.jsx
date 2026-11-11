import { useLayoutEffect, useEffect, useRef } from "react";
import { gsap } from "../lib/smooth.js";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Fades/slides children in as they enter the viewport. */
export function Reveal({ as: Tag = "div", children, className = "", delay = 0, y = 40, stagger = 0, ...rest }) {
  const ref = useRef(null);
  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const targets = stagger ? el.children : el;
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger]);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** Editorial section header: (01) — LABEL, then a big title. */
export function SectionHead({ label, title, aside, className = "" }) {
  return (
    <div className={`wrap mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end ${className}`}>
      <Reveal className="md:col-span-8">
        {label && <p className="label mb-6">{label}</p>}
        <h2 className="display text-balance text-[15vw] sm:text-[11vw] md:text-[7.2vw] xl:text-[6.875rem]">{title}</h2>
      </Reveal>
      {aside && (
        <Reveal delay={0.15} className="text-lg leading-relaxed text-bone-dim md:col-span-4 md:pb-3">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

export function Monogram({ name, className = "" }) {
  const initials = name
    .replace(/^(Dr\.|Mr\.|Ms\.|Br\.)\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w-[0])
    .join("");
  return (
    <div className={`flex items-center justify-center bg-ink-700 font-display text-5xl text-bone/25 ${className}`} aria-hidden>
      {initials}
    </div>
  );
}
