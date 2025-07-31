// src/components/home/CTASection.tsx
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Assessment?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the first step toward better understanding autism spectrum traits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/test')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium"
            >
              Start Now <ChevronRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('games').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Activities
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}