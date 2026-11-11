import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ContactModal from "./ContactModal.jsx";
import Intro from "./Intro.jsx";
import { ContactContext } from "../lib/contact.js";
import { sound } from "../lib/sound.js";
import { startSmoothScroll, scrollToTarget, ScrollTrigger } from "../lib/smooth.js";

const Layout = () => {
  const { pathname, hash } = useLocation();
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);

  useEffect(() => {
    startSmoothScroll();
    sound.autostart(); // music on by default; the navbar symbol mutes it
  }, []);

  // Route changes: new pages start at the top; "/#section" links scroll once the
  // page's pinned sections have been measured (otherwise the target moves).
  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, { immediate: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(hash, { offset: -10 });
    }, 250);
    return () => clearTimeout(id);
  }, [pathname, hash]);

  return (
    <ContactContext.Provider value={openContact}>
      <a
        href="#main"
        className="sr-only z-[100] rounded bg-signal px-4 py-2 font-mono text-xs text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Intro />
      <NavBar />
      <main id="main" className="relative">
        <Outlet />
      </main>
      <Footer />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </ContactContext.Provider>
  );
};

export default Layout;
