import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, itemListLd, pageLd } from "../lib/structuredData.js";
import PageHeader from "../components/PageHeader.jsx";
import { Link } from "react-router-dom";
import { usePalette } from "../lib/palette.js";
import {
  eventCategories,
  eventCover,
  eventMedia,
  eventDateLabel,
  eventNumber,
  eventYears,
  isUpcoming,
  site,
  sortedEvents,
  stats,
} from "../data/site.js";

const photoCount = new Set(
  sortedEvents.flatMap((e) =>
    (e.gallery || []).filter((g) => !/\.(mp4|webm|mov)$/i.test(g)),
  ),
).size;

const EventsPage = () => {
  const [filter, setFilter] = useState("All");
  const openPalette = usePalette();
  const [now, setNow] = useState(null);
  useEffect(() => setNow(Date.now()), []);

  const upcomingCount = now
    ? sortedEvents.filter((e) => isUpcoming(e, now)).length
    : 0;
  const filters = [
    "All",
    ...(upcomingCount ? ["Upcoming"] : []),
    ...eventCategories,
  ];

  const list = useMemo(
    () =>
      sortedEvents.filter((e) => {
        if (filter === "All") return true;
        if (filter === "Upcoming") return now && isUpcoming(e, now);
        return e.category === filter;
      }),
    [filter, now],
  );

  // one wall: each event's title tile, then photos from that event's gallery
  const wall = list.flatMap((e) => [
    { kind: "event", key: e.slug, event: e },
    ...eventMedia(e)
      .filter((m) => m.src !== e.cover && !m.video)
      .map((m) => ({ kind: "photo", key: m.src, event: e, ...m })),
  ]);

  const totals = [
    [sortedEvents.length, "Events"],
    [stats.find((s) => s.short === "Attendees")?.value ?? 0, "Attendees", true],
    [stats.find((s) => s.short === "Speakers")?.value ?? 0, "Speakers"],
    [photoCount, "Photos"],
  ];

  return (
    <>
      <SEO
        fullTitle="AI Events, Workshops & Hackathons in Pune | Gotham AI"
        description="Every technical session, workshop, meetup and hackathon run by Gotham AI, the student AI community at JSPM's RSCOE, Pune — with dates, venues, speakers and photos."
      />
      <StructuredData
        data={[
          pageLd("CollectionPage", "/events", { name: "Gotham AI events" }),
          breadcrumbLd([["Events", "/events"]]),
          itemListLd(
            "Gotham AI events",
            sortedEvents.map((e) => ({
              name: e.title,
              url: `/events/${e.slug}`,
            })),
          ),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "Events" }]}
        title={
          <>
            Events <span className="accent">&amp;</span> sessions
          </>
        }
        intro={`Technical sessions, workshops, meetups and hackathons since ${eventYears[eventYears.length - 1]} — on campus and across Pune.`}
      >
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {totals.map(([v, label, plus]) => (
            <div key={label} data-reveal="rise" className="flex flex-col">
              <dt className="order-2 mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-bone-mute">
                {label}
              </dt>
              <dd className="display order-1 text-6xl md:text-7xl">
                {v.toLocaleString("en-IN")}
                {plus && <span className="text-signal">+</span>}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={openPalette}
              className="flex w-full max-w-md items-center gap-3 rounded-full border border-bone/20 px-5 py-3 text-left text-bone-mute transition-colors hover:border-bone/50 hover:text-bone-dim"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="flex-1">Search events, speakers, venues…</span>
              <kbd className="rounded border border-bone/20 px-1.5 py-0.5 font-mono text-[0.625rem]">
                Ctrl K
              </kbd>
            </button>
            <div
              role="group"
              aria-label="Filter events"
              className="flex flex-wrap gap-2"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    filter === f
                      ? "border-bone bg-bone text-ink"
                      : "border-bone/20 text-bone-dim hover:border-bone/50 hover:text-bone"
                  }`}
                >
                  {f}
                  <span className="ml-2 opacity-50">
                    {f === "All"
                      ? sortedEvents.length
                      : f === "Upcoming"
                        ? upcomingCount
                        : sortedEvents.filter((e) => e.category === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="label" aria-live="polite">
            {now && upcomingCount === 0 ? (
              <>
                Next event: to be announced ·{" "}
                <a
                  href={site.joinForm}
                  target="_blank"
                  rel="noreferrer"
                  className="text-signal hover:underline"
                >
                  get notified
                </a>
              </>
            ) : (
              `Showing ${list.length}`
            )}
          </p>
        </div>
      </PageHeader>

      <section className="wrap py-12 md:py-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {wall.map((item) =>
            item.kind === "event" ? (
              <Link
                key={item.key}
                data-reveal="rise"
                to={`/events/${item.event.slug}`}
                className={`group relative block break-inside-avoid overflow-hidden rounded-2xl ${now && isUpcoming(item.event, now) ? "ring-1 ring-signal" : ""}`}
              >
                <img
                  src={item.event.cover}
                  alt={eventCover(item.event).alt}
                  width={eventCover(item.event).width}
                  height={eventCover(item.event).height}
                  loading="lazy"
                  decoding="async"
                  className="block min-h-[22rem] w-full object-cover transition-transform duration-[1.4s] ease-expo group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10"
                />
                <span className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone">
                    No. {eventNumber(item.event)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] backdrop-blur-sm ${
                      now && isUpcoming(item.event, now)
                        ? "bg-signal text-ink"
                        : "border border-bone/30 bg-ink/40 text-bone"
                    }`}
                  >
                    {now && isUpcoming(item.event, now)
                      ? "Upcoming"
                      : item.event.category}
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-signal">
                    {eventDateLabel(item.event)}
                  </span>
                  <span className="display mt-1 block text-4xl leading-[0.9] md:text-5xl">
                    {item.event.title}
                  </span>
                  <span className="mt-2 flex items-end justify-between gap-3 text-sm text-bone-dim">
                    <span>
                      {item.event.location}
                      {item.event.attendees > 0 &&
                        ` · ${item.event.attendees} attendees`}
                    </span>
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-all duration-500 ease-expo group-hover:-rotate-45 group-hover:bg-signal"
                    >
                      →
                    </span>
                  </span>
                </span>
              </Link>
            ) : (
              <Link
                key={item.key}
                data-reveal="rise"
                to={`/events/${item.event.slug}#photos`}
                className="group relative block break-inside-avoid overflow-hidden rounded-2xl"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  title={item.caption}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="block w-full transition-transform duration-[1.4s] ease-expo group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-sm text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.event.title} ↗
                </span>
              </Link>
            ),
          )}
        </div>
      </section>
    </>
  );
};

export default EventsPage;
