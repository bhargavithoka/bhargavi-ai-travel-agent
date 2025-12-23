"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { FlightOption, fetchFlights } from "@/app/services/data.service";
import { Plane, Calendar, TrendingDown, AlertCircle, Loader } from "lucide-react";

type FlightsViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export function FlightsView({ aiResult, intakeData }: FlightsViewProps) {
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
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plane className="h-7 w-7 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Flight Recommendations
              </h3>
            </div>
            <p className="text-white/60 text-sm">
              Real-time flight options based on your destination
            </p>
          </div>
          <motion.div
            className="rounded-xl bg-blue-500/20 border border-blue-500/40 px-6 py-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-blue-300 font-semibold uppercase">Est. Cost</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">${estimatedFlightCost}</p>
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
          <Loader className="h-8 w-8 text-blue-400 animate-spin mr-3" />
          <p className="text-white/70">Fetching available flights...</p>
        </motion.div>
      )}

      {/* Flights List */}
      {!loading && flights.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {flights.map((flight, idx) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-300 font-semibold text-lg mb-2">{flight.airline}</p>
                  <p className="text-white/70 text-sm">
                    {flight.departure} → {flight.arrival}
                  </p>
                  <p className="text-white/50 text-xs mt-1">Duration: {flight.duration}</p>
                </div>
                <div className="flex items-end justify-between md:justify-end gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Stops: {flight.stops}</p>
                    <p className="text-white/60 text-sm">Rating: {flight.rating.toFixed(1)}/5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-300">${flight.price}</p>
                    <button className="mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Flight Info Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Best Time to Book */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-5"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mt-1"
            >
              <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Best Time to Book</h4>
              <p className="text-sm text-white/70 mb-3">2-3 months in advance</p>
              <div className="inline-block rounded-full bg-blue-500/30 border border-blue-500/50 px-3 py-1 text-xs font-semibold text-blue-300">
                🎯 Save 20-40%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flight Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-5"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-1"
            >
              <TrendingDown className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Travel Duration</h4>
              <p className="text-sm text-white/70 mb-3">{aiResult.days} days total trip</p>
              <div className="inline-block rounded-full bg-cyan-500/30 border border-cyan-500/50 px-3 py-1 text-xs font-semibold text-cyan-300">
                ✈️ Mid-range prices
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Flight Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <AnimatedCard delay={0.5}>
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-3">✈️ Flight Booking Tips</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Tuesday-Thursday flights are typically 10-15% cheaper</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Early morning departures often offer better rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Set price alerts 2 months before your trip</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Consider nearby airports for significant savings</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
