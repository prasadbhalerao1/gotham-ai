import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { 
  IoCloseOutline, 
  IoMailOutline, 
  IoPersonOutline, 
  IoCallOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import contactService from '../services/contactService';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string()
    .email('Please provide a valid email address'),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
  phone: z.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
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
      setSubmitStatus('success');
      reset();
      setTimeout(() => {
        setSubmitStatus(null);
        onClose();
      }, 3000);
    },
    onError: (error) => {
      setSubmitStatus('error');
      console.error('Contact form error:', error);
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pointer-events-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="relative rounded-t-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8">
                <button
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <IoCloseOutline className="size-6 text-white" />
                </button>

                <h2 className="mb-2 text-3xl font-black text-white">Get In Touch</h2>
                <p className="text-blue-100">
                  We'd love to hear from you! Fill out the form below and we'll get back to you soon.
                </p>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="m-6 flex items-start gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-4"
                >
                  <IoCheckmarkCircleOutline className="mt-0.5 size-6 shrink-0 text-green-600" />
                  <div>
                    <h3 className="mb-1 font-bold text-green-900">Message Sent Successfully!</h3>
                    <p className="text-sm text-green-700">
                      Thank you for contacting us. We'll get back to you via email shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="m-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4"
                >
                  <IoAlertCircleOutline className="mt-0.5 size-6 shrink-0 text-red-600" />
                  <div>
                    <h3 className="mb-1 font-bold text-red-900">Oops! Something went wrong</h3>
                    <p className="text-sm text-red-700">
                      {mutation.error?.message || 'Please try again later.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoPersonOutline className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="name"
                      {...register('name')}
                      type="text"
                      placeholder="John Doe"
                      className={`w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-colors focus:outline-none ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder="john@example.com"
                      className={`w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-colors focus:outline-none ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Field (Optional) */}
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <IoCallOutline className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="phone"
                      {...register('phone')}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className={`w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-colors focus:outline-none ${
                        errors.phone 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoDocumentTextOutline className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="subject"
                      {...register('subject')}
                      type="text"
                      placeholder="What would you like to discuss?"
                      className={`w-full rounded-xl border-2 py-3 pl-12 pr-4 transition-colors focus:outline-none ${
                        errors.subject 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full resize-none rounded-xl border-2 px-4 py-3 transition-colors focus:outline-none ${
                      errors.message 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={mutation.isPending}
                    className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="size-5 animate-spin rounded-full border-y-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <IoMailOutline className="size-5" />
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
