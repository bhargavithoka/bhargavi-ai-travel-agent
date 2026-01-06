"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import AnimatedTabIcon from "./AnimatedTabIcon";
import type { TabItem } from "@/app/types/travel.types";
import type { Tab } from "@/app/types/travel.types";

type Props = {
  tabs: readonly TabItem[];
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
};

const TabGrid = memo(function TabGrid({ tabs, activeTab, onTabChange }: Props) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        delay: idx * 0.06,
      },
    }),
  };

  return (
    <motion.div
      className="w-full flex justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="tablist"
      aria-label="Travel planning tabs"
    >
      <div className="grid grid-cols-3 gap-2 w-full max-w-lg">
        {tabs.map((t, idx) => {
          const isActive = t.name === activeTab;

          return (
            <motion.button
              key={t.name}
              onClick={() => onTabChange(t.name)}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onHoverStart={() => setHoveredTab(t.name)}
              onHoverEnd={() => setHoveredTab(null)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              role="tab"
              aria-selected={isActive}
              aria-label={`${t.name} tab`}
              className="relative group h-20 rounded-lg overflow-hidden cursor-pointer will-change-transform"
            >
              {/* Background gradient base */}
              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/10"
                    : "bg-gradient-to-br from-white/10 via-white/5 to-white/0"
                } ${hoveredTab === t.name ? "opacity-110" : ""} transition-opacity duration-200`}
              />

              {/* Backdrop blur */}
              <div className="absolute inset-0 backdrop-blur-xl" />

              {/* Border with glow - CSS transition instead of motion */}
              <div
                className={`absolute inset-0 rounded-2xl border-2 ${
                  isActive
                    ? "border-white/40 shadow-2xl shadow-blue-500/30"
                    : hoveredTab === t.name
                    ? "border-white/25 shadow-lg shadow-white/5"
                    : "border-white/15 shadow-sm"
                } transition-all duration-200 will-change-shadow`}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
                {/* Icon - only animate on active, not on hover */}
                <motion.div
                  animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <AnimatedTabIcon Icon={t.icon} active={isActive} />
                </motion.div>

                {/* Label */}
                <span
                  className={`text-center font-bold text-xs transition-colors duration-200 ${
                    isActive ? "text-white" : hoveredTab === t.name ? "text-white/90" : "text-white/70"
                  }`}
                >
                  {t.name}
                </span>

                {/* Animated underline for active - opacity instead of width + layout */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-3 h-1 w-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>

              {/* Subtle shimmer effect for active - use opacity only */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});

TabGrid.displayName = "TabGrid";

export default TabGrid;
