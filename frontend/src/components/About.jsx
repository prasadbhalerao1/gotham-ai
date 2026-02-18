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
  });

  return (
    <div id="about" className="w-screen pb-2">
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
    </div>
  );
};

export default About;
