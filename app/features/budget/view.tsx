// Extracted from page.tsx - Budget tab component
import { motion } from "framer-motion";
import { AIResult } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { RadialBudgetCard } from "@/app/components/common/RadialBudgetCard";
import { AlertCircle, TrendingDown, CheckCircle } from "lucide-react";

type BudgetViewProps = {
  aiResult: AIResult;
};

const safeNum = (n: unknown) =>
  typeof n === "number" && isFinite(n) ? n : 0;

export function BudgetView({ aiResult }: BudgetViewProps) {
  const budgetItems = Object.entries(aiResult.budget);
  const totalBudget = budgetItems.reduce((sum, [_, v]) => sum + safeNum(v), 0);

  // Determine budget health
  const budgetHealth = 
    totalBudget <= 1200 ? "excellent" : 
    totalBudget <= 2000 ? "good" : 
    totalBudget <= 3000 ? "warning" : 
    "high";

  const budgetHealthLabel = 
    budgetHealth === "excellent" ? "Budget-Friendly 💚" :
    budgetHealth === "good" ? "Moderate Spend 🟢" :
    budgetHealth === "warning" ? "High Spend ⚠️" :
    "Premium Budget 💎";

  const healthColor = 
    budgetHealth === "excellent" ? "from-green-500 to-emerald-500" :
    budgetHealth === "good" ? "from-blue-500 to-cyan-500" :
    budgetHealth === "warning" ? "from-orange-500 to-yellow-500" :
    "from-purple-500 to-pink-500";

  const healthBgColor =
    budgetHealth === "excellent" ? "bg-green-500/10 border-green-500/40" :
    budgetHealth === "good" ? "bg-blue-500/10 border-blue-500/40" :
    budgetHealth === "warning" ? "bg-orange-500/10 border-orange-500/40" :
    "bg-purple-500/10 border-purple-500/40";

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header Card */}
      <AnimatedCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Budget Breakdown
            </h3>
            <p className="text-white/60 text-sm mt-2">
              Total estimated cost: <span className="text-white font-semibold">${totalBudget}</span>
            </p>
          </div>
          
          {/* Health Indicator */}
          <motion.div
            className={`rounded-xl border-2 px-6 py-4 text-center backdrop-blur-xl ${healthBgColor}`}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-white/70 font-semibold uppercase">Travel Style</p>
            <p className={`text-lg font-bold mt-2 bg-gradient-to-r ${healthColor} bg-clip-text text-transparent`}>
              {budgetHealthLabel}
            </p>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Radial Budget Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {budgetItems.map(([category, amount], idx) => {
          const percentage = totalBudget > 0 ? (safeNum(amount) / totalBudget) * 100 : 0;

          // Color mapping for categories
          const colorMap: Record<string, "blue" | "emerald" | "orange" | "purple"> = {
            flights: "blue",
            hotels: "emerald",
            food: "orange",
            activities: "purple",
          };

          const cardColor = colorMap[category.toLowerCase()] || "blue";

          return (
            <RadialBudgetCard
              key={category}
              title={category}
              amount={safeNum(amount)}
              percentage={percentage}
              color={cardColor}
              delay={0.3 + idx * 0.1}
            />
          );
        })}
      </motion.div>

      {/* Budget Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <AnimatedCard delay={0.5}>
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <TrendingDown className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-3">💡 Budget Optimization</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Book flights 2-3 months in advance for best rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Stay in mid-range hotels for comfort without premium prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Mix restaurant dining with local street food for authentic savings</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {[
          { label: "Avg/Day", value: `$${(totalBudget / 7).toFixed(0)}` },
          { label: "Max Single", value: `$${Math.max(...budgetItems.map(([_, v]) => safeNum(v)))}` },
          { label: "Categories", value: `${budgetItems.length}` },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + idx * 0.05 }}
            className="rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 p-4 text-center"
          >
            <p className="text-xs text-white/60">{stat.label}</p>
            <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
