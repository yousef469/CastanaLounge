'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, Coffee, ChevronRight, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section - order: hero, showcase, menu, about, contact
      const sections = ['hero', 'showcase', 'menu', 'about', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: t('navHome'), href: '#hero' },
    { id: 'showcase', label: language === 'ar' ? 'العروض' : 'Showcase', href: '#showcase' },
    { id: 'menu', label: t('navMenu'), href: '#menu' },
    { id: 'about', label: t('navAbout'), href: '#about' },
    { id: 'contact', label: t('navContact'), href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0a0f1a]/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-[#d4af37]/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-16 md:h-20">
          {/* Logo - Left */}
          <motion.a
            href="#hero"
            className="flex items-center gap-2 group flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 bg-gradient-to-r from-[#00d4ff] to-[#d4af37] rounded-xl group-hover:shadow-lg group-hover:shadow-[#00d4ff]/30 transition-shadow">
              <Coffee className="w-5 h-5 text-[#0a1628]" />
            </div>
            <span
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#d4af37] bg-clip-text text-transparent hidden sm:block"
              style={{
                fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
              }}
            >
              {t('heroTitle')}
            </span>
          </motion.a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-[#00d4ff]' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{
                      fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-white/10 rounded-xl shadow-lg shadow-[#00d4ff]/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 font-semibold text-base tracking-wide">{link.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions - Top Right Corner */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Reservation Button */}
            <Link href="/reservation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-5 py-3 bg-[#d4af37] text-[#0a0f1a] font-bold rounded-xl hover:bg-[#f4cf67] transition-colors text-base shadow-lg shadow-[#d4af37]/30"
                style={{
                  fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                }}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden lg:inline">
                  {language === 'ar' ? 'احجز الآن' : 'Reserve Table'}
                </span>
                <span className="lg:hidden">
                  {language === 'ar' ? 'احجز' : 'Reserve'}
                </span>
              </motion.button>
            </Link>

            {/* Language Switcher */}
            <motion.button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d4ff]/30 rounded-xl transition-all duration-300"
              style={{
                fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
              }}
            >
              <Globe className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-sm font-medium text-gray-300 hidden sm:inline">
                {language === 'ar' ? 'العربية' : 'English'}
              </span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-5 h-5 text-[#00d4ff]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-5 h-5 text-[#00d4ff]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0a1628]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-2 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#d4af37]/20 text-[#00d4ff] border border-[#00d4ff]/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={{
                      fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                    }}
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </motion.a>
                );
              })}
              
              {/* Mobile Reservation Button */}
              <Link href="/reservation" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.div
                  initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="w-full flex items-center justify-between p-4 bg-[#d4af37] text-[#0a0f1a] rounded-xl font-bold mt-2"
                  style={{
                    fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                  }}
                >
                  <span>{language === 'ar' ? 'احجز طاولة' : 'Reserve Table'}</span>
                  <Calendar className="w-5 h-5" />
                </motion.div>
              </Link>

              {/* Mobile Language Switcher */}
              <motion.button
                onClick={() => {
                  setLanguage(language === 'ar' ? 'en' : 'ar');
                  setIsMobileMenuOpen(false);
                }}
                initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 + 0.1 }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#d4af37]/20 to-transparent text-[#d4af37] rounded-xl border border-[#d4af37]/30 mt-4"
                style={{
                  fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                }}
              >
                <span className="font-medium">{t('langSwitch')}</span>
                <Globe className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
