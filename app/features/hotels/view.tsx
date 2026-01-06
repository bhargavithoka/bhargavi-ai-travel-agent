// Hotels tab component - hotel recommendations and amenities
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { HotelOption, fetchHotels } from "@/app/services/data.service";
import { Home, Wifi, Coffee, Shield, Star, Loader, MapPin, Heart, Zap, TrendingDown, Award } from "lucide-react";

type HotelsViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export const HotelsView = React.memo(function HotelsView({ aiResult, intakeData }: HotelsViewProps) {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const estimatedHotelCost = aiResult.budget.hotels || 0;
  const nights = aiResult.days - 1;
  const avgPerNight = nights > 0 ? Math.round(estimatedHotelCost / nights) : 0;

  useEffect(() => {
    async function loadHotels() {
      if (!intakeData?.destination || !intakeData?.preferredCities?.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchHotels(intakeData);
        setHotels(data);
      } catch (error) {
        console.error("Error loading hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }

    loadHotels();
  }, [intakeData]);

  const amenityIcons = {
    wifi: Wifi,
    breakfast: Coffee,
    safe: Shield,
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-transparent border border-emerald-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(20,184,166,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.div
                className="flex items-center gap-4 mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-4xl">🏨</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Hotel Recommendations
                </h1>
              </motion.div>
              <p className="text-white/70">
                {nights} nights • Curated stays within your budget
              </p>
            </div>
            <motion.div
              className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 backdrop-blur-xl px-6 py-4 text-center shrink-0"
              whileHover={{ scale: 1.08 }}
            >
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-2">Average/Night</p>
              <p className="text-3xl font-bold text-emerald-200">${avgPerNight}</p>
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Budget Tiers Display */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { emoji: "💚", tier: "Budget", price: "$40-80", desc: "Cozy, clean, essential amenities" },
          { emoji: "🟢", tier: "Mid-Range", price: "$80-150", desc: "Comfort, better locations, great value", highlight: true },
          { emoji: "👑", tier: "Luxury", price: "$150+", desc: "Premium experience, prime locations" },
        ].map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative rounded-xl p-5 border transition-all ${
              tier.highlight
                ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 shadow-lg shadow-emerald-500/20"
                : "border-white/20 bg-white/5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
            }`}
          >
            <div className="text-3xl mb-3">{tier.emoji}</div>
            <h4 className="text-lg font-bold text-white mb-1">{tier.tier}</h4>
            <p className="text-2xl font-bold text-emerald-300 mb-2">{tier.price}</p>
            <p className="text-xs text-white/60">{tier.desc}</p>
            {tier.highlight && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 text-xs bg-emerald-400/80 text-emerald-900 px-2 py-1 rounded-full font-bold"
              >
                BEST VALUE
              </motion.div>
            )}
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
            <Home className="h-12 w-12 text-emerald-400" />
          </motion.div>
          <p className="text-white/70 mt-4 text-lg">Finding perfect hotels...</p>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ delay: i * 0.2, duration: 1.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Hotel Cards */}
      {!loading && hotels.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Top Hotels
          </h3>
          {hotels.map((hotel, idx) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, x: 5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/30 backdrop-blur-xl p-6 transition-all hover:border-emerald-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/10 transition-all duration-500 -z-10" />

              <div className="relative">
                {/* Top Section: Info & Price */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <motion.h4
                      className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {hotel.name}
                    </motion.h4>
                    <div className="flex items-center gap-2 text-emerald-300 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            animate={{ scale: i < Math.floor(hotel.rating) ? [1, 1.1, 1] : 1 }}
                            transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                i < Math.floor(hotel.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/30"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white">{hotel.rating.toFixed(1)}</span>
                      <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs text-white/60"
                      >
                        {Math.round(Math.random() * 100 + 200)} reviews
                      </motion.span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="text-right shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-2xl mb-2 opacity-60 hover:opacity-100 transition"
                    >
                      <Heart className="w-6 h-6 text-red-400" />
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-4xl font-bold text-emerald-300"
                    >
                      ${hotel.price}
                    </motion.div>
                    <p className="text-xs text-emerald-300/70">per night</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Amenities */}
                {hotel.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/60 font-semibold mb-3 uppercase tracking-wider">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 5).map((amenity, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="rounded-full bg-emerald-500/30 border border-emerald-500/50 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/50 transition cursor-pointer"
                        >
                          {amenity}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  Book Hotel
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Hotel Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900/30 via-emerald-900/20 to-transparent border border-teal-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-teal-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">Hotel Booking Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: "🏆",
                title: "Mid-Range Sweet Spot",
                description: "Best value for comfort and location",
              },
              {
                emoji: "📞",
                title: "Book Directly",
                description: "Better cancellation policies with hotels",
              },
              {
                emoji: "⭐",
                title: "Check Reviews",
                description: "Focus on location, cleanliness ratings",
              },
              {
                emoji: "🍳",
                title: "Breakfast Included",
                description: "Ask about inclusions to save on food",
              },
              {
                emoji: "📍",
                title: "Location Matters",
                description: "Central areas reduce travel costs",
              },
              {
                emoji: "🎟️",
                title: "Check Deals",
                description: "Weekly discounts and package offers",
              },
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-teal-300 transition">
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

      {/* No Hotels Message */}
      {!loading && hotels.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 rounded-xl bg-white/5 border border-white/10"
        >
          <Home className="w-12 h-12 text-emerald-300/50 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No hotels found for your selection</p>
          <p className="text-white/40 text-sm mt-2">Try adjusting your dates or city preferences</p>
        </motion.div>
      )}
    </div>
  );
});
