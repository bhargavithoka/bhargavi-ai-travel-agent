import { motion } from "framer-motion";

export function SkeletonLoader() {
  return (
    <motion.div
      className="w-full max-w-4xl space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header skeleton */}
      <div className="rounded-2xl bg-gradient-to-r from-white/5 to-white/10 p-8 border border-white/10">
        <div className="space-y-3">
          <motion.div
            className="h-8 bg-white/10 rounded-lg w-3/4"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-4 bg-white/5 rounded-lg w-1/2"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          />
        </div>
      </div>

      {/* Content skeletons */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-2xl bg-gradient-to-r from-white/5 to-white/10 p-6 border border-white/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        >
          <div className="space-y-2">
            <div className="h-5 bg-white/10 rounded-lg w-2/3" />
            <div className="h-3 bg-white/5 rounded-lg w-full" />
            <div className="h-3 bg-white/5 rounded-lg w-4/5" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
