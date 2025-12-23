import { memo, ReactNode } from "react";
import { motion } from "framer-motion";

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
      className={`relative rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 will-change-transform ${className}`}
      style={{
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
    >
      {/* Subtle glow on hover - CSS-based */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 hover:from-blue-500/5 hover:via-purple-500/2 hover:to-blue-500/5 transition-all duration-200 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

AnimatedCard.displayName = "AnimatedCard";
