'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Clock, ExternalLink, Navigation, Send, Phone } from 'lucide-react';

export default function Contact() {
  const { t, language } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-[#0a0f1a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-sm font-medium mb-4 border border-[#d4af37]/20">
            <Send className="w-4 h-4" />
            {language === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#d4af37] bg-clip-text text-transparent"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
          >
            {t('contactTitle')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === 'ar'
              ? 'زورونا أو تواصلوا معنا - نحن هنا لخدمتكم'
              : 'Visit us or get in touch - we are here to serve you'}
          </p>
        </motion.div>

        {/* Main Grid - 3 columns on large screens */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards - 2 columns */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {/* Phone Card */}
            <motion.a
              href="tel:0533151012"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-r from-[#d4af37] to-[#f4cf67] rounded-xl mb-4 shadow-lg shadow-[#d4af37]/20 group-hover:shadow-[#d4af37]/30 transition-shadow">
                  <Phone className="w-5 h-5 text-[#0a0f1a]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                  {t('contactPhone')}
                </h3>
                <p className="text-2xl font-semibold text-[#d4af37] mb-2">0533151012</p>
                <span className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-[#00d4ff] transition-colors">
                  {language === 'ar' ? 'اتصل الآن' : 'Call Now'}
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </motion.a>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#00d4ff]/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] rounded-xl mb-4 shadow-lg shadow-[#00d4ff]/20">
                  <Clock className="w-5 h-5 text-[#0a0f1a]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                  {t('contactHours')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{language === 'ar' ? 'الخميس - الجمعة' : 'Thu - Fri'}</span>
                    <span className="text-white font-medium">10 ص - 3 ص</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{language === 'ar' ? 'السبت - الأربعاء' : 'Sat - Wed'}</span>
                    <span className="text-white font-medium">10 ص - 2 ص</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Links - Full width with big icons at sides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sm:col-span-2 bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                {t('contactSocial')}
              </h3>
              
              {/* Social Icons - Centered close together */}
              <div className="flex justify-center items-center gap-4 mb-6">
                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/castanalounge"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="p-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-white text-sm">Instagram</span>
                </motion.a>

                {/* Facebook */}
                <motion.a
                  href="https://www.facebook.com/CastanaLoungeKSA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-white text-sm">Facebook</span>
                </motion.a>
              </div>

              {/* Footer Credits - Below social icons */}
              <div className="flex justify-center items-center gap-6 text-xs border-t border-white/10 pt-4">
                <p className="text-gray-400">
                  made by <span className="text-[#d4af37]">simplyyousef</span>
                </p>
                <p className="text-gray-400">
                  © 2026 <span className="text-[#00d4ff]">CASTANA</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Map - Single column, fits content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:row-span-1"
          >
            <div className="bg-white/[0.03] backdrop-blur-sm p-5 rounded-2xl border border-white/10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#00d4ff]/10 rounded-lg">
                  <Navigation className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <h3 className="font-bold text-white" style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                  {language === 'ar' ? 'موقعنا' : 'Our Location'}
                </h3>
              </div>
              
              <div className="rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.783544485239!2d39.12998757465838!3d21.55531746948641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3dbc52c373051%3A0x70fed5c2a26f670a!2sCastana%20lounge!5e0!3m2!1sen!2ssa!4v1776562415725!5m2!1sen!2ssa"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <p className="mt-4 text-sm text-gray-400 text-center">
                Saudia City Compound, Al Khalidiyyah, Jeddah
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
