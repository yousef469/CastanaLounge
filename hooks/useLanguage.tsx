'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translations: Record<string, Record<Language, string>> = {
      // Navigation
      navHome: { ar: 'الرئيسية', en: 'Home' },
      navMenu: { ar: 'القائمة', en: 'Menu' },
      navAbout: { ar: 'عن كستانا', en: 'About' },
      navGallery: { ar: 'المعرض', en: 'Gallery' },
      navContact: { ar: 'تواصل معنا', en: 'Contact' },
      
      // Hero
      heroTitle: { ar: 'كستانا لاونج', en: 'Castana Lounge' },
      heroSubtitle: { ar: 'تجربة فريدة في عالم الطعام والمشروبات', en: 'A unique experience in food and beverages' },
      heroScroll: { ar: 'اكتشف المزيد', en: 'Discover More' },
      
      // About
      aboutTitle: { ar: 'عن كستانا', en: 'About Castana' },
      aboutDescription: { ar: 'كستانا لاونج هو وجهتك المثالية للاستمتاع بأجواء راقية وتجربة طعام استثنائية. نقدم لكم تشكيلة واسعة من الأطباق والمشروبات المحضرة بحب واهتمام في أجواء دافئة ومريحة.', en: 'Castana Lounge is your perfect destination to enjoy a sophisticated atmosphere and an exceptional dining experience. We offer a wide variety of dishes and beverages prepared with love and care in a warm and comfortable setting.' },
      aboutExperience: { ar: 'تجربة لا تنسى', en: 'Unforgettable Experience' },
      aboutQuality: { ar: 'جودة عالية', en: 'High Quality' },
      aboutAmbiance: { ar: 'أجواء راقية', en: 'Sophisticated Ambiance' },
      
      // Menu
      menuTitle: { ar: 'القائمة', en: 'Menu' },
      menuSearch: { ar: 'ابحث في القائمة', en: 'Search menu' },
      menuPrice: { ar: 'السعر', en: 'Price' },
      menuVat: { ar: 'جميع الأسعار تشمل ضريبة القيمة المضافة 15%', en: 'All prices include 15% VAT' },
      
      // Gallery
      galleryTitle: { ar: 'معرض الصور', en: 'Gallery' },
      
      // Contact
      contactTitle: { ar: 'تواصل معنا', en: 'Contact Us' },
      contactAddress: { ar: 'العنوان', en: 'Address' },
      contactPhone: { ar: 'الهاتف', en: 'Phone' },
      contactHours: { ar: 'ساعات العمل', en: 'Opening Hours' },
      contactSocial: { ar: 'تابعنا', en: 'Follow Us' },
      
      // Hours
      hoursThuFri: { ar: 'الخميس - الجمعة: 10 ص - 3 ص', en: 'Thursday - Friday: 10 AM - 3 AM' },
      hoursSatWed: { ar: 'السبت - الأربعاء: 10 ص - 2 ص', en: 'Saturday - Wednesday: 10 AM - 2 AM' },
      
      // Footer
      footerRights: { ar: 'جميع الحقوق محفوظة © 2024 كستانا لاونج', en: 'All rights reserved © 2024 Castana Lounge' },
      
      // Language
      langSwitch: { ar: 'English', en: 'العربية' },
    };
    
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
