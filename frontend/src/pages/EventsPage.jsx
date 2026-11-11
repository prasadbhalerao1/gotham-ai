import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, itemListLd } from "../lib/structuredData.js";
import PageHeader from "../components/PageHeader.jsx";
import IndexList from "../components/IndexList.jsx";
import { eventCategories, eventDateLabel, eventNumber, eventYears, isUpcoming, site, sortedEvents } from "../data/site.js";

const EventsPage = () => {
  const [filter, setFilter] = useState("All");
  const [now, setNow] = useState(null);
  useEffect(() => setNow(Date.now()), []);

  const upcomingCount = now ? sortedEvents.filter((e) => isUpcoming(e, now)).length : 0;
  const filters = ["All", ...(upcomingCount ? ["Upcoming"] : []), ...eventCategories];

  const list = useMemo(
    () =>
      sortedEvents.filter((e) => {
        if (filter === "All") return true;
        if (filter === "Upcoming") return now && isUpcoming(e, now);
        return e.category === filter;
      }),
    [filter, now],
  );

  const rows = list.map((e) => ({
    key: e.slug,
    to: `/events/${e.slug}`,
    num: eventNumber(e),
    title: e.title,
    sub: e.location,
    image: e.cover,
    right: (
      <>
        <span className={now && isUpcoming(e, now) ? "text-signal" : ""}>{eventDateLabel(e)}</span>
        <span>{e.category}</span>
      </>
    ),
  }));

  return (
    <>
      <SEO title="Events" description="Sessions, workshops, meetups and hackathons hosted by Gotham AI at JSPM's RSCOE and across Pune." />
      <StructuredData
        data={[
          breadcrumbLd([["Events", "/events"]]),
          itemListLd(
            "Gotham AI events",
            sortedEvents.map((e) => ({ name: e.title, url: `/events/${e.slug}` })),
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
        intro={`${sortedEvents.length} events since ${eventYears[eventYears.length - 1]} — technical sessions, workshops, meetups and hackathons, on campus and across Pune.`}
      >
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div role="group" aria-label="Filter events" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  filter === f ? "border-bone bg-bone text-ink" : "border-bone/20 text-bone-dim hover:border-bone/50 hover:text-bone"
                }`}
              >
                {f}
                <span className="ml-2 opacity-50">
                  {f === "All" ? sortedEvents.length : f === "Upcoming" ? upcomingCount : sortedEvents.filter((e) => e.category === f).length}
                </span>
              </button>
            ))}
          </div>
          <p className="label" aria-live="polite">
            {now && upcomingCount === 0 ? (
              <>
                Next event: to be announced ·{" "}
                <a href={site.joinForm} target="_blank" rel="noreferrer" className="text-signal hover:underline">
                  get notified
                </a>
              </>
            ) : (
              `Showing ${list.length}`
            )}
          </p>
        </div>
      </PageHeader>

      <section className="wrap py-10 md:py-16">
        <IndexList rows={rows} label="Events" />
      </section>
    </>
  );
};

export default EventsPage;
