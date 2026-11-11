import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll } from "../lib/smooth.js";
import { useFocusTrap } from "../lib/useFocusTrap.js";
import { navItems, site } from "../data/site.js";
import Logo from "./Logo.jsx";
import SoundToggle from "./SoundToggle.jsx";
import SearchButton from "./SearchButton.jsx";


function PuneClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>PUNE {now ?? "--:--"} IST</span>;
}

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname, hash } = useLocation();
  // trap covers the header too, so the close button stays reachable
  const shell = useRef(null);
  useFocusTrap(shell, open);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    lockScroll(open);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // in-page sections (e.g. /#faq) count as "here" only while they're on screen
  const [inView, setInView] = useState(null);
  useEffect(() => {
    if (pathname !== "/") return setInView(null);
    const ids = navItems.filter((n) => n.to.startsWith("/#")).map((n) => n.to.slice(2));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView((cur) => (e.isIntersecting ? e.target.id : cur === e.target.id ? null : cur))),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  const isActive = (to) => (to.startsWith("/#") ? pathname === "/" && inView === to.slice(2) : pathname.startsWith(to));

  return (
    <div ref={shell}>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-expo ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`wrap flex h-16 items-center justify-between gap-6 transition-colors duration-500 md:h-20 ${
            scrolled && !open ? "bg-ink/70 backdrop-blur-md" : ""
          }`}
        >
          <Link to="/" className="group flex items-center gap-3" aria-label="Gotham AI home">
            <Logo title="" className="size-7 text-bone transition-transform duration-700 ease-expo group-hover:-rotate-12" />
            <span className="text-lg font-semibold tracking-tight">Gotham AI</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item, i) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={`group relative px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors ${
                  isActive(item.to) ? "text-signal" : "text-bone-dim hover:text-bone"
                }`}
              >
                <span className="mr-1.5 text-bone-mute">0{i + 1}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="label hidden xl:inline">
              <PuneClock />
            </span>
            <SearchButton />
            <SoundToggle />
            <a href={site.joinForm} target="_blank" rel="noreferrer" className="btn-signal hidden !px-5 !py-2.5 sm:inline-flex">
              Join <span aria-hidden>↗</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex size-11 items-center justify-center rounded-full border border-bone/20 transition-colors hover:border-signal lg:hidden"
            >
              <span
                className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-expo ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-expo ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink-800 pt-24"
          >
            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-center gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    className="group flex items-baseline gap-4 border-b border-bone/10 py-3"
                  >
                    <span className="font-mono text-xs text-signal">0{i + 1}</span>
                    <span className="display text-[13vw] transition-colors group-hover:text-signal sm:text-7xl">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-8 pt-6">
              <a href={site.joinForm} target="_blank" rel="noreferrer" className="btn-signal">
                Join the community ↗
              </a>
              <span className="label">
                <PuneClock />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
