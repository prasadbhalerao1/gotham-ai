import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
} from "date-fns";
import eventService from "../services/eventService";

let hasSeenAnimation = false;
let isNotificationClosed = false;

const EventNotification = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(!isNotificationClosed);
  const notificationRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data } = useQuery({
    queryKey: ["events"],
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
    if (isVisible && currentEvent && notificationRef.current) {
      if (hasSeenAnimation) {
        // If already seen in this session (navigated back), show immediately without animation
        gsap.set(notificationRef.current, { y: 0, opacity: 1 });
      } else {
        // If first time (or refresh), animate and set flag
        gsap.fromTo(
          notificationRef.current,
          { y: -100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            onComplete: () => {
              hasSeenAnimation = true;
            },
          },
        );
      }
    }
  }, [isVisible, currentEvent]);

  const handleClose = () => {
    if (!notificationRef.current) return;

    gsap.to(notificationRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        isNotificationClosed = true;
      },
    });
  };

  if (!isVisible || !currentEvent) return null;

  return (
    <div
      ref={notificationRef}
      className="event-notification fixed inset-x-2 top-[4.5rem] z-40 rounded-xl border border-white/20 bg-black/75 backdrop-blur-xl sm:inset-x-4 sm:top-24"
      style={{
        boxShadow:
          "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 30px rgba(59, 130, 246, 0.1)",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-3">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-400 sm:hidden"
        >
          <IoClose className="size-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <img
                src={currentEvent.image}
                alt="Current Event"
                className="size-12 rounded-lg border-2 border-blue-400/50 object-cover"
              />
            </div>

            <div className="flex-1 pr-6 sm:pr-0">
              <h3 className="mb-1 text-sm font-bold text-white sm:mb-1 sm:text-lg sm:font-semibold">
                {currentEvent.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 text-yellow-300">
                  <IoCalendarOutline className="size-3 sm:size-4" />
                  <span className="font-medium">
                    {currentEvent.dateDisplay}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300">
                  <IoTimeOutline className="size-3 sm:size-4" />
                  <span>{currentEvent.time}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-300">
                  <IoLocationOutline className="size-3 sm:size-4" />
                  <span>{currentEvent.location}</span>
                </div>
              </div>

              <p className="hidden max-w-2xl text-sm text-gray-300 sm:mt-1 sm:block">
                {currentEvent.description}
              </p>
            </div>
          </div>

          <div className="mr-4 hidden items-center space-x-3 md:flex">
            <div className="text-center">
              <div className="countdown-item min-w-[60px] rounded-lg bg-blue-600/50 px-3 py-2">
                <div className="text-lg font-bold text-white">
                  {timeLeft.days}
                </div>
                <div className="text-xs text-gray-200">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="countdown-item min-w-[60px] rounded-lg bg-blue-600/50 px-3 py-2">
                <div className="text-lg font-bold text-white">
                  {timeLeft.hours}
                </div>
                <div className="text-xs text-gray-200">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="countdown-item min-w-[60px] rounded-lg bg-green-600/50 px-3 py-2">
                <div className="text-lg font-bold text-white">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs text-gray-200">Mins</div>
              </div>
            </div>
          </div>

          <div className="hidden items-center space-x-3 sm:flex">
            <button
              onClick={() => navigate(`/events/${currentEvent.slug}`)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-600"
            >
              Learn More
            </button>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 transition-colors duration-200 hover:scale-110 hover:text-white"
            >
              <IoClose className="size-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 sm:hidden">
            <div className="flex flex-1 justify-start space-x-2">
              <div className="min-w-[40px] rounded bg-blue-900/60 px-2 py-1 text-center backdrop-blur-sm">
                <span className="block text-sm font-bold text-white">
                  {timeLeft.days}
                </span>
                <span className="block text-[8px] text-gray-200">Days</span>
              </div>
              <div className="min-w-[40px] rounded bg-blue-900/60 px-2 py-1 text-center backdrop-blur-sm">
                <span className="block text-sm font-bold text-white">
                  {timeLeft.hours}
                </span>
                <span className="block text-[8px] text-gray-200">Hrs</span>
              </div>
              <div className="min-w-[40px] rounded bg-green-900/60 px-2 py-1 text-center backdrop-blur-sm">
                <span className="block text-sm font-bold text-white">
                  {timeLeft.minutes}
                </span>
                <span className="block text-[8px] text-gray-200">Mins</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/events/${currentEvent.slug}`)}
              className="shrink-0 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-transform hover:bg-blue-500 active:scale-95"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventNotification;
