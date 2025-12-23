"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  active?: boolean;
};

export default function AnimatedTabIcon({ Icon, active }: Props) {
  return (
    <motion.span
      initial={false}
      animate={{
        scale: active ? 1.25 : 1,
        rotate: active ? 5 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="inline-flex items-center justify-center"
    >
      <motion.span
        initial={false}
        animate={{
          opacity: active ? 1 : 0.7,
          filter: active
            ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
            : "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <Icon className="h-5 w-5" />
      </motion.span>
    </motion.span>
  );
}
