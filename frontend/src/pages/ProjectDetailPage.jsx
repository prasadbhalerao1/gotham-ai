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
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_35px_80px_-35px_rgba(15,23,42,0.9)]"
        >
          <div className="relative h-80 bg-gradient-to-br from-blue-900 to-slate-900">
            {project.heroImage && (
              <img
                src={project.heroImage}
                alt={project.title}
                className="absolute inset-0 size-full object-cover opacity-50"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-transparent"></div>

            <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12">
              <h1 className="special-font mb-3 text-4xl font-black sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-lg text-slate-200">
                {project.shortDescription}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-3 font-semibold text-cyan-300">
                  <IoBusinessOutline className="size-5" />
                  Industry Partner
                </div>
                <p className="text-lg font-bold text-white">
                  {project.industryPartner}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-3 font-semibold text-cyan-300">
                  <IoRibbonOutline className="size-5" />
                  Source
                </div>
                <p className="text-lg font-bold text-white">
                  {project.source}
                  {project.sourceLink && (
                    <a
                      href={project.sourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 underline"
                    >
                      <IoLinkOutline /> Visit
                    </a>
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-3 font-semibold text-cyan-300">
                  <IoPeopleOutline className="size-5" />
                  Gotham AI Team
                </div>
                <p className="text-lg font-bold text-white">
                  Versanix Community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-4 text-3xl font-bold">Overview</h2>
                  <div className="space-y-4 leading-relaxed text-slate-200">
                    {overviewParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {galleryItems.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-6 text-3xl font-bold">Project Gallery</h2>
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
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-6 text-3xl font-bold">
                      Key Capabilities
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {project.keyCapabilities.map((capability, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <IoCheckmarkCircleOutline className="mt-1 size-6 shrink-0 text-cyan-300" />
                          <p className="text-slate-200">{capability}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {project.projectTeam?.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-5 text-2xl font-bold">Project Team</h3>
                    <div className="space-y-4">
                      {project.projectTeam.map((member, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                          <p className="font-semibold text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-cyan-300">{member.role}</p>
                        </div>
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
