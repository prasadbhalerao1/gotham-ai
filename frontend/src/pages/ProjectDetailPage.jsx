import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  IoArrowBack,
  IoBusinessOutline,
  IoLinkOutline,
  IoRibbonOutline,
  IoPeopleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import projectService from "../services/projectService";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../styles/gallery.css";

const ProjectDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => projectService.getProjectBySlug(slug),
  });

  const project = data?.data;

  const overviewParagraphs = useMemo(() => {
    if (!project?.overview) return [];
    return project.overview
      .split("\n")
      .map((para) => para.trim())
      .filter(Boolean);
  }, [project?.overview]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-cyan-400"></div>
          <p className="text-lg">Loading project intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 text-center text-white">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Project not found</h2>
          <p className="mb-6 text-slate-300">
            {error ? error.message : "The requested project is unavailable."}
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold"
          >
            <IoArrowBack className="size-5" /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isVideo = (url) =>
    typeof url === "string" && /\.(mp4|webm|ogg)$/i.test(url);

  const galleryItems = (project.gallery ?? []).filter(Boolean).map((url) => {
    const video = isVideo(url);
    return {
      original: url,
      thumbnail: url,
      renderItem: video
        ? (item) => (
            <div
              className="gallery-slide"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
              }}
            >
              <video
                controls
                src={item.original}
                style={{ maxHeight: "600px", width: "auto" }}
              />
            </div>
          )
        : undefined,
      renderThumbInner: video
        ? () => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "80px",
                background: "#111",
              }}
            >
              <svg fill="#fff" viewBox="0 0 24 24" width="32px" height="32px">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )
        : undefined,
    };
  });

  if (project.disableDetail) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-semibold text-slate-300 transition-colors hover:text-white"
            >
              <IoArrowBack className="size-5" /> Back to Projects
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl"
          >
            <div className="space-y-6 p-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.4em] text-cyan-300">
                  Spotlight
                </p>
                <h1 className="special-font mb-2 text-4xl font-black">
                  {project.title}
                </h1>
                <p className="text-slate-200">{project.shortDescription}</p>
              </div>
              {galleryItems.length > 0 && (
                <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                  <div className="gallery-container">
                    <ImageGallery
                      items={galleryItems}
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
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    Industry Partner
                  </p>
                  <p className="text-xl font-bold">{project.industryPartner}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    Status
                  </p>
                  <p className="text-xl font-bold">{project.status}</p>
                </div>
              </div>
              {project.keyCapabilities && (
                <div className="rounded-2xl bg-white/5 p-6">
                  <h2 className="mb-4 text-2xl font-bold">Key Capabilities</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {project.keyCapabilities.map((capability, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-slate-200"
                      >
                        <span className="mt-1 size-2 rounded-full bg-cyan-400"></span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-12 md:py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-semibold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
          >
            <IoArrowBack className="size-5" /> Back to Projects
          </Link>
        </motion.div>

        {/* Split Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
        >
          {/* Left Side: Title & Info */}
          <div className="space-y-8 lg:col-span-7">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                Gotham AI Labs Spotlight
              </p>
              <h1 className="special-font leading-tight mb-4 text-5xl font-black text-white sm:text-6xl md:text-7xl">
                {project.title}
              </h1>
              <p className="max-w-xl text-xl text-slate-300 md:text-2xl leading-relaxed">
                {project.shortDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition-all hover:bg-white/10 hover:shadow-xl">
                <div className="rounded-xl bg-blue-900/50 p-3 text-cyan-400">
                  <IoBusinessOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Partner</p>
                  <p className="font-bold text-white transition-colors">{project.industryPartner}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition-all hover:bg-white/10 hover:shadow-xl">
                <div className="rounded-xl bg-cyan-900/50 p-3 text-cyan-400">
                  <IoRibbonOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</p>
                  <div className="font-bold text-white flex items-center gap-2">
                    {project.source}
                    {project.sourceLink && (
                      <a
                        href={project.sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                         <IoLinkOutline />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition-all hover:bg-white/10 hover:shadow-xl sm:col-span-2 lg:col-span-1">
                <div className="rounded-xl bg-slate-800 p-3 text-cyan-400">
                  <IoPeopleOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Developed By</p>
                  <p className="font-bold text-white">Versanix Community</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition-all hover:bg-white/10 hover:shadow-xl sm:col-span-2 lg:col-span-1">
                <div className="rounded-xl bg-green-900/40 p-3 text-green-400 border border-green-500/20">
                  <IoCheckmarkCircleOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status</p>
                  <p className="font-bold text-white">{project.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Floating Cover Image */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              <img
                src={project.heroImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format"}
                alt={project.title}
                className="aspect-square w-full object-cover lg:aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-transparent mix-blend-overlay"></div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-16 lg:col-span-8"
          >
            {/* Overview / Brief */}
            <div className="pt-4">
              <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Project Overview
              </h2>
              <div className="prose prose-lg sm:prose-xl max-w-none prose-p:text-slate-300 prose-p:leading-relaxed marker:text-cyan-400">
                {overviewParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Key Capabilities */}
            {project.keyCapabilities?.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Key Capabilities
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.keyCapabilities.map((capability, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur transition-all hover:bg-white/[0.08]"
                    >
                      <IoCheckmarkCircleOutline className="mt-1 size-6 shrink-0 text-cyan-400 transition-transform group-hover:-translate-y-1" />
                      <p className="text-slate-200 leading-relaxed font-medium">{capability}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {galleryItems.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Project Gallery
                </h2>
                <div className="mt-4 drop-shadow-2xl">
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
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-4"
          >
            {/* Project Team Widget */}
            {project.projectTeam?.length > 0 && (
              <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xl shadow-2xl sm:p-8">
                <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-cyan-400">
                  Project Team
                </h3>
                <div className="space-y-4">
                  {project.projectTeam.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group flex gap-4 rounded-2xl border border-white/5 p-4 transition-all hover:bg-white/10"
                    >
                       <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2 ring-white/10 transition-transform duration-500 group-hover:scale-110">
                         <span className="text-lg font-bold text-cyan-400">{member.name.charAt(0)}</span>
                       </div>
                       <div>
                         <p className="font-bold text-white text-lg">{member.name}</p>
                         <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">{member.role}</p>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
