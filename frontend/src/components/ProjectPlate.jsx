import Logo from "./Logo.jsx";

/** Typographic cover for projects without a photo/screenshot yet. */
const ProjectPlate = ({ project, number, compact = false, className = "" }) => (
  <div className={`relative flex flex-col justify-between overflow-hidden border border-bone/10 bg-ink-800 p-5 md:p-7 ${className}`}>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-35"
      style={{
        backgroundImage:
          "linear-gradient(rgba(242,242,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,238,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
    <div className="relative flex items-start justify-between">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone-mute">Case {number}</span>
      <Logo className="size-6 text-bone/40" />
    </div>
    <p aria-hidden className={`display relative leading-[0.8] text-bone/90 ${compact ? "text-5xl" : "text-[clamp(3rem,9vw,7rem)]"}`}>
      {project.title}
    </p>
    <div className="relative flex items-end justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-bone-mute">
      <span>{project.partner?.name}</span>
      <span className="text-signal">{project.status}</span>
    </div>
  </div>
);

export default ProjectPlate;
