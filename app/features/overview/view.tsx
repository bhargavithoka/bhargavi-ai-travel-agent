// Extracted from page.tsx - Overview tab component
import { motion } from "framer-motion";
import { AIResult } from "@/app/types/travel.types";
import { Stat } from "@/app/components/common/Stat";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import {
  MapPin,
  UtensilsCrossed,
  Building2,
  Cloud,
  Lightbulb,
} from "lucide-react";

type OverviewViewProps = {
  aiResult: AIResult;
  totalCost: number;
  travelStyle: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function OverviewView({
  aiResult,
  totalCost,
  travelStyle,
}: OverviewViewProps) {
  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Summary Card */}
      <AnimatedCard>
        <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Trip Overview
        </h2>
        <p className="text-white/90 text-lg leading-relaxed">
          {aiResult.summary}
        </p>
      </AnimatedCard>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Stat delay={0} label="Trip Length" value={`${aiResult.days} days`} />
        <Stat
          delay={0.1}
          label="Estimated Total"
          value={`$${totalCost.toLocaleString()}`}
        />
        <Stat delay={0.2} label="Travel Style" value={travelStyle} />
      </motion.div>

      {/* Best Places Section */}
      {aiResult.overview?.bestPlaces && aiResult.overview.bestPlaces.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4"
          >
            <MapPin className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Best Places to Visit</h3>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            {aiResult.overview.bestPlaces.map((place, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300"
              >
                <h4 className="text-lg font-bold text-blue-300 mb-2 group-hover:text-blue-200">
                  {place.title}
                </h4>
                <p className="text-sm text-white/80 mb-3">{place.description}</p>
                <div className="flex flex-wrap gap-2">
                  {place.highlights.slice(0, 3).map((highlight, hIdx) => (
                    <span
                      key={hIdx}
                      className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Food Experiences Section */}
      {aiResult.overview?.foodExperiences &&
        aiResult.overview.foodExperiences.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-4"
            >
              <UtensilsCrossed className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">
                Must-Try Food Experiences
              </h3>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {aiResult.overview.foodExperiences.map((food, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-orange-400/50 hover:bg-orange-400/10 transition-all duration-300"
                >
                  <h4 className="text-lg font-bold text-orange-300 mb-2 group-hover:text-orange-200">
                    {food.name}
                  </h4>
                  <p className="text-sm text-white/80 mb-3">
                    {food.description}
                  </p>
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30">
                    {food.cuisine}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

      {/* Areas to Stay Section */}
      {aiResult.overview?.areasToStay &&
        aiResult.overview.areasToStay.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-4"
            >
              <Building2 className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Areas to Stay</h3>
            </motion.div>
            <motion.div
              className="space-y-3"
              variants={containerVariants}
            >
              {aiResult.overview.areasToStay.map((area, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-green-400/50 hover:bg-green-400/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-green-300 group-hover:text-green-200">
                      {area.area}
                    </h4>
                    <span className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-200 border border-green-400/30">
                      {area.priceLevel}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mb-2">{area.why}</p>
                  <p className="text-sm text-white/70 italic">
                    Vibe: {area.vibe}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

      {/* Seasonal Notes Section */}
      {aiResult.overview?.seasonalNotes && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4"
          >
            <Cloud className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Seasonal & Weather</h3>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Best Time to Visit</p>
              <p className="text-lg font-bold text-cyan-300">
                {aiResult.overview.seasonalNotes.bestTime}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Weather</p>
              <p className="text-lg font-bold text-cyan-300">
                {aiResult.overview.seasonalNotes.weather}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70 mb-1">Crowd Level</p>
              <p className="text-lg font-bold text-cyan-300">
                {aiResult.overview.seasonalNotes.crowdLevel}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recommendations Section */}
      {aiResult.recommendations && aiResult.recommendations.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold text-white"
          >
            Recommended Experiences
          </motion.h3>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
          >
            {aiResult.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:border-purple-400/50 hover:bg-purple-400/10 transition-all duration-300"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-purple-400 flex-shrink-0" />
                <p className="text-white/90">{rec}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Budget Breakdown */}
      {aiResult.budget && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold text-white"
          >
            Budget Breakdown
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {[
              { label: "Flights", value: aiResult.budget.flights, color: "blue" },
              {
                label: "Hotels",
                value: aiResult.budget.hotels,
                color: "green",
              },
              { label: "Food", value: aiResult.budget.food, color: "orange" },
              {
                label: "Activities",
                value: aiResult.budget.activities,
                color: "pink",
              },
            ].map((item, idx) => {
              const colorClasses = {
                blue: "bg-blue-500/20 text-blue-200 border-blue-400/30",
                green: "bg-green-500/20 text-green-200 border-green-400/30",
                orange: "bg-orange-500/20 text-orange-200 border-orange-400/30",
                pink: "bg-pink-500/20 text-pink-200 border-pink-400/30",
              }[item.color];

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`rounded-lg border ${colorClasses} p-4 backdrop-blur-sm`}
                >
                  <p className="text-xs opacity-75 mb-1">{item.label}</p>
                  <p className="text-xl font-bold">${item.value.toLocaleString()}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
      {aiResult.overview?.tips && aiResult.overview.tips.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4"
          >
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Travel Tips</h3>
          </motion.div>
          <motion.div
            className="space-y-2"
            variants={containerVariants}
          >
            {aiResult.overview.tips.map((tip, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0" />
                <p className="text-white/90">{tip}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
