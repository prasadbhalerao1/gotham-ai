import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// The city with the power out: a couple of windows flicker until the visitor clicks
// to restore it, then the lights and the moon come back.
const NotFoundPage = ({ what = "page" }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("../three/gothamScene.js")
      .then(({ createGothamScene }) => {
        if (cancelled) return;
        sceneRef.current = createGothamScene(canvasRef.current, { reducedMotion: reduced, blackout: true });
      })
      .catch(() => {
        // no WebGL: the plain page still works
      });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const restore = (e) => {
    if (restored || e.target.closest("a, button")) return;
    setRestored(true);
    sceneRef.current?.start();
  };

  return (
    <section onPointerDown={restore} className="relative flex min-h-[100svh] cursor-pointer flex-col overflow-hidden bg-ink pt-24">
      <Helmet>
        <title>Signal lost | Gotham AI</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <div className="wrap relative z-10 cursor-auto">
        <p className="label mb-6 text-signal">Error 404</p>
        <h1 className="display text-[22vw] md:text-[14vw]">
          Signal <span className="accent">lost</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-bone-dim">We couldn&apos;t find that {what}. It may have moved, or never existed.</p>
        <Link to="/" className="btn-signal mt-10">
          Back to Gotham →
        </Link>
      </div>

      <p aria-live="polite" className="label relative z-10 mt-auto pb-8 text-center">
        {restored ? "Power restored" : "The city's power is out · click anywhere to restore it"}
      </p>
    </section>
  );
};

export default NotFoundPage;
