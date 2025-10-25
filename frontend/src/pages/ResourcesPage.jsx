/*
 * ANIMATION FEATURES:
 * 1. Buttery smooth card entrance with Framer Motion stagger (0.5s duration, 0.08s stagger)
 * 2. Smooth spring physics with custom easing curve
 * 3. AnimatePresence for smooth filtering transitions
 * 4. Layout animations when cards rearrange
 * 5. CSS-based hover effects preserved (lift and shadow)
 * 6. No jitter - animations only run once on mount
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  IoSearchOutline, 
  IoFilterOutline,
  IoBookOutline,
  IoVideocamOutline,
  IoDocumentTextOutline,
  IoCodeSlashOutline,
  IoTrophyOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoArrowForward
} from 'react-icons/io5';
import resourceService from '../services/resourceService';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['resources', { search: searchQuery, type: selectedType, category: selectedCategory, difficulty: selectedDifficulty }],
    queryFn: () => resourceService.getAllResources({
      search: searchQuery,
      type: selectedType,
      category: selectedCategory,
      difficulty: selectedDifficulty,
    }),
    onError: (err) => {
      console.error('Failed to fetch resources:', err.message);
    },
  });

  const resources = data?.data || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <IoDocumentTextOutline className="w-5 h-5" />;
      case 'tutorial':
        return <IoCodeSlashOutline className="w-5 h-5" />;
      case 'video':
        return <IoVideocamOutline className="w-5 h-5" />;
      case 'book':
        return <IoBookOutline className="w-5 h-5" />;
      case 'course':
        return <IoTrophyOutline className="w-5 h-5" />;
      default:
        return <IoDocumentTextOutline className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const types = ['article', 'tutorial', 'video', 'book', 'course', 'dataset', 'tool', 'paper'];
  const categories = ['AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Robotics', 'Data Science'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h1 className="special-font text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-4">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Resources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated collection of AI/ML resources, tutorials, courses, and study materials to accelerate your learning journey
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
                placeholder="Search resources..."
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
              className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

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

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
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
            <p className="text-gray-600 text-lg">Loading resources...</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Resources</h3>
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
              {resources.map((resource, index) => (
                <motion.div
                  key={resource._id}
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
                {/* Resource Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-400">
                  {resource.image ? (
                    <img 
                      src={resource.image} 
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                      {getTypeIcon(resource.type)}
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {resource.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <IoTrophyOutline className="w-4 h-4" /> Featured
                      </span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {resource.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Author */}
                  {resource.author && (
                    <p className="text-sm text-gray-500 mb-4">
                      By <span className="font-semibold">{resource.author}</span>
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <IoEyeOutline className="w-4 h-4" />
                      <span>{resource.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoHeartOutline className="w-4 h-4" />
                      <span>{resource.likes || 0}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    to={`/resources/${resource.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                  >
                    Learn More
                    <IoArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setSelectedCategory('');
                setSelectedDifficulty('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
