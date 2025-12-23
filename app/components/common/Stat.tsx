import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string;
  delay?: number;
}

export function Stat({ label, value, delay = 0 }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 hover:bg-white/15 transition-colors duration-300"
    >
      <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
        {value}
      </p>
    </motion.div>
  );
}
