import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/smooth.js";
import { eventCover, eventDateLabel, eventNumber, eventParts, isUpcoming, site, sortedEvents } from "../../data/site.js";
import EventPanel from "../EventPanel.jsx";
import { Reveal } from "../ui.jsx";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Featured({ event, upcoming }) {
  const parts = eventParts(event);
  return (
    <Link to={`/events/${event.slug}`} className="group grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="relative overflow-hidden lg:col-span-7">
        <img
          src={event.cover}
          alt={eventCover(event).alt}
          width={eventCover(event).width}
          height={eventCover(event).height}
          className="aspect-[16/10] w-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink">
          {upcoming ? "Upcoming" : "Latest event"}
        </span>
      </div>
      <div className="flex flex-col lg:col-span-5">
        <div className="flex items-end gap-4">
          <span className="display text-8xl leading-[0.78] md:text-9xl">{parts.day}</span>
          <span className="pb-1 font-mono text-xs uppercase leading-snug tracking-[0.14em] text-bone-dim">
            {parts.month} {parts.year}
            <br />
            {event.category}
          </span>
        </div>
        <h3 className="display mt-6 text-5xl transition-colors duration-500 group-hover:text-signal md:text-6xl">{event.title}</h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-bone-dim">{event.summary}</p>
        <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-bone-mute">
          {event.location}
          {event.gallery?.length ? ` · ${event.gallery.length} photos` : ""}
        </p>
        <span className="btn-signal mt-8 self-start">View event →</span>
      </div>
    </Link>
  );
}

const EventsReel = () => {
  const pinned = useRef(null);
  const track = useRef(null);
  const [now, setNow] = useState(null);
  useEffect(() => setNow(Date.now()), []);

  const upcoming = now ? sortedEvents.filter((e) => isUpcoming(e, now)) : [];
  const featured = upcoming[upcoming.length - 1] ?? sortedEvents[0];
  const rest = sortedEvents.filter((e) => e !== featured);

  // Desktop: pin the reel and scroll it sideways. GSAP wraps the *inner* div
  // (React keeps owning the outer one), and the layout-effect cleanup tears the
  // pin down before React removes the DOM — otherwise route changes crash.
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinned.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => pinned.current?.style.setProperty("--reel", self.progress.toFixed(3)),
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="events" aria-labelledby="events-title" className="relative bg-ink">
      <div className="wrap pb-20 pt-28 md:pt-36">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="events-title" data-reveal="mask" className="display text-[15vw] sm:text-[11vw] md:text-[7.2vw] xl:text-[6.875rem]">
            Events
          </h2>
          <p className="max-w-sm text-bone-dim md:text-right">
            {upcoming.length ? (
              <>
                <span className="text-signal">{upcoming.length} coming up.</span> Grab a seat.
              </>
            ) : (
              <>
                Next event to be announced —{" "}
                <a href={site.joinForm} target="_blank" rel="noreferrer" className="text-signal underline-offset-4 hover:underline">
                  join to hear first
                </a>
                .
              </>
            )}
          </p>
        </div>
        <Reveal>
          <Featured event={featured} upcoming={now ? isUpcoming(featured, now) : false} />
        </Reveal>
      </div>

      <div>
        <div ref={pinned} className="overflow-hidden pb-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-0">
          <div className="wrap mb-8 flex items-end justify-between">
            <p className="label">Previously at Gotham AI</p>
            <Link to="/events" className="label hover:text-signal">
              All {sortedEvents.length} events →
            </Link>
          </div>
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] lg:w-max lg:snap-none lg:gap-6 lg:overflow-visible lg:pb-0"
          >
            {rest.map((e) => (
              <EventPanel
                key={e.slug}
                event={e}
                number={eventNumber(e)}
                upcoming={now ? isUpcoming(e, now) : false}
                className="w-[78vw] shrink-0 snap-start sm:w-[23.75rem] lg:w-[min(28vw,420px)]"
              />
            ))}
          </div>
          <div className="wrap mt-8 hidden lg:block">
            <div className="h-px w-full bg-bone/10">
              <div className="h-px origin-left bg-signal" style={{ transform: "scaleX(var(--reel, 0))" }} />
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">Latest: {featured.title}, {eventDateLabel(featured)}.</p>
    </section>
  );
};

export default EventsReel;
