'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import ProductShowcase from '@/components/ProductShowcase';
import Contact from '@/components/Contact';
import VideoBackground from '@/components/VideoBackground';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Home() {
  useAnalytics();
  
  return (
    <div className="min-h-screen bg-[#0a0f1a] overflow-x-hidden">
      <VideoBackground />
      <Navigation />
      <main className="relative">
        <Hero />
        <ProductShowcase />
        <Menu />
        <About />
        <Contact />
      </main>
    </div>
  );
}
