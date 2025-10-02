import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
} from "react-icons/io5";
import gsap from "gsap";

const EventNotification = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Sample current event data
  const currentEvent = {
    title: "NVIDIA AI Session",
    date: "September 15, 2025",
    time: "11:30 AM - 1:30 PM",
    location: "MAC LAB",
    description:
      "Discover cutting-edge innovations and real-world case studies on how NVIDIA AI is driving breakthroughs across industries.",
    image: "/img/Nvidia-event.png",
    status: "LIVE NOW",
  };

  // Calculate time remaining until event starts
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Parse the actual event date and time from currentEvent
      const eventStartDate = new Date("September 15, 2025 11:30:00");

      const distance = eventStartDate.getTime() - now.getTime();

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If event has passed, show 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // GSAP animation for entrance
  useEffect(() => {
    if (isVisible) {
      gsap.fromTo(
        ".event-notification",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [isVisible]);

  const handleClose = () => {
    gsap.to(".event-notification", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => setIsVisible(false),
    });
  };

  if (!isVisible) return null;

  return (
    <div className="event-notification fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-md border-b border-purple-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Event Info */}
          <div className="flex items-center space-x-4">
            {/* Event Image */}
            <div className="hidden sm:block relative">
              <img
                src={currentEvent.image}
                alt="Current Event"
                className="w-12 h-12 rounded-lg object-cover border-2 border-purple-400/50"
              />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full animate-pulse">
                LIVE
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1 text-yellow-300">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentEvent.date}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300">
                  <IoTimeOutline className="w-4 h-4" />
                  <span className="text-sm">{currentEvent.time}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-300">
                  <IoLocationOutline className="w-4 h-4" />
                  <span className="text-sm">{currentEvent.location}</span>
                </div>
              </div>

              <h3 className="text-white font-semibold text-lg mb-1">
                {currentEvent.title}
              </h3>

              <p className="text-gray-300 text-sm max-w-2xl">
                {currentEvent.description}
              </p>
            </div>
          </div>

          {/* Event Duration Timer */}
          <div className="hidden md:flex items-center space-x-3 mr-4">
            <div className="text-center">
              <div className="countdown-item bg-purple-600/50 rounded-lg px-3 py-2 min-w-[60px]">
                <div className="text-white font-bold text-lg">
                  {timeLeft.days}
                </div>
                <div className="text-purple-200 text-xs">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="countdown-item bg-blue-600/50 rounded-lg px-3 py-2 min-w-[60px]">
                <div className="text-white font-bold text-lg">
                  {timeLeft.hours}
                </div>
                <div className="text-blue-200 text-xs">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="countdown-item bg-green-600/50 rounded-lg px-3 py-2 min-w-[60px]">
                <div className="text-white font-bold text-lg">
                  {timeLeft.minutes}
                </div>
                <div className="text-green-200 text-xs">Mins</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open("https://google.com", "_blank")}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
            >
              Join Live
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Event Duration */}
        <div className="md:hidden mt-3 flex justify-center space-x-2">
          <div className="text-center">
            <div className="countdown-item bg-purple-600/50 rounded px-2 py-1">
              <div className="text-white font-bold text-sm">
                {timeLeft.days}
              </div>
              <div className="text-purple-200 text-xs">Days</div>
            </div>
          </div>
          <div className="text-center">
            <div className="countdown-item bg-blue-600/50 rounded px-2 py-1">
              <div className="text-white font-bold text-sm">
                {timeLeft.hours}
              </div>
              <div className="text-blue-200 text-xs">Hours</div>
            </div>
          </div>
          <div className="text-center">
            <div className="countdown-item bg-green-600/50 rounded px-2 py-1">
              <div className="text-white font-bold text-sm">
                {timeLeft.minutes}
              </div>
              <div className="text-green-200 text-xs">Mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventNotification;
