'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronDown, ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  const { t, language } = useLanguage();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1a]">
      {/* Background Pizza Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ 
            backgroundImage: "url('/hero-pizza.png')",
          }}
        />
        {/* Premium dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/85 via-[#0a0f1a]/70 to-[#0a0f1a]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/60 via-transparent to-[#0a0f1a]/60" />
        {/* Gold accent glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[100px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-6"
        >
          <span 
            className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] bg-clip-text text-transparent"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
          >
            {t('heroTitle')}
          </span>
        </motion.h1>

        {/* Subtitle - Centered under title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
        >
          {language === 'ar' 
            ? 'تجربة فريدة من نوعها في الطعام والمشروبات'
            : 'A unique experience in food and beverages'}
        </motion.p>

        {/* Fancy Google Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-lg border border-[#d4af37]/30 rounded-2xl shadow-lg shadow-[#d4af37]/10">
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
              ))}
              <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/50" />
            </div>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-2xl font-bold text-[#d4af37]">4.5</span>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">
                {language === 'ar' ? 'تقييم Google' : 'Google Rating'}
              </span>
              <span className="text-xs text-gray-400">
                {language === 'ar' ? '2,382 تقييم' : '2,382 reviews'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Primary Button - Gold */}
          <motion.a
            href="#menu"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941d] text-[#0a0f1a] font-bold rounded-xl overflow-hidden shadow-lg shadow-[#d4af37]/30"
          >
            <span className="relative z-10 flex items-center gap-2">
              {language === 'ar' ? 'استكشف القائمة' : 'Explore Menu'}
              <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f4d03f] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          {/* Secondary Button - Outline */}
          <motion.a
            href="#about"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border-2 border-[#00d4ff]/50 text-[#00d4ff] font-semibold rounded-xl hover:bg-[#00d4ff]/10 transition-colors"
          >
            {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">{t('heroScroll')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-[#d4af37]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
