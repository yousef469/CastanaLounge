'use client';

import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Sparkles, Award, Coffee, Star, Check, Accessibility, Car, Utensils, Music, CreditCard } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function About() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: t('aboutExperience'),
      description: language === 'ar' 
        ? 'نقدم تجربة طعام استثنائية تجمع بين الأصالة والحداثة في أجواء راقية ومريحة'
        : 'We offer an exceptional dining experience blending authenticity and modernity in an elegant atmosphere',
      color: 'from-[#00d4ff] to-[#00a8cc]',
    },
    {
      icon: Award,
      title: t('aboutQuality'),
      description: language === 'ar'
        ? 'نستخدم أجود المكونات الطازجة ونحرص على تقديم أعلى معايير الجودة في كل طبق'
        : 'We use the freshest premium ingredients and maintain the highest quality standards in every dish',
      color: 'from-[#d4af37] to-[#f4cf67]',
    },
    {
      icon: Coffee,
      title: t('aboutAmbiance'),
      description: language === 'ar'
        ? 'أجواء دافئة وهادئة مع تصميم عصري أنيق يناسب جميع المناسبات والاحتفالات'
        : 'Warm and serene ambiance with modern elegant design suitable for all occasions and celebrations',
      color: 'from-[#00d4ff] to-[#d4af37]',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#0a0f1a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00d4ff]/5 rounded-full blur-3xl" />
      
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
            <Award className="w-4 h-4" />
            {language === 'ar' ? 'من نحن' : 'Who We Are'}
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#d4af37] bg-clip-text text-transparent"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)', lineHeight: '1.4' }}
          >
            {t('aboutTitle')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف قصة كستنا لاونج وما يميزنا عن الآخرين'
              : 'Discover the story of Castana Lounge and what sets us apart'}
          </p>
        </motion.div>

        {/* Two Column Layout - Text Left, Accessibility Right */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          {/* Left Column - Story Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
            style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
          >
            {language === 'ar' ? (
              <>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-[#d4af37] to-[#f4cf67] rounded-xl mb-4 shadow-lg shadow-[#d4af37]/20">
                    <Sparkles className="w-5 h-5 text-[#0a0f1a]" />
                  </div>
                  <h3 className="text-[#d4af37] font-bold text-xl mb-3">ملاذ راقٍ في قلب جدة</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    في قلب مجمع مدينة السعودية بالخالدية، يجمع كستنا لاونج بين الأجواء الدافئة والتصميم العصري
                    المستوحى من الطابع الصناعي الحديث ليقدم تجربة استثنائية. يتميز المكان بإضاءة ذهبية ناعمة 
                    وموسيقى هادئة ومقاعد فاخرة تخلق أجواءً حميمية مثالية للحوارات الممتعة.
                  </p>
                </div>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#00d4ff]/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] rounded-xl mb-4 shadow-lg shadow-[#00d4ff]/20">
                    <Award className="w-5 h-5 text-[#0a0f1a]" />
                  </div>
                  <h3 className="text-[#00d4ff] font-bold text-xl mb-3">خدمة متميزة</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    من فريقنا المخلص بقيادة محمد شوفان، إلى مأكولاتنا المحضرة بإتقان ومشروباتنا المميزة.
                    كل طبق يُعد بشغف، من بيتزا الخشب المحترقة إلى موهيتونا المثالي. خدمة الشيشة الفاخرة
                    لدينا تضم أرقى النكهات المحضرة بأيدي خبيرة.
                  </p>
                </div>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-4 shadow-lg shadow-purple-500/20">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-purple-400 font-bold text-xl mb-3">أجواء لا تُضاهى</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    سواء كنت تبحث عن مكان أنيق للقاءات العمل، أو احتفال بمناسبة خاصة، أو مجرد استراحة هادئة
                    بعد يوم طويل، كستنا لاونج هو وجهتك المثالية. مع معايير الضيافة الفاخرة والقائمة المتنوعة،
                    نعدك بتجربة تفوق التوقعات.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-[#d4af37] to-[#f4cf67] rounded-xl mb-4 shadow-lg shadow-[#d4af37]/20">
                    <Sparkles className="w-5 h-5 text-[#0a0f1a]" />
                  </div>
                  <h3 className="text-[#d4af37] font-bold text-xl mb-3">A Sophisticated Retreat</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    In the heart of Saudia City Compound, Al Khalidiyyah, Jeddah. Castana Lounge blends 
                    warm ambient lighting with modern industrial design. Our carefully curated interiors 
                    feature comfortable seating, soft music, and golden accent lighting that creates 
                    the perfect intimate setting.
                  </p>
                </div>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#00d4ff]/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] rounded-xl mb-4 shadow-lg shadow-[#00d4ff]/20">
                    <Award className="w-5 h-5 text-[#0a0f1a]" />
                  </div>
                  <h3 className="text-[#00d4ff] font-bold text-xl mb-3">Distinguished Service</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    From our dedicated team led by Mohammed Shofan, to our meticulously prepared cuisine 
                    and signature beverages. Each dish is crafted with passion, from wood-fired pizzas 
                    to signature mojitos. Our premium shisha features the finest quality flavors.
                  </p>
                </div>
                <div className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-4 shadow-lg shadow-purple-500/20">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-purple-400 font-bold text-xl mb-3">An Unmatched Atmosphere</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Whether you're seeking an elegant venue for business meetings, celebrating a special 
                    occasion, or unwinding after a long day, Castana Lounge is your perfect destination. 
                    With luxurious hospitality and diverse menu catering to all tastes.
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                <Star className="w-5 h-5 text-[#d4af37]" />
                {language === 'ar' ? 'ما يميزنا' : 'What Makes Us Special'}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 flex-1">
                {/* Accessibility */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Accessibility className="w-3.5 h-3.5 text-[#00d4ff]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الوصول' : 'Accessibility'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'كراسي متحركة' : 'Wheelchair'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'موقف مخصص' : 'Parking'}</li>
                  </ul>
                </div>

                {/* Service */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الخدمة' : 'Service'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'جلسات خارجية' : 'Outdoor'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'توصيل' : 'Delivery'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'حجز' : 'Reservations'}</li>
                  </ul>
                </div>

                {/* Highlights */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00d4ff]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'المميزات' : 'Highlights'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'موسيقى حية' : 'Live music'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'سطح' : 'Rooftop'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'قهوة' : 'Coffee'}</li>
                  </ul>
                </div>

                {/* Atmosphere */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Music className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الأجواء' : 'Atmosphere'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'عائلي' : 'Family'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'راقٍ' : 'Upmarket'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'مجموعات' : 'Groups'}</li>
                  </ul>
                </div>

                {/* Food Options */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Coffee className="w-3.5 h-3.5 text-[#00d4ff]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الخيارات' : 'Options'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'حلال' : 'Halal'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'نباتي' : 'Vegetarian'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'فيجان' : 'Vegan'}</li>
                  </ul>
                </div>

                {/* Payment */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الدفع' : 'Payment'}</span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-gray-400">
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'ائتمان' : 'Credit'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'مدى' : 'Debit'}</li>
                    <li className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" /> {language === 'ar' ? 'جوال' : 'Mobile'}</li>
                  </ul>
                </div>

                {/* Parking - Full width */}
                <div className="col-span-2 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Car className="w-3.5 h-3.5 text-[#00d4ff]" />
                    <span className="text-xs font-semibold text-white">{language === 'ar' ? 'الموقف' : 'Parking'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {language === 'ar' 
                      ? 'موقف مجاني واسع في المجمع + شارع'
                      : 'Free spacious parking in compound + street'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300"
            >
              <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4 shadow-lg`}>
                <feature.icon className="w-5 h-5 text-[#0a0f1a]" />
              </div>
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: language === 'ar' ? 'var(--font-cairo)' : 'var(--font-inter)' }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
