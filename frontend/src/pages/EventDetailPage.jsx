import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, eventLd } from "../lib/structuredData.js";
import Gallery from "../components/Gallery.jsx";
import { Monogram, Reveal } from "../components/ui.jsx";
import { Block, Breadcrumbs, Chip, MetaStrip, NumberedList, ParallaxImage, PrevNext, SectionTabs, Sections } from "../components/detail.jsx";
import { eventDateLabel, eventNumber, eventParts, getEvent, isUpcoming, site, sortedEvents } from "../data/site.js";
import NotFoundPage from "./NotFoundPage.jsx";

function EventIndex({ current }) {
  return (
    <nav aria-label="All events" className="sticky top-24">
      <p className="label mb-4">All events</p>
      <ol className="border-t border-bone/10">
        {sortedEvents.map((e) => {
          const on = e.slug === current.slug;
          return (
            <li key={e.slug}>
              <Link
                to={`/events/${e.slug}`}
                aria-current={on ? "page" : undefined}
                className={`group flex items-baseline gap-3 border-b border-bone/10 py-3 text-sm transition-colors ${on ? "text-bone" : "text-bone-mute hover:text-bone"}`}
              >
                <span className={`font-mono text-[10px] ${on ? "text-signal" : ""}`}>{eventNumber(e)}</span>
                <span className="flex-1 truncate">{e.title}</span>
                <span className="font-mono text-[10px]">{eventParts(e).year}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Agenda({ days }) {
  return (
    <div className={`grid gap-10 ${days.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {days.map((d) => (
        <Reveal key={d.label}>
          <h3 className="text-2xl text-bone">{d.label}</h3>
          {d.venue && <p className="label mt-2">{d.venue}</p>}
          <ol className="mt-6 border-t border-bone/10">
            {d.items.map((it, i) => (
              <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-bone/10 py-4">
                <span className="font-mono text-xs text-bone-mute">{it.time || "—"}</span>
                <span>
                  <span className={it.by ? "text-bone" : "text-bone-dim"}>{it.title}</span>
                  {it.by && <span className="mt-0.5 block text-sm text-signal">{it.by}</span>}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      ))}
    </div>
  );
}

function Speakers({ speakers }) {
  return (
    <Reveal stagger={0.08} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {speakers.map((s) => (
        <article key={s.name} className="group flex gap-5 border border-bone/10 p-4 transition-colors duration-500 hover:border-bone/30">
          {s.image ? (
            <div className="photo size-24 shrink-0 md:size-28">
              <img src={s.image} alt={s.name} loading="lazy" className="size-full object-cover object-top" />
            </div>
          ) : (
            <Monogram name={s.name} className="size-24 shrink-0 !text-3xl md:size-28" />
          )}
          <div className="min-w-0">
            <h3 className="text-xl leading-tight text-bone">{s.name}</h3>
            {s.title && <p className="mt-1 text-sm text-signal">{s.title}</p>}
            {s.bio && <p className="mt-2 text-sm leading-relaxed text-bone-dim">{s.bio}</p>}
          </div>
        </article>
      ))}
    </Reveal>
  );
}

const EventDetailPage = () => {
  const { slug } = useParams();
  const event = getEvent(slug);
  const [now, setNow] = useState(null);
  useEffect(() => setNow(Date.now()), []);

  const tabs = useMemo(() => {
    if (!event) return [];
    return [
      { id: "overview", label: "Overview" },
      event.agenda?.length && { id: "agenda", label: "Agenda" },
      event.speakers?.length && { id: "speakers", label: "Speakers", count: event.speakers.length },
      event.gallery?.length && { id: "photos", label: "Photos", count: event.gallery.length },
    ].filter(Boolean);
  }, [event]);

  if (!event) return <NotFoundPage what="event" />;

  const upcoming = now ? isUpcoming(event, now) : false;
  const parts = eventParts(event);
  const i = sortedEvents.indexOf(event);
  const newer = sortedEvents[i - 1];
  const older = sortedEvents[i + 1];
  const toNav = (e) => e && { to: `/events/${e.slug}`, title: e.title, meta: eventDateLabel(e) };

  return (
    <>
      <SEO title={event.title} description={event.summary} image={event.cover} type="article" />
      <StructuredData
        data={[
          eventLd(event),
          breadcrumbLd([
            ["Events", "/events"],
            [event.title, `/events/${event.slug}`],
          ]),
        ]}
      />

      <article>
        <header className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-7">
              <Breadcrumbs items={[{ label: "Events", to: "/events" }, { label: `No. ${eventNumber(event)}` }]} />
              <Reveal className="mt-10 flex flex-wrap items-center gap-2">
                <Chip tone={upcoming ? "solid" : "default"}>{upcoming ? "Upcoming" : "Past event"}</Chip>
                <Chip>{event.category}</Chip>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="display mt-6 text-balance text-[15vw] sm:text-[10vw] lg:text-[6.6vw] xl:text-[104px]">{event.title}</h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl text-xl leading-relaxed text-bone-dim">{event.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {upcoming && event.registrationLink ? (
                    <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-signal">
                      Register ↗
                    </a>
                  ) : (
                    <a href={site.joinForm} target="_blank" rel="noreferrer" className="btn-signal">
                      Join for the next one ↗
                    </a>
                  )}
                  {event.gallery?.length > 0 && (
                    <a href="#photos" className="btn-ghost">
                      See photos ↓
                    </a>
                  )}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="relative lg:col-span-5">
              <ParallaxImage src={event.cover} alt={`${event.title} — ${event.location}`} className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]" />
              <div className="absolute -bottom-px left-0 flex items-end gap-3 bg-ink pr-5 pt-4">
                <span className="display text-7xl leading-[0.8] md:text-8xl">{parts.day}</span>
                <span className="pb-1 font-mono text-xs uppercase leading-tight tracking-[0.14em] text-bone-dim">
                  {parts.month}
                  <br />
                  {parts.year}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="wrap mt-14">
            <MetaStrip
              items={[
                ["Date", eventDateLabel(event)],
                event.time && ["Time", event.time],
                ["Venue", event.location],
                ["Format", event.category],
                event.attendees > 0 && ["Attendees", event.attendees.toLocaleString("en-IN")],
                event.speakers?.length > 0 && ["Speakers", event.speakers.length],
              ]}
            />
          </div>
        </header>

        <SectionTabs tabs={tabs} />

        <section id="overview" aria-label="Overview" className="scroll-mt-24 py-16 md:py-24">
          <div className="wrap grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {event.highlights?.length > 0 && (
                <div className="mb-20">
                  <p className="label mb-6">Highlights</p>
                  <NumberedList items={event.highlights} large />
                </div>
              )}
              {event.sections?.length > 0 && <Sections sections={event.sections} />}
            </div>
            <aside className="hidden lg:col-span-3 lg:col-start-10 lg:block">
              <EventIndex current={event} />
            </aside>
          </div>
        </section>

        {event.agenda?.length > 0 && (
          <Block id="agenda" title="Agenda" label={`${event.agenda.length} ${event.agenda.length > 1 ? "days" : "day"}`} className="border-t border-bone/10">
            <Agenda days={event.agenda} />
          </Block>
        )}

        {event.speakers?.length > 0 && (
          <Block id="speakers" title="Speakers" label={`${event.speakers.length} ${event.speakers.length > 1 ? "voices" : "voice"}`} className="border-t border-bone/10">
            <Speakers speakers={event.speakers} />
          </Block>
        )}

        {event.gallery?.length > 0 && (
          <Block id="photos" title="Photos" label={`${event.gallery.length} frames`} className="border-t border-bone/10 bg-ink-800">
            <Gallery items={event.gallery} title={event.title} />
          </Block>
        )}
      </article>

      <PrevNext kind="event" prev={toNav(older)} next={toNav(newer)} />
    </>
  );
};

export default EventDetailPage;
