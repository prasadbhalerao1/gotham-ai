import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { breadcrumbLd, organizationLd, pageLd } from "../lib/structuredData.js";
import { useContact } from "../lib/contact.js";
import { eventYears, partners, publishedProjects, site, sortedEvents, stats } from "../data/site.js";

const kinds = [...new Set(sortedEvents.map((e) => e.category))];

/** Plain-language description of Gotham AI — written for people first, and easy for search and AI systems to quote. */
const AboutPage = () => {
  const openContact = useContact();
  return (
    <>
      <SEO
        fullTitle="About Gotham AI | Student AI & Technology Community in Pune"
        description={site.description}
      />
      <StructuredData
        data={[
          organizationLd(),
          pageLd("AboutPage", "/about", { name: "About Gotham AI", description: site.description }),
          breadcrumbLd([["About", "/about"]]),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "About" }]}
        title={
          <>
            About <span className="accent">Gotham</span> AI
          </>
        }
        intro={site.description}
      />

      <article className="wrap grid gap-16 py-16 md:py-24 lg:grid-cols-12">
        <div className="space-y-16 lg:col-span-8">
          <section aria-labelledby="what">
            <h2 id="what" data-reveal="mask" className="display text-5xl md:text-6xl">
              What we do
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-dim">
              {site.name} brings students together to learn and build with artificial intelligence. Since {eventYears[eventYears.length - 1]} the community has run{" "}
              <Link to="/events" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                {sortedEvents.length} events
              </Link>{" "}
              ({kinds.join(", ").toLowerCase()}) with {stats.find((s) => s.short === "Attendees").value}+ recorded attendees, and its members lead{" "}
              <Link to="/projects" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                {publishedProjects.length} industry projects
              </Link>{" "}
              with {partners.map((p) => p.name).join(", ")}.
            </p>
            <ul className="mt-8 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-3">
              {[
                ["Learn", "Technical sessions and workshops on machine learning, LLMs, RAG and responsible AI, taught by practitioners."],
                ["Compete", "Hackathons and hackathon preparation, including Smart India Hackathon guidance and a national-level AI hackathon."],
                ["Build", "Student-led industry projects, from AI access control to post-quantum cryptography."],
              ].map(([k, v]) => (
                <li key={k} data-reveal="rise" className="bg-ink p-6">
                  <h3 className="display text-3xl">{k}</h3>
                  <p className="mt-2 text-bone-dim">{v}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="focus" aria-labelledby="focus-title" className="scroll-mt-24">
            <h2 id="focus-title" data-reveal="mask" className="display text-5xl md:text-6xl">
              Focus areas
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.focusAreas.map((f) => (
                <li key={f} className="rounded-full border border-bone/20 px-4 py-2 text-bone-dim">
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="where">
            <h2 id="where" data-reveal="mask" className="display text-5xl md:text-6xl">
              Where we are
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-dim">
              {site.name} is a student community based at{" "}
              <a href={site.mapLink} target="_blank" rel="noreferrer" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                {site.institution}, {site.city}
              </a>
              , Maharashtra, India. Events take place on campus and at partner venues across Pune.
            </p>
          </section>

          <section id="join" aria-labelledby="join-title" className="scroll-mt-24">
            <h2 id="join-title" data-reveal="mask" className="display text-5xl md:text-6xl">
              Join or collaborate
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-dim">
              Students, beginners included, can join through the{" "}
              <a href={site.joinForm} target="_blank" rel="noreferrer" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                join form
              </a>
              . Companies and communities can partner on projects, sponsor or co-host events, or send speakers — email{" "}
              <a href={`mailto:${site.email}`} className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                {site.email}
              </a>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.joinForm} target="_blank" rel="noreferrer" className="btn-signal">
                Join Gotham AI ↗
              </a>
              <button type="button" onClick={openContact} className="btn-ghost">
                Contact us
              </button>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="sticky top-24 space-y-10">
            <div>
              <h2 className="label mb-4">Led by</h2>
              <ul className="space-y-3 border-t border-bone/10 pt-4">
                {site.leadership.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/team/${p.slug}`} className="group block">
                      <span className="block text-bone transition-colors group-hover:text-signal">{p.name}</span>
                      <span className="text-sm text-bone-mute">{p.role}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label mb-4">At a glance</h2>
              <dl className="space-y-3 border-t border-bone/10 pt-4 text-sm">
                {[
                  ["Type", "Student-led community"],
                  ["Based at", `${site.institutionShort}, ${site.city}`],
                  ["Events", sortedEvents.length],
                  ["Projects", publishedProjects.length],
                  ["Contact", site.email],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-bone-mute">{k}</dt>
                    <dd className="text-right text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </article>
    </>
  );
};

export default AboutPage;
