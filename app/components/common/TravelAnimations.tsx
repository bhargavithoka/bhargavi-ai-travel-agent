"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plane, Ship, Train, Bus, Bike } from "lucide-react";
import { useWindowDimensions } from "@/app/hooks/useWindowDimensions";
import { useSettings } from "../../contexts/SettingsContext";
import "./travel.css";

const TravelAnimations = memo(function TravelAnimations() {
  const dimensions = useWindowDimensions();
  const { shouldReduceMotion } = useSettings();

  if (dimensions.width === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Flying Plane - Diagonal across screen */}
      <motion.div
        className="absolute top-1/4 -left-16 text-blue-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
        }}
        animate={shouldReduceMotion ? {} : {
          x: [0, dimensions.width + 100],
          y: [0, 50],
        }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="plane-icon"
          animate={shouldReduceMotion ? {} : { opacity: [0.3, 0.5] }}
          transition={{
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Plane size={42} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Boat - Gently floating */}
      <motion.div
        className="absolute bottom-1/3 -left-12 text-cyan-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 14px rgba(34, 211, 238, 0.5))",
        }}
        animate={shouldReduceMotion ? {} : {
          x: [0, dimensions.width + 100],
          y: [0, 10],
        }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: "linear", delay: 5 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="boat-icon"
          animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.4] }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Ship size={40} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Train - Moving from right to left */}
      <motion.div
        className="absolute top-2/3 -right-16 text-green-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))",
        }}
        animate={shouldReduceMotion ? {} : {
          x: [0, -dimensions.width - 100],
          y: [0, -20],
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, ease: "linear", delay: 8 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="train-icon"
          animate={shouldReduceMotion ? {} : { opacity: [0.25, 0.45] }}
          transition={{
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Train size={38} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Bus - Moving from top to bottom */}
      <motion.div
        className="absolute top-0 left-1/3 text-yellow-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 11px rgba(250, 204, 21, 0.5))",
        }}
        animate={shouldReduceMotion ? {} : {
          y: [0, dimensions.height + 100],
          x: [0, 30],
        }}
        transition={{
          y: { duration: 22, repeat: Infinity, ease: "linear", delay: 12 },
          x: { duration: 11, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="bus-icon"
          animate={shouldReduceMotion ? {} : { opacity: [0.3, 0.5] }}
          transition={{
            opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Bus size={36} strokeWidth={1.3} />
        </motion.div>
      </motion.div>

      {/* Bike - Moving diagonally from top-right */}
      <motion.div
        className="absolute -top-12 right-1/4 text-orange-400 travel-item"
        style={{
          filter: "drop-shadow(0 0 9px rgba(249, 115, 22, 0.5))",
        }}
        animate={shouldReduceMotion ? {} : {
          x: [0, -dimensions.width - 100],
          y: [0, dimensions.height + 100],
        }}
        transition={{
          x: { duration: 28, repeat: Infinity, ease: "linear", delay: 15 },
          y: { duration: 28, repeat: Infinity, ease: "linear" },
        }}
      >
        <motion.div
          className="bike-icon"
          animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.4] }}
          transition={{
            opacity: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Bike size={34} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </div>
  );
});

TravelAnimations.displayName = "TravelAnimations";

export { TravelAnimations };
