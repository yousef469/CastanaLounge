'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar, Users, Crown, Phone, User, Clock, Download, Check, History, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Video Background: Single 5-minute looping video with more blur
// Defined OUTSIDE the page component so it doesn't re-render on form changes
const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only start playing once video is loaded
    const handleCanPlay = () => {
      if (!isLoaded) {
        setIsLoaded(true);
        video.play().catch(() => {});
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    
    // If already loaded, play
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    // Check every second if 5 minutes (300 seconds) have passed
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed >= 300) {
        // Reset after 5 minutes
        startTimeRef.current = Date.now();
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }, 1000);

    // Also handle video ended event (in case video is shorter than 5 mins)
    const onEnded = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed < 300) {
        // If less than 5 mins passed, loop the video
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        // Reset timer and play from start
        startTimeRef.current = Date.now();
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    video.addEventListener('ended', onEnded);

    return () => {
      clearInterval(interval);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isLoaded]);

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        src="/ezgif-21a92b9f6e50cd2d.mp4"
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          objectFit: 'cover', 
          objectPosition: 'center', 
          filter: 'blur(20px) brightness(0.35)',
          transform: 'scale(1.1)' // Prevent blur edges
        }}
      />
    </div>
  );
};

export default function ReservationPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState<'form' | 'pending' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tableNumber: '',
    isVip: false,
    numberOfPersons: 1,
    date: '',
    time: '',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [existingReservation, setExistingReservation] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [userIp, setUserIp] = useState('');

  // Get user IP on mount
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setUserIp(data.ip);
        checkExistingReservation(data.ip);
      })
      .catch(() => {
        // Fallback: use localStorage to track
        const deviceId = localStorage.getItem('castana_device_id') || 'device-' + Date.now();
        localStorage.setItem('castana_device_id', deviceId);
        setUserIp(deviceId);
        checkExistingReservation(deviceId);
      });
  }, []);

  // Check if user already has an active reservation
  const checkExistingReservation = async (identifier: string) => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .eq('ipAddress', identifier)
      .eq('scanned', false)
      .gte('createdAt', Date.now() - (24 * 60 * 60 * 1000)) // Last 24 hours
      .order('createdAt', { ascending: false })
      .limit(1);
    
    if (data && data.length > 0) {
      setExistingReservation(data[0]);
    }
  };

  // Delete existing reservation
  const deleteExistingReservation = async () => {
    if (existingReservation) {
      await supabase.from('reservations').delete().eq('id', existingReservation.id);
      setExistingReservation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('pending');

    setTimeout(async () => {
      const id = 'CASTANA-' + Date.now().toString(36).toUpperCase();
      setReservationId(id);

      // Create QR code data URL for scanning
      const qrData = `${window.location.origin}/reservation/scan?id=${id}`;

      const reservationData = {
        id,
        name: formData.name || 'Guest',
        phone: formData.phone || 'N/A',
        tableNumber: formData.tableNumber,
        isVip: formData.isVip,
        guests: formData.numberOfPersons,
        date: formData.date,
        time: formData.time,
        createdAt: Date.now(),
        qrCode: qrData,
        scanned: false,
      };

      // Check for duplicate by phone
      const { data: existingByPhone } = await supabase
        .from('reservations')
        .select('*')
        .eq('phone', formData.phone)
        .eq('scanned', false)
        .gte('createdAt', Date.now() - (24 * 60 * 60 * 1000))
        .limit(1);
      
      if (existingByPhone && existingByPhone.length > 0) {
        alert(language === 'ar' 
          ? 'لديك حجز نشط بالفعل بهذا الرقم. يرجى إلغاء الحجز السابق أولاً.'
          : 'You already have an active reservation with this phone number. Please cancel the previous reservation first.');
        setStep('form');
        return;
      }

      // Check table availability - table is unavailable for 3 hours after any reservation
      const requestedDate = formData.date;
      const requestedTime = formData.time;
      const requestedDateTime = new Date(`${requestedDate}T${requestedTime}`).getTime();
      const windowStart = requestedDateTime - (3 * 60 * 60 * 1000); // 3 hours before
      const windowEnd = requestedDateTime + (3 * 60 * 60 * 1000); // 3 hours after
      
      const { data: tableBookings } = await supabase
        .from('reservations')
        .select('*')
        .eq('tableNumber', formData.tableNumber)
        .eq('date', requestedDate);
      
      if (tableBookings && tableBookings.length > 0) {
        // Check if any existing booking overlaps with the 3-hour window
        const hasOverlap = tableBookings.some((booking: any) => {
          const bookingDateTime = new Date(`${booking.date}T${booking.time}`).getTime();
          return bookingDateTime >= windowStart && bookingDateTime <= windowEnd;
        });
        
        if (hasOverlap) {
          alert(language === 'ar' 
            ? `الطاولة ${formData.tableNumber} محجوزة بالفعل في هذا الوقت. يرجى اختيار طاولة أخرى أو وقت مختلف (يجب أن يكون الفرق 3 ساعات على الأقل).`
            : `Table ${formData.tableNumber} is already booked at this time. Please choose another table or a different time (must be at least 3 hours apart).`);
          setStep('form');
          return;
        }
      }

      // Store in Supabase database with IP tracking
      await supabase.from('reservations').insert({
        ...reservationData,
        ipAddress: userIp,
        deviceId: localStorage.getItem('castana_device_id') || userIp
      });

      // Generate QR code image URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);

      setStep('success');
    }, 5000);
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `reservation-${reservationId}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab
      window.open(qrCodeUrl, '_blank');
    }
  };

  if (step === 'pending') {
    return (
      <div className="min-h-screen relative">
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 border-4 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
              {language === 'ar' ? 'جاري معالجة الحجز...' : 'Processing Reservation...'}
            </h2>
            <p className="text-gray-300">
              {language === 'ar' ? 'يرجى الانتظار لحظات' : 'Please wait a moment'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
        <VideoBackground />
        <div className="relative z-10 w-full max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0f1a]/95 backdrop-blur-xl rounded-3xl p-10 md:p-12 border border-[#d4af37]/40 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-[#d4af37] mb-2">
                {language === 'ar' ? 'تم الحجز بنجاح!' : 'Reservation Confirmed!'}
              </h2>
              <p className="text-gray-400">{reservationId}</p>
            </div>

            {qrCodeUrl && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-[300px] mx-auto" />
                <p className="text-center text-gray-800 text-sm mt-4">
                  {language === 'ar' ? 'امسح الكود عند الوصول' : 'Scan this code upon arrival'}
                </p>
                <p className="text-center text-red-600 text-xs mt-2">
                  {language === 'ar' 
                    ? '⚠️ صلاحية الكود 3 ساعات من وقت الحجز' 
                    : '⚠️ QR code valid for 3 hours from reservation time'}
                </p>
              </div>
            )}

            <div className="flex gap-6">
              <button
                onClick={downloadQR}
                className="flex-1 flex items-center justify-center gap-2 py-5 text-lg bg-[#d4af37] text-[#0a0f1a] font-bold rounded-xl hover:bg-[#f4cf67] transition-colors"
              >
                <Download className="w-6 h-6" />
                {language === 'ar' ? 'تحميل' : 'Download'}
              </button>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-5 text-lg bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      <VideoBackground />
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Registration History Button - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] rounded-xl border border-[#d4af37]/30 transition-colors"
          >
            <History className="w-5 h-5" />
            {language === 'ar' ? 'سجل الحجوزات' : 'Registration History'}
          </button>
        </div>

        {/* Existing Reservation Warning */}
        {existingReservation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-200 font-medium mb-2">
                  {language === 'ar' 
                    ? `لديك حجز نشط: ${existingReservation.id}` 
                    : `You have an active reservation: ${existingReservation.id}`}
                </p>
                <p className="text-amber-300/70 text-sm mb-3">
                  {language === 'ar'
                    ? 'يجب إلغاء الحجز السابق قبل إنشاء حجز جديد'
                    : 'You must cancel the previous reservation before creating a new one'}
                </p>
                <button
                  onClick={deleteExistingReservation}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {language === 'ar' ? 'إلغاء الحجز' : 'Cancel Reservation'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Registration History Modal */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 max-w-md w-full border border-[#d4af37]/30"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#d4af37] mb-4">
                {language === 'ar' ? 'سجل الحجوزات' : 'Registration History'}
              </h3>
              {existingReservation ? (
                <div className="space-y-3">
                  <div className="p-4 bg-[#0a0f1a] rounded-xl border border-[#d4af37]/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#d4af37] font-mono text-sm">{existingReservation.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${existingReservation.scanned ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {existingReservation.scanned 
                          ? (language === 'ar' ? 'تم التحقق' : 'Checked In')
                          : (language === 'ar' ? 'معلق' : 'Pending')}
                      </span>
                    </div>
                    <p className="text-white text-sm">{existingReservation.name}</p>
                    <p className="text-gray-400 text-xs">{existingReservation.date} • {existingReservation.time}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {language === 'ar' ? 'لا توجد حجوزات حالية' : 'No current reservations'}
                </p>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="w-full mt-4 py-3 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] rounded-xl transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-[#d4af37]">Castana Lounge</h1>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            {language === 'ar' ? 'حجز طاولة' : 'Table Reservation'}
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-[#0a0f1a]/95 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-[#d4af37]/40 space-y-10 shadow-2xl text-lg"
        >
          {/* Optional */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-base mb-3">
                <User className="w-5 h-5 text-[#d4af37]" />
                {language === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/20 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-base mb-3">
                <Phone className="w-5 h-5 text-[#d4af37]" />
                {language === 'ar' ? 'الهاتف (اختياري)' : 'Phone (Optional)'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/20 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          <div className="border-t border-[#d4af37]/20 pt-6">
            <p className="text-[#d4af37] text-base mb-4">
              {language === 'ar' ? 'الحقول المطلوبة:' : 'Required Fields:'}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-lg mb-3">
                  <span className="text-[#d4af37]">#</span>
                  {language === 'ar' ? 'رقم الطاولة *' : 'Table Number *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/30 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
                  placeholder={language === 'ar' ? 'مثال: 05' : 'e.g. 05'}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 text-lg mb-3">
                  <Users className="w-5 h-5 text-[#d4af37]" />
                  {language === 'ar' ? 'عدد الأشخاص *' : 'Number of Persons *'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={formData.numberOfPersons}
                  onChange={(e) => setFormData({ ...formData, numberOfPersons: parseInt(e.target.value) })}
                  className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/30 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-gray-300 text-lg mb-3">
                <Crown className="w-5 h-5 text-[#d4af37]" />
                {language === 'ar' ? 'طاولة VIP؟' : 'VIP Table?'}
              </label>
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVip: true })}
                  className={`flex-1 py-6 text-xl rounded-xl border-2 transition-all font-bold ${
                    formData.isVip
                      ? 'bg-[#d4af37] text-[#0a0f1a] border-[#d4af37]'
                      : 'bg-transparent text-gray-400 border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  {language === 'ar' ? 'نعم' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVip: false })}
                  className={`flex-1 py-6 text-xl rounded-xl border-2 transition-all font-bold ${
                    !formData.isVip
                      ? 'bg-[#d4af37] text-[#0a0f1a] border-[#d4af37]'
                      : 'bg-transparent text-gray-400 border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  {language === 'ar' ? 'لا' : 'No'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-lg mb-3">
                  <Calendar className="w-5 h-5 text-[#d4af37]" />
                  {language === 'ar' ? 'التاريخ *' : 'Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/30 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 text-lg mb-3">
                  <Clock className="w-5 h-5 text-[#d4af37]" />
                  {language === 'ar' ? 'الوقت *' : 'Time *'}
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-5 py-4 bg-[#0a0f1a] border border-[#d4af37]/30 rounded-xl text-white text-lg focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-6 text-xl bg-[#d4af37] text-[#0a0f1a] font-bold rounded-xl mt-10 hover:bg-[#f4cf67] transition-colors shadow-xl shadow-[#d4af37]/30"
          >
            {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Reservation'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
