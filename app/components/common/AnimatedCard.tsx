import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedCard = memo(function AnimatedCard({
  children,
  delay = 0,
  className = "",
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      className={`relative rounded-2xl backdrop-blur-xl p-6 will-change-transform bg-white/10 border border-white/20 ${className}`}
      style={{
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
    >
      <div className={`absolute inset-0 rounded-2xl transition-all duration-200 pointer-events-none bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 hover:from-blue-500/5 hover:via-purple-500/2 hover:to-blue-500/5`} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

AnimatedCard.displayName = "AnimatedCard";
