/*
 * KEY CHANGES:
 * 1. Fixed countdown timer bug - now uses date from currentEvent.date instead of hardcoded value
 * 2. Integrated date-fns library for reliable date calculations
 * 3. Imports event data from centralized data file
 * 4. Improved animation easing functions for smoother transitions
 */

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import eventService from "../services/eventService";

const EventNotification = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch events from API
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAllEvents(),
  });

  const currentEvent = data?.data?.[0];

  useEffect(() => {
    if (!currentEvent?.date) return;

    const timer = setInterval(() => {
      const now = new Date();
      const eventStartDate = parseISO(currentEvent.date);

      const distance = eventStartDate.getTime() - now.getTime();

      if (distance > 0) {
        const days = differenceInDays(eventStartDate, now);
        const hours = differenceInHours(eventStartDate, now) % 24;
        const minutes = differenceInMinutes(eventStartDate, now) % 60;
        const seconds = differenceInSeconds(eventStartDate, now) % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEvent?.date]);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo(
        ".event-notification",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
      );
    }
  }, [isVisible]);

  const handleClose = () => {
    gsap.to(".event-notification", {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => setIsVisible(false),
    });
  };

  // Don't show if no event data or not visible
  if (!isVisible || !currentEvent) return null;

  return (
    <div className="event-notification fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md border-b border-blue-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
              <img
                src={currentEvent.image}
                alt="Current Event"
                className="w-12 h-12 rounded-lg object-cover border-2 border-blue-400/50"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1 text-yellow-300">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentEvent.dateDisplay}
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

          <div className="hidden md:flex items-center space-x-3 mr-4">
            <div className="text-center">
              <div className="countdown-item bg-blue-600/50 rounded-lg px-3 py-2 min-w-[60px]">
                <div className="text-white font-bold text-lg">
                  {timeLeft.days}
                </div>
                <div className="text-blue-200 text-xs">Days</div>
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

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/events/${currentEvent.slug}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm hover:scale-105"
            >
              Learn More
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:scale-110"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden mt-3 flex justify-center space-x-2">
          <div className="text-center">
            <div className="countdown-item bg-blue-600/50 rounded px-2 py-1">
              <div className="text-white font-bold text-sm">
                {timeLeft.days}
              </div>
              <div className="text-blue-200 text-xs">Days</div>
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
