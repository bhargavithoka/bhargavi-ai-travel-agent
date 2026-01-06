// Food tab component - culinary recommendations and dining guides
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { FoodOption, fetchRestaurants } from "@/app/services/data.service";
import { UtensilsCrossed, TrendingUp, AlertCircle, Loader, Star, Flame, Award, Utensils, Zap } from "lucide-react";

type FoodViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export const FoodView = React.memo(function FoodView({ aiResult, intakeData }: FoodViewProps) {
  const [restaurants, setRestaurants] = useState<FoodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const estimatedFoodCost = aiResult.budget.food || 0;
  const avgPerDay = aiResult.days > 0 ? Math.round(estimatedFoodCost / aiResult.days) : 0;

  useEffect(() => {
    async function loadRestaurants() {
      if (!intakeData?.destination) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchRestaurants(intakeData);
        setRestaurants(data);
      } catch (error) {
        console.error("Error loading restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, [intakeData]);

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/40 via-red-900/30 to-transparent border border-orange-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(234,88,12,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(220,38,38,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.div
                className="flex items-center gap-4 mb-4"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-4xl">🍽️</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  Culinary Guide
                </h1>
              </motion.div>
              <p className="text-white/70">
                Authentic dining experiences and street food adventures
              </p>
            </div>
            <motion.div
              className="rounded-2xl border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-xl px-6 py-4 text-center shrink-0"
              whileHover={{ scale: 1.08 }}
            >
              <p className="text-xs text-orange-300 font-bold uppercase tracking-widest mb-2">Daily Budget</p>
              <p className="text-3xl font-bold text-orange-200">${avgPerDay}</p>
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Dining Categories */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { emoji: "🍜", label: "Street Food", desc: "Best Value", color: "from-orange-500 to-yellow-500" },
          { emoji: "🥘", label: "Traditional", desc: "Authentic", color: "from-red-500 to-orange-500", highlight: true },
          { emoji: "✨", label: "Fine Dining", desc: "Special", color: "from-pink-500 to-red-500" },
        ].map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative rounded-xl p-5 border transition-all ${
              cat.highlight
                ? "border-orange-400/60 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-lg shadow-orange-500/20"
                : "border-white/20 bg-white/5 hover:border-orange-400/40 hover:bg-orange-400/10"
            }`}
          >
            <div className="text-3xl mb-3">{cat.emoji}</div>
            <h4 className="text-lg font-bold text-white mb-1">{cat.label}</h4>
            <p className="text-sm text-orange-300">{cat.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <UtensilsCrossed className="h-12 w-12 text-orange-400" />
          </motion.div>
          <p className="text-white/70 mt-4 text-lg">Discovering amazing food...</p>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-orange-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ delay: i * 0.2, duration: 1.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Restaurants List */}
      {!loading && restaurants.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Top Restaurants
          </h3>
          {restaurants.map((restaurant, idx) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ scale: 1.03, x: 5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 backdrop-blur-xl p-6 transition-all hover:border-orange-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/10 transition-all duration-500 -z-10" />

              <div className="relative">
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <motion.h4
                      className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {restaurant.name}
                    </motion.h4>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block rounded-full bg-orange-500/30 border border-orange-500/50 px-3 py-1 text-sm font-semibold text-orange-200">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-orange-400 font-bold text-lg">{restaurant.price}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{restaurant.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            animate={{ scale: i < Math.floor(restaurant.rating) ? [1, 1.1, 1] : 1 }}
                            transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                i < Math.floor(restaurant.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/30"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white">{restaurant.rating.toFixed(1)}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all"
                    >
                      Save
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dining Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/30 via-orange-900/20 to-transparent border border-orange-500/30 backdrop-blur-xl p-8"
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
            <h3 className="text-2xl font-bold text-white">Smart Dining Guide</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: "🍜",
                title: "Street Food Magic",
                description: "1/3 the price, 10x the flavor - eat where locals eat",
              },
              {
                emoji: "🌍",
                title: "Local Hotspots",
                description: "Busy stalls and family-run places are always best",
              },
              {
                emoji: "🕐",
                title: "Lunch Advantage",
                description: "Eat lunch at fancy restaurants for dinner prices",
              },
              {
                emoji: "🛒",
                title: "Market Tours",
                description: "Ask locals about food markets with daily specials",
              },
              {
                emoji: "👥",
                title: "Social Eating",
                description: "Group meals at local restaurants offer great value",
              },
              {
                emoji: "🗺️",
                title: "Neighborhood Gems",
                description: "Venture beyond tourist areas for authentic bargains",
              },
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-orange-300 transition">
                      {tip.title}
                    </h4>
                    <p className="text-sm text-white/60 group-hover:text-white/80 transition">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* No Restaurants Message */}
      {!loading && restaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 rounded-xl bg-white/5 border border-white/10"
        >
          <UtensilsCrossed className="w-12 h-12 text-orange-300/50 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No restaurants found</p>
          <p className="text-white/40 text-sm mt-2">Try exploring a different location</p>
        </motion.div>
      )}
    </div>
  );
});
