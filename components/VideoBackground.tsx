'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Track scroll progress of the entire page
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to video time
  const videoTime = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, videoDuration || 0]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setVideoDuration(video.duration);
      video.pause(); // Keep video paused, controlled by scroll
      video.currentTime = 0;
      setIsLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('loadeddata', handleLoaded);
    
    if (video.readyState >= 2) {
      handleLoaded();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('loadeddata', handleLoaded);
    };
  }, []);

  // Update video currentTime based on scroll position
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    return videoTime.on("change", (latest) => {
      if (video.duration) {
        // Smoothly update video time based on scroll
        video.currentTime = Math.min(latest, video.duration - 0.01);
      }
    });
  }, [isLoaded, videoTime]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full -z-10">
      {/* Video - Paused and controlled by scroll */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <source src="/The_Castana_pizza_202604161353.mp4" type="video/mp4" />
      </video>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#0a1628] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-[#0a1628]/70" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-transparent to-[#0a1628]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-[#d4af37]/5" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,22,40,0.5)_100%)]" />

      {/* Scroll Progress Indicator (optional - at top) */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4ff] to-[#d4af37] z-50"
        style={{ 
          scaleX: scrollYProgress, 
          transformOrigin: "0%",
          opacity: isLoaded ? 1 : 0
        }}
      />
    </div>
  );
}
