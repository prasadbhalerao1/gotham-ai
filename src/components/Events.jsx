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
    // Animate title
    gsap.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
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
        scrollTrigger: {
          trigger: eventsContainerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate individual event cards
    const eventCards =
      eventsContainerRef.current.querySelectorAll(".event-card");
    eventCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.5 + index * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
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
            Gotham community together
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
              className="event-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
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
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Never miss an event! Subscribe to our newsletter and be the first
              to know about upcoming events, workshops, and exclusive
              gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
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
