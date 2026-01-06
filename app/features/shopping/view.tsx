// Shopping tab component - shopping guide and recommendations
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { ShoppingOption, fetchShoppingDestinations } from "@/app/services/data.service";
import { ShoppingBag, Sparkles, Tag, MapPin, Loader, Zap, Award, Gift } from "lucide-react";

type ShoppingViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export const ShoppingView = React.memo(function ShoppingView({ aiResult, intakeData }: ShoppingViewProps) {
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
    <div className="w-full max-w-4xl space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/40 via-rose-900/30 to-transparent border border-pink-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(236,72,153,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(244,63,94,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.div
                className="flex items-center gap-4 mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-4xl">🛍️</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                  Shopping Guide
                </h1>
              </motion.div>
              <p className="text-white/70">
                Markets, boutiques, and souvenirs within budget
              </p>
            </div>
            <motion.div
              className="rounded-2xl border-2 border-pink-500/50 bg-pink-500/10 backdrop-blur-xl px-6 py-4 text-center shrink-0"
              whileHover={{ scale: 1.08 }}
            >
              <p className="text-xs text-pink-300 font-bold uppercase tracking-widest mb-2">Budget</p>
              <p className="text-3xl font-bold text-pink-200">${shoppingBudget}</p>
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Shopping Categories */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { emoji: "🏪", label: "Markets", desc: "Local treasures", color: "from-pink-500 to-rose-500" },
          { emoji: "🎁", label: "Souvenirs", desc: "Authentic finds", color: "from-rose-500 to-pink-500", highlight: true },
          { emoji: "🏬", label: "Boutiques", desc: "Unique items", color: "from-purple-500 to-pink-500" },
        ].map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative rounded-xl p-5 border transition-all ${
              cat.highlight
                ? "border-pink-400/60 bg-gradient-to-br from-pink-500/20 to-rose-500/10 shadow-lg shadow-pink-500/20"
                : "border-white/20 bg-white/5 hover:border-pink-400/40 hover:bg-pink-400/10"
            }`}
          >
            <div className="text-3xl mb-3">{cat.emoji}</div>
            <h4 className="text-lg font-bold text-white mb-1">{cat.label}</h4>
            <p className="text-sm text-pink-300">{cat.desc}</p>
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
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShoppingBag className="h-12 w-12 text-pink-400" />
          </motion.div>
          <p className="text-white/70 mt-4 text-lg">Finding shopping destinations...</p>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-pink-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ delay: i * 0.2, duration: 1.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Shopping Destinations */}
      {!loading && shopping.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-400" />
            Top Shopping Spots
          </h3>
          {shopping.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ scale: 1.03, x: 5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/30 to-rose-900/20 border border-pink-500/30 backdrop-blur-xl p-6 transition-all hover:border-pink-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/10 transition-all duration-500 -z-10" />

              <div className="relative">
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <motion.h4
                      className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {dest.name}
                    </motion.h4>
                    <div className="flex items-center gap-2 text-pink-300 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{dest.location}</span>
                    </div>
                    <div className="mb-3">
                      <span className="inline-block rounded-full bg-pink-500/30 border border-pink-500/50 px-3 py-1 text-sm font-semibold text-pink-200">
                        {dest.category}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{dest.description}</p>
                  </div>

                  {/* Explore Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition-all whitespace-nowrap shrink-0"
                  >
                    Explore
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Shopping Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-transparent border border-pink-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 bg-pink-400/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-pink-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">Smart Shopping Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: "🎯",
                title: "Skip Tourist Traps",
                description: "Head to local neighborhoods for authentic items",
              },
              {
                emoji: "💬",
                title: "Haggle Smart",
                description: "Expected at markets - start at 70% and negotiate",
              },
              {
                emoji: "🎨",
                title: "Artisan Shops",
                description: "Support local artists for unique, meaningful souvenirs",
              },
              {
                emoji: "🏭",
                title: "Factory Outlets",
                description: "Save 30-50% on branded goods at outlet stores",
              },
              {
                emoji: "♻️",
                title: "Vintage & Secondhand",
                description: "Find vintage treasures at a fraction of retail price",
              },
              {
                emoji: "🆓",
                title: "Market Samples",
                description: "Free samples at markets - taste before you buy",
              },
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-pink-300 transition">
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

      {/* No Shopping Message */}
      {!loading && shopping.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 rounded-xl bg-white/5 border border-white/10"
        >
          <ShoppingBag className="w-12 h-12 text-pink-300/50 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No shopping destinations found</p>
          <p className="text-white/40 text-sm mt-2">Try exploring a different location</p>
        </motion.div>
      )}
    </div>
  );
});
