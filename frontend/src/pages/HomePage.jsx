import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import Hero from "../components/Hero.jsx";
import SEO from "../components/SEO.jsx";
import Events from "../components/Events.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const isTouchOnly = window.matchMedia("(hover: none)").matches;
    if (isTouchOnly) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

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
      <Events />
      <About />
      <Contact />
    </>
  );
};

export default HomePage;
