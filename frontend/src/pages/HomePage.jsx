import { useEffect, useRef, lazy, Suspense } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import Hero from "../components/Hero.jsx";
import SEO from "../components/SEO.jsx";

const Events = lazy(() => import("../components/Events.jsx"));
const About = lazy(() => import("../components/About.jsx"));
const Contact = lazy(() => import("../components/Contact.jsx"));

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Official Lenis + GSAP integration pattern:
    // 1. ScrollTrigger updates ONLY when Lenis detects actual scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis from GSAP's ticker (keeps them perfectly in sync)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 3. Prevent GSAP from compensating for frame drops (causes jank with Lenis)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <SEO
        title="Gotham AI"
        description="Join Gotham AI (Versanix Community) at JSPM RSCOE. Led by Prasad Bhalerao, we are the ultimate hub for AI/ML, Deep Learning, and CSBS innovation at Rajarshi Shahu College Of Engineering."
        keywords="Gotham AI, Gotham Club, RSCOE, JSPM, Rajarshi Shahu College Of Engineering, Versanix, Prasad Bhalerao, AI Club, CSBS, Deep Learning, AIML, IIT Tathawade, Gautam AI, Versanix Community"
      />
      <div className="hero-section-marker">
        <Hero />
      </div>
      <Suspense fallback={null}>
        <Events />
        <About />
        <Contact />
      </Suspense>
    </>
  );
};

export default HomePage;
