// Shopping tab component - shopping guide and recommendations
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { ShoppingOption, fetchShoppingDestinations } from "@/app/services/data.service";
import { ShoppingBag, Sparkles, Tag, MapPin, Loader } from "lucide-react";

type ShoppingViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export function ShoppingView({ aiResult, intakeData }: ShoppingViewProps) {
  const [shopping, setShopping] = useState<ShoppingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const estimatedShoppingBudget = aiResult.budget.activities || 0;
  const shoppingBudget = Math.round(estimatedShoppingBudget * 0.4);

  useEffect(() => {
    async function loadShopping() {
      if (!intakeData?.destination || !intakeData?.preferredCities?.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchShoppingDestinations(intakeData);
        setShopping(data);
      } catch (error) {
        console.error("Error loading shopping destinations:", error);
        setShopping([]);
      } finally {
        setLoading(false);
      }
    }

    loadShopping();
  }, [intakeData]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <ShoppingBag className="h-7 w-7 text-pink-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                Shopping Guide
              </h3>
            </div>
            <p className="text-white/60 text-sm">
              Real-time shopping destinations and local markets
            </p>
          </div>
          <motion.div
            className="rounded-xl bg-pink-500/20 border border-pink-500/40 px-6 py-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-pink-300 font-semibold uppercase">Budget</p>
            <p className="text-2xl font-bold text-pink-300 mt-1">${shoppingBudget}</p>
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
          <Loader className="h-8 w-8 text-pink-400 animate-spin mr-3" />
          <p className="text-white/70">Fetching shopping destinations...</p>
        </motion.div>
      )}

      {/* Shopping Destinations */}
      {!loading && shopping.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {shopping.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="rounded-xl backdrop-blur-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">{dest.name}</h4>
                  <div className="flex items-center gap-2 text-white/70 mb-3">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{dest.location}</p>
                  </div>
                  <span className="inline-block rounded-full bg-pink-500/30 border border-pink-500/50 px-3 py-1 text-xs text-pink-300 mb-3">
                    {dest.category}
                  </span>
                  <p className="text-sm text-white/60">{dest.description}</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors whitespace-nowrap ml-4">
                  Explore
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Shopping Tips Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Smart Shopping */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatedCard delay={0.3}>
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-pink-400 flex-shrink-0" />
              </motion.div>
              <h4 className="font-semibold text-white">💡 Smart Shopping</h4>
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Avoid tourist-heavy areas for authentic items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Haggle at markets - it's expected!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Visit local artisan shops for unique pieces</span>
              </li>
            </ul>
          </AnimatedCard>
        </motion.div>

        {/* Budget Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatedCard delay={0.4}>
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Tag className="h-6 w-6 text-pink-400 flex-shrink-0" />
              </motion.div>
              <h4 className="font-semibold text-white">💰 Budget Tips</h4>
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Factory outlets give 30-50% discounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Second-hand shops for vintage treasures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">•</span>
                <span>Free samples at markets and food courts</span>
              </li>
            </ul>
          </AnimatedCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
