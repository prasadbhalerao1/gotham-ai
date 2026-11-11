import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import contactService from "../services/contactService";
import { lockScroll } from "../lib/smooth.js";

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

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", type: "text" },
];

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

  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const inputClass = (hasError) =>
    `w-full border-b bg-transparent pb-2 pt-1 text-lg text-bone placeholder:text-bone-mute focus:outline-none transition-colors ${
      hasError ? "border-alert" : "border-bone/20 focus:border-signal"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="grain relative max-h-[92vh] w-full max-w-xl overflow-y-auto border border-bone/15 bg-ink-800 p-6 sm:p-10"
          >
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="label mb-3 text-signal">Open a channel</p>
                <h2 id="contact-title" className="display text-5xl sm:text-6xl">
                  Get in <span className="accent">touch</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={mutation.isPending}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-bone/20 text-xl transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
                aria-label="Close contact form"
              >
                ×
              </button>
            </div>

            {submitStatus === "success" ? (
              <div className="py-10 text-center" role="status">
                <p className="display text-4xl text-signal">Signal received</p>
                <p className="mt-3 text-bone-dim">Thanks — we&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {fields.map((f) => (
                    <label key={f.name} className={f.name === "subject" || f.name === "phone" ? "block sm:col-span-1" : "block"}>
                      <span className="label mb-1 block">{f.label}</span>
                      <input
                        {...register(f.name)}
                        type={f.type}
                        autoComplete={f.autoComplete}
                        aria-invalid={!!errors[f.name]}
                        disabled={mutation.isPending}
                        className={inputClass(errors[f.name])}
                      />
                      {errors[f.name] && <span className="mt-1 block text-xs text-alert">{errors[f.name].message}</span>}
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="label mb-1 block">Message</span>
                  <textarea
                    {...register("message")}
                    rows={4}
                    aria-invalid={!!errors.message}
                    disabled={mutation.isPending}
                    className={`${inputClass(errors.message)} resize-none`}
                  />
                  {errors.message && <span className="mt-1 block text-xs text-alert">{errors.message.message}</span>}
                </label>

                {submitStatus === "error" && (
                  <p role="alert" className="border border-alert/40 px-4 py-3 text-sm text-alert">
                    {mutation.error?.message || "Failed to send message. Please try again."}
                  </p>
                )}

                <button type="submit" disabled={mutation.isPending} className="btn-signal w-full justify-center disabled:opacity-60">
                  {mutation.isPending ? "Transmitting…" : "Send message →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
