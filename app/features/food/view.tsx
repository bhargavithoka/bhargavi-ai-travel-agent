// Food tab component - culinary recommendations and dining guides
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { FoodOption, fetchRestaurants } from "@/app/services/data.service";
import { UtensilsCrossed, TrendingUp, AlertCircle, Loader, Star } from "lucide-react";

type FoodViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export function FoodView({ aiResult, intakeData }: FoodViewProps) {
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
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <UtensilsCrossed className="h-7 w-7 text-orange-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                Culinary Recommendations
              </h3>
            </div>
            <p className="text-white/60 text-sm">
              Real-time restaurants and dining experiences
            </p>
          </div>
          <motion.div
            className="rounded-xl bg-orange-500/20 border border-orange-500/40 px-6 py-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-orange-300 font-semibold uppercase">Avg/Day</p>
            <p className="text-2xl font-bold text-orange-300 mt-1">${avgPerDay}</p>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="flex items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="h-8 w-8 text-orange-400 animate-spin mr-3" />
          <p className="text-white/70">Fetching restaurants...</p>
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
          {restaurants.map((restaurant, idx) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="rounded-xl backdrop-blur-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-white/70">{restaurant.cuisine}</span>
                    <span className="text-white/50">•</span>
                    <span className="text-sm text-orange-300">{restaurant.price}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">{restaurant.description}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(restaurant.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-white/60 ml-2">{restaurant.rating.toFixed(1)}</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors whitespace-nowrap ml-4">
                  Save
                </button>
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
      >
        <AnimatedCard delay={0.4}>
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-3">🍽️ Dining Guide Tips</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">1.</span>
                  <span>Street food offers authentic flavors at 1/3 the restaurant price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">2.</span>
                  <span>Eat where locals eat - look for busy food stalls and family-run places</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">3.</span>
                  <span>Lunch menus often cheaper than dinner at the same restaurants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">4.</span>
                  <span>Ask locals about food markets with daily specials and fresh deals</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
