import { useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import Hero from '../components/Hero';
import SEO from '../components/SEO';

const Events = lazy(() => import('../components/Events'));
const About = lazy(() => import('../components/About'));
const Contact = lazy(() => import('../components/Contact'));

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
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
