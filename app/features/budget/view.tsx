// Extracted from page.tsx - Budget tab component
import React from "react";
import { motion } from "framer-motion";
import { AIResult } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { RadialBudgetCard } from "@/app/components/common/RadialBudgetCard";
import { AlertCircle, TrendingDown, CheckCircle, Zap, Target, DollarSign, Award } from "lucide-react";

type BudgetViewProps = {
  aiResult: AIResult;
};

const safeNum = (n: unknown) =>
  typeof n === "number" && isFinite(n) ? n : 0;

export const BudgetView = React.memo(function BudgetView({ aiResult }: BudgetViewProps) {
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
    <div className="w-full max-w-4xl space-y-8">
      {/* Animated Header with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-purple-900/30 to-transparent border border-white/20 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(168,85,247,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(34,211,238,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <motion.h1
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💰 Budget Breakdown
            </motion.h1>
            <p className="text-white/70 text-base">
              Visualize your spending across all travel categories
            </p>
          </div>

          {/* Premium Health Indicator */}
          <motion.div
            className={`rounded-2xl border-2 backdrop-blur-xl p-6 text-center relative overflow-hidden shrink-0 ${healthBgColor}`}
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 opacity-40"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
                  "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <motion.p
                className="text-xs text-white/70 font-bold uppercase tracking-widest"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Travel Style
              </motion.p>
              <p className={`text-2xl font-bold mt-3 bg-gradient-to-r ${healthColor} bg-clip-text text-transparent`}>
                {budgetHealthLabel}
              </p>
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Total Cost Display */}
        <motion.div
          className="mt-6 flex items-baseline gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <DollarSign className="w-5 h-5 text-cyan-300" />
          <span className="text-5xl font-bold text-white">${totalBudget.toLocaleString()}</span>
          <span className="text-white/60 text-lg">Total Budget</span>
        </motion.div>
      </motion.div>

      {/* Radial Budget Cards Grid with Enhanced Visuals */}
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

      {/* Daily Spending Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target className="w-6 h-6 text-emerald-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">Daily Average</h3>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group rounded-xl bg-emerald-500/20 border border-emerald-400/40 p-5 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <p className="text-sm text-emerald-300/80 font-semibold mb-2">DAILY SPENDING</p>
              <p className="text-3xl font-bold text-emerald-200">${(totalBudget / Math.max(aiResult.days, 1)).toFixed(0)}</p>
              <p className="text-xs text-emerald-300/60 mt-2">÷ {aiResult.days} days</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group rounded-xl bg-cyan-500/20 border border-cyan-400/40 p-5 hover:bg-cyan-500/30 transition-all cursor-pointer"
            >
              <p className="text-sm text-cyan-300/80 font-semibold mb-2">HIGHEST CATEGORY</p>
              <p className="text-3xl font-bold text-cyan-200">${Math.max(...budgetItems.map(([_, v]) => safeNum(v))).toLocaleString()}</p>
              <p className="text-xs text-cyan-300/60 mt-2">Peak Spending</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group rounded-xl bg-purple-500/20 border border-purple-400/40 p-5 hover:bg-purple-500/30 transition-all cursor-pointer"
            >
              <p className="text-sm text-purple-300/80 font-semibold mb-2">CATEGORIES</p>
              <p className="text-3xl font-bold text-purple-200">{budgetItems.length}</p>
              <p className="text-xs text-purple-300/60 mt-2">Budget Areas</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Budget Tips Card with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/30 via-red-900/20 to-pink-900/20 border border-orange-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-orange-400" />
            </motion.div>
            <h4 className="font-bold text-white text-xl">Budget Optimization Tips</h4>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: "✈️",
                title: "Flight Booking",
                tip: "Book flights 2-3 months in advance for best rates",
              },
              {
                icon: "🏨",
                title: "Hotel Strategy",
                tip: "Stay in mid-range hotels for comfort without premium prices",
              },
              {
                icon: "🍜",
                title: "Dining Balance",
                tip: "Mix restaurant dining with local street food for authentic savings",
              },
              {
                icon: "🎟️",
                title: "Activity Deals",
                tip: "Book combo tickets and look for weekday discounts",
              },
            ].map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <motion.span
                  className="text-2xl flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: idx * 0.2, duration: 2, repeat: Infinity }}
                >
                  {item.icon}
                </motion.span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-300 group-hover:text-orange-200 transition">
                    {item.title}
                  </p>
                  <p className="text-sm text-white/70 group-hover:text-white/90 transition">
                    {item.tip}
                  </p>
                </div>
                <motion.div
                  className="w-1 h-full bg-gradient-to-b from-orange-400 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Budget Summary with Animated Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Budget Distribution
        </h3>
        {budgetItems.map(([category, amount], idx) => {
          const percentage = totalBudget > 0 ? (safeNum(amount) / totalBudget) * 100 : 0;
          const colorGradients = {
            flights: "from-blue-500 to-cyan-400",
            hotels: "from-emerald-500 to-teal-400",
            food: "from-orange-500 to-red-400",
            activities: "from-purple-500 to-pink-400",
          };
          const gradientClass = colorGradients[category.toLowerCase() as keyof typeof colorGradients] || "from-blue-500 to-cyan-400";

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white capitalize">{category}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">${safeNum(amount).toLocaleString()}</span>
                  <span className="text-xs text-white/60 ml-2">{percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="relative h-3 rounded-full bg-white/10 overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradientClass} shadow-lg`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.7 + idx * 0.1, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 opacity-0 animate-pulse bg-white/20"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});
