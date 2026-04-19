'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';
import { X, ZoomIn, Camera, Eye, Grid3X3, Images, Utensils, Coffee } from 'lucide-react';

const galleryCategories = [
  { id: 'all', label: { ar: 'الكل', en: 'All' }, icon: Grid3X3 },
  { id: 'interior', label: { ar: 'الديكور', en: 'Interior' }, icon: Images },
  { id: 'food', label: { ar: 'الأطباق', en: 'Food' }, icon: Utensils },
  { id: 'drinks', label: { ar: 'المشروبات', en: 'Drinks' }, icon: Coffee },
];

const galleryImages = [
  { id: 1, category: 'interior', alt: { ar: 'ديكور داخلي أنيق', en: 'Elegant Interior' }, aspect: 'square' },
  { id: 2, category: 'food', alt: { ar: 'أطباق شهية', en: 'Delicious Dishes' }, aspect: 'tall' },
  { id: 3, category: 'interior', alt: { ar: 'أجواء راقية', en: 'Sophisticated Ambiance' }, aspect: 'wide' },
  { id: 4, category: 'drinks', alt: { ar: 'مشروبات منعشة', en: 'Refreshing Drinks' }, aspect: 'square' },
  { id: 5, category: 'food', alt: { ar: 'بيتزا طازجة', en: 'Fresh Pizza' }, aspect: 'wide' },
  { id: 6, category: 'interior', alt: { ar: 'إطلالة ليلية', en: 'Night View' }, aspect: 'tall' },
  { id: 7, category: 'food', alt: { ar: 'حلويات مميزة', en: 'Special Desserts' }, aspect: 'square' },
  { id: 8, category: 'drinks', alt: { ar: 'قهوة ممتازة', en: 'Excellent Coffee' }, aspect: 'tall' },
];

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const getAspectClass = (aspect: string) => {
    switch (aspect) {
      case 'tall': return 'row-span-2';
      case 'wide': return 'col-span-2';
      default: return '';
    }
  };

  return (
    <section id="gallery" className="py-32 px-4 relative overflow-hidden">
      {/* Glassmorphism background overlay */}
      <div className="absolute inset-0 bg-[#0a1628]/60 backdrop-blur-sm" />
      {/* Decorative blur elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 text-[#d4af37] rounded-full text-sm font-medium mb-6"
          >
            <Camera className="w-4 h-4" />
            {language === 'ar' ? 'لحظات مميزة' : 'Special Moments'}
          </motion.span>
          <h2
            className="text-5xl md:text-6xl font-bold mb-6 text-[#00d4ff]"
            style={{
              fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
            }}
          >
            {t('galleryTitle')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'استمتع بجولة بصرية في أجواء كستانا وأطباقها المميزة'
              : 'Enjoy a visual tour of Castana\'s ambiance and signature dishes'}
          </p>
          <div className="w-32 h-1 bg-[#d4af37] mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {galleryCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a1628] font-semibold shadow-lg shadow-[#00d4ff]/30'
                    : 'bg-white/5 backdrop-blur-lg text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label[language]}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${getAspectClass(image.aspect)}`}
                onClick={() => setSelectedImage(image)}
              >
                {/* Image Placeholder with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0d1a2d]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 to-[#d4af37]/10" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {image.category === 'interior' && <Images className="w-8 h-8 text-[#00d4ff]" />}
                    {image.category === 'food' && <Utensils className="w-8 h-8 text-[#d4af37]" />}
                    {image.category === 'drinks' && <Coffee className="w-8 h-8 text-[#00d4ff]" />}
                  </div>
                  <span
                    className="text-gray-300 text-sm text-center font-medium"
                    style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                  >
                    {image.alt[language]}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#d4af37] flex items-center justify-center"
                    >
                      <ZoomIn className="w-6 h-6 text-[#0a1628]" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span
                      className="text-white font-semibold"
                      style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                    >
                      {image.alt[language]}
                    </span>
                  </div>
                </div>

                {/* Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#00d4ff]/50 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl w-full"
              >
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d1a2d] rounded-3xl overflow-hidden border border-white/10">
                  {/* Image Placeholder */}
                  <div className="aspect-video relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/20 to-[#d4af37]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        {selectedImage.category === 'interior' && <Images className="w-20 h-20 text-[#00d4ff] mx-auto mb-4" />}
                        {selectedImage.category === 'food' && <Utensils className="w-20 h-20 text-[#d4af37] mx-auto mb-4" />}
                        {selectedImage.category === 'drinks' && <Coffee className="w-20 h-20 text-[#00d4ff] mx-auto mb-4" />}
                        <span
                          className="text-gray-300 text-2xl"
                          style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                        >
                          {selectedImage.alt[language]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Bar */}
                  <div className="p-6 flex items-center justify-between bg-white/5">
                    <div>
                      <h3
                        className="text-xl font-bold text-white mb-1"
                        style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                      >
                        {selectedImage.alt[language]}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{language === 'ar' ? 'معرض الصور' : 'Gallery View'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a1628] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all"
                      style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                    >
                      {language === 'ar' ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
