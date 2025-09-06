// src/pages/Home.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/home/Header';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { GameGridSection } from '../components/home/GameGridSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/home/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <GameGridSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}