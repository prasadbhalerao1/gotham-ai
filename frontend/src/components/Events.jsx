import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import eventService from "../services/eventService";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const eventsRef = useRef(null);
  const titleRef = useRef(null);
  const eventsContainerRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
  });

  // Limit to 3 events on homepage
  const eventsData = (data?.data || []).slice(0, 3);

  useGSAP(() => {
    // Title animation with smooth fade-in
    gsap.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Event cards with smooth, fast staggered animation
    const eventCards =
      eventsContainerRef.current?.querySelectorAll(".event-card");
    if (eventCards?.length) {
      gsap.set(eventCards, { transformPerspective: 1000 });

      gsap.fromTo(
        eventCards,
        {
          y: 30,
          opacity: 0,
          scale: 0.92,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: eventsContainerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Smooth hover animation
      eventCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology":
        return "bg-blue-600";
      case "Gaming":
        return "bg-green-500";
      case "Networking":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section
      ref={eventsRef}
      id="events"
      className="relative isolate min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-20"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="mb-16 text-center">
          <h2 className="special-font mb-4 text-4xl font-black text-gray-900 sm:text-5xl md:text-6xl">
            Our <span className="text-blue-600">Events</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover exciting events, workshops, and gatherings that bring the
            Gotham AI community together to learn, innovate, and shape the
            future
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-y-4 border-blue-600"></div>
            <p className="text-lg text-gray-600">Loading events...</p>
          </div>
        ) : (
          <div
            ref={eventsContainerRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {eventsData.map((event) => (
              <div
                key={event._id || event.id}
                className="event-card group overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-300/50 hover:shadow-2xl"
                role="article"
                aria-labelledby={`event-title-${event._id || event.id}`}
              >
                <div className="image-hover-zoom relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-800/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <img
                    src={event.image}
                    alt={event.title}
                    className="size-full scale-105 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {event.category && (
                    <div className="absolute right-4 top-4">
                      <span
                        className={`${getCategoryColor(event.category)} rounded-full px-3 py-1 text-xs font-semibold text-white`}
                      >
                        {event.category}
                      </span>
                    </div>
                  )}

                  {event.attendees && (
                    <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-sm text-white">
                      <IoPeopleOutline className="size-4" />
                      <span>{event.attendees}</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3
                    id={`event-title-${event.id}`}
                    className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600"
                  >
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
                    className="button-enhanced block w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
                    aria-label={`Learn more about ${event.title}`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        <div className="mt-12 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
          >
            View All Events
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <h3 className="mb-4 text-2xl font-bold">Stay Connected</h3>
            <p className="mx-auto mb-6 max-w-2xl text-blue-100">
              Never miss an event! Subscribe to our newsletter and be the first
              to know about upcoming AI workshops, tech talks, and exclusive
              community gatherings.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Email address"
              />
              <button
                className="button-enhanced rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
