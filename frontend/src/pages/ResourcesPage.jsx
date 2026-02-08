import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoBookOutline,
  IoVideocamOutline,
  IoDocumentTextOutline,
  IoCodeSlashOutline,
  IoTrophyOutline,
  IoArrowForward,
} from "react-icons/io5";
import resourceService from "../services/resourceService";
import SEO from "../components/SEO";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["resources", searchQuery],
    queryFn: () => resourceService.getAllResources({ search: searchQuery }),
  });

  const resources = data?.data || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "article":
        return <IoDocumentTextOutline className="size-5" />;
      case "tutorial":
        return <IoCodeSlashOutline className="size-5" />;
      case "video":
        return <IoVideocamOutline className="size-5" />;
      case "book":
        return <IoBookOutline className="size-5" />;
      case "course":
        return <IoTrophyOutline className="size-5" />;
      default:
        return <IoDocumentTextOutline className="size-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24">
      <SEO
        title="Resources"
        description="Access curated AI benchmarks, datasets, and learning materials."
        canonical="https://gotham-ai.vercel.app/resources"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-blue-600 sm:text-sm">
            Gotham AI Labs
          </p>
          <h1 className="special-font mb-5 text-4xl font-black text-gray-900 sm:text-5xl md:text-6xl">
            AI{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Curated collection of AI/ML resources, tutorials, courses, and study
            materials to accelerate your learning journey
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-12 rounded-3xl border border-gray-200 bg-white/60 p-6 backdrop-blur"
        >
          <div className="relative">
            <IoSearchOutline className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, topics, or categories..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-blue-600"></div>
            <p className="text-lg text-gray-600">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-20 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto size-20 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Failed to Load Resources
            </h3>
            <p className="mb-6 text-gray-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Resources Grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
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
              {resources.map((resource) => (
                <motion.article
                  key={resource._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                    },
                  }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-colors duration-300 hover:border-blue-400"
                >
                  {/* Subtle top accent line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                  <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(resource.difficulty)}`}
                    >
                      {resource.difficulty}
                    </span>
                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="mb-6 min-h-[72px] text-gray-600">
                    {resource.description}
                  </p>

                  {resource.author && (
                    <div className="mb-8 flex items-center gap-3 text-sm text-gray-500">
                      <IoDocumentTextOutline className="size-5 text-blue-500" />
                      <span>By {resource.author}</span>
                    </div>
                  )}

                  <Link
                    to={`/resources/${resource.slug}`}
                    className="relative inline-flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-500"
                  >
                    Learn More
                    <IoArrowForward className="size-5" />
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && !error && resources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              No Resources Found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
