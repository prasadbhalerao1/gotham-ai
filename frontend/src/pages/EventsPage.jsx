import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoSearchOutline,
  IoFilterOutline,
} from "react-icons/io5";
import eventService from "../services/eventService";
import SEO from "../components/SEO";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
  });

  const events = data?.data || [];

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology":
        return "bg-blue-500";
      case "Gaming":
        return "bg-green-500";
      case "Networking":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  const categories = [
    "Technology",
    "Gaming",
    "Networking",
    "Workshop",
    "Seminar",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-24">
      <SEO
        title="Events"
        description="Discover upcoming AI workshops, seminars, and networking events at Gotham AI."
        canonical="https://gotham-ai.vercel.app/events"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h1 className="special-font mb-4 text-5xl font-black text-gray-900 sm:text-6xl md:text-7xl">
            All{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Discover all our exciting events, workshops, and gatherings. Join
            the Gotham AI community to learn, innovate, and shape the future.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 rounded-2xl bg-white p-6 shadow-xl"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-colors focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
            >
              <IoFilterOutline className="size-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t border-gray-200 pt-6"
            >
              {/* Category Filter */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-blue-600"></div>
            <p className="text-lg text-gray-600">Loading events...</p>
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
              Failed to Load Events
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

        {/* Events Grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  id={event.slug}
                  key={event._id}
                  layout
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                      scale: 0.9,
                      rotateX: 10,
                      filter: "blur(10px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.8,
                        opacity: { duration: 0.4 },
                        filter: { duration: 0.5 },
                      },
                    },
                    exit: {
                      opacity: 0,
                      scale: 0.85,
                      filter: "blur(8px)",
                      transition: { duration: 0.3, ease: "easeInOut" },
                    },
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                    rotateY: 2,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                >
                  {/* Event Image */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <img
                      src={event.image}
                      alt={event.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Category Badge */}
                    {event.category && (
                      <div className="absolute right-4 top-4">
                        <span
                          className={`${getCategoryColor(event.category)} rounded-full px-3 py-1 text-xs font-semibold text-white`}
                        >
                          {event.category}
                        </span>
                      </div>
                    )}

                    {/* Attendees */}
                    {event.attendees && (
                      <div className="absolute bottom-4 right-4 flex items-center space-x-1 rounded-full bg-black/30 px-3 py-1 text-sm text-white backdrop-blur">
                        <IoPeopleOutline className="size-4" />
                        <span>{event.attendees}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {event.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {event.description}
                    </p>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <IoCalendarOutline className="size-4 text-blue-500" />
                        <span>{event.dateDisplay}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <IoTimeOutline className="size-4 text-cyan-500" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <IoLocationOutline className="size-4 text-green-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="mb-6">
              <svg
                className="mx-auto size-20 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              No Events Found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
