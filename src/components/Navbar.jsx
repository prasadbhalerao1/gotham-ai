/*
 * KEY CHANGES:
 * 1. Integrated react-intersection-observer for robust section detection
 * 2. Improved glass morphism effect with better contrast and readability
 * 3. Enhanced active state highlighting for navigation links
 * 4. Refined background transitions between sections
 * 5. Added professional entrance animations with proper easing
 */

import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useInView } from "react-intersection-observer";

import Button from "./Button";
import { Link } from "react-router-dom";

const navItems = ["Event", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.3 });
  const { ref: eventsRef, inView: eventsInView } = useInView({ threshold: 0.3 });
  const { ref: aboutRef, inView: aboutInView } = useInView({ threshold: 0.3 });
  const { ref: contactRef, inView: contactInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (contactInView) {
      setActiveSection('contact');
    } else if (aboutInView) {
      setActiveSection('about');
    } else if (eventsInView) {
      setActiveSection('events');
    } else if (heroInView) {
      setActiveSection('home');
    }
  }, [heroInView, eventsInView, aboutInView, contactInView]);

  useEffect(() => {
    const sections = {
      hero: document.querySelector('.hero-section-marker'),
      events: document.getElementById('events'),
      about: document.getElementById('about'),
      contact: document.getElementById('contact'),
    };

    if (sections.hero && !sections.hero.hasAttribute('data-observer-attached')) {
      heroRef(sections.hero);
      sections.hero.setAttribute('data-observer-attached', 'true');
    }
    if (sections.events && !sections.events.hasAttribute('data-observer-attached')) {
      eventsRef(sections.events);
      sections.events.setAttribute('data-observer-attached', 'true');
    }
    if (sections.about && !sections.about.hasAttribute('data-observer-attached')) {
      aboutRef(sections.about);
      sections.about.setAttribute('data-observer-attached', 'true');
    }
    if (sections.contact && !sections.contact.hasAttribute('data-observer-attached')) {
      contactRef(sections.contact);
      sections.contact.setAttribute('data-observer-attached', 'true');
    }
  }, []);

  useEffect(() => {
    if (!navContainerRef.current) return;

    navContainerRef.current.classList.remove("home-nav", "floating-nav", "events-nav", "about-nav", "contact-nav");

    if (activeSection === 'home') {
      navContainerRef.current.classList.add("home-nav");
    } else {
      navContainerRef.current.classList.add("floating-nav");
      if (activeSection === 'events') {
        navContainerRef.current.classList.add("events-nav");
      } else if (activeSection === 'about') {
        navContainerRef.current.classList.add("about-nav");
      } else if (activeSection === 'contact') {
        navContainerRef.current.classList.add("contact-nav");
      }
    }
  }, [activeSection]);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (!navContainerRef.current) return;
    gsap.fromTo(
      navContainerRef.current,
      { y: -20, opacity: 0, filter: "blur(4px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "expo.out" }
    );
    gsap.from(".nav-item-enhanced", {
      y: -8,
      opacity: 0,
      stagger: 0.06,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-2 sm:inset-x-4 top-2 sm:top-4 z-50 h-14 sm:h-16 border-none transition-all duration-700 ease-out rounded-xl will-change-transform nav-3d"
      style={{
        transform: 'translateZ(0)',
      }}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-3 sm:px-4 py-2">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Gotham AI Home"
              className="focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded-lg p-1"
            >
              <img src="/img/logo.png" alt="Gotham AI Logo" className="w-8 sm:w-10 cursor-pointer hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

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
                    className={`nav-hover-btn nav-item-enhanced nav-link-3d focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded px-2 py-1 transition-all duration-300 ${isActive ? 'text-yellow-300 font-extrabold scale-110' : 'text-blue-50/90 font-semibold'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      let elementId = item.toLowerCase();

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

            <button
              onClick={() => {}}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={toggleAudioIndicator}
              className="ml-3 sm:ml-10 flex items-center space-x-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded p-1 hover:scale-110 transition-transform duration-300"
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
