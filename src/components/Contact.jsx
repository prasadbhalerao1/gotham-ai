/*
 * KEY CHANGES:
 * 1. Added smooth entrance animations with professional easing
 * 2. Enhanced button hover states for tactile feedback
 * 3. Improved overall polish with refined transitions
 * 4. Added fade-in effects for background images
 */

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} alt="" />
  </div>
);

const Contact = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      contentRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  return (
    <div id="contact" className="my-10 sm:my-20 min-h-96 w-screen px-4 sm:px-10">
      <div
        ref={containerRef}
        className="relative rounded-lg bg-black py-12 sm:py-16 md:py-24 text-blue-50 overflow-hidden"
      >
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96 opacity-30 sm:opacity-100">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80 opacity-30 sm:opacity-100">
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div ref={contentRef} className="flex flex-col items-center text-center relative z-10 px-4">
          <p className="mb-6 sm:mb-10 font-general text-[10px] sm:text-xs uppercase tracking-wider">
            Join Gotham
          </p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> intell<b>i</b>gence t<b>o</b>gether."
            className="special-font w-full font-zentry font-black text-3xl sm:text-4xl md:text-6xl lg:!text-[6.2rem] !leading-[1.1] sm:!leading-[1.05] md:!leading-[.9] max-w-4xl"
          />

          <Button
            title="contact us"
            containerClass="mt-6 sm:mt-10 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
