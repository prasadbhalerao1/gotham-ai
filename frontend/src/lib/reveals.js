// Site-wide scroll reveals, driven by data attributes so any page gets the
// same motion language without wiring animations by hand:
//
//   data-reveal="mask"   headings rise out of a mask
//   data-reveal="image"  photo frames open like a window; the photo settles in
//   data-reveal="rise"   cards / rows rise in, staggered with their neighbours
//   data-reveal="line"   hairlines draw themselves across
//
// Content is fully visible in the prerendered HTML; initial states are only set
// here, on the client, and skipped entirely for reduced-motion users.
import { gsap, ScrollTrigger } from "./smooth.js";

const EASE = "expo.out";

export function initReveals(root = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const ctx = gsap.context(() => {
    const fresh = (sel) => gsap.utils.toArray(root.querySelectorAll(`${sel}:not([data-revealed])`));

    fresh('[data-reveal="mask"]').forEach((el) => {
      el.setAttribute("data-revealed", "");
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)", yPercent: 18 },
        {
          clipPath: "inset(0% 0% -10% 0%)",
          yPercent: 0,
          duration: 1.1,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          clearProps: "clipPath,transform",
        },
      );
    });

    fresh('[data-reveal="image"]').forEach((el) => {
      el.setAttribute("data-revealed", "");
      const media = el.querySelector("img, video");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.fromTo(
        el,
        { clipPath: "inset(5% 5% 5% 5% round 1rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1.2, ease: EASE, clearProps: "clipPath" },
      );
      if (media) tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: EASE, clearProps: "transform" }, 0);
    });

    const rise = fresh('[data-reveal="rise"]');
    rise.forEach((el) => el.setAttribute("data-revealed", ""));
    if (rise.length) {
      gsap.set(rise, { opacity: 0, y: 24 });
      ScrollTrigger.batch(rise, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.06, clearProps: "opacity,transform" }),
      });
    }

    fresh('[data-reveal="line"]').forEach((el) => {
      el.setAttribute("data-revealed", "");
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: "0% 50%" },
        { scaleX: 1, duration: 1.4, ease: EASE, scrollTrigger: { trigger: el, start: "top 95%", once: true }, clearProps: "transform" },
      );
    });
  }, root);

  // lazy images change the layout as they arrive — re-measure trigger positions
  let pending = 0;
  const remeasure = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  root.addEventListener("load", remeasure, true); // capture: load doesn't bubble

  return () => {
    root.removeEventListener("load", remeasure, true);
    cancelAnimationFrame(pending);
    ctx.revert();
    root.querySelectorAll?.("[data-revealed]").forEach((el) => el.removeAttribute("data-revealed"));
  };
}
