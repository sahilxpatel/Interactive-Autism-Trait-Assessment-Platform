// src/components/home/FeaturesSection.tsx
import { motion } from 'framer-motion';
import { Star, Award, BrainCircuit } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Star className="text-yellow-500" size={32} />,
      title: "Gold Standard Tools",
      description: "Incorporates clinically validated assessment methodologies",
      color: "bg-yellow-50"
    },
    {
      icon: <Award className="text-green-500" size={32} />,
      title: "Strength-Based",
      description: "Focuses on identifying unique abilities alongside challenges",
      color: "bg-green-50"
    },
    {
      icon: <BrainCircuit className="text-purple-500" size={32} />,
      title: "Interactive Format",
      description: "Engaging activities that reduce assessment anxiety",
      color: "bg-purple-50"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Assessment Approach</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Developed with autism specialists to provide meaningful insights
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`${feature.color} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                {feature.icon}
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}