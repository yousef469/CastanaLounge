'use client';

import { useEffect } from 'react';

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: string[];
  dailyVisits: { date: string; count: number }[];
  pageViews: number;
  lastUpdated: number;
}

const ANALYTICS_KEY = 'castana_analytics';
const VISITOR_ID_KEY = 'castana_visitor_id';

function generateVisitorId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function trackVisit() {
  if (typeof window === 'undefined') return;

  const visitorId = getVisitorId();
  const today = getToday();
  
  const stored = localStorage.getItem(ANALYTICS_KEY);
  let analytics: AnalyticsData = stored 
    ? JSON.parse(stored) 
    : {
        totalVisitors: 0,
        uniqueVisitors: [],
        dailyVisits: [],
        pageViews: 0,
        lastUpdated: Date.now()
      };

  // Track page view
  analytics.pageViews += 1;
  analytics.lastUpdated = Date.now();

  // Track unique visitor
  if (!analytics.uniqueVisitors.includes(visitorId)) {
    analytics.uniqueVisitors.push(visitorId);
    analytics.totalVisitors = analytics.uniqueVisitors.length;
  }

  // Track daily visit
  const todayEntry = analytics.dailyVisits.find(d => d.date === today);
  if (todayEntry) {
    todayEntry.count += 1;
  } else {
    analytics.dailyVisits.push({ date: today, count: 1 });
  }

  // Keep only last 60 days
  analytics.dailyVisits = analytics.dailyVisits.slice(-60);

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export function useAnalytics() {
  useEffect(() => {
    trackVisit();
  }, []);
}
