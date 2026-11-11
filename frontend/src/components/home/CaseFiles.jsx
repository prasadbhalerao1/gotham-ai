import { Link } from "react-router-dom";
import { partners, projectNumber, publishedProjects } from "../../data/site.js";
import IndexList from "../IndexList.jsx";
import ProjectPlate from "../ProjectPlate.jsx";
import { SectionHead } from "../ui.jsx";

const CaseFiles = () => (
  <section id="projects" aria-labelledby="projects-title" className="relative bg-ink py-28 md:py-40">
    <SectionHead
      label="Projects"
      title={
        <span id="projects-title">
          Projects <span className="accent">in</span> the works
        </span>
      }
      aside={`Real problems from ${partners.length} industry partners, each carried by a Gotham AI member from first brief to working system.`}
    />
    <div className="wrap">
      <IndexList
        label="Projects"
        rows={publishedProjects.map((p) => ({
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
        }))}
      />
      <div className="mt-10 flex justify-end">
        <Link to="/projects" className="btn-ghost">
          All projects →
        </Link>
      </div>
    </div>
  </section>
);

export default CaseFiles;
