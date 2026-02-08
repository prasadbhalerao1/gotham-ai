import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { IoArrowBack, IoOpenOutline } from "react-icons/io5";
import resourceService from "../services/resourceService";

const ResourceDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["resource", slug],
    queryFn: () => resourceService.getResourceBySlug(slug),
  });

  const resource = data?.data;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-blue-600"></div>
          <p className="text-lg text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Resource Not Found
          </h2>
          <p className="mb-8 text-gray-600">
            The resource you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            <IoArrowBack /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <IoArrowBack className="size-5" /> Back to Resources
          </Link>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="relative flex h-80 flex-col justify-end bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8">
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  {resource.category}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(resource.difficulty)}`}
                >
                  {resource.difficulty}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  {resource.type}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-black text-white sm:text-5xl">
                {resource.title}
              </h1>

              {resource.author && (
                <p className="text-lg text-white/90">
                  By <span className="font-semibold">{resource.author}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Bar */}
          {resource.url && (
            <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-8 py-4">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
              >
                Access Resource
                <IoOpenOutline className="size-5" />
              </a>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About This Resource
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {resource.description}
              </p>
            </div>

            {/* Detailed Content */}
            {resource.content && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Details
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </div>
            )}

            {/* CTA */}
            {resource.url && (
              <div className="rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 p-8 text-center">
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Ready to Learn?
                </h3>
                <p className="mb-6 text-gray-700">
                  Access this resource and start your learning journey today!
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700"
                >
                  Get Started Now
                  <IoOpenOutline className="size-6" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
