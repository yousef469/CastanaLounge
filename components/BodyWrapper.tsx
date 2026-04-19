'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
