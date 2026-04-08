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
                  background: "#050505",
                  borderRadius: "16px",
                  overflow: "hidden"
                }}
              >
                <video
                  controls
                  src={item.original}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
                <div className="pt-4">
                  <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
                    Event Gallery
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-12 md:py-24">
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
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            <IoArrowBack className="size-5" /> Back to Events
          </Link>
        </motion.div>

        {/* Split Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
        >
          {/* Left Side: Title & Info */}
          <div className="space-y-8 lg:col-span-7">
            <h1 className="special-font text-5xl font-black leading-tight text-gray-900 sm:text-6xl md:text-7xl">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-xl text-gray-700 md:text-2xl">
                {event.description}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <IoCalendarOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Date</p>
                  <p className="font-bold text-gray-900">{event.dateDisplay}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600">
                    <IoTimeOutline className="size-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Time</p>
                    <p className="font-bold text-gray-900">{event.time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <IoLocationOutline className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Location</p>
                  <p className="font-bold text-gray-900">{event.location}</p>
                </div>
              </div>

              {event.attendees > 0 && (
                <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                    <IoPeopleOutline className="size-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Attendees</p>
                    <p className="font-bold text-gray-900">{event.attendees}+</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Floating Cover Image */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
              <img
                src={event.image}
                alt={event.title}
                className="aspect-square w-full object-cover lg:aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-overlay"></div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Main Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-16 lg:col-span-8"
          >
            {/* Event Description (About) */}
            {event.content && (
              <div className="pt-4">
                <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  About This Event
                </h2>
                <div
                  className="prose prose-lg sm:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-li:text-gray-600 marker:text-blue-500"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>
            )}

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="pt-8">
                <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Event Highlights
                </h2>
                <div className="mt-4 drop-shadow-2xl">
                  <ImageGallery
                    items={galleryImages}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showNav={true}
                    additionalClass="custom-gallery"
                    autoPlay={false}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-4"
          >
            {/* Speakers Widget */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="sticky top-8 rounded-3xl bg-white/60 px-6 py-8 backdrop-blur-xl shadow-sm ring-1 ring-gray-900/5 sm:p-8">
                <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-blue-600">
                  Featured Speakers
                </h3>
                <div className="space-y-8">
                  {event.speakers.map((speaker, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md ring-2 ring-white/50 transition-transform duration-500 group-hover:scale-105">
                          {speaker.image ? (
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-white">
                              {speaker.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {speaker.name}
                          </h4>
                          {speaker.title && (
                            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                              {speaker.title}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {speaker.bio}
                      </p>
                    </motion.div>
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
