// src/components/home/HeroSection.tsx
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive <span className="text-blue-600">Autism</span> Assessment Tools
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Evidence-based assessments and interactive games designed to evaluate and support autism spectrum traits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button
                onClick={() => document.getElementById('games').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                Explore Tools <ChevronRight size={18} />
              </button>
              <button
                onClick={() => navigate('/test')}
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Start Assessment
              </button>
            </div>
          </motion.div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative w-full max-w-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl opacity-20 blur-xl"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Autism Assessment" 
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}