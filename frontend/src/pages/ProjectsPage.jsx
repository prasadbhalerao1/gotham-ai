import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, itemListLd, pageLd } from "../lib/structuredData.js";
import PageHeader from "../components/PageHeader.jsx";
import IndexList from "../components/IndexList.jsx";
import ProjectPlate from "../components/ProjectPlate.jsx";
import { partners, projectNumber, publishedProjects } from "../data/site.js";

const ProjectsPage = () => {
  const rows = publishedProjects.map((p) => ({
    key: p.slug,
    to: `/projects/${p.slug}`,
    num: projectNumber(p),
    title: p.title,
    sub: p.tagline || p.summary,
    image: p.cover,
    plate: <ProjectPlate project={p} number={projectNumber(p)} compact className="size-full !p-4" />,
    right: (
      <>
        <span className="text-signal">{p.status}</span>
        <span>{p.partner.name}</span>
      </>
    ),
  }));

  return (
    <>
      <SEO
        fullTitle="Student AI & Software Projects with Industry | Gotham AI"
        description="Industry projects led by Gotham AI members at JSPM's RSCOE, Pune — AI access control, field-workforce platforms, post-quantum cryptography and cybercrime intelligence."
      />
      <StructuredData
        data={[
          pageLd("CollectionPage", "/projects", { name: "Gotham AI projects" }),
          breadcrumbLd([["Projects", "/projects"]]),
          itemListLd(
            "Gotham AI projects",
            publishedProjects.map((p) => ({ name: p.title, url: `/projects/${p.slug}` })),
          ),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "Projects" }]}
        title={
          <>
            Projects <span className="accent">in</span> the works
          </>
        }
        intro={`${publishedProjects.length} industry projects with ${partners.length} partners, each led by a Gotham AI member.`}
      />
      <section className="wrap py-10 md:py-16">
        <IndexList rows={rows} label="Projects" />
      </section>
    </>
  );
};

export default ProjectsPage;
