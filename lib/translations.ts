import { Translations } from '@/types';

export const translations: Translations = {
  ar: {
    // Navigation
    navHome: 'الرئيسية',
    navMenu: 'القائمة',
    navAbout: 'عن كستانا',
    navGallery: 'المعرض',
    navContact: 'تواصل معنا',
    
    // Hero
    heroTitle: 'كستانا لاونج',
    heroSubtitle: 'تجربة فريدة في عالم الطعام والمشروبات',
    heroScroll: 'اكتشف المزيد',
    
    // About
    aboutTitle: 'عن كستانا',
    aboutDescription: 'كستانا لاونج هو وجهتك المثالية للاستمتاع بأجواء راقية وتجربة طعام استثنائية. نقدم لكم تشكيلة واسعة من الأطباق والمشروبات المحضرة بحب واهتمام في أجواء دافئة ومريحة.',
    aboutExperience: 'تجربة لا تنسى',
    aboutQuality: 'جودة عالية',
    aboutAmbiance: 'أجواء راقية',
    
    // Menu
    menuTitle: 'القائمة',
    menuSearch: 'ابحث في القائمة',
    menuPrice: 'السعر',
    menuVat: 'جميع الأسعار تشمل ضريبة القيمة المضافة 15%',
    
    // Gallery
    galleryTitle: 'معرض الصور',
    
    // Contact
    contactTitle: 'تواصل معنا',
    contactAddress: 'العنوان',
    contactPhone: 'الهاتف',
    contactHours: 'ساعات العمل',
    contactSocial: 'تابعنا',
    
    // Hours
    hoursThuFri: 'الخميس - الجمعة: 10 ص - 3 ص',
    hoursSatWed: 'السبت - الأربعاء: 10 ص - 2 ص',
    
    // Footer
    footerRights: 'جميع الحقوق محفوظة © 2024 كستانا لاونج',
    
    // Language
    langSwitch: 'English',
  },
  en: {
    // Navigation
    navHome: 'Home',
    navMenu: 'Menu',
    navAbout: 'About',
    navGallery: 'Gallery',
    navContact: 'Contact',
    
    // Hero
    heroTitle: 'Castana Lounge',
    heroSubtitle: 'A unique experience in food and beverages',
    heroScroll: 'Discover More',
    
    // About
    aboutTitle: 'About Castana',
    aboutDescription: 'Castana Lounge is your perfect destination to enjoy a sophisticated atmosphere and an exceptional dining experience. We offer a wide variety of dishes and beverages prepared with love and care in a warm and comfortable setting.',
    aboutExperience: 'Unforgettable Experience',
    aboutQuality: 'High Quality',
    aboutAmbiance: 'Sophisticated Ambiance',
    
    // Menu
    menuTitle: 'Menu',
    menuSearch: 'Search menu',
    menuPrice: 'Price',
    menuVat: 'All prices include 15% VAT',
    
    // Gallery
    galleryTitle: 'Gallery',
    
    // Contact
    contactTitle: 'Contact Us',
    contactAddress: 'Address',
    contactPhone: 'Phone',
    contactHours: 'Opening Hours',
    contactSocial: 'Follow Us',
    
    // Hours
    hoursThuFri: 'Thursday - Friday: 10 AM - 3 AM',
    hoursSatWed: 'Saturday - Wednesday: 10 AM - 2 AM',
    
    // Footer
    footerRights: 'All rights reserved © 2024 Castana Lounge',
    
    // Language
    langSwitch: 'العربية',
  },
};

export const getTranslation = (lang: 'ar' | 'en', key: string): string => {
  return translations[lang][key] || key;
};
