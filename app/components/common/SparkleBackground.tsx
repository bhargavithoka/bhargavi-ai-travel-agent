// Cosmic starfield background with twinkling stars and travel animations
"use client";

import { useEffect, useState } from "react";
import { TravelAnimations } from "./TravelAnimations";
import { useSettings } from "../../contexts/SettingsContext";
import "./stars.css";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

export function SparkleBackground() {
  const { shouldShowBackgroundEffects, shouldReduceMotion } = useSettings();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Create stars with optimized variation and better distribution
    const newStars: Star[] = [];
    
    // Generate 200 stars with better distribution
    for (let i = 0; i < 200; i++) {
      // Bias toward right side for better balance
      const xBias = Math.random() < 0.6 ? Math.random() * 0.7 : 0.3 + Math.random() * 0.7;
      const x = xBias * w;
      const y = Math.random() * h;
      
      // Vary sizes more dramatically
      const size = Math.random() < 0.1 ? Math.random() * 4 + 2 : Math.random() * 2 + 0.5;
      
      // Vary opacity with more range
      const baseOpacity = Math.random() * 0.8 + 0.1;
      
      // Vary twinkle timing more
      const duration = Math.random() * 4 + 1.5;
      const delay = Math.random() * 3;
      
      newStars.push({
        id: i,
        x,
        y,
        size,
        opacity: baseOpacity,
        duration,
        delay,
      });
    }
    
    setStars(newStars);
  }, []);

  return (
    <>
      {/* Dark mode: Night sky gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Moon */}
      <div className="pointer-events-none absolute top-20 right-20">
        <div className="relative w-20 h-20 bg-gradient-radial from-gray-200 to-gray-400 rounded-full shadow-2xl">
          <div className="absolute inset-1 bg-gradient-radial from-gray-100 to-gray-300 rounded-full" />
          {/* Moon craters */}
          <div className="absolute top-3 left-4 w-2 h-2 bg-gray-400 rounded-full opacity-60" />
          <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-60" />
          <div className="absolute bottom-4 left-6 w-1 h-1 bg-gray-400 rounded-full opacity-60" />
        </div>
      </div>
      
      {/* Subtle radial gradients for depth */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient opacity-30" 
        style={{
          background: `radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Stars */}
      {shouldShowBackgroundEffects && (
        <div className="pointer-events-none absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white star-twinkle"
              style={{
                left: `${(star.x / window.innerWidth) * 100}%`,
                top: `${(star.y / window.innerHeight) * 100}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,${star.opacity}), 0 0 ${star.size * 6}px rgba(147,197,253,${star.opacity * 0.5})`,
                animation: shouldReduceMotion ? 'none' : `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`,
                opacity: shouldReduceMotion ? star.opacity : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Travel animations */}
      {shouldShowBackgroundEffects && <TravelAnimations />}

      {/* Soft glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
    </>
  );
}
