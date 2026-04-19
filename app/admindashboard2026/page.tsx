'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Users, Clock, Calendar, User, Users2, QrCode, AlertTriangle, CheckCircle, XCircle, Trash2, RefreshCw, BarChart3, TrendingUp, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = 'iam the admin of CastanaLounge1354213542';
const RATE_LIMIT_KEY = 'admin_rate_limit';
const LOGIN_ATTEMPTS_KEY = 'admin_login_attempts';

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  createdAt: number;
  qrCode: string;
  scanned: boolean;
  scannedAt?: number;
  vip: boolean;
}

interface RateLimit {
  attempts: number;
  lastAttempt: number;
  lockoutEnd?: number;
}

interface HackAttempt {
  timestamp: number;
  passwordAttempt: string;
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
}

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: string[];
  dailyVisits: { date: string; count: number }[];
  pageViews: number;
  lastUpdated: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTime, setLockoutTime] = useState(0);
  const [hackAttempts, setHackAttempts] = useState<HackAttempt[]>([]);
  const [showHackingAlert, setShowHackingAlert] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Check authentication status and rate limit on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    loadReservations();
    loadHackAttempts();
    checkRateLimit();
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const stored = localStorage.getItem('castana_analytics');
    if (stored) {
      setAnalytics(JSON.parse(stored));
    } else {
      setAnalytics({
        totalVisitors: 0,
        uniqueVisitors: [],
        dailyVisits: [],
        pageViews: 0,
        lastUpdated: Date.now()
      });
    }
  };

  // Timer for lockout countdown
  useEffect(() => {
    if (lockoutTime > 0) {
      const interval = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const loadReservations = async () => {
    const { data, error } = await supabase.from('reservations').select('*');
    if (data) {
      // Filter out expired reservations (3 hours past reservation time)
      const now = Date.now();
      const valid = data.filter((r: Reservation) => {
        const reservationTime = new Date(`${r.date}T${r.time}`).getTime();
        const expiryTime = reservationTime + (3 * 60 * 60 * 1000); // 3 hours
        return now < expiryTime || !r.scanned;
      });
      setReservations(valid);
    } else if (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const loadHackAttempts = () => {
    const stored = localStorage.getItem('castana_hack_attempts');
    if (stored) {
      try {
        setHackAttempts(JSON.parse(stored));
        if (JSON.parse(stored).length > 0) {
          setShowHackingAlert(true);
        }
      } catch (e) {
        console.error('Error loading hack attempts:', e);
      }
    }
  };

  const checkRateLimit = () => {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (stored) {
      try {
        const rateLimit: RateLimit = JSON.parse(stored);
        if (rateLimit.lockoutEnd && Date.now() < rateLimit.lockoutEnd) {
          setLockoutTime(Math.ceil((rateLimit.lockoutEnd - Date.now()) / 1000));
        }
      } catch (e) {
        console.error('Error checking rate limit:', e);
      }
    }
  };

  const getLockoutDuration = (attempts: number): number => {
    if (attempts <= 3) return 60; // 1 minute
    if (attempts <= 6) return 300; // 5 minutes
    if (attempts <= 9) return 600; // 10 minutes
    return -1; // Permanent (4th round)
  };

  const logHackAttempt = (passwordAttempt: string) => {
    const attempt: HackAttempt = {
      timestamp: Date.now(),
      passwordAttempt,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    
    const stored = localStorage.getItem('castana_hack_attempts');
    const attempts: HackAttempt[] = stored ? JSON.parse(stored) : [];
    attempts.push(attempt);
    localStorage.setItem('castana_hack_attempts', JSON.stringify(attempts));
    setHackAttempts(attempts);
    setShowHackingAlert(true);
  };

  const handleLogin = () => {
    if (lockoutTime > 0) {
      setError(`Too many failed attempts. Please wait ${lockoutTime} seconds.`);
      return;
    }

    // Get current rate limit
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    let rateLimit: RateLimit = stored ? JSON.parse(stored) : { attempts: 0, lastAttempt: 0 };

    if (password === ADMIN_PASSWORD) {
      // Success
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('admin_authenticated', 'true');
      // Reset rate limit on success
      localStorage.removeItem(RATE_LIMIT_KEY);
    } else {
      // Failed attempt
      rateLimit.attempts++;
      rateLimit.lastAttempt = Date.now();

      const lockoutDuration = getLockoutDuration(rateLimit.attempts);
      
      if (lockoutDuration === -1) {
        // 4th round - log hacking attempt
        logHackAttempt(password);
        setError('🚨 SECURITY ALERT: Unauthorized access attempt detected. Device information has been logged.');
        rateLimit.lockoutEnd = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      } else {
        rateLimit.lockoutEnd = Date.now() + (lockoutDuration * 1000);
        setLockoutTime(lockoutDuration);
        setError(`Incorrect password. Locked out for ${lockoutDuration} seconds.`);
      }

      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimit));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_authenticated');
  };

  const getTimeUntilReservation = (date: string, time: string): string => {
    const reservationTime = new Date(`${date}T${time}`).getTime();
    const now = Date.now();
    const diff = reservationTime - now;
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getTimeUntilExpiry = (createdAt: number): string => {
    const expiryTime = createdAt + (3 * 60 * 60 * 1000);
    const now = Date.now();
    const diff = expiryTime - now;
    
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const scanQRCode = async (reservationId: string) => {
    // Update in Supabase
    await supabase
      .from('reservations')
      .update({ scanned: true, scannedAt: Date.now() })
      .eq('id', reservationId);
    
    // Update local state
    const updated = reservations.map(r => {
      if (r.id === reservationId) {
        return { ...r, scanned: true, scannedAt: Date.now() };
      }
      return r;
    });
    setReservations(updated);
  };

  const deleteReservation = async (reservationId: string) => {
    // Delete from Supabase
    await supabase.from('reservations').delete().eq('id', reservationId);
    
    // Update local state
    const updated = reservations.filter(r => r.id !== reservationId);
    setReservations(updated);
  };

  const refreshData = () => {
    loadReservations();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Hacking Alert */}
          <AnimatePresence>
            {showHackingAlert && hackAttempts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className="text-red-400 font-bold">Security Alert</h3>
                </div>
                <p className="text-red-300 text-sm mb-3">
                  Someone trying to hack into the system. Device information logged.
                </p>
                <div className="space-y-2 text-xs text-red-400/80">
                  {hackAttempts.slice(-3).map((attempt, i) => (
                    <div key={i} className="p-2 bg-red-500/10 rounded">
                      <p>Time: {new Date(attempt.timestamp).toLocaleString()}</p>
                      <p>Device: {attempt.userAgent.slice(0, 50)}...</p>
                      <p>Platform: {attempt.platform}</p>
                      <p>Screen: {attempt.screenResolution}</p>
                      <p>Timezone: {attempt.timezone}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Card */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#d4af37]/20 rounded-full">
                <Shield className="w-12 h-12 text-[#d4af37]" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Enter password to confirm you are the admin
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/50"
                  disabled={lockoutTime > 0}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg text-sm ${
                    error.includes('SECURITY') 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {error}
                </motion.div>
              )}

              {lockoutTime > 0 && (
                <div className="text-center text-[#d4af37]">
                  Locked out: {Math.floor(lockoutTime / 60)}m {lockoutTime % 60}s
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={lockoutTime > 0 || !password}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#f4cf67] text-[#0a0f1a] font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-[#d4af37]">CASTANA</span> Admin Dashboard
          </h1>
          <p className="text-gray-400">Reservation Management System</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#00d4ff]" />
            <span className="text-gray-400 text-sm">Total Reservations</span>
          </div>
          <p className="text-3xl font-bold text-white">{reservations.length}</p>
        </div>
        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Checked In</span>
          </div>
          <p className="text-3xl font-bold text-white">{reservations.filter(r => r.scanned).length}</p>
        </div>
        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-400 text-sm">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white">{reservations.filter(r => !r.scanned).length}</p>
        </div>
        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users2 className="w-5 h-5 text-[#d4af37]" />
            <span className="text-gray-400 text-sm">Total Guests</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {reservations.reduce((acc, r) => acc + r.guests, 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#00d4ff]/10 to-[#d4af37]/10 p-6 rounded-xl border border-[#00d4ff]/20">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-[#00d4ff]" />
            <span className="text-gray-400 text-sm">Website Visitors</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {analytics?.totalVisitors || 0}
          </p>
        </div>
      </motion.div>

      {/* Website Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-[#d4af37]" />
          <h2 className="text-xl font-bold text-white">Website Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-gray-400 text-sm">Total Page Views</span>
            </div>
            <p className="text-2xl font-bold text-white">{analytics?.pageViews || 0}</p>
          </div>
          <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-gray-400 text-sm">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold text-white">{analytics?.uniqueVisitors?.length || 0}</p>
          </div>
          <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-gray-400 text-sm">Active Days</span>
            </div>
            <p className="text-2xl font-bold text-white">{analytics?.dailyVisits?.length || 0}</p>
          </div>
        </div>

        {/* Daily Visits Chart */}
        {analytics?.dailyVisits && analytics.dailyVisits.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Daily Visits (Last 30 Days)</h3>
            <div className="flex items-end gap-2 h-32 overflow-x-auto">
              {analytics.dailyVisits.slice(-30).map((day, index) => {
                const maxCount = Math.max(...analytics.dailyVisits.map(d => d.count), 1);
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={index} className="flex flex-col items-center gap-1 min-w-[30px]">
                    <div 
                      className="w-6 bg-gradient-to-t from-[#00d4ff] to-[#d4af37] rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${day.date}: ${day.count} visits`}
                    />
                    <span className="text-[10px] text-gray-500 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Reservations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Active Reservations</h2>
        </div>
        
        {reservations.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No active reservations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Guest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Guests</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Table</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Countdown</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">QR Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{reservation.name}</p>
                        <p className="text-gray-500 text-sm">{reservation.phone}</p>
                        {reservation.vip && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white">{reservation.date}</div>
                      <div className="text-[#00d4ff] font-medium">{reservation.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white">{reservation.guests}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white">
                        {reservation.tableNumber || 'Not assigned'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-medium ${
                        getTimeUntilReservation(reservation.date, reservation.time).includes('Overdue')
                          ? 'text-red-500'
                          : 'text-green-400'
                      }`}>
                        {getTimeUntilReservation(reservation.date, reservation.time)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {reservation.scanned ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="w-4 h-4" />
                          Checked In
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm ${
                        getTimeUntilExpiry(reservation.createdAt) === 'Expired'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}>
                        {getTimeUntilExpiry(reservation.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {!reservation.scanned && (
                          <button
                            onClick={() => scanQRCode(reservation.id)}
                            className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="Mark as checked in (Scan QR)"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="p-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-lg hover:bg-[#00d4ff]/30 transition-colors"
                          title="View QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Delete reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReservation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#0a0f1a] mb-4 text-center">
                Reservation QR Code
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedReservation.qrCode)}`}
                  alt="QR Code"
                  className="w-[200px] h-[200px]"
                />
              </div>
              <div className="text-center space-y-1 text-sm text-gray-600">
                <p className="font-semibold">{selectedReservation.name}</p>
                <p>{selectedReservation.date} at {selectedReservation.time}</p>
                <p>{selectedReservation.guests} guests</p>
                {selectedReservation.scanned ? (
                  <p className="text-green-600 font-medium">✓ Checked In</p>
                ) : (
                  <p className="text-yellow-600">⏳ Pending Check-in</p>
                )}
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="w-full mt-6 py-3 bg-[#0a0f1a] text-white rounded-xl font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
