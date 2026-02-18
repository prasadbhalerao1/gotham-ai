import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const About = () => {
  const headerRef = useRef(null);
  const subtextRef = useRef(null);

  useGSAP(() => {
    // Text entrance animations (work on all devices)
    gsap.fromTo(
      headerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      subtextRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: subtextRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Same animation for all devices - pin animation with clip expansion
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power1.inOut", // Smoother ease for mobile
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div
        ref={headerRef}
        className="relative mb-8 mt-20 flex flex-col items-center gap-5 px-4 sm:mt-36"
      >
        <p className="text-center font-general text-sm uppercase tracking-wider text-gray-600 md:text-[10px]">
          Welcome to Gotham AI
        </p>

        <AnimatedTitle
          title="Expl<b>o</b>re the future of <br /> <b>A</b>I together"
          containerClass="mt-8 sm:mt-16 !text-black text-center"
        />

        <div ref={subtextRef} className="about-subtext">
          <p className="text-center font-semibold text-gray-900">
            The Era of Intelligence begins — your journey into AI starts here
          </p>
          <p className="text-center text-gray-600">
            Gotham AI unites learners, creators, and innovators to explore the
            world of artificial intelligence, building skills, projects, and the
            future together.
          </p>
          <p className="mt-4 text-center text-sm italic text-gray-500">
            in collaboration with Versanix Technologies
          </p>
        </div>
      </div>

      <div
        className="h-screen w-screen flex items-center justify-center relative"
        id="clip"
      >
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
