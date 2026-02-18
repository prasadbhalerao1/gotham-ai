import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  IoCloseOutline,
  IoMailOutline,
  IoPersonOutline,
  IoCallOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import contactService from "../services/contactService";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject cannot exceed 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{10,15}$/, "Please provide a valid phone number")
    .optional()
    .or(z.literal("")),
});

const ContactModal = ({ isOpen, onClose }) => {
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: contactService.submitContact,
    onSuccess: () => {
      setSubmitStatus("success");
      reset();
      setTimeout(() => {
        setSubmitStatus(null);
        onClose();
      }, 3000);
    },
    onError: (error) => {
      setSubmitStatus("error");
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      reset();
      setSubmitStatus(null);
      onClose();
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-lg border py-2 pl-9 pr-3 text-sm transition-colors focus:outline-none ${
      hasError
        ? "border-red-300 focus:border-red-500"
        : "border-gray-200 focus:border-blue-500"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="relative rounded-t-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-4">
                <button
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 transition-colors hover:bg-white/30 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <IoCloseOutline className="size-4 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white">Get In Touch</h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  Fill out the form and we'll get back to you soon.
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"
                >
                  <IoCheckmarkCircleOutline className="size-4 shrink-0 text-green-600" />
                  <div>
                    <p className="text-xs font-semibold text-green-900">
                      Message Sent!
                    </p>
                    <p className="text-xs text-green-700">
                      We'll get back to you via email shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                >
                  <IoAlertCircleOutline className="size-4 shrink-0 text-red-600" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">
                      Something went wrong
                    </p>
                    <p className="text-xs text-red-700">
                      {mutation.error?.message || "Please try again later."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoPersonOutline className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="name"
                      {...register("name")}
                      type="text"
                      placeholder="John Doe"
                      className={inputClass(errors.name)}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-0.5 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className={inputClass(errors.email)}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600"
                  >
                    Phone{" "}
                    <span className="text-xs font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <IoCallOutline className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="phone"
                      {...register("phone")}
                      type="tel"
                      placeholder="+91 8767X XXXXX"
                      className={inputClass(errors.phone)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-0.5 text-xs text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoDocumentTextOutline className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="subject"
                      {...register("subject")}
                      type="text"
                      placeholder="What would you like to discuss?"
                      className={inputClass(errors.subject)}
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-0.5 text-xs text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows="4"
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none ${
                      errors.message
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-0.5 text-xs text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={mutation.isPending}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-y-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <IoMailOutline className="size-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
