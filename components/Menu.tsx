'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { menuItems, categories } from '@/lib/menu-data';
import { Category } from '@/types';
import { Search, Utensils, Coffee, Pizza, Sandwich, Flame, Salad, ChefHat, Beef, Sunrise, IceCream, GlassWater, Star } from 'lucide-react';

const categoryConfig: Record<Category, { icon: any; desc: { ar: string; en: string } }> = {
  hotAppetizers: { 
    icon: Flame, 
    desc: { ar: 'مقبلات ساخنة لبداية مثالية', en: 'Hot appetizers for a perfect start' }
  },
  coldAppetizers: { 
    icon: Salad, 
    desc: { ar: 'سلطات ومقبلات باردة منعشة', en: 'Fresh cold salads & appetizers' }
  },
  pizzaPasta: { 
    icon: Pizza, 
    desc: { ar: 'بيتزا إيطالية وباستا طازجة', en: 'Italian pizza & fresh pasta' }
  },
  sandwiches: { 
    icon: Sandwich, 
    desc: { ar: 'سندوتشات متنوعة ولذيذة', en: 'Delicious variety of sandwiches' }
  },
  mainCourses: { 
    icon: ChefHat, 
    desc: { ar: 'أطباق رئيسية شهية', en: 'Delectable main courses' }
  },
  grilled: { 
    icon: Beef, 
    desc: { ar: 'مشويات على الفحم', en: 'Charcoal grilled specialties' }
  },
  breakfast: { 
    icon: Sunrise, 
    desc: { ar: 'إفطار شهي كل يوم', en: 'Delicious breakfast every day' }
  },
  sweets: { 
    icon: IceCream, 
    desc: { ar: 'حلويات وآيس كريم', en: 'Desserts & ice cream' }
  },
  hotDrinks: { 
    icon: Coffee, 
    desc: { ar: 'قهوة ساخنة ومشروبات', en: 'Hot coffee & beverages' }
  },
  coldDrinks: { 
    icon: GlassWater, 
    desc: { ar: 'مشروبات باردة وعصائر', en: 'Cold drinks & fresh juices' }
  },
};

export default function Menu() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('hotAppetizers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(
    (item) =>
      item.category === selectedCategory &&
      (item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentCategory = categoryConfig[selectedCategory];
  const CategoryIcon = currentCategory.icon;

  return (
    <section id="menu" className="py-24 bg-[#0a0f1a]">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-2 bg-[#d4af37]/20 text-[#d4af37] rounded-full text-sm font-medium mb-4">
            {language === 'ar' ? 'قائمة الطعام' : 'Our Menu'}
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
          >
            {t('menuTitle')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-[#00d4ff] mx-auto" />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative group">
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00d4ff] transition-colors`} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في القائمة...' : 'Search Menu...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-[#1a1f2e] border border-[#d4af37]/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]/50 transition-all`}
              style={{
                fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
              }}
            />
          </div>
        </motion.div>

        {/* Category Pills - Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Object.keys(categories).map((cat) => {
              const isSelected = selectedCategory === cat;
              
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#0a0f1a]'
                      : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-[#d4af37]/20'
                  }`}
                  style={{
                    fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                  }}
                >
                  {categories[cat as Category][language]}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Menu Items - Centered */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 w-full"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="group flex items-center justify-between w-full p-4 md:p-5 bg-[#1a1f2e] rounded-xl border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#d4af37]/50 text-sm font-mono w-8">{String(index + 1).padStart(2, '0')}</span>
                  <h3
                    className="text-center text-lg md:text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors"
                    style={{
                      fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                    }}
                  >
                    {language === 'ar' ? item.nameAr : item.nameEn}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xl">{item.price}</span>
                  <span className="text-[#d4af37] font-bold text-xl">SAR</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p
              className="text-gray-400"
              style={{
                fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
              }}
            >
              {language === 'ar' ? 'لا توجد نتائج' : 'No items found'}
            </p>
          </motion.div>
        )}

        {/* VAT Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p
            className="text-gray-500 text-sm"
            style={{
              fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
            }}
          >
            {t('menuVat')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
