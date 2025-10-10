/*
 * KEY CHANGES:
 * 1. Integrated Lenis smooth scrolling for premium user experience
 * 2. Added hero-section-marker for intersection observer detection
 * 3. Synced GSAP ScrollTrigger with Lenis for seamless animations
 * 4. Proper cleanup on component unmount
 */

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Contact from "./components/Contact";
import Events from "./components/Events";
import Footer from "./components/Footer";
import EventNotification from "./components/EventNotification";

gsap.registerPlugin(ScrollTrigger);

function App() {
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
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <EventNotification />
      <div className="hero-section-marker">
        <Hero />
      </div>
      <Events />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
