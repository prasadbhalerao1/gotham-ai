import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle.jsx";
import Button from "./Button.jsx";
import ContactModal from "./ContactModal.jsx";

gsap.registerPlugin(ScrollTrigger);

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img
      src={src}
      alt=""
      width="320"
      height="320"
      className="size-full object-cover"
    />
  </div>
);

const Contact = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      contentRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  return (
    <div
      id="contact"
      className="my-10 min-h-96 w-screen px-4 sm:my-20 sm:px-10"
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-black py-12 text-blue-50 sm:py-16 md:py-24"
      >
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden opacity-30 sm:block sm:opacity-100 lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 opacity-30 sm:top-1/2 sm:opacity-100 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center px-4 text-center"
        >
          <p className="mb-6 font-general text-[10px] uppercase tracking-wider sm:mb-10 sm:text-xs">
            Join Gotham
          </p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> intell<b>i</b>gence t<b>o</b>gether."
            className="special-font w-full max-w-4xl font-zentry text-3xl font-black !leading-[1.1] sm:text-4xl sm:!leading-[1.05] md:text-6xl md:!leading-[.9] lg:!text-[6.2rem]"
          />

          <Button
            title="contact us"
            containerClass="mt-6 sm:mt-10 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Contact;
