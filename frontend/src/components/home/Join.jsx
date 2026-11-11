import { useRef } from "react";
import { site } from "../../data/site.js";
import { useContact } from "../../lib/contact.js";
import { Reveal } from "../ui.jsx";

const steps = [
  { k: "Fill the form", v: "Two minutes. Tell us what you want to learn or build." },
  { k: "Show up", v: "Sessions, clinics and hackathons on and around campus." },
  { k: "Build something", v: "Join a squad or a live industry project and ship it." },
];

function Badge() {
  const text = "Join the community ✦ Answer the signal ✦ ";
  return (
    <a
      href={site.joinForm}
      target="_blank"
      rel="noreferrer"
      aria-label="Join the community"
      className="group relative flex size-36 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-500 hover:scale-105 md:size-44"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-spinslow" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontFamily="JetBrains Mono, monospace" fontSize="13.5" letterSpacing="3" fill="currentColor">
          <textPath href="#badge-circle">{text.toUpperCase()}</textPath>
        </text>
      </svg>
      <span className="text-4xl transition-transform duration-500 group-hover:rotate-45" aria-hidden>
        ↗
      </span>
    </a>
  );
}

const Join = () => {
  const openContact = useContact();
  const ref = useRef(null);

  // the searchlight follows the pointer across the section
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section
      ref={ref}
      id="join"
      onPointerMove={onMove}
      aria-labelledby="join-title"
      className="grain relative overflow-hidden bg-ink-900 py-28 md:py-40"
      style={{ "--mx": "70%", "--my": "30%" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-300"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), rgba(237,255,102,0.07), transparent 60%), radial-gradient(120% 70% at 50% 120%, rgba(237,255,102,0.05), transparent 60%)",
        }}
      />
      <div className="wrap relative">
        <p className="label mb-8 flex items-center gap-3">
          Join us
        </p>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="join-title" data-reveal="mask" className="display text-[19vw] md:text-[13vw] xl:text-[12.5rem]">
              Answer
              <br />
              the <span className="accent">signal</span>
            </h2>
          </div>
          <Badge />
        </div>

        <Reveal stagger={0.1} className="mt-20 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.k} className="bg-ink-900 p-8">
              <p className="font-mono text-xs text-signal">STEP 0{i + 1}</p>
              <p className="display mt-6 text-4xl">{s.k}</p>
              <p className="mt-3 text-bone-dim">{s.v}</p>
            </div>
          ))}
        </Reveal>

        {/* contact is the main action here — one big, obvious target */}
        <button
          type="button"
          onClick={openContact}
          className="group mt-16 flex w-full flex-col gap-6 rounded-3xl bg-signal p-8 text-left text-ink transition-transform duration-500 ease-expo hover:-translate-y-1 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <span>
            <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink/60">
              Partnerships · speaking · sponsoring · questions
            </span>
            <span className="display mt-3 block text-6xl md:text-8xl">Contact us</span>
          </span>
          <span
            aria-hidden
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-ink text-3xl text-signal transition-transform duration-500 ease-expo group-hover:-rotate-45 md:size-24 md:text-4xl"
          >
            →
          </span>
        </button>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={`mailto:${site.email}`} className="label text-bone underline-offset-4 hover:text-signal hover:underline">
            or email {site.email}
          </a>
          <a href={site.joinForm} target="_blank" rel="noreferrer" className="label underline-offset-4 hover:text-signal hover:underline">
            Want to join instead? Fill the form ↗
          </a>
          {site.socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="label underline-offset-4 hover:text-signal hover:underline">
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Join;
