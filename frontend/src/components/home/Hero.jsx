import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/smooth.js";
import { site, stats } from "../../data/site.js";
import { whenEntered } from "../../lib/intro.js";

const Hero = () => {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);

  // WebGL scene — loaded lazily, client only; its entrance waits for the intro gate
  useEffect(() => {
    let scene;
    let trigger;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("../../three/gothamScene.js")
      .then(({ createGothamScene }) => {
        if (cancelled) return;
        scene = createGothamScene(canvasRef.current, { reducedMotion: reduced, onReady: () => setSceneReady(true) });
        whenEntered().then(() => !cancelled && scene.start());
        trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => scene.setScroll(self.progress),
        });
      })
      .catch(() => {
        // no WebGL: the static glow stays
      });
    return () => {
      cancelled = true;
      trigger?.kill();
      scene?.dispose();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-hero-line]", { yPercent: 105, duration: 1.5, ease: "expo.out" }, 0.25);
      tl.from("[data-hero-fade]", { opacity: 0, y: 16, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.6);
      whenEntered().then(() => !cancelled && tl.play());
      gsap.to("[data-hero-type]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} aria-label="Gotham AI" className="relative flex min-h-[38.75rem] flex-col overflow-hidden bg-ink [height:100svh]">
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-[2000ms] ${sceneReady ? "opacity-0" : "opacity-100"}`}
        style={{ background: "#09090b" }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 size-full transition-opacity duration-[1800ms] ${sceneReady ? "opacity-100" : "opacity-0"}`}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <div className="wrap relative z-10 flex flex-1 flex-col pb-8 pt-24 md:pb-10 md:pt-28">
        <div data-hero-fade className="flex items-start justify-between gap-6">
          <p className="label">
            {site.institutionShort} · {site.city}
          </p>
          <p className="label hidden text-right md:block">Student AI community</p>
        </div>

        <div data-hero-type className="mt-auto">
          <p data-hero-fade className="mb-3 font-serif text-2xl italic text-bone-dim md:mb-1 md:text-4xl">
            {site.tagline.toLowerCase()}.
          </p>
          <h1 className="overflow-hidden">
            <span data-hero-line className="display block whitespace-nowrap text-[19.5vw] leading-[0.82] 2xl:text-[18rem]">
              Gotham <span className="text-signal">AI</span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 border-t border-bone/15 pt-6 md:mt-10 lg:flex-row lg:items-center lg:justify-between">
            <dl data-hero-fade className="grid grid-cols-4 gap-4 sm:flex sm:gap-10">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="order-2 mt-1 font-mono text-[0.6875rem] uppercase leading-tight tracking-[0.14em] text-bone-mute">{s.short}</dt>
                  <dd className="order-1 text-2xl font-semibold leading-none text-bone sm:text-3xl">
                    {s.value.toLocaleString("en-IN")}
                    {s.plus && <span className="text-signal">+</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <div data-hero-fade className="flex flex-wrap gap-3">
              <a href={site.joinForm} target="_blank" rel="noreferrer" className="btn-signal">
                Join the community <span aria-hidden>↗</span>
              </a>
              <Link to="/#events" className="btn-ghost">
                See events ↓
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
