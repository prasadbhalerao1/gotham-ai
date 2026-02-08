import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import ContactModal from "./ContactModal";

const navItems = ["Event", "Projects", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const menuPanelRef = useRef(null); // Ref for the mobile menu panel

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.3 });
  const { ref: eventsRef, inView: eventsInView } = useInView({
    threshold: 0.3,
  });
  const { ref: aboutRef, inView: aboutInView } = useInView({ threshold: 0.3 });
  const { ref: contactRef, inView: contactInView } = useInView({
    threshold: 0.3,
  });

  // GSAP animation for the mobile menu
  useGSAP(() => {
    gsap.set(menuPanelRef.current, {
      y: -20,
      opacity: 0,
      pointerEvents: "none",
    });

    if (isMenuOpen) {
      gsap.to(menuPanelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(menuPanelRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (contactInView) setActiveSection("contact");
    else if (aboutInView) setActiveSection("about");
    else if (eventsInView) setActiveSection("events");
    else if (heroInView) setActiveSection("home");
  }, [heroInView, eventsInView, aboutInView, contactInView]);

  useEffect(() => {
    const sections = {
      hero: document.querySelector(".hero-section-marker"),
      events: document.getElementById("events"),
      about: document.getElementById("about"),
      contact: document.getElementById("contact"),
    };
    if (sections.hero) heroRef(sections.hero);
    if (sections.events) eventsRef(sections.events);
    if (sections.about) aboutRef(sections.about);
    if (sections.contact) contactRef(sections.contact);
  }, [heroRef, eventsRef, aboutRef, contactRef]);

  useEffect(() => {
    if (!navContainerRef.current) return;
    const classList = navContainerRef.current.classList;
    classList.remove(
      "home-nav",
      "floating-nav",
      "events-nav",
      "about-nav",
      "contact-nav",
    );
    if (activeSection === "home") classList.add("home-nav");
    else {
      classList.add("floating-nav");
      if (activeSection === "events") classList.add("events-nav");
      else if (activeSection === "about") classList.add("about-nav");
      else if (activeSection === "contact") classList.add("contact-nav");
    }
  }, [activeSection]);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) audioElementRef.current.play();
    else audioElementRef.current.pause();
  }, [isAudioPlaying]);

  useEffect(() => {
    gsap.fromTo(
      navContainerRef.current,
      { y: -20, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "expo.out",
      },
    );
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (item === "Event") {
      window.location.href = "/events";
      return;
    }

    if (item === "Projects") {
      window.location.href = "/projects";
      return;
    }

    // For other items (About, Contact), scroll to section
    let elementId = item.toLowerCase();

    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      window.location.href = `/#${elementId}`;
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="nav-3d fixed inset-x-2 top-2 z-50 h-14 rounded-xl border-none transition-all duration-700 ease-out will-change-transform sm:inset-x-4 sm:top-4 sm:h-16"
    >
      <header className="relative flex size-full items-center justify-between px-3 sm:px-4">
        <div className="flex items-center">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMenuOpen(false);
            }}
            aria-label="Gotham AI Home"
            className="rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
          >
            <img
              src="/img/logo.jpg"
              alt="Gotham AI Logo"
              width="40"
              height="40"
              className="h-auto w-8 cursor-pointer transition-transform duration-300 hover:scale-110 sm:w-10"
            />
          </Link>
        </div>

        <div className="flex h-full items-center">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex">
            {navItems.map((item) => {
              const href =
                item === "Event"
                  ? "/events"
                  : item === "Projects"
                    ? "/projects"
                    : `/#${item.toLowerCase()}`;
              const isActive =
                (item === "Event" && location.pathname.startsWith("/events")) ||
                (item === "Projects" &&
                  location.pathname.startsWith("/projects")) ||
                (item === "About" && activeSection === "about") ||
                (item === "Contact" && activeSection === "contact");
              return (
                <a
                  key={item}
                  href={href}
                  className={`nav-hover-btn nav-item-enhanced nav-link-3d rounded px-2 py-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 ${isActive ? "scale-110 font-extrabold text-yellow-300" : "font-semibold text-blue-50/90"}`}
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
            className="flex size-8 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/50 sm:hidden"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="size-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m4 6H4"
              />
            </svg>
          </button>

          <button
            onClick={toggleAudioIndicator}
            className="ml-3 flex items-center space-x-0.5 rounded p-1 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 sm:ml-10"
            aria-label={`${isAudioPlaying ? "Pause" : "Play"} background music`}
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
                style={{ animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel (Now Animated) */}
      <div
        ref={menuPanelRef}
        className="absolute inset-x-0 top-[64px] mx-2 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-lg sm:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <nav>
          <ul className="flex flex-col items-center space-y-4">
            {navItems.map((item) => {
              const href =
                item === "Event"
                  ? "/events"
                  : item === "Projects"
                    ? "/projects"
                    : `#${item.toLowerCase()}`;
              return (
                <li key={item}>
                  <a
                    href={href}
                    className="py-2 text-lg font-semibold text-blue-50/90 hover:text-yellow-300"
                    onClick={(e) => handleLinkClick(e, item)}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default NavBar;
