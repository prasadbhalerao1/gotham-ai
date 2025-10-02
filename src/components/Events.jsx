import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const eventsRef = useRef(null);
  const titleRef = useRef(null);
  const eventsContainerRef = useRef(null);

  // Sample events data
  const events = [
    {
      id: 1,
      title: "NVIDIA AI Session",
      date: "December 15, 2024",
      time: "11:30 AM - 1:30 PM",
      location: "MAC LAB",
      description:
        "Discover cutting-edge innovations and real-world case studies on how NVIDIA AI is driving breakthroughs across industries.",
      image: "/img/Nvidia-event.png",
      status: "LIVE NOW",
      attendees: 150,
      category: "Technology",
    },
    {
      id: 2,
      title: "Upcoming Event",
      date: "TBA",
      time: "TBA",
      location: "JSPM",
      description: "Something Big is coming.",
      image: "/img/upcomingevent.jpg",
      status: "UPCOMING",
      attendees: 200,
      // category: "Gam",
    },
    // {
    //   id: 3,
    //   title: "Tech Networking Night",
    //   date: "December 25, 2024",
    //   time: "6:00 PM - 9:00 PM",
    //   location: "Gotham Lounge",
    //   description:
    //     "Connect with fellow tech enthusiasts and industry professionals in a relaxed networking environment.",
    //   image: "/img/contact-1.webp",
    //   status: "UPCOMING",
    //   attendees: 80,
    //   category: "Networking",
    // },
  ];

  useGSAP(() => {
    // Animate title with performance optimizations
    gsap.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      }
    );

    // Animate events container
    gsap.fromTo(
      eventsContainerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: eventsContainerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      }
    );

    // Animate individual event cards with stagger for better performance
    const eventCards = eventsContainerRef.current?.querySelectorAll(".event-card");
    if (eventCards?.length) {
      gsap.fromTo(
        eventCards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          force3D: true,
          stagger: 0.2,
          scrollTrigger: {
            trigger: eventsContainerRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE NOW":
        return "bg-red-500 text-white";
      case "UPCOMING":
        return "bg-blue-500 text-white";
      case "PAST":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology":
        return "bg-purple-500";
      case "Gaming":
        return "bg-green-500";
      case "Networking":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section
      ref={eventsRef}
      id="events"
      className="relative min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="special-font text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Our <span className="text-purple-600">Events</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting events, workshops, and gatherings that bring the
            Gotham AI community together to learn, innovate, and shape the future
          </p>
        </div>

        {/* Events Grid */}
        <div
          ref={eventsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl card-hover-effect overflow-hidden focus-within:ring-4 focus-within:ring-purple-300/50"
              role="article"
              aria-labelledby={`event-title-${event.id}`}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden image-hover-zoom">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`${getStatusColor(event.status)} px-3 py-1 rounded-full text-xs font-semibold animate-pulse`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {event.category}
                  </span>
                </div>

                {/* Attendees */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-white text-sm">
                  <IoPeopleOutline className="w-4 h-4" />
                  <span>{event.attendees}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 
                  id={`event-title-${event.id}`}
                  className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300"
                >
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <IoCalendarOutline className="w-4 h-4 text-purple-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <IoTimeOutline className="w-4 h-4 text-blue-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <IoLocationOutline className="w-4 h-4 text-green-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() =>
                    event.status === "LIVE NOW"
                      ? window.open("https://google.com", "_blank")
                      : null
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg button-enhanced focus:outline-none focus:ring-4 focus:ring-purple-300/50"
                  aria-label={`${event.status === "LIVE NOW" ? "Join live session for" : "Learn more about"} ${event.title}`}
                >
                  {event.status === "LIVE NOW" ? "Join Live" : "Learn More"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Never miss an event! Subscribe to our newsletter and be the first
              to know about upcoming AI workshops, tech talks, and exclusive
              community gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg button-enhanced focus:outline-none focus:ring-4 focus:ring-yellow-300/50">
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
