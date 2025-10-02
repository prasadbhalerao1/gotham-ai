import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";
import { Link } from "react-router-dom";

const navItems = ["Event", "About", "Contact"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [activeSection, setActiveSection] = useState('home');

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  // Make navbar always visible with floating effect when scrolled and change colors based on section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Define section positions
      const heroHeight = windowHeight; // Hero section height
      const eventsSection = document.getElementById('events');
      const aboutSection = document.getElementById('about');
      const contactSection = document.getElementById('contact');
      
      // Calculate section positions
      const eventsTop = eventsSection ? eventsSection.offsetTop - 100 : heroHeight;
      const aboutTop = aboutSection ? aboutSection.offsetTop - 100 : heroHeight + 1000;
      const contactTop = contactSection ? contactSection.offsetTop - 100 : heroHeight + 2000;
      
      // Determine active section based on scroll position
      if (scrollY < eventsTop) {
        setActiveSection('home');
        navContainerRef.current.classList.add("home-nav");
        navContainerRef.current.classList.remove("floating-nav", "events-nav", "about-nav", "contact-nav");
      } else if (scrollY >= eventsTop && scrollY < aboutTop) {
        setActiveSection('events');
        navContainerRef.current.classList.remove("home-nav");
        navContainerRef.current.classList.add("floating-nav", "events-nav");
        navContainerRef.current.classList.remove("about-nav", "contact-nav");
      } else if (scrollY >= aboutTop && scrollY < contactTop) {
        setActiveSection('about');
        navContainerRef.current.classList.remove("home-nav");
        navContainerRef.current.classList.add("floating-nav", "about-nav");
        navContainerRef.current.classList.remove("events-nav", "contact-nav");
      } else {
        setActiveSection('contact');
        navContainerRef.current.classList.remove("home-nav");
        navContainerRef.current.classList.add("floating-nav", "contact-nav");
        navContainerRef.current.classList.remove("events-nav", "about-nav");
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentScrollY]);

  // Subtle entrance animation for navbar container and links
  useEffect(() => {
    if (!navContainerRef.current) return;
    gsap.fromTo(
      navContainerRef.current,
      { y: -20, opacity: 0, filter: "blur(4px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }
    );
    gsap.from(".nav-item-enhanced", {
      y: -6,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      delay: 0.1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-2 sm:inset-x-4 top-2 sm:top-4 z-50 h-14 sm:h-16 border-none transition-all duration-700 ease-out rounded-xl will-change-transform nav-3d"
      style={{
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-3 sm:px-4 py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Gotham AI Home"
              className="focus:outline-none focus:ring-2 focus:ring-purple-300/50 rounded-lg p-1"
            >
              <img src="/img/logo.png" alt="Gotham AI Logo" className="w-8 sm:w-10 cursor-pointer" />
            </Link>

            {/* <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            /> */}
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden sm:flex">
              {navItems.map((item, index) => {
                const isActive = (item === "Event" && activeSection === "events") ||
                               (item === "About" && activeSection === "about") ||
                               (item === "Contact" && activeSection === "contact");
                
                return (
                  <a
                    key={index}
                    href={`/#${item.toLowerCase()}`}
                    className={`nav-hover-btn nav-item-enhanced nav-link-3d focus:outline-none focus:ring-2 focus:ring-purple-300/50 rounded px-2 py-1 ${isActive ? 'text-yellow-300 font-extrabold' : 'text-blue-50/90 font-semibold'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      let elementId = item.toLowerCase();
                      
                      // Handle special case for Event button
                      if (item === "Event") {
                        elementId = "events";
                      }
                      
                      const element = document.getElementById(elementId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                // Toggle mobile menu - you can implement this later
              }}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={toggleAudioIndicator}
              className="ml-3 sm:ml-10 flex items-center space-x-0.5 focus:outline-none focus:ring-2 focus:ring-purple-300/50 rounded p-1"
              aria-label={`${isAudioPlaying ? 'Pause' : 'Play'} background music`}
              role="button"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
