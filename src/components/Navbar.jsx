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
        navContainerRef.current.classList.remove("floating-nav", "events-nav", "about-nav", "contact-nav");
      } else if (scrollY >= eventsTop && scrollY < aboutTop) {
        setActiveSection('events');
        navContainerRef.current.classList.add("floating-nav", "events-nav");
        navContainerRef.current.classList.remove("about-nav", "contact-nav");
      } else if (scrollY >= aboutTop && scrollY < contactTop) {
        setActiveSection('about');
        navContainerRef.current.classList.add("floating-nav", "about-nav");
        navContainerRef.current.classList.remove("events-nav", "contact-nav");
      } else {
        setActiveSection('contact');
        navContainerRef.current.classList.add("floating-nav", "contact-nav");
        navContainerRef.current.classList.remove("events-nav", "about-nav");
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentScrollY]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 sm:bg-transparent sm:rounded-none bg-black/80 rounded-lg backdrop-blur-md"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/img/logo.png" alt="logo" className="w-10 cursor-pointer" />
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
            <div className="flex md:block">
              {navItems.map((item, index) => {
                const isActive = (item === "Event" && activeSection === "events") ||
                               (item === "About" && activeSection === "about") ||
                               (item === "Contact" && activeSection === "contact");
                
                return (
                  <a
                    key={index}
                    href={`/#${item.toLowerCase()}`}
                    className={`nav-hover-btn ${isActive ? 'text-yellow-300 font-semibold' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      let elementId = item.toLowerCase();
                      
                      // Handle special case for Event button
                      if (item === "Event") {
                        elementId = "events";
                      }
                      
                      const element = document.getElementById(elementId);
                      console.log('Looking for element with ID:', elementId);
                      console.log('Found element:', element);
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

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
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
