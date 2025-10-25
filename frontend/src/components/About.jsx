/*
 * KEY CHANGES:
 * 1. Enhanced entrance animations with professional easing functions (expo.out)
 * 2. Improved scroll-triggered animations for smooth transitions
 * 3. Added subtle fade and scale effects for visual polish
 * 4. Refined timing for more natural user experience
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headerRef = useRef(null);
  const subtextRef = useRef(null);

  useGSAP(() => {
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
      }
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
      }
    );

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
      ease: "power2.inOut",
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div ref={headerRef} className="relative mb-8 mt-20 sm:mt-36 flex flex-col items-center gap-5 px-4">
        <p className="font-general text-sm uppercase md:text-[10px] text-center tracking-wider text-gray-600">
          Welcome to Gotham AI
        </p>

        <AnimatedTitle
          title="Expl<b>o</b>re the future of <br /> <b>A</b>I together"
          containerClass="mt-8 sm:mt-16 !text-black text-center"
        />

        <div ref={subtextRef} className="about-subtext">
          <p className="text-center font-semibold text-gray-900">The Era of Intelligence begins — your journey into AI starts here</p>
          <p className="text-gray-600 text-center">
            Gotham AI unites learners, creators, and innovators to explore the
            world of artificial intelligence, building skills, projects, and the
            future together.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
