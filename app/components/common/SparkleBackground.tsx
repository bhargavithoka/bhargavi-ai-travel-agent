// Cosmic starfield background with twinkling stars and travel animations
"use client";

import { useEffect, useState } from "react";
import { TravelAnimations } from "./TravelAnimations";
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
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Create stars with optimized variation
    const newStars: Star[] = Array.from({ length: 150 }, (_, i) => {
      const baseOpacity = Math.random() * 0.6 + 0.2;
      return {
        id: i,
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 0.5,
        opacity: baseOpacity,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      };
    });
    
    setStars(newStars);
  }, []);

  return (
    <>
      {/* Main dark gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900" />
      
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

      {/* Travel animations (planes, trains, boats, etc.) */}
      <TravelAnimations />

      {/* CSS-based animated starfield */}
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
              animation: `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Soft glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
    </>
  );
}
