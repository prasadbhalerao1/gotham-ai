import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoBriefcaseOutline,
  IoPeopleOutline,
  IoChevronForward,
} from "react-icons/io5";
import projectService from "../services/projectService";
import SEO from "../components/SEO";

const statusStyles = {
  "In Progress": "bg-green-100 text-green-700",
  "Documentation Phase": "bg-yellow-50 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
  "On Hold": "bg-gray-100 text-gray-600",
};

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAllProjects(),
  });

  const projects = data?.data || [];

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((project) => {
      const target =
        `${project.title} ${project.shortDescription} ${project.industryPartner} ${project.status}`.toLowerCase();
      return target.includes(searchQuery.toLowerCase());
    });
  }, [projects, searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24">
      <SEO
        title="Projects"
        description="Explore strategic AI projects and collaborations at Gotham AI Labs."
        canonical="https://gotham-ai.vercel.app/projects"
      />
      <div className="mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-blue-300 sm:text-sm">
            Gotham AI Labs
          </p>
          <h1 className="special-font mb-5 text-4xl font-black sm:text-5xl md:text-6xl">
            Strategic{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            Explore the flagship collaborations we are building with industry,
            defense, and community partners across India.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div className="relative">
            <IoSearchOutline className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, partners, or statuses"
              className="w-full rounded-2xl border border-white/10 bg-transparent py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </motion.div>

        {isLoading && (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-cyan-400"></div>
            <p className="text-lg text-slate-300">
              Fetching project portfolio...
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="py-24 text-center">
            <h3 className="mb-3 text-2xl font-bold">Unable to load projects</h3>
            <p className="mb-6 text-slate-400">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.1 },
              },
            }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.article
                  key={project._id || project.slug}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                    },
                  }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 transition-colors duration-300 hover:border-cyan-500/30"
                >
                  {/* Subtle top accent line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                  <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                      <IoBriefcaseOutline className="size-5" />
                      {project.industryPartner}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[project.status] || "bg-slate-100 text-slate-700"}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-6 min-h-[72px] text-slate-300">
                    {project.shortDescription}
                  </p>

                  <div className="mb-8 flex items-center gap-3 text-sm text-slate-400">
                    <IoPeopleOutline className="size-5 text-cyan-300" />
                    <span>Gotham AI – Versanix Community</span>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="relative inline-flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500"
                  >
                    Learn More
                    <IoChevronForward className="size-5" />
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="mb-4 text-2xl font-bold">
              No projects match that search yet.
            </h3>
            <p className="mb-6 text-slate-400">
              Try a different keyword or partner.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
