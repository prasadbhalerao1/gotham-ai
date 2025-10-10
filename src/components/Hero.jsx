/*
 * KEY CHANGES:
 * 1. Removed clipPath scroll animation - replaced with elegant scale-down and fade-out effect
 * 2. Eliminated video popup card - implemented automatic timer-based crossfade transitions
 * 3. Added professional 3D parallax effect on mouse movement for heading and button
 * 4. Smooth transitions between videos using opacity fade
 * 5. Professional easing functions (expo.out, power2.out) for natural animations
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const totalVideos = 4;
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const heroContainerRef = useRef(null);
  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos) {
      setLoading(false);
    }
  }, [loadedVideos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (nextVideoRef.current && currentVideoRef.current) {
      nextVideoRef.current.src = getVideoSrc(currentIndex);
      nextVideoRef.current.load();
      nextVideoRef.current.play();

      gsap.timeline()
        .to(currentVideoRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        })
        .to(
          nextVideoRef.current,
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
              if (currentVideoRef.current && nextVideoRef.current) {
                currentVideoRef.current.src = nextVideoRef.current.src;
                currentVideoRef.current.play();
                gsap.set(currentVideoRef.current, { opacity: 1 });
                gsap.set(nextVideoRef.current, { opacity: 0 });
              }
            },
          },
          "<"
        );
    }
  }, [currentIndex, loading]);

  useGSAP(() => {
    gsap.to(heroContainerRef.current, {
      scale: 0.85,
      opacity: 0.3,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: heroContainerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth - 0.5) * 30;
    const y = (clientY / innerHeight - 0.5) * 30;

    setMousePosition({ x, y });
  };

  useEffect(() => {
    if (headingRef.current) {
      gsap.to(headingRef.current, {
        x: -mousePosition.x,
        y: -mousePosition.y,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: -mousePosition.x * 0.5,
        y: -mousePosition.y * 0.5,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div
      className="relative h-dvh w-screen overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-black">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        ref={heroContainerRef}
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black"
      >
        <video
          ref={currentVideoRef}
          src={getVideoSrc(1)}
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        <video
          ref={nextVideoRef}
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center opacity-0"
          onLoadedData={handleVideoLoad}
        />

        {[2, 3, 4].map((index) => (
          <video
            key={index}
            src={getVideoSrc(index)}
            preload="metadata"
            className="hidden"
            onLoadedData={handleVideoLoad}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10" />

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 sm:mt-32 px-4 sm:px-5 md:px-10">
            <h1
              ref={headingRef}
              className="special-font hero-heading text-blue-100 mb-4 sm:mb-6"
              style={{ willChange: 'transform' }}
            >
              Gotham AI
            </h1>

            <p className="mb-6 sm:mb-8 max-w-xs sm:max-w-sm md:max-w-64 font-robert-regular text-blue-100 text-sm sm:text-base leading-relaxed">
              Where Minds Meet Machines <br /> The AI Playground for Visionaries
            </p>

            <div ref={buttonRef} style={{ willChange: 'transform' }}>
              <Button
                id="enter-now"
                title="Enter Now"
                onClick={() => (window.location.href = "https://google.com")}
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1 text-sm sm:text-base px-6 sm:px-7 py-2 sm:py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
