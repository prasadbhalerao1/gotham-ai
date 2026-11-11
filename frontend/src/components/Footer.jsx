import { Link } from "react-router-dom";
import { getPerson, navItems, site } from "../data/site.js";

const credit = getPerson("prasad-bhalerao");
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
          <p className="label mb-2 mt-10">Write to us</p>
          <a
            href={`mailto:${site.email}`}
            className="text-2xl text-bone underline decoration-bone/30 underline-offset-[0.3em] transition-colors hover:text-signal hover:decoration-signal md:text-3xl"
          >
            {site.email}
          </a>
          <p className="mt-2 text-sm text-bone-mute">Partnerships, speaking, sponsoring, or joining the team.</p>
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
            <li>
              <Link to="/contact" className="text-bone-dim transition-colors hover:text-signal">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label mb-5">Led by</p>
          <ul className="mb-10 space-y-2">
            {site.leadership.map((p) => (
              <li key={p.name}>
                <a href={p.linkedin} target="_blank" rel="noreferrer" className="group text-bone-dim transition-colors hover:text-signal">
                  {p.name}
                  <span className="text-bone-mute"> · {p.role}</span>
                </a>
              </li>
            ))}
          </ul>
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
        <p data-reveal="mask" className="display outline-text whitespace-nowrap text-center text-[24vw] leading-[0.75]">Gotham AI</p>
      </div>

      <div className="wrap flex flex-col justify-between gap-2 border-t border-bone/10 py-6 sm:flex-row">
        <span className="label">© {new Date().getFullYear()} Gotham AI · {site.institutionShort}</span>
        <span className="label flex items-center gap-3">
          {/* site credit */}
          Site by
          <a href={credit.linkedin} target="_blank" rel="noreferrer" className="text-bone-dim transition-colors hover:text-signal">
            {credit.name}
          </a>
          <a href={credit.github} target="_blank" rel="noreferrer me" aria-label={`${credit.name} on GitHub`} className="transition-colors hover:text-signal">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
