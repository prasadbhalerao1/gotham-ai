/*
 * KEY FEATURES:
 * 1. Imports event data from centralized data file
 * 2. Fast, snappy card entrance animations (0.45s duration, 0.08s stagger)
 * 3. Optimized GSAP animations with power2.out easing for smooth performance
 * 4. Lightweight hover interactions with minimal transform properties
 * 5. No jitter - removed 3D transforms, using only Y-axis and scale
 * 6. Performance-focused with simplified animation properties
 */

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
    queryKey: ['events'],
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
      }
    );

    // Event cards with smooth, fast staggered animation
    const eventCards = eventsContainerRef.current?.querySelectorAll(".event-card");
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
        }
      );

      // Smooth hover animation
      eventCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        
        card.addEventListener('mouseleave', () => {
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
        return "bg-blue-500";
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
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 py-20"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="special-font text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Our <span className="text-blue-600">Events</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting events, workshops, and gatherings that bring the
            Gotham AI community together to learn, innovate, and shape the future
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        ) : (
          <div
            ref={eventsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {eventsData.map((event) => (
            <div
              key={event._id || event.id}
              className="event-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-300/50 transition-shadow duration-200"
              role="article"
              aria-labelledby={`event-title-${event._id || event.id}`}
            >
              <div className="relative h-48 overflow-hidden image-hover-zoom">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {event.category && (
                  <div className="absolute top-4 right-4">
                    <span
                      className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {event.category}
                    </span>
                  </div>
                )}

                {event.attendees && (
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-white text-sm">
                    <IoPeopleOutline className="w-4 h-4" />
                    <span>{event.attendees}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3
                  id={`event-title-${event.id}`}
                  className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300"
                >
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
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg button-enhanced focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300 text-center"
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
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View All Events
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Never miss an event! Subscribe to our newsletter and be the first
              to know about upcoming AI workshops, tech talks, and exclusive
              community gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg button-enhanced focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition-all duration-300">
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
