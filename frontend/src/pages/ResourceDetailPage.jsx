import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  IoArrowBack,
  IoOpenOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoShareSocialOutline,
  IoBookmarkOutline
} from 'react-icons/io5';
import resourceService from '../services/resourceService';

const ResourceDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', slug],
    queryFn: () => resourceService.getResourceBySlug(slug),
  });

  const resource = data?.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Resource Not Found</h2>
          <p className="text-gray-600 mb-8">The resource you're looking for doesn't exist.</p>
          <Link 
            to="/resources" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IoArrowBack /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/resources" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <IoArrowBack className="w-5 h-5" /> Back to Resources
          </Link>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-80 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 flex flex-col justify-end">
            <div className="absolute top-6 right-6 flex gap-3">
              <button className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors">
                <IoShareSocialOutline className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors">
                <IoBookmarkOutline className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {resource.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                  {resource.difficulty}
                </span>
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {resource.type}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                {resource.title}
              </h1>

              {resource.author && (
                <p className="text-white/90 text-lg">
                  By <span className="font-semibold">{resource.author}</span>
                </p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <IoEyeOutline className="w-5 h-5" />
                <span className="font-semibold">{resource.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <IoHeartOutline className="w-5 h-5" />
                <span className="font-semibold">{resource.likes || 0} likes</span>
              </div>
            </div>

            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              >
                Access Resource
                <IoOpenOutline className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Resource</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Detailed Content */}
            {resource.content && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </div>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {resource.url && (
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Learn?</h3>
                <p className="text-gray-700 mb-6">Access this resource and start your learning journey today!</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now
                  <IoOpenOutline className="w-6 h-6" />
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
