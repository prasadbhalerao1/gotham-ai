import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoTimeOutline, 
  IoPeopleOutline,
  IoArrowBack,
  IoShareSocialOutline 
} from 'react-icons/io5';
import eventService from '../services/eventService';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const EventDetailPage = () => {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventService.getEventBySlug(slug),
    onError: (err) => {
      console.error('Failed to fetch event:', err.message);
    },
  });

  const event = data?.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-2">
            {error ? error.message : "The event you're looking for doesn't exist."}
          </p>
          {error && (
            <p className="text-sm text-gray-500 mb-8">Please try again or contact support if the problem persists.</p>
          )}
          <Link 
            to="/#events" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IoArrowBack /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = event.gallery?.map(img => ({
    original: img,
    thumbnail: img,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/#events" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <IoArrowBack className="w-5 h-5" /> Back to Events
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          {/* Header Image */}
          <div className="relative h-96 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Category Badge */}
            <button className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
              <IoShareSocialOutline className="w-6 h-6 text-gray-800" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="special-font text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Info Cards */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl"
              >
                <div className="p-3 bg-blue-600 rounded-lg">
                  <IoCalendarOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-gray-900 font-bold">{event.dateDisplay}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-cyan-50 rounded-xl"
              >
                <div className="p-3 bg-cyan-600 rounded-lg">
                  <IoTimeOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Time</p>
                  <p className="text-gray-900 font-bold">{event.time}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl"
              >
                <div className="p-3 bg-green-600 rounded-lg">
                  <IoLocationOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-gray-900 font-bold">{event.location}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl"
              >
                <div className="p-3 bg-blue-600 rounded-lg">
                  <IoPeopleOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Attendees</p>
                  <p className="text-gray-900 font-bold">{event.attendees}+</p>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {event.description}
              </p>
              
              {/* Event Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </div>

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Gallery</h2>
                <ImageGallery 
                  items={galleryImages}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  autoPlay={false}
                />
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Speakers</h3>
                <div className="space-y-4">
                  {event.speakers.map((speaker, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {speaker.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{speaker.name}</h4>
                        <p className="text-sm text-blue-600 mb-1">{speaker.title}</p>
                        <p className="text-sm text-gray-600">{speaker.bio}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </motion.span>
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

export default EventDetailPage;
