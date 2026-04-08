import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoArrowBack,
} from "react-icons/io5";
import eventService from "../services/eventService";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../styles/gallery.css";

const EventDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => eventService.getEventBySlug(slug),
    onError: (err) => {
      console.error("Failed to fetch event:", err.message);
    },
  });

  const event = data?.data;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-blue-600"></div>
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 px-4">
        <div className="max-w-md text-center">
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
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Event Not Found
          </h2>
          <p className="mb-2 text-gray-600">
            {error
              ? error.message
              : "The event you're looking for doesn't exist."}
          </p>
          {error && (
            <p className="mb-8 text-sm text-gray-500">
              Please try again or contact support if the problem persists.
            </p>
          )}
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            <IoArrowBack /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isVideo = (url) =>
    typeof url === "string" && /\.(mp4|webm|ogg)$/i.test(url);

  const galleryImages =
    event?.gallery?.map((url) => {
      const video = isVideo(url);
      return {
        original: url,
        thumbnail: url,
        renderItem: video
          ? (item) => (
              <div
                className="image-gallery-image"
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
    }) || [];

  if (event.galleryOnly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              <IoArrowBack className="size-5" /> Back to Events
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Hero Section */}
            <div className="relative h-72">
              <img
                src={event.image}
                alt={event.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <h1 className="special-font mb-2 text-4xl font-black text-white sm:text-5xl">
                  {event.title}
                </h1>
              </div>
            </div>

            <div className="space-y-8 p-8">
              {/* Gallery Only view: show only gallery */}
              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="rounded-2xl bg-gray-50 p-6">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Photo Gallery
                  </h2>
                  <ImageGallery
                    items={galleryImages}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    additionalClass="custom-gallery"
                    autoPlay={false}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <IoArrowBack className="size-5" /> Back to Events
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h1 className="special-font mb-4 text-4xl font-black text-white sm:text-5xl md:text-6xl">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Info Cards */}
          <div className="p-8">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${event.attendees && event.attendees > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"} mb-8 gap-6`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 rounded-xl bg-blue-50 p-4"
              >
                <div className="rounded-lg bg-blue-600 p-3">
                  <IoCalendarOutline className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="font-bold text-gray-900">{event.dateDisplay}</p>
                </div>
              </motion.div>

              {event.time && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 rounded-xl bg-cyan-50 p-4"
                >
                  <div className="rounded-lg bg-cyan-600 p-3">
                    <IoTimeOutline className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="font-bold text-gray-900">{event.time}</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 rounded-xl bg-green-50 p-4"
              >
                <div className="rounded-lg bg-green-600 p-3">
                  <IoLocationOutline className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="font-bold text-gray-900">{event.location}</p>
                </div>
              </motion.div>

              {event.attendees && event.attendees > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 rounded-xl bg-blue-50 p-4"
                >
                  <div className="rounded-lg bg-blue-600 p-3">
                    <IoPeopleOutline className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Attendees
                    </p>
                    <p className="font-bold text-gray-900">
                      {event.attendees}+
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Description */}
            {event.description && (
              <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  About This Event
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                  {event.description}
                </p>

                {/* Event Content */}
                {event.content && (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}
              </div>
            )}

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  Event Gallery
                </h2>
                <ImageGallery
                  items={galleryImages}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  additionalClass="custom-gallery"
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
              <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Speakers
                </h3>
                <div className="space-y-4">
                  {event.speakers.map((speaker, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-xl font-bold text-white">
                        {speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          speaker.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {speaker.name}
                        </h4>
                        <p className="text-sm text-gray-600">{speaker.bio}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
