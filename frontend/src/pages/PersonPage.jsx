import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { breadcrumbLd, ids, organizationLd, pageLd, personLd } from "../lib/structuredData.js";
import { getPerson, publishedProjects, site } from "../data/site.js";
import NotFoundPage from "./NotFoundPage.jsx";

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer me" className="btn-ghost !px-4 !py-2">
    {children} ↗
  </a>
);

/** Public profile of a Gotham AI team member (file in src/content/team/). */
const PersonPage = () => {
  const { slug } = useParams();
  const person = getPerson(slug);
  if (!person) return <NotFoundPage what="profile" />;

  const ledProjects = publishedProjects.filter((p) => (p.team || []).some((m) => m.name === person.name));
  const path = `/team/${person.slug}`;

  return (
    <>
      <SEO
        fullTitle={`${person.name} | ${person.role}, ${site.name}`}
        description={`${person.bio.split(/(?<=\.)\s/)[0]} ${person.github || person.linkedin ? "Profile, projects and links." : ""}`.trim()}
        type="profile"
        image={person.image}
        imageAlt={person.image ? person.name : undefined}
      />
      <StructuredData
        data={[
          personLd(person),
          organizationLd(),
          pageLd("ProfilePage", path, { name: `${person.name} — ${person.role}, ${site.name}`, about: ids.person(person.slug), mainEntity: { "@id": ids.person(person.slug) } }),
          breadcrumbLd([
            ["Team", "/team"],
            [person.name, path],
          ]),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "Team", to: "/team" }, { label: person.name }]}
        title={person.name}
        intro={
          <>
            {person.role},{" "}
            <Link to="/about" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
              {site.name}
            </Link>
          </>
        }
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {person.linkedin && <ExternalLink href={person.linkedin}>LinkedIn</ExternalLink>}
          {person.github && <ExternalLink href={person.github}>GitHub</ExternalLink>}
          {person.website && <ExternalLink href={person.website}>Website</ExternalLink>}
        </div>
      </PageHeader>

      <article className="wrap grid gap-14 py-16 md:py-24 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-8">
          <section aria-labelledby="bio">
            <h2 id="bio" className="label mb-4">
              About
            </h2>
            <p className="text-2xl leading-snug text-bone md:text-[2rem] md:leading-[1.2]">{person.bio}</p>
          </section>

          {ledProjects.length > 0 && (
            <section aria-labelledby="projects">
              <h2 id="projects" className="label mb-4">
                Projects led
              </h2>
              <ul className="border-t border-bone/10">
                {ledProjects.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/projects/${p.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-bone/10 py-4">
                      <span>
                        <span className="block text-xl text-bone transition-colors group-hover:text-signal">{p.title}</span>
                        <span className="text-sm text-bone-mute">{p.tagline || p.summary}</span>
                      </span>
                      <span className="label shrink-0">{p.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {person.contributions?.length > 0 && (
            <section aria-labelledby="contrib">
              <h2 id="contrib" className="label mb-4">
                Contributions
              </h2>
              <ul className="space-y-2">
                {person.contributions.map((c) => (
                  <li key={c} className="relative pl-6 text-lg text-bone-dim">
                    <span aria-hidden className="absolute left-0 top-[0.75em] h-px w-3 bg-signal" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-10 lg:col-span-3 lg:col-start-10">
          <dl className="space-y-4 border-t border-bone/10 pt-4">
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-1 text-bone">
                {person.role}, {site.name}
              </dd>
            </div>
            {person.academic && (
              <div>
                <dt className="label">Studies</dt>
                <dd className="mt-1 text-bone">{person.academic}</dd>
              </div>
            )}
          </dl>
          {person.interests?.length > 0 && (
            <div>
              <h2 className="label mb-3">Interests</h2>
              <ul className="flex flex-wrap gap-2">
                {person.interests.map((t) => (
                  <li key={t} className="rounded-full border border-bone/15 px-3 py-1 text-sm text-bone-dim">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </>
  );
};

export default PersonPage;
