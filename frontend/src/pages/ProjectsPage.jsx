import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  IoSearchOutline,
  IoBriefcaseOutline,
  IoPeopleOutline,
  IoChevronForward,
} from 'react-icons/io5';
import projectService from '../services/projectService';
import SEO from '../components/SEO';

const statusStyles = {
  'In Progress': 'bg-green-100 text-green-700',
  'Documentation Phase': 'bg-yellow-50 text-yellow-700',
  Completed: 'bg-blue-100 text-blue-700',
  'On Hold': 'bg-gray-100 text-gray-600',
};

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');


  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAllProjects(),
  });

  const projects = data?.data || [];

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((project) => {
      const target = `${project.title} ${project.shortDescription} ${project.industryPartner} ${project.status}`.toLowerCase();
      return target.includes(searchQuery.toLowerCase());
    });
  }, [projects, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24">
      <SEO 
        title="Projects" 
        description="Explore strategic AI projects and collaborations at Gotham AI Labs."
        canonical="https://gotham-ai.vercel.app/projects"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="uppercase tracking-[0.4em] text-blue-300 text-xs sm:text-sm mb-3">
            Gotham AI Labs
          </p>
          <h1 className="special-font text-4xl sm:text-5xl md:text-6xl font-black mb-5">
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Projects</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Explore the flagship collaborations we are building with industry, defense, and community partners across India.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur"
        >
          <div className="relative">
            <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, partners, or statuses"
              className="w-full bg-transparent border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </motion.div>

        {isLoading && (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300 text-lg">Fetching project portfolio...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold mb-3">Unable to load projects</h3>
            <p className="text-slate-400 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
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
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
                    },
                  }}
                  whileHover={{ y: -10 }}
                  className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.9)]"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 text-sm text-cyan-200 font-semibold">
                      <IoBriefcaseOutline className="w-5 h-5" />
                      {project.industryPartner}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[project.status] || 'bg-slate-100 text-slate-700'}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 mb-6 min-h-[72px]">
                    {project.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-8">
                    <IoPeopleOutline className="w-5 h-5 text-cyan-300" />
                    <span>Gotham AI – Versanix Community</span>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="relative inline-flex w-full items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    Learn More
                    <IoChevronForward className="w-5 h-5" />
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold mb-4">No projects match that search yet.</h3>
            <p className="text-slate-400 mb-6">Try a different keyword or partner.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold"
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

