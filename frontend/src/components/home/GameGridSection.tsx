// src/components/home/GameGridSection.tsx
import { motion } from 'framer-motion';
import { ChevronRight, BrainCircuit } from 'lucide-react';
import { GameCard } from '../GameCard';
import { useNavigate } from 'react-router-dom';

export function GameGridSection() {
  const navigate = useNavigate();

  const games = [
    {
      title: 'Emotion Recognition',
      description: 'Assess ability to identify and interpret facial expressions',
      imageUrl: '/emotion.png',
      path: '/emotion-game',
      badge: 'Core Assessment',
      color: 'bg-pink-100 text-pink-800',
      icon: '😊'
    },
    {
      title: 'Shape Recognition',
      description: 'Evaluate spatial awareness and geometric shape identification',
      imageUrl: '/gesture.png',
      path: '/shape-game',
      badge: 'Spatial Skills',
      color: 'bg-green-100 text-green-800',
      icon: '🔷'
    },
    {
      title: 'Color Detection',
      description: 'Assess responses to different visual stimuli and colors',
      imageUrl: '/colour.png',
      path: '/color-game',
      badge: 'Visual Processing',
      color: 'bg-blue-100 text-blue-800',
      icon: '🎨'
    },
    {
      title: 'Gesture Recognition',
      description: 'Test hand coordination and non-verbal communication skills',
      imageUrl: '/gesture.png',
      path: '/gesture-game',
      badge: 'Motor Skills',
      color: 'bg-orange-100 text-orange-800',
      icon: '👋'
    }
  ];

  return (
    <main id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Activities</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Interactive tools to evaluate different aspects of autism spectrum traits
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {games.map((game, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300,
              default: { duration: 0.6 },
              hover: { duration: 0.2 },
              tap: { duration: 0.1 }
            }}
            className="relative"
          >
            {game.badge && (
              <span className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-semibold ${game.color} z-10 shadow-sm`}>
                {game.badge}
              </span>
            )}
            <div className="absolute top-4 left-4 text-3xl z-10">
              {game.icon}
            </div>
            <GameCard
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              onPlay={() => navigate(game.path, { state: { autoStart: true } })}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200 hover:border-blue-300 transition-all col-span-1 md:col-span-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-5"></div>
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <BrainCircuit size={64} className="text-white opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-4xl">🧠</div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Comprehensive Assessment</h3>
            <p className="text-gray-600 mb-4">
              Complete a full evaluation combining all activities for detailed insights into cognitive and behavioral patterns.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/test')}
              className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Take Full Assessment
              <ChevronRight size={16} className="ml-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
