'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Users, Crown, Calendar, Clock, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReservationData {
  id: string;
  name: string;
  phone: string;
  tableNumber: string;
  isVip: boolean;
  numberOfPersons: number;
  date: string;
  time: string;
  createdAt: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  scanned?: boolean;
  scannedAt?: number;
}

function ScanContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch from Supabase database
      supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setReservation(data);
          } else {
            console.error('Reservation not found:', error);
            setNotFound(true);
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const markAsScanned = async () => {
    if (reservation) {
      const updated = { ...reservation, scanned: true, scannedAt: Date.now() };
      
      // Update in Supabase
      await supabase
        .from('reservations')
        .update({ scanned: true, scannedAt: Date.now() })
        .eq('id', reservation.id);
      
      setReservation(updated);
    }
  };

  const updateStatus = async (status: 'confirmed' | 'cancelled') => {
    if (reservation) {
      const updated = { ...reservation, status };
      
      // Update in Supabase
      await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservation.id);
      
      setReservation(updated);
    }
  };

  const isExpired = () => {
    if (!reservation?.createdAt) return false;
    const createdTime = new Date(reservation.createdAt).getTime() || Date.now();
    const expiryTime = createdTime + (3 * 60 * 60 * 1000); // 3 hours
    return Date.now() > expiryTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (notFound || !reservation) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Reservation Not Found</h2>
          <p className="text-gray-400">لم يتم العثور على الحجز</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f2e] rounded-3xl p-8 border border-[#d4af37]/20 print:bg-white print:border-2 print:border-gray-300"
        >
          {/* Header */}
          <div className="text-center mb-8 border-b border-[#d4af37]/20 pb-6">
            <h1 className="text-3xl font-bold text-[#d4af37] mb-2 print:text-black">Castana Lounge</h1>
            <p className="text-gray-400 print:text-gray-600">Reservation Details / تفاصيل الحجز</p>
            <p className="text-sm font-mono text-[#00d4ff] mt-2">{reservation.id}</p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-6 gap-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                reservation.scanned
                  ? 'bg-green-500/20 text-green-500'
                  : isExpired()
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-yellow-500/20 text-yellow-500'
              }`}
            >
              {reservation.scanned
                ? 'Checked In / تم الدخول'
                : isExpired()
                ? 'Expired / منتهي'
                : 'Pending / قيد الانتظار'}
            </span>
            {reservation.isVip && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-[#d4af37]/20 text-[#d4af37]">
                VIP
              </span>
            )}
          </div>

          {isExpired() && !reservation.scanned && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center">
              <p className="text-red-400 font-bold">⚠️ QR Code Expired</p>
              <p className="text-red-400/80 text-sm">This reservation has expired (3 hours limit)</p>
            </div>
          )}

          {reservation.scanned && (
            <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl text-center">
              <p className="text-amber-400 font-bold">⚠️ Already Checked In</p>
              <p className="text-amber-400/80 text-sm">
                This QR code was already scanned on {new Date(reservation.scannedAt || Date.now()).toLocaleString()}
              </p>
              <p className="text-amber-300/60 text-xs mt-2">
                Each QR code can only be used once
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <MapPin className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 print:text-gray-600">Table Number / رقم الطاولة</p>
                <p className="text-xl font-bold text-white print:text-black">{reservation.tableNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <Crown className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 print:text-gray-600">VIP Table / طاولة VIP</p>
                <p className="text-xl font-bold text-white print:text-black">
                  {reservation.isVip ? 'Yes / نعم' : 'No / لا'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <Users className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 print:text-gray-600">Number of Persons / عدد الأشخاص</p>
                <p className="text-xl font-bold text-white print:text-black">{reservation.numberOfPersons}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 print:text-gray-600">Date / التاريخ</p>
                <p className="text-xl font-bold text-white print:text-black">{reservation.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                <Clock className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 print:text-gray-600">Time / الوقت</p>
                <p className="text-xl font-bold text-white print:text-black">{reservation.time}</p>
              </div>
            </div>

            {reservation.name && (
              <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
                <div className="p-2 bg-[#00d4ff]/20 rounded-lg">
                  <User className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 print:text-gray-600">Name / الاسم</p>
                  <p className="text-xl font-bold text-white print:text-black">{reservation.name}</p>
                </div>
              </div>
            )}

            {reservation.phone && reservation.phone !== 'N/A' && (
              <div className="flex items-center gap-4 p-4 bg-[#0a0f1a] rounded-xl print:bg-gray-100">
                <div className="p-2 bg-[#00d4ff]/20 rounded-lg">
                  <Phone className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 print:text-gray-600">Phone / الهاتف</p>
                  <p className="text-xl font-bold text-white print:text-black">{reservation.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[#d4af37]/20 print:hidden">
            <div className="flex gap-4 flex-wrap">
              {!reservation.scanned && !isExpired() && (
                <button
                  onClick={markAsScanned}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Check In
                </button>
              )}
              <button
                onClick={() => updateStatus('confirmed')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-[#00d4ff] text-[#0a0f1a] font-bold rounded-xl hover:bg-[#00d4ff]/80 transition-colors"
              >
                <Check className="w-5 h-5" />
                Confirm
              </button>
              <button
                onClick={() => updateStatus('cancelled')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 min-w-[140px] py-3 bg-[#d4af37] text-[#0a0f1a] font-bold rounded-xl hover:bg-[#f4cf67] transition-colors"
              >
                Print / PDF
              </button>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-500">
            <p>Castana Lounge - Al Khalidiyah, Jeddah</p>
            <p>Tel: 0533151012</p>
            <p>Generated: {new Date().toLocaleString()}</p>
          </div>

          {/* Social Links & Footer */}
          <div className="mt-8 pt-6 border-t border-[#d4af37]/20 print:hidden">
            {/* Social Icons - Centered close together */}
            <div className="flex justify-center items-center gap-4 mb-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/castanalounge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/CastanaLoungeKSA/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Facebook</span>
              </a>
            </div>

            {/* Footer Credits - Below social icons */}
            <div className="flex justify-center items-center gap-6 text-xs">
              <p className="text-gray-500">
                made by <span className="text-[#d4af37]">simplyyousef</span>
              </p>
              <p className="text-gray-500">
                2026 <span className="text-[#00d4ff]">CASTANA</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
