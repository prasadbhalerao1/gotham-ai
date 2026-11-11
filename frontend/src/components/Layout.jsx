import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ContactModal from "./ContactModal.jsx";
import Intro from "./Intro.jsx";
import CommandPalette from "./CommandPalette.jsx";
import { ContactContext } from "../lib/contact.js";
import { PaletteContext } from "../lib/palette.js";
import { sound } from "../lib/sound.js";
import { initReveals } from "../lib/reveals.js";
import {
  startSmoothScroll,
  scrollToTarget,
  ScrollTrigger,
} from "../lib/smooth.js";

const Layout = () => {
  const { pathname, hash } = useLocation();
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  // ⌘K / Ctrl K anywhere, or "/" when not typing, opens search
  useEffect(() => {
    const onKey = (e) => {
      const typing =
        /^(input|textarea|select)$/i.test(e.target.tagName) ||
        e.target.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    startSmoothScroll();
    sound.autostart(); // music on by default; the navbar symbol mutes it
  }, []);

  // shared scroll reveals for whatever page is showing
  useEffect(() => {
    let cleanup;
    const id = requestAnimationFrame(
      () => (cleanup = initReveals(document.getElementById("main"))),
    );
    return () => {
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, [pathname]);

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
      <PaletteContext.Provider value={openPalette}>
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
        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
        />
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onContact={openContact}
        />
      </PaletteContext.Provider>
    </ContactContext.Provider>
  );
};

export default Layout;
