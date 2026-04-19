'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Coffee, MessageCircle, Share2, MapPin, Phone, ArrowUp, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t, language } = useLanguage();

  const quickLinks = [
    { label: t('navHome'), href: '#hero' },
    { label: t('navAbout'), href: '#about' },
    { label: t('navMenu'), href: '#menu' },
    { label: language === 'ar' ? 'العروض' : 'Showcase', href: '#showcase' },
    { label: t('navContact'), href: '#contact' },
  ];

  const socialLinks = [
    { icon: MessageCircle, href: 'https://www.instagram.com/castanalounge', label: 'Instagram' },
    { icon: Share2, href: 'https://www.facebook.com/CastanaLoungeKSA/', label: 'Facebook' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0f1a] border-t border-[#d4af37]/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-r from-[#00d4ff] to-[#d4af37] rounded-xl">
                <Coffee className="w-6 h-6 text-[#0a1628]" />
              </div>
              <h3
                className="text-2xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#d4af37] bg-clip-text text-transparent"
                style={{
                  fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
                }}
              >
                {t('heroTitle')}
              </h3>
            </div>
            <p
              className="text-gray-400 leading-relaxed mb-6 max-w-md"
              style={{
                fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)',
              }}
            >
              {language === 'ar' 
                ? 'وجهتك المثالية للاستمتاع بأجواء راقية وتجربة طعام استثنائية في قلب جدة'
                : 'Your perfect destination to enjoy an elegant atmosphere and exceptional dining experience in the heart of Jeddah'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:0533151012" className="flex items-center gap-3 text-gray-400 hover:text-[#00d4ff] transition-colors">
                <Phone className="w-4 h-4" />
                <span>0533151012</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Saudia City Compound, Al Khalidiyyah, Jeddah</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
            >
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#00d4ff] transition-colors flex items-center gap-2 group"
                    style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] group-hover:bg-[#00d4ff] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
            >
              {language === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h4>
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#00d4ff] transition-colors group"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00d4ff]/20 transition-colors">
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span>{link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </div>

            {/* Opening Hours Mini */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h5 className="text-sm font-semibold text-[#d4af37] mb-2">
                {language === 'ar' ? 'ساعات العمل' : 'Opening Hours'}
              </h5>
              <p className="text-xs text-gray-400">
                {t('hoursThuFri')}<br />
                {t('hoursSatWed')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-gray-500 text-sm text-center md:text-left"
              style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
            >
              © 2024 {t('heroTitle')}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{language === 'ar' ? 'صنع بـ' : 'Made with'}</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>{language === 'ar' ? 'في جدة' : 'in Jeddah'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
