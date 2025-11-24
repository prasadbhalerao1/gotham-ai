import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  IoArrowBack,
  IoBriefcaseOutline,
  IoBusinessOutline,
  IoLinkOutline,
  IoRibbonOutline,
  IoPeopleOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import projectService from '../services/projectService';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../styles/gallery.css';

const statusBadge = {
  'In Progress': 'bg-green-100 text-green-700',
  'Documentation Phase': 'bg-yellow-50 text-yellow-700',
  Completed: 'bg-blue-100 text-blue-700',
  'On Hold': 'bg-gray-100 text-gray-600',
};

const ProjectDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectService.getProjectBySlug(slug),
  });

  const project = data?.data;

  const overviewParagraphs = useMemo(() => {
    if (!project?.overview) return [];
    return project.overview.split('\n').map((para) => para.trim()).filter(Boolean);
  }, [project?.overview]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading project intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 text-center text-white">
        <div>
          <h2 className="text-3xl font-bold mb-4">Project not found</h2>
          <p className="text-slate-300 mb-6">
            {error ? error.message : 'The requested project is unavailable.'}
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold"
          >
            <IoArrowBack className="w-5 h-5" /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const galleryItems = (project.gallery?.length ? project.gallery : [project.heroImage]).filter(Boolean).map((img) => ({
    original: img,
    thumbnail: img,
  }));

  if (project.disableDetail) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold"
            >
              <IoArrowBack className="w-5 h-5" /> Back to Projects
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div>
                <p className="uppercase tracking-[0.4em] text-cyan-300 text-xs mb-3">Spotlight</p>
                <h1 className="special-font text-4xl font-black mb-2">{project.title}</h1>
                <p className="text-slate-200">{project.shortDescription}</p>
              </div>
              <div className="rounded-2xl overflow-hidden bg-white/5 p-4">
                <div className="gallery-container">
                  <ImageGallery
                    items={galleryItems.length ? galleryItems : [{ original: project.heroImage, thumbnail: project.heroImage }]}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    autoPlay={false}
                    showThumbnails={galleryItems.length > 1}
                    showNav={galleryItems.length > 1}
                    additionalClass="custom-gallery"
                    renderItem={(item) => (
                      <div className="gallery-slide">
                        <img
                          src={item.original}
                          alt={item.originalAlt || project.title}
                          className="gallery-image"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-cyan-200 font-semibold mb-1">Industry Partner</p>
                  <p className="text-xl font-bold">{project.industryPartner}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-cyan-200 font-semibold mb-1">Status</p>
                  <p className="text-xl font-bold">{project.status}</p>
                </div>
              </div>
              {project.keyCapabilities && (
                <div className="bg-white/5 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4">Key Capabilities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.keyCapabilities.map((capability, index) => (
                      <div key={index} className="flex items-start gap-3 text-slate-200">
                        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400"></span>
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold"
          >
            <IoArrowBack className="w-5 h-5" /> Back to Projects
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-[0_35px_80px_-35px_rgba(15,23,42,0.9)]"
        >
          <div className="relative h-80 bg-gradient-to-br from-blue-900 to-slate-900">
            {project.heroImage && (
              <img
                src={project.heroImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-transparent"></div>

            <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-end h-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-semibold">
                  <IoBriefcaseOutline className="w-5 h-5 text-cyan-300" />
                  {project.industryPartner}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusBadge[project.status] || 'bg-white/90 text-slate-800'}`}>
                  {project.status}
                </span>
              </div>
              <h1 className="special-font text-4xl sm:text-5xl md:text-6xl font-black mb-3">
                {project.title}
              </h1>
              <p className="text-slate-200 text-lg max-w-3xl">
                {project.shortDescription}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 text-cyan-300 font-semibold">
                  <IoBusinessOutline className="w-5 h-5" />
                  Industry Partner
                </div>
                <p className="text-white text-lg font-bold">{project.industryPartner}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 text-cyan-300 font-semibold">
                  <IoRibbonOutline className="w-5 h-5" />
                  Source
                </div>
                <p className="text-white text-lg font-bold">
                  {project.source}
                  {project.sourceLink && (
                    <a
                      href={project.sourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 text-sm font-semibold ml-2 underline"
                    >
                      <IoLinkOutline /> Visit
                    </a>
                  )}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 text-cyan-300 font-semibold">
                  <IoPeopleOutline className="w-5 h-5" />
                  Gotham AI Team
                </div>
                <p className="text-white text-lg font-bold">Versanix Community</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-3xl font-bold mb-4">Overview</h2>
                  <div className="space-y-4 text-slate-200 leading-relaxed">
                    {overviewParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {galleryItems.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-3xl font-bold mb-6">Project Gallery</h2>
                    <div className="gallery-container">
                      <ImageGallery
                        items={galleryItems}
                        showPlayButton={false}
                        showFullscreenButton={true}
                        showThumbnails={galleryItems.length > 1}
                        showNav={galleryItems.length > 1}
                        autoPlay={false}
                        additionalClass="custom-gallery"
                        renderItem={(item) => (
                          <div className="gallery-slide">
                            <img
                              src={item.original}
                              alt={item.originalAlt || project.title}
                              className="gallery-image"
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}

                {project.keyCapabilities?.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-3xl font-bold mb-6">Key Capabilities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.keyCapabilities.map((capability, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4"
                        >
                          <IoCheckmarkCircleOutline className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-1" />
                          <p className="text-slate-200">{capability}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {project.projectTeam?.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold mb-5">Project Team</h3>
                    <div className="space-y-4">
                      {project.projectTeam.map((member, index) => (
                        <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                          <p className="text-white font-semibold">{member.name}</p>
                          <p className="text-cyan-300 text-sm">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.tags?.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold mb-4">Focus Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default ProjectDetailPage;

