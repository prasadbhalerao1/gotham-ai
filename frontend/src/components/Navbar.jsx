/*
 * KEY CHANGES:
 * 1. (Applied Fix) Added a smooth fade-and-slide animation to the mobile menu using GSAP.
 * 2. The menu panel is no longer conditionally rendered, allowing it to be animated.
 * 3. Used the `useGSAP` hook for clean, modern animation logic.
 */

import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import ContactModal from "./ContactModal";

const navItems = ["Event", "About", "Resources", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const menuPanelRef = useRef(null); // Ref for the mobile menu panel

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.3 });
  const { ref: eventsRef, inView: eventsInView } = useInView({ threshold: 0.3 });
  const { ref: aboutRef, inView: aboutInView } = useInView({ threshold: 0.3 });
  const { ref: contactRef, inView: contactInView } = useInView({ threshold: 0.3 });

  // GSAP animation for the mobile menu
  useGSAP(() => {
    gsap.set(menuPanelRef.current, { y: -20, opacity: 0, pointerEvents: 'none' });

    if (isMenuOpen) {
      gsap.to(menuPanelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
        pointerEvents: 'auto',
      });
    } else {
      gsap.to(menuPanelRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        pointerEvents: 'none',
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (contactInView) setActiveSection('contact');
    else if (aboutInView) setActiveSection('about');
    else if (eventsInView) setActiveSection('events');
    else if (heroInView) setActiveSection('home');
  }, [heroInView, eventsInView, aboutInView, contactInView]);

  useEffect(() => {
    const sections = {
      hero: document.querySelector('.hero-section-marker'),
      events: document.getElementById('events'),
      about: document.getElementById('about'),
      contact: document.getElementById('contact'),
    };
    if (sections.hero) heroRef(sections.hero);
    if (sections.events) eventsRef(sections.events);
    if (sections.about) aboutRef(sections.about);
    if (sections.contact) contactRef(sections.contact);
  }, [heroRef, eventsRef, aboutRef, contactRef]);

  useEffect(() => {
    if (!navContainerRef.current) return;
    const classList = navContainerRef.current.classList;
    classList.remove("home-nav", "floating-nav", "events-nav", "about-nav", "contact-nav");
    if (activeSection === 'home') classList.add("home-nav");
    else {
      classList.add("floating-nav");
      if (activeSection === 'events') classList.add("events-nav");
      else if (activeSection === 'about') classList.add("about-nav");
      else if (activeSection === 'contact') classList.add("contact-nav");
    }
  }, [activeSection]);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying(prev => !prev);
    setIsIndicatorActive(prev => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) audioElementRef.current.play();
    else audioElementRef.current.pause();
  }, [isAudioPlaying]);

  useEffect(() => {
    gsap.fromTo(
      navContainerRef.current,
      { y: -20, opacity: 0, filter: "blur(4px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "expo.out" }
    );
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (item === "Resources") {
      window.location.href = '/resources';
      return;
    }
    
    if (item === "Event") {
      window.location.href = '/events';
      return;
    }
    
    // For other items (About, Contact), scroll to section
    let elementId = item.toLowerCase();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = `/#${elementId}`;
      return;
    }
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-2 sm:inset-x-4 top-2 sm:top-4 z-50 h-14 sm:h-16 border-none transition-all duration-700 ease-out rounded-xl will-change-transform nav-3d"
    >
      <header className="relative w-full h-full flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMenuOpen(false);
            }}
            aria-label="Gotham AI Home"
            className="focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded-lg p-1"
          >
            <img src="/img/logo.png" alt="Gotham AI Logo" className="w-8 sm:w-10 cursor-pointer hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>

        <div className="flex h-full items-center">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex">
            {navItems.map((item) => {
              const isActive = (item === "Event" && location.pathname === "/events") ||
                             (item === "About" && activeSection === "about") ||
                             (item === "Resources" && location.pathname === "/resources") ||
                             (item === "Contact" && activeSection === "contact");
              return (
                <a
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  className={`nav-hover-btn nav-item-enhanced nav-link-3d focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded px-2 py-1 transition-all duration-300 ${isActive ? 'text-yellow-300 font-extrabold scale-110' : 'text-blue-50/90 font-semibold'}`}
                  onClick={(e) => handleLinkClick(e, item)}
                >
                  {item}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6H4" />
            </svg>
          </button>

          <button
            onClick={toggleAudioIndicator}
            className="ml-3 sm:ml-10 flex items-center space-x-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 rounded p-1 hover:scale-110 transition-transform duration-300"
            aria-label={`${isAudioPlaying ? 'Pause' : 'Play'} background music`}
            role="button"
          >
            <audio ref={audioElementRef} className="hidden" src="/audio/loop.mp3" loop />
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={clsx("indicator-line", { active: isIndicatorActive })}
                style={{ animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel (Now Animated) */}
      <div
        ref={menuPanelRef}
        className="sm:hidden absolute top-[64px] left-0 right-0 mx-2 p-4 rounded-lg bg-black/80 backdrop-blur-lg border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <nav>
          <ul className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-blue-50/90 hover:text-yellow-300 text-lg font-semibold py-2"
                  onClick={(e) => handleLinkClick(e, item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default NavBar;