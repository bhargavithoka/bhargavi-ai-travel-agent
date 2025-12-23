"use client";

import { motion } from "framer-motion";

interface RadialBudgetCardProps {
  title: string;
  amount: number;
  percentage: number;
  color: "blue" | "emerald" | "orange" | "purple";
  delay?: number;
}

export function RadialBudgetCard({
  title,
  amount,
  percentage,
  color,
  delay = 0,
}: RadialBudgetCardProps) {
  // SVG donut chart parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color mappings
  const colorMap = {
    blue: {
      gradient: "from-blue-500 to-blue-400",
      stop1: "#3b82f6",
      stop2: "#60a5fa",
      text: "text-blue-300",
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
    },
    emerald: {
      gradient: "from-emerald-500 to-emerald-400",
      stop1: "#10b981",
      stop2: "#34d399",
      text: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
    },
    orange: {
      gradient: "from-orange-500 to-orange-400",
      stop1: "#f97316",
      stop2: "#fb923c",
      text: "text-orange-300",
      bg: "bg-orange-500/10",
      border: "border-orange-500/40",
    },
    purple: {
      gradient: "from-purple-500 to-purple-400",
      stop1: "#a855f7",
      stop2: "#c084fc",
      text: "text-purple-300",
      bg: "bg-purple-500/10",
      border: "border-purple-500/40",
    },
  };

  const colorScheme = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      className={`rounded-2xl backdrop-blur-xl border-2 p-8 ${colorScheme.bg} ${colorScheme.border} transition-all duration-300 hover:shadow-xl`}
    >
      {/* SVG Donut Chart */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />

            {/* Progress circle with gradient */}
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorScheme.stop1} />
                <stop offset="100%" stopColor={colorScheme.stop2} />
              </linearGradient>
            </defs>

            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={`url(#gradient-${color})`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>

          {/* Center text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className={`text-2xl font-bold ${colorScheme.text}`}>
              {percentage.toFixed(0)}%
            </span>
            <span className="text-xs text-white/50 mt-1">of total</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3 }}
        className="text-center"
      >
        <h3 className={`text-sm font-semibold uppercase tracking-wider text-white/70 mb-2`}>
          {title}
        </h3>

        <motion.p
          className={`text-3xl font-bold ${colorScheme.text}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ${amount.toLocaleString()}
        </motion.p>

        {/* Subtle indicator line */}
        <motion.div
          className={`h-0.5 bg-gradient-to-r ${colorScheme.gradient} rounded-full mx-auto mt-4 w-12`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}
