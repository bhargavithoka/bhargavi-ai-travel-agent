// Hotels tab component - hotel recommendations and amenities
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { HotelOption, fetchHotels } from "@/app/services/data.service";
import { Home, Wifi, Coffee, Shield, Star, Loader, MapPin } from "lucide-react";

type HotelsViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export function HotelsView({ aiResult, intakeData }: HotelsViewProps) {
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
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Home className="h-7 w-7 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Hotel Recommendations
              </h3>
            </div>
            <p className="text-white/60 text-sm">
              Real-time hotels within your budget for {nights} nights
            </p>
          </div>
          <motion.div
            className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-emerald-300 font-semibold uppercase">Avg/Night</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">${avgPerNight}</p>
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
          <Loader className="h-8 w-8 text-emerald-400 animate-spin mr-3" />
          <p className="text-white/70">Fetching available hotels...</p>
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
          {hotels.map((hotel, idx) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="rounded-xl backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 p-6 cursor-pointer transition-shadow hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {/* Hotel Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{hotel.name}</h4>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{hotel.location}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(hotel.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/60 ml-2">{hotel.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-300">${hotel.price}</p>
                  <p className="text-xs text-white/60">per night</p>
                  <button className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities.length > 0 && (
                <div className="flex items-center gap-3 pt-4 border-t border-white/10 flex-wrap">
                  {hotel.amenities.slice(0, 4).map((amenity, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-full bg-emerald-500/30 border border-emerald-500/50 px-3 py-1 text-xs text-emerald-300"
                    >
                      {amenity}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Booking Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatedCard delay={0.4}>
          <h4 className="font-semibold text-white mb-3">🏨 Hotel Booking Tips</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Mid-range hotels offer best value for quality experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Book directly with hotels for better cancellation policies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Check reviews for location safety and cleanliness ratings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Ask about breakfast inclusion to reduce daily food costs</span>
            </li>
          </ul>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
