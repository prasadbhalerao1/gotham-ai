import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, projectLd } from "../lib/structuredData.js";
import Gallery from "../components/Gallery.jsx";
import ProjectPlate from "../components/ProjectPlate.jsx";
import { Reveal } from "../components/ui.jsx";
import { Block, Breadcrumbs, Chip, MetaStrip, NumberedList, ParallaxImage, PrevNext, SectionTabs } from "../components/detail.jsx";
import { getProject, personByName, projectNumber, publishedProjects, site } from "../data/site.js";
import { useContact } from "../lib/contact.js";
import NotFoundPage from "./NotFoundPage.jsx";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = getProject(slug);
  const openContact = useContact();

  const tabs = useMemo(() => {
    if (!project) return [];
    return [
      { id: "overview", label: "Overview" },
      { id: "capabilities", label: "Capabilities", count: project.capabilities.length },
      project.team?.length && { id: "team", label: "Team" },
      project.gallery?.length && { id: "gallery", label: "Gallery", count: project.gallery.length },
    ].filter(Boolean);
  }, [project]);

  if (!project) return <NotFoundPage what="project" />;

  const i = publishedProjects.indexOf(project);
  const toNav = (p) => p && { to: `/projects/${p.slug}`, title: p.title, meta: p.tagline };
  const lead = project.team?.[0];

  return (
    <>
      <SEO
        title={project.tagline && project.tagline.length <= 40 ? `${project.title} — ${project.tagline}` : `${project.title} — Industry Project`}
        description={`${project.summary} A Gotham AI industry project with ${project.partner.name}. Status: ${project.status}.`}
        image={project.cover}
        type="article"
      />
      <StructuredData
        data={[
          projectLd(project),
          breadcrumbLd([
            ["Projects", "/projects"],
            [project.title, `/projects/${project.slug}`],
          ]),
        ]}
      />

      <article>
        <header className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-7">
              <Breadcrumbs items={[{ label: "Projects", to: "/projects" }, { label: `Case ${projectNumber(project)}` }]} />
              <Reveal className="mt-10 flex flex-wrap gap-2">
                <Chip tone="signal">{project.status}</Chip>
                <Chip>Industry project</Chip>
              </Reveal>
              <div>
                <h1 data-reveal="mask" className="display mt-6 text-balance text-[17vw] sm:text-[12vw] lg:text-[8vw] xl:text-[8rem]">{project.title}</h1>
                {project.tagline && <p className="mt-3 font-serif text-3xl italic text-bone-dim md:text-4xl">{project.tagline}</p>}
              </div>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl text-xl leading-relaxed text-bone-dim">{project.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {(project.links || []).map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-signal">
                      {l.label} ↗
                    </a>
                  ))}
                  <a href={site.joinForm} target="_blank" rel="noreferrer" className={project.links?.length ? "btn-ghost" : "btn-signal"}>
                    Build with us ↗
                  </a>
                  <button type="button" onClick={openContact} className="btn-ghost">
                    Partner with us
                  </button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-5">
              {project.cover ? (
                <ParallaxImage src={project.cover} alt={project.title} className="aspect-[4/3] w-full" />
              ) : (
                <ProjectPlate project={project} number={projectNumber(project)} className="aspect-[4/3] w-full" />
              )}
            </Reveal>
          </div>

          <div className="wrap mt-14">
            <MetaStrip
              items={[
                ["Status", project.status],
                [
                  "Industry partner",
                  project.partner.url ? (
                    <a href={project.partner.url} target="_blank" rel="noreferrer" className="underline decoration-bone/30 underline-offset-4 hover:decoration-signal">
                      {project.partner.name} ↗
                    </a>
                  ) : (
                    project.partner.name
                  ),
                ],
                lead && [
                  lead.role,
                  personByName(lead.name) ? (
                    <Link key="lead" to={`/team/${personByName(lead.name).slug}`} className="underline decoration-bone/30 underline-offset-4 hover:text-signal">
                      {lead.name}
                    </Link>
                  ) : (
                    lead.name
                  ),
                ],
                ["Capabilities", project.capabilities.length],
              ]}
            />
          </div>
        </header>

        <SectionTabs tabs={tabs} />

        <section id="overview" aria-label="Overview" className="scroll-mt-24 py-16 md:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <p className="label lg:col-span-3">Overview</p>
            <Reveal stagger={0.1} className="space-y-6 lg:col-span-8">
              {project.overview.map((para, k) => (
                <p key={k} className={k === 0 ? "text-2xl leading-snug text-bone md:text-[2rem] md:leading-[1.2]" : "text-lg leading-relaxed text-bone-dim"}>
                  {para}
                </p>
              ))}
              {project.source && <p className="label pt-4">Source — {project.source}</p>}
            </Reveal>
          </div>
        </section>

        <Block id="capabilities" title="Capabilities" label={`${project.capabilities.length} specified`} className="border-t border-bone/10">
          <NumberedList items={project.capabilities} />
        </Block>

        {project.team?.length > 0 && (
          <Block id="team" title="Team" className="border-t border-bone/10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.team.map((m) => (
                <li key={m.name} className="border border-bone/10 p-6">
                  <p className="label">{m.role}</p>
                  <p className="mt-3 text-2xl text-bone">
                    {personByName(m.name) ? (
                      <Link to={`/team/${personByName(m.name).slug}`} className="hover:text-signal">
                        {m.name} →
                      </Link>
                    ) : (
                      m.name
                    )}
                  </p>
                </li>
              ))}
              <li>
                <a href={site.joinForm} target="_blank" rel="noreferrer" className="flex h-full flex-col justify-between border border-dashed border-bone/20 p-6 transition-colors hover:border-signal">
                  <span className="label">Open seat</span>
                  <span className="mt-3 text-2xl text-bone-dim">Want in? Join the squad ↗</span>
                </a>
              </li>
            </ul>
          </Block>
        )}

        {project.gallery?.length > 0 && (
          <Block id="gallery" title="Gallery" label={`${project.gallery.length} frames`} className="border-t border-bone/10 bg-ink-800">
            <Gallery items={project.gallery} title={project.title} />
          </Block>
        )}
      </article>

      <PrevNext kind="project" prev={toNav(publishedProjects[i - 1])} next={toNav(publishedProjects[i + 1])} />
    </>
  );
};

export default ProjectDetailPage;
