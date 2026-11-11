import { Link } from "react-router-dom";
import { navItems, site } from "../data/site.js";
import { useContact } from "../lib/contact.js";

const Footer = () => {
  const openContact = useContact();
  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-ink pt-20">
      <div className="wrap grid gap-12 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label mb-5">Gotham AI / Signal</p>
          <p className="max-w-sm font-serif text-3xl italic leading-tight text-bone">
            {site.tagline}. A student community for people who would rather build intelligence than just read about it.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-5">Navigate</p>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-bone-dim transition-colors hover:text-signal">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/resources" className="text-bone-dim transition-colors hover:text-signal">
                Resources
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label mb-5">Find us</p>
          <a
            href={site.mapLink}
            target="_blank"
            rel="noreferrer"
            className="block text-bone-dim transition-colors hover:text-signal"
          >
            {site.institution}
            <br />
            {site.city}
          </a>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={openContact} className="btn-ghost !px-4 !py-2">
              Contact
            </button>
            {site.socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none">
        <p className="display outline-text whitespace-nowrap text-center text-[24vw] leading-[0.75]">Gotham AI</p>
      </div>

      <div className="wrap flex flex-col justify-between gap-2 border-t border-bone/10 py-6 sm:flex-row">
        <span className="label">© {new Date().getFullYear()} Gotham AI · {site.institutionShort}</span>
        <span className="label">{site.tagline}</span>
      </div>
    </footer>
  );
};

export default Footer;
