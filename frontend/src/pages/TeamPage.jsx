import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { breadcrumbLd, ids, pageLd } from "../lib/structuredData.js";
import { site } from "../data/site.js";

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

const TeamPage = () => (
  <>
    <SEO fullTitle="Meet the Team | Gotham AI" description={`The people leading ${site.name}: ${site.leadership.map((p) => `${p.name}, ${p.role}`).join("; ")}.`} />
    <StructuredData
      data={[
        pageLd("CollectionPage", "/team", {
          name: "Gotham AI team",
          mainEntity: { "@type": "ItemList", itemListElement: site.leadership.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": ids.person(p.slug) } })) },
        }),
        breadcrumbLd([["Team", "/team"]]),
      ]}
    />
    <PageHeader
      crumbs={[{ label: "Team" }]}
      title={
        <>
          The <span className="accent">team</span>
        </>
      }
      intro={`The people leading ${site.name} at ${site.institutionShort}, Pune.`}
    />
    <section className="wrap py-16 md:py-24">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.leadership.map((p) => (
          <li key={p.slug} data-reveal="rise">
            <Link to={`/team/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-bone/10 p-6 transition-colors hover:border-bone/30 hover:bg-ink-800">
              <span aria-hidden className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-ink-700 font-display text-3xl text-bone/40">
                {p.image ? <img src={p.image} alt="" className="size-full object-cover" /> : initials(p.name)}
              </span>
              <span className="label mt-8 block">{p.role}</span>
              <span className="display mt-2 block text-4xl transition-colors group-hover:text-signal">{p.name}</span>
              <span className="mt-3 line-clamp-3 text-bone-dim">{p.bio}</span>
              <span className="label mt-auto pt-6 text-bone">View profile →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  </>
);

export default TeamPage;
