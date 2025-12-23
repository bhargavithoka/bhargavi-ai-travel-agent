"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plane, Train, Ship, Bike } from "lucide-react";
import { useWindowDimensions } from "@/app/hooks/useWindowDimensions";
import "./travel.css";

const TravelAnimations = memo(function TravelAnimations() {
  const dimensions = useWindowDimensions();

  if (dimensions.width === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Flying Plane - Diagonal across screen */}
      <motion.div
        className="absolute top-1/4 -left-16 text-blue-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
        }}
        animate={{
          x: [0, dimensions.width + 100],
          y: [0, 100],
        }}
        transition={{
          x: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="plane-icon"
          animate={{ opacity: [0.25, 0.35], rotate: [0, 5, -5] }}
          transition={{
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Plane size={42} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Train - Moving horizontally near bottom */}
      <motion.div
        className="absolute bottom-1/4 -left-12 text-orange-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))",
        }}
        animate={{
          x: [0, dimensions.width + 100],
        }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear", delay: 3 },
        }}
      >
        <motion.div
          className="train-icon"
          animate={{ opacity: [0.2, 0.3], rotate: [-1, 1], scale: [0.98, 1.02] }}
          transition={{
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Train size={38} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Boat - Gently floating */}
      <motion.div
        className="absolute bottom-1/3 -left-12 text-cyan-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 14px rgba(34, 211, 238, 0.5))",
        }}
        animate={{
          x: [0, dimensions.width + 100],
          y: [0, 20, 5, 15, 0],
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, ease: "linear", delay: 6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="boat-icon"
          animate={{ opacity: [0.2, 0.32], rotate: [-2, 2], scale: [0.95, 1.05] }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Ship size={40} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Bike - Moving slowly */}
      <motion.div
        className="absolute top-1/3 -left-10 text-green-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))",
        }}
        animate={{
          x: [0, dimensions.width + 100],
        }}
        transition={{
          x: { duration: 22, repeat: Infinity, ease: "linear", delay: 9 },
        }}
      >
        <motion.div
          className="bike-icon"
          animate={{ opacity: [0.22, 0.32], rotate: [0, -3, 3], scale: [0.97, 1.03] }}
          transition={{
            opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Bike size={37} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Bus - Bottom area moving slow */}
      <motion.div
        className="absolute bottom-1/5 -left-14 text-yellow-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 8px rgba(234, 179, 8, 0.4))",
        }}
        animate={{
          x: [0, dimensions.width + 100],
          y: [0, 8],
        }}
        transition={{
          x: { duration: 18, repeat: Infinity, ease: "linear", delay: 12 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="bus-icon"
          animate={{ opacity: [0.18, 0.28], scale: [0.96, 1.04] }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <rect x="2" y="6" width="16" height="12" rx="2" />
            <circle cx="6" cy="19" r="1.5" />
            <circle cx="14" cy="19" r="1.5" />
            <path d="M2 10h6M12 6v8" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
});

TravelAnimations.displayName = "TravelAnimations";

export { TravelAnimations };
