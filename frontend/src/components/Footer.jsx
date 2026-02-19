import { Link, useLocation } from "react-router-dom";
import { FaDiscord, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const socialLinks = [
  {
    href: "https://discord.com",
    icon: <FaDiscord />,
    label: "Discord",
    hoverClass:
      "hover:bg-indigo-500/20 hover:text-indigo-300 hover:ring-indigo-400/30",
  },
  {
    href: "https://linkedin.com",
    icon: <FaLinkedin />,
    label: "LinkedIn",
    hoverClass:
      "hover:bg-blue-500/20 hover:text-blue-300 hover:ring-blue-400/30",
  },
  {
    href: "https://instagram.com",
    icon: <FaInstagram />,
    label: "Instagram",
    hoverClass:
      "hover:bg-pink-500/20 hover:text-pink-300 hover:ring-pink-400/30",
  },
];

const quickLinks = [
  { label: "Events", type: "section", target: "events" },
  { label: "About", type: "section", target: "about" },
  { label: "Contact", type: "section", target: "contact" },
];

const resourceLinks = [
  { label: "Projects", type: "route", target: "/projects" },
  { label: "Resources", type: "route", target: "/resources" },
  {
    label: "Join Community",
    type: "external",
    target: "https://discord.com",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleScrollLink = (target) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${target}`;
      return;
    }
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLink = (link, index) => {
    const baseClass =
      "group flex items-center gap-2.5 text-[13px] text-gray-300/70 transition-all duration-300 hover:text-white hover:translate-x-1";

    if (link.type === "route") {
      return (
        <Link key={index} to={link.target} className={baseClass}>
          <span className="h-px w-3 bg-gray-500/40 transition-all duration-300 group-hover:w-5 group-hover:bg-cyan-400" />
          {link.label}
        </Link>
      );
    }
    if (link.type === "external") {
      return (
        <a
          key={index}
          href={link.target}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClass}
        >
          <span className="h-px w-3 bg-gray-500/40 transition-all duration-300 group-hover:w-5 group-hover:bg-cyan-400" />
          {link.label}
        </a>
      );
    }
    return (
      <button
        key={index}
        type="button"
        className={`text-left ${baseClass}`}
        onClick={() => handleScrollLink(link.target)}
        aria-label={`Scroll to ${link.label}`}
      >
        <span className="h-px w-3 bg-gray-500/40 transition-all duration-300 group-hover:w-5 group-hover:bg-cyan-400" />
        {link.label}
      </button>
    );
  };

  return (
    <footer className="relative w-screen overflow-hidden bg-gradient-to-br from-[#0f1b3d] via-[#132654] to-[#0d2240] text-white">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-blue-700/15 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-cyan-700/15 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700/10 blur-[120px]" />
      </div>

      {/* Top accent line */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-y-12 pb-12 pt-16 sm:grid-cols-4 lg:grid-cols-12 lg:gap-x-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-5 lg:pr-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/img/logo.jpg"
                  alt="Gotham AI Logo"
                  className="size-10 rounded-xl ring-1 ring-white/10"
                />
                <div className="absolute -inset-1 -z-10 rounded-xl bg-cyan-400/10 blur-md" />
              </div>
              <div>
                <span className="font-zentry text-lg font-bold tracking-wide">
                  Gotham AI
                </span>
                <p className="text-[10px] font-medium uppercase tracking-widest text-cyan-300/60">
                  Where Minds Meet Machines
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-[13px] leading-[1.7] text-gray-400">
              Your gateway to artificial intelligence, innovation, and the
              future of technology. Shaping tomorrow's world with today's
              brightest minds.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-gray-400/70">
              <MdLocationOn className="size-3.5 shrink-0 text-cyan-400/60" />
              <a
                href="https://maps.app.goo.gl/QzkAcTycAdpqbPZ96"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-cyan-300"
              >
                JSPM's RSCOE, Tathawade
              </a>
            </div>

            {/* Social row */}
            <div className="mt-7 flex gap-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`flex size-10 items-center justify-center rounded-xl bg-white/[0.05] text-base text-gray-400 ring-1 ring-white/[0.08] transition-all duration-300 hover:scale-105 ${link.hoverClass}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate column */}
          <div className="col-span-1 lg:col-span-3 lg:pl-4">
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400/70">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link, index) => renderLink(link, index))}
            </div>
          </div>

          {/* Resources column */}
          <div className="col-span-1 lg:col-span-3 lg:pl-4">
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400/70">
              Resources
            </h4>
            <div className="flex flex-col gap-3">
              {resourceLinks.map((link, index) => renderLink(link, index))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/[0.06]">
          <div className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <p className="py-6 text-center text-[11px] tracking-wide text-gray-500">
            © {currentYear} <span className="text-gray-300">Gotham AI</span>
            <span className="mx-2 text-gray-600">·</span>
            Empowering the next generation of AI innovators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
