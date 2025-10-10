import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false); // Used for Step 4: The Cycle

  const totalVideos = 4;
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    // This timer drives the entire cycle
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Determine which video is which role for this cycle
    const outgoingVideo = isFlipped ? videoRef2.current : videoRef1.current; // Video A
    const incomingVideo = isFlipped ? videoRef1.current : videoRef2.current; // Video B

    // --- Step 2: The Incoming Video Plays in the Background ---
    incomingVideo.src = `videos/hero-${currentIndex}.mp4`;
    incomingVideo.load();

    const handleCanPlayThrough = () => {
      incomingVideo.play(); // Starts playing while invisible

      // --- Step 1 & 3: The Outgoing Video Fades & The Videos Crossfade ---
      gsap.timeline({
        onComplete: () => {
          // --- Step 4: The Cycle Repeats ---
          // The roles are flipped for the next transition
          setIsFlipped((prev) => !prev);
          incomingVideo.removeEventListener("canplaythrough", handleCanPlayThrough);
        },
      })
      .to(outgoingVideo, { // Video A fades out
        opacity: 0,
        duration: 2.0,
        ease: "none",
      })
      .to(incomingVideo, { // Video B fades in
        opacity: 1,
        duration: 2.0,
        ease: "none",
      }, "<"); // "<" ensures they happen at the same time
    };

    incomingVideo.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      incomingVideo.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [currentIndex, loading]);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-black">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef1}
          src="videos/hero-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={() => setLoading(false)}
        />

        <video
          ref={videoRef2}
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center opacity-0"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10" />

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 sm:mt-32 px-4 sm:px-5 md:px-10">
            <h1 className="special-font hero-heading text-blue-100 mb-4 sm:mb-6">
              Gotham AI
            </h1>

            <p className="mb-6 sm:mb-8 max-w-xs sm:max-w-sm md:max-w-64 font-robert-regular text-blue-100 text-sm sm:text-base leading-relaxed">
              Where Minds Meet Machines <br /> The AI Playground for Visionaries
            </p>

            <div>
              <Button
                id="enter-now"
                title="Enter Now"
                onClick={() => (window.location.href = "https://google.com")}
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1 text-sm sm:text-base px-6 sm:px-7 py-2 sm:py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;