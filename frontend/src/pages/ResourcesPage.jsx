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
        return <IoDocumentTextOutline className="w-5 h-5" />;
      case "tutorial":
        return <IoCodeSlashOutline className="w-5 h-5" />;
      case "video":
        return <IoVideocamOutline className="w-5 h-5" />;
      case "book":
        return <IoBookOutline className="w-5 h-5" />;
      case "course":
        return <IoTrophyOutline className="w-5 h-5" />;
      default:
        return <IoDocumentTextOutline className="w-5 h-5" />;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="uppercase tracking-[0.4em] text-blue-600 text-xs sm:text-sm mb-3">
            Gotham AI Labs
          </p>
          <h1 className="special-font text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-5">
            AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Resources
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Curated collection of AI/ML resources, tutorials, courses, and study
            materials to accelerate your learning journey
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/60 border border-gray-200 rounded-3xl p-6 backdrop-blur mb-12"
        >
          <div className="relative">
            <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, topics, or categories..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-red-500"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Resources
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Resources Grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
                  className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 hover:border-blue-400 transition-colors duration-300"
                >
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold">
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}
                    >
                      {resource.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-6 min-h-[72px]">
                    {resource.description}
                  </p>

                  {resource.author && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
                      <IoDocumentTextOutline className="w-5 h-5 text-blue-500" />
                      <span>By {resource.author}</span>
                    </div>
                  )}

                  <Link
                    to={`/resources/${resource.slug}`}
                    className="relative inline-flex w-full items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-500 hover:to-cyan-500 transition-all"
                  >
                    Learn More
                    <IoArrowForward className="w-5 h-5" />
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
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Resources Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
