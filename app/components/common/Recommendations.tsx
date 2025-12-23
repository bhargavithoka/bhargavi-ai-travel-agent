import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2 } from "lucide-react";
import { AIResult } from "@/app/types/travel.types";

export function Recommendations({ recommendations }: { recommendations: AIResult["recommendations"] }) {
  return (
    <motion.div
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Lightbulb className="h-7 w-7 text-amber-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">Smart Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            className="flex items-start gap-4 rounded-xl backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 hover:border-green-500/40 transition-colors duration-300"
          >
            <CheckCircle2 className="h-5 w-5 mt-1 flex-shrink-0 text-green-400" />
            <p className="text-white/90 leading-relaxed">{rec}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
