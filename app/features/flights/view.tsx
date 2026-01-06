"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { FlightOption, fetchFlights } from "@/app/services/data.service";
import { Plane, Calendar, TrendingDown, AlertCircle, Loader, Zap, Clock, Users, Gauge } from "lucide-react";

type FlightsViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export const FlightsView = React.memo(function FlightsView({ aiResult, intakeData }: FlightsViewProps) {
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(true);
  const estimatedFlightCost = aiResult.budget.flights || 0;

  useEffect(() => {
    async function loadFlights() {
      if (!intakeData?.destination) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchFlights(intakeData);
        setFlights(data);
      } catch (error) {
        console.error("Error loading flights:", error);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }

    loadFlights();
  }, [intakeData]);

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Enhanced Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-transparent border border-blue-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.div
                className="flex items-center gap-4 mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-4xl">✈️</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Flight Recommendations
                </h1>
              </motion.div>
              <p className="text-white/70">
                Smart flight search based on your dates and budget
              </p>
            </div>
            <motion.div
              className="rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 backdrop-blur-xl px-6 py-4 text-center shrink-0"
              whileHover={{ scale: 1.08, borderColor: "rgba(34,211,238,0.8)" }}
            >
              <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-2">Estimated Cost</p>
              <p className="text-3xl font-bold text-blue-200">${estimatedFlightCost}</p>
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Key Flight Info Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { icon: Clock, label: "Best Time", value: "2-3 Months", color: "from-blue-500 to-blue-600", emoji: "📅" },
          { icon: Gauge, label: "Save", value: "20-40%", color: "from-green-500 to-emerald-600", emoji: "💰" },
          { icon: Plane, label: "Flights", value: intakeData?.preferredCities?.length || "N/A", color: "from-purple-500 to-pink-600", emoji: "🛫" },
          { icon: Zap, label: "Duration", value: `${aiResult.days} Days`, color: "from-orange-500 to-red-600", emoji: "⏱️" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative group rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-white/20 p-4 overflow-hidden cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-xs text-white/70 font-semibold uppercase">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State with Enhanced Animation */}
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
            <Plane className="h-12 w-12 text-blue-400" />
          </motion.div>
          <p className="text-white/70 mt-4 text-lg">Searching for the best flights...</p>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ delay: i * 0.2, duration: 1.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Flights List with Enhanced Cards */}
      {!loading && flights.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Available Flights</h3>
          {flights.map((flight, idx) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ scale: 1.02, borderColor: "rgba(34,211,238,0.6)" }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/30 p-6 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/10 transition-all duration-500 -z-10" />

              <div className="relative space-y-4">
                {/* Top Row: Airline & Pricing */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <motion.h4
                      className="text-lg font-bold text-blue-300 mb-2"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {flight.airline}
                    </motion.h4>
                    <p className="text-white/80 font-semibold">
                      {flight.departure} <span className="text-cyan-400">→</span> {flight.arrival}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-4xl font-bold text-blue-300"
                    >
                      ${flight.price}
                    </motion.div>
                    <p className="text-xs text-blue-300/70 mt-1">Per Person</p>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                  {[
                    { icon: "⏱️", label: "Duration", value: flight.duration },
                    { icon: "🛑", label: "Stops", value: `${flight.stops}` },
                    { icon: "⭐", label: "Rating", value: `${flight.rating.toFixed(1)}/5` },
                    { icon: "👥", label: "Availability", value: "Limited" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xl block mb-1">{item.icon}</span>
                      <p className="text-xs text-white/60">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,211,238,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  Select Flight
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Flight Booking Tips with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent border border-purple-500/30 backdrop-blur-xl p-8"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">Flight Booking Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: "📅",
                title: "Book in Advance",
                description: "2-3 months ahead for best prices",
              },
              {
                emoji: "📊",
                title: "Tuesday is Best",
                description: "Flights are 10-15% cheaper mid-week",
              },
              {
                emoji: "🌅",
                title: "Early Morning",
                description: "Early departures offer better rates",
              },
              {
                emoji: "🎯",
                title: "Set Alerts",
                description: "Price alerts help you catch deals",
              },
              {
                emoji: "🛫",
                title: "Nearby Airports",
                description: "Can save 20-30% on tickets",
              },
              {
                emoji: "✨",
                title: "Flexible Dates",
                description: "Being flexible saves thousands",
              },
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition">
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

      {/* No Flights Message */}
      {!loading && flights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 rounded-xl bg-white/5 border border-white/10"
        >
          <Plane className="w-12 h-12 text-blue-300/50 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No flights found for your selection</p>
          <p className="text-white/40 text-sm mt-2">Try adjusting your dates or destination</p>
        </motion.div>
      )}
    </div>
  );
});
