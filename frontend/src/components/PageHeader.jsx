import { Link } from "react-router-dom";

const PageHeader = ({ crumbs = [], title, intro, children }) => (
  <header className="grain relative overflow-hidden border-b border-bone/10 bg-ink pb-16 pt-32 md:pb-20 md:pt-44">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(70% 60% at 85% 0%, rgba(255,179,71,0.12), transparent 70%)" }}
    />
    <div className="wrap relative">
      <nav aria-label="Breadcrumb" className="label mb-8 flex flex-wrap items-center gap-2">
        <Link to="/" className="-my-3 inline-block py-3 hover:text-signal">
          Gotham
        </Link>
        {crumbs.map((c) => (
          <span key={c.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {c.to ? (
              <Link to={c.to} className="-my-3 inline-block py-3 hover:text-signal">
                {c.label}
              </Link>
            ) : (
              <span className="text-bone">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div>
        <h1 data-reveal="mask" className="display text-balance text-[14vw] sm:text-[10vw] md:text-[8vw] xl:text-[7.5rem]">{title}</h1>
      </div>
      {intro && (
        <p data-reveal="rise" className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-dim md:text-xl">
          {intro}
        </p>
      )}
      {children}
    </div>
  </header>
);

export default PageHeader;
