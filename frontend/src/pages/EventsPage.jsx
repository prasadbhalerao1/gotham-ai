import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoSearchOutline,
  IoFilterOutline,
} from 'react-icons/io5';
import eventService from '../services/eventService';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAllEvents(),
    onError: (err) => {
      console.error('Failed to fetch events:', err.message);
    },
  });

  const events = data?.data || [];

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technology':
        return 'bg-blue-500';
      case 'Gaming':
        return 'bg-green-500';
      case 'Networking':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const categories = ['Technology', 'Gaming', 'Networking', 'Workshop', 'Seminar'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h1 className="special-font text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-4">
            All <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all our exciting events, workshops, and gatherings. Join the Gotham AI community to learn, innovate, and shape the future.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold"
            >
              <IoFilterOutline className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Events</h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  layout
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 40,
                      scale: 0.9,
                      rotateX: 10,
                      filter: "blur(10px)"
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
                        filter: { duration: 0.5 }
                      }
                    },
                    exit: {
                      opacity: 0,
                      scale: 0.85,
                      filter: "blur(8px)",
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }
                  }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    rotateY: 2,
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    } 
                  }}
                >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Category Badge */}
                  {event.category && (
                    <div className="absolute top-4 right-4">
                      <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {event.category}
                      </span>
                    </div>
                  )}

                  {/* Attendees */}
                  {event.attendees && (
                    <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-white text-sm">
                      <IoPeopleOutline className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <IoCalendarOutline className="w-4 h-4 text-blue-500" />
                      <span>{event.dateDisplay}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <IoTimeOutline className="w-4 h-4 text-cyan-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <IoLocationOutline className="w-4 h-4 text-green-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.slug}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center"
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
            className="text-center py-20"
          >
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
