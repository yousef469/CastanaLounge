'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredProducts = [
  {
    id: 'pizza',
    nameAr: 'بيتزا كستانا',
    nameEn: 'Castana Pizza',
    price: 35,
    descriptionAr: 'بيتزا إيطالية أصيلة بالعجين الطازج والصلصة الخاصة مع أجود أنواع الجبن والمكونات الطازجة.',
    descriptionEn: 'Authentic Italian pizza with fresh dough and special sauce, topped with premium cheese and fresh ingredients.',
    video: '/A_cinematic_product-style_202604170133.mp4',
    category: 'pizzaPasta',
  },
  {
    id: 'hot-chocolate',
    nameAr: 'شوكولاتة ساخنة',
    nameEn: 'Hot Chocolate',
    price: 27,
    descriptionAr: 'شوكولاتة ساخنة غنية وكريمية، مُحضرة بأجود أنواع الكاكاو والحليب الطازج.',
    descriptionEn: 'Rich and creamy hot chocolate, made with premium cocoa and fresh milk.',
    video: '/coffee-video.mp4',
    category: 'hotDrinks',
  },
  {
    id: 'steak',
    nameAr: 'فيليه ستيك',
    nameEn: 'Fillet Steak',
    price: 35,
    descriptionAr: 'فيليه ستيك مشوي على الفحم مع الخضار والبطاطس المهروسة.',
    descriptionEn: 'Charcoal-grilled fillet steak with vegetables and mashed potatoes.',
    video: '/steak-video.mp4',
    category: 'mainCourses',
  },
  {
    id: 'tawook',
    nameAr: 'تاووك مشوي',
    nameEn: 'Grilled Tawook',
    price: 45,
    descriptionAr: 'دجاج تاووك مشوي على الفحم الحي مع البهارات الخاصة والثومية.',
    descriptionEn: 'Charcoal-grilled tawook chicken with special spices and garlic sauce.',
    video: '/hookah-video.mp4',
    category: 'grilled',
  },
];

export default function ProductShowcase() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentProduct = featuredProducts[currentIndex];
  const hasVideo = !!currentProduct.video;

  // Reset video when product changes
  useEffect(() => {
    if (videoRef.current && hasVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, hasVideo]);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section id="showcase" className="py-24 bg-[#0a0f1a]">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#d4af37]/20 text-[#d4af37] rounded-full text-sm font-medium mb-4">
            {language === 'ar' ? 'أطباق مميزة' : 'Featured Dishes'}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
          >
            {language === 'ar' ? 'تجربة بصرية فريدة' : 'Visual Dining Experience'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-[#00d4ff] mx-auto" />
        </motion.div>

        {/* Main Showcase Card */}
        <div className="relative bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-3xl overflow-hidden border border-[#d4af37]/20 shadow-2xl shadow-black/50">
          
          {/* Navigation Arrows - Desktop */}
          <button
            onClick={prevProduct}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-[#d4af37]/90 hover:bg-[#d4af37] text-[#0a0f1a] rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextProduct}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-[#d4af37]/90 hover:bg-[#d4af37] text-[#0a0f1a] rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2"
            >
              {/* Media Section */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-[#0a0f1a]">
                {hasVideo ? (
                  <video
                    ref={videoRef}
                    key={currentProduct.video}
                    src={currentProduct.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => console.error('Video error:', e)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1e2a3a] to-[#0f1419]">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#00d4ff] flex items-center justify-center">
                        <span className="text-5xl">🍽️</span>
                      </div>
                      <p className="text-gray-400">
                        {language === 'ar' ? 'صورة الطبق' : 'Dish Image'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a1f2e]/90 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] via-transparent to-transparent md:hidden" />
                
                {/* Counter badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#0a0f1a]/80 text-[#d4af37] rounded-full text-sm font-bold border border-[#d4af37]/30">
                  {currentIndex + 1} / {featuredProducts.length}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Category tag */}
                  <span className="inline-block px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full text-xs font-medium mb-4">
                    {currentProduct.category === 'pizzaPasta'
                      ? (language === 'ar' ? 'بيتزا' : 'Pizza')
                      : currentProduct.category === 'hotDrinks'
                      ? (language === 'ar' ? 'مشروبات ساخنة' : 'Hot Drinks')
                      : currentProduct.category === 'mainCourses'
                      ? (language === 'ar' ? 'أطباق رئيسية' : 'Main Courses')
                      : (language === 'ar' ? 'مشويات' : 'Grilled')}
                  </span>

                  {/* Title */}
                  <h3 
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                  >
                    {language === 'ar' ? currentProduct.nameAr : currentProduct.nameEn}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl font-bold text-[#d4af37]">{currentProduct.price}</span>
                    <span className="text-xl text-gray-400">SAR</span>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-gray-300 text-lg leading-relaxed mb-8"
                    style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                  >
                    {language === 'ar' ? currentProduct.descriptionAr : currentProduct.descriptionEn}
                  </p>

                  {/* CTA Button */}
                  <motion.a
                    href="#menu"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941d] text-[#0a0f1a] font-bold rounded-xl shadow-lg shadow-[#d4af37]/30"
                  >
                    {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                    <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between p-4 border-t border-[#d4af37]/10">
            <button
              onClick={prevProduct}
              className="p-3 bg-[#d4af37]/20 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-[#d4af37]" />
            </button>
            <div className="flex gap-2">
              {featuredProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-[#d4af37]' : 'w-2 bg-[#d4af37]/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextProduct}
              className="p-3 bg-[#d4af37]/20 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-[#d4af37]" />
            </button>
          </div>

          {/* Desktop Dots */}
          <div className="hidden md:flex items-center justify-center gap-2 pb-6">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-[#d4af37]' : 'w-2 bg-[#d4af37]/30 hover:bg-[#d4af37]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
