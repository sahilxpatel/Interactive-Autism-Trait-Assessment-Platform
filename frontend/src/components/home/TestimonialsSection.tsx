// src/components/home/TestimonialsSection.tsx
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This platform provides one of the most comprehensive digital autism assessments I've seen.",
      author: "Dr. Sarah Chen",
      role: "Child Psychologist"
    },
    {
      quote: "The interactive format is particularly effective for younger individuals on the spectrum.",
      author: "Dr. Michael Rodriguez",
      role: "Autism Specialist"
    },
    {
      quote: "An invaluable tool for preliminary screening and ongoing evaluation.",
      author: "Dr. Emily Park",
      role: "Developmental Pediatrician"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Endorsements</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recognized by clinicians and autism specialists
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-600 font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}