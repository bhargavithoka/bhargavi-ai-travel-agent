"use client";

// Trip Planner tab component - interactive trip timeline and itinerary
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AIResult, TravelIntake } from "@/app/types/travel.types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Calendar, MapPin, AlertCircle, CheckCircle, Clock, DollarSign, ChevronDown, RotateCw, Shuffle } from "lucide-react";
import {
  detectMissingPlannerInfo,
  generateItinerary,
  regenerateItinerary,
  type ItineraryDay,
  type ItineraryActivity,
  type PlannerQuestion,
} from "@/app/services/itinerary.service";

type PlannerViewProps = {
  aiResult: AIResult;
  intakeData?: TravelIntake;
};

export function PlannerView({ aiResult, intakeData }: PlannerViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [missingInfoQuestions, setMissingInfoQuestions] = useState<PlannerQuestion[]>([]);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [preferences, setPreferences] = useState<{
    travelStyle?: string[];
    interests?: string[];
    pace?: string;
  }>({});
  const [swapModalOpen, setSwapModalOpen] = useState<{ dayIdx: number; actIdx: number } | null>(null);
  
  const dayCount = aiResult.days;
  const totalBudget =
    (aiResult.budget.flights || 0) +
    (aiResult.budget.hotels || 0) +
    (aiResult.budget.food || 0) +
    (aiResult.budget.activities || 0);
  const totalItineraryCost = itinerary.reduce((sum, day) => sum + (day.totalCost || 0), 0);

  // Initialize and generate itinerary on mount
  useEffect(() => {
    const initializeItinerary = async () => {
      setLoading(true);
      try {
        // Check for missing info
        const missing = detectMissingPlannerInfo(intakeData || {});
        if (missing.length > 0) {
          setMissingInfoQuestions(missing);
          setShowMissingInfoDialog(true);
          return;
        }

        // Generate itinerary if we have all info
        const result = generateItinerary(intakeData || {}, {});
        setItinerary(result.days);
      } catch (error) {
        console.error("Failed to generate itinerary:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeItinerary();
  }, [intakeData]);

  // Handle missing info answers
  const handleMissingInfoSubmit = async (answers: Record<string, string | string[]>) => {
    setLoading(true);
    try {
      const newPreferences = {
        travelStyle: Array.isArray(answers.travelStyle) ? answers.travelStyle : [answers.travelStyle as string],
        interests: Array.isArray(answers.interests) ? answers.interests : [answers.interests as string],
        pace: answers.pace as string,
      };
      setPreferences(newPreferences);

      // Generate itinerary with new preferences
      const result = generateItinerary(intakeData || {}, newPreferences);
      setItinerary(result.days);
      setShowMissingInfoDialog(false);
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle regenerate itinerary
  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const result = regenerateItinerary(intakeData || {}, preferences);
      setItinerary(result.days);
    } catch (error) {
      console.error("Failed to regenerate itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle swap activity
  const handleSwapActivity = (dayIdx: number, actIdx: number, newActivity: ItineraryActivity) => {
    try {
      const updatedDays = [...itinerary];
      const updatedDay = {
        ...updatedDays[dayIdx],
        activities: [...updatedDays[dayIdx].activities],
      };
      updatedDay.activities[actIdx] = newActivity;
      updatedDay.totalCost = updatedDay.activities.reduce((sum, act) => sum + act.cost, 0);
      updatedDays[dayIdx] = updatedDay;
      setItinerary(updatedDays);
      setSwapModalOpen(null);
    } catch (error) {
      console.error("Failed to swap activity:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Missing Info Dialog */}
      {showMissingInfoDialog && (
        <MissingInfoDialog
          questions={missingInfoQuestions}
          onSubmit={handleMissingInfoSubmit}
          loading={loading}
        />
      )}

      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Calendar className="h-7 w-7 text-violet-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                {dayCount}-Day Itinerary
              </h3>
            </div>
            <p className="text-white/60 text-sm">
              {loading ? "Generating your perfect itinerary..." : "Interactive timeline of your perfect trip"}
            </p>
          </div>
          <motion.div
            className="rounded-xl bg-violet-500/20 border border-violet-500/40 px-6 py-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-violet-300 font-semibold uppercase">Total Cost</p>
            <p className="text-2xl font-bold text-violet-300 mt-1">
              ${totalItineraryCost > 0 ? totalItineraryCost : totalBudget}
            </p>
          </motion.div>
        </div>

        {/* Regenerate Button */}
        {!loading && itinerary.length > 0 && (
          <motion.button
            onClick={handleRegenerate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-300 font-semibold hover:bg-violet-500/30 transition-all"
          >
            <RotateCw className="h-4 w-4" />
            Regenerate Itinerary
          </motion.button>
        )}
      </AnimatedCard>

      {/* Timeline */}
      {itinerary.length > 0 ? (
        <div className="space-y-3">
          {itinerary.map((dayData, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <motion.div
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl backdrop-blur-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/30 p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-violet-500/20"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">
                      {idx === 0 ? "✈️" : idx === itinerary.length - 1 ? "👋" : "🎯"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-violet-300">Day {dayData.day}</p>
                      <p className="text-lg font-bold text-white">{dayData.title}</p>
                      {dayData.theme && (
                        <p className="text-xs text-violet-300 mt-1">Theme: {dayData.theme}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="text-right"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xs text-white/60">Cost</p>
                      <p className="text-lg font-bold text-violet-300">${dayData.totalCost}</p>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: expandedDay === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-violet-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Highlights */}
                {dayData.highlights && dayData.highlights.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dayData.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs bg-violet-500/30 text-violet-200 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded Activities */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedDay === idx ? 1 : 0,
                    height: expandedDay === idx ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    {dayData.activities.map((activity, actIdx) => (
                      <motion.div
                        key={actIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: actIdx * 0.05 }}
                        className="flex items-start gap-3 text-white/80 group"
                      >
                        <Clock className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{activity.time}</p>
                          <p className="text-sm text-white/90">{activity.activity}</p>
                          {activity.description && (
                            <p className="text-xs text-white/60 mt-1">{activity.description}</p>
                          )}
                          {activity.duration && (
                            <p className="text-xs text-violet-300 mt-1">Duration: {activity.duration}</p>
                          )}
                          {activity.cost && (
                            <p className="text-xs text-violet-300">Cost: ${activity.cost}</p>
                          )}
                        </div>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwapModalOpen({ dayIdx: idx, actIdx });
                          }}
                          whileHover={{ scale: 1.1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-violet-500/30"
                          title="Swap activity"
                        >
                          <Shuffle className="h-4 w-4 text-violet-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : !loading && itinerary.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">Loading your itinerary...</p>
        </div>
      ) : null}

      {/* Trip Overview Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Total Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AnimatedCard delay={0.5}>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white/60 font-semibold uppercase">Duration</p>
                <p className="text-2xl font-bold text-white mt-1">{dayCount} Days</p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Total Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AnimatedCard delay={0.6}>
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white/60 font-semibold uppercase">Trip Budget</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${totalItineraryCost > 0 ? totalItineraryCost : totalBudget}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Average Daily */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <AnimatedCard delay={0.7}>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white/60 font-semibold uppercase">Daily Avg</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${dayCount > 0 ? Math.round((totalItineraryCost > 0 ? totalItineraryCost : totalBudget) / dayCount) : 0}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </motion.div>

      {/* Planning Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <AnimatedCard delay={0.8}>
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-3">📋 Planning Tips</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">1.</span>
                  <span>Book accommodations and flights first, then plan daily activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">2.</span>
                  <span>Leave buffer time for rest days or spontaneous discoveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">3.</span>
                  <span>Group nearby attractions to minimize travel between locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">4.</span>
                  <span>Reserve popular activities 2-3 weeks in advance</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* Swap Activity Modal */}
      {swapModalOpen && (
        <SwapActivityModal
          dayIdx={swapModalOpen.dayIdx}
          actIdx={swapModalOpen.actIdx}
          currentDay={itinerary[swapModalOpen.dayIdx]}
          onSwap={handleSwapActivity}
          onClose={() => setSwapModalOpen(null)}
        />
      )}
    </div>
  );
}

// Missing Info Dialog Component
function MissingInfoDialog({
  questions,
  onSubmit,
  loading,
}: {
  questions: PlannerQuestion[];
  onSubmit: (answers: Record<string, string | string[]>) => void;
  loading: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const travelStyleOptions = ["Cultural", "Adventure", "Luxury", "Budget", "Family"];
  const interestOptions = ["Food", "Museums", "Beaches", "Mountains", "Shopping", "Nightlife"];
  const paceOptions = ["Relaxed", "Moderate", "Fast-paced"];

  const handleToggleMultiselect = (field: string, value: string) => {
    const current = Array.isArray(answers[field]) ? answers[field] : [];
    const updated = (current as string[]).includes(value)
      ? (current as string[]).filter((v) => v !== value)
      : [...(current as string[]), value];
    setAnswers({ ...answers, [field]: updated });
  };

  const handleSubmit = () => {
    const missingQuestion = questions.find((q) => !answers[q.field]);
    if (missingQuestion) {
      alert(`Please select your ${missingQuestion.field}`);
      return;
    }
    onSubmit(answers);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border border-violet-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Personalize Your Itinerary</h2>
        <p className="text-white/60 mb-6">Help us create the perfect trip for you</p>

        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.field}>
              <label className="block text-white font-semibold mb-3">{question.label}</label>

              {question.type === "multiselect" && (
                <div className="grid grid-cols-2 gap-3">
                  {(question.field === "travelStyle"
                    ? travelStyleOptions
                    : question.field === "interests"
                    ? interestOptions
                    : []
                  ).map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => handleToggleMultiselect(question.field, option)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        (answers[question.field] as string[])?.includes(option)
                          ? "bg-violet-500 text-white border border-violet-400"
                          : "bg-white/10 text-white/70 border border-white/20 hover:border-violet-400"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {question.type === "radio" && (
                <div className="space-y-2">
                  {paceOptions.map((option) => (
                    <motion.label
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:border-violet-400 transition-all"
                    >
                      <input
                        type="radio"
                        name={question.field}
                        value={option}
                        checked={answers[question.field] === option}
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.field]: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-white font-semibold flex-1">{option}</span>
                    </motion.label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Swap Activity Modal Component
function SwapActivityModal({
  dayIdx,
  actIdx,
  currentDay,
  onSwap,
  onClose,
}: {
  dayIdx: number;
  actIdx: number;
  currentDay: ItineraryDay;
  onSwap: (dayIdx: number, actIdx: number, newActivity: ItineraryActivity) => void;
  onClose: () => void;
}) {
  // Alternative activity suggestions
  const alternativeActivities: ItineraryActivity[] = [
    {
      time: "09:00 AM",
      activity: "Local Market Tour",
      description: "Explore vibrant local markets and street food",
      duration: "2 hours",
      cost: 15,
    },
    {
      time: "11:00 AM",
      activity: "Museum Visit",
      description: "Discover art and history",
      duration: "2.5 hours",
      cost: 20,
    },
    {
      time: "02:00 PM",
      activity: "Adventure Activity",
      description: "Hiking, kayaking, or water sports",
      duration: "3 hours",
      cost: 40,
    },
    {
      time: "04:00 PM",
      activity: "Shopping District",
      description: "Browse local shops and souvenirs",
      duration: "2 hours",
      cost: 30,
    },
    {
      time: "06:00 PM",
      activity: "Local Cuisine Experience",
      description: "Authentic dinner at popular restaurant",
      duration: "2 hours",
      cost: 35,
    },
    {
      time: "08:00 PM",
      activity: "Night Entertainment",
      description: "Live music, comedy, or cultural show",
      duration: "2 hours",
      cost: 25,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border border-violet-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Swap Activity: Day {currentDay.day}
          </h2>
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90 }}
            className="text-white/60 hover:text-white"
          >
            ✕
          </motion.button>
        </div>

        <p className="text-white/60 mb-6">
          Choose an alternative activity to replace{" "}
          <span className="text-violet-300 font-semibold">
            {currentDay.activities[actIdx]?.activity}
          </span>
        </p>

        <div className="space-y-3">
          {alternativeActivities.map((activity, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSwap(dayIdx, actIdx, activity)}
              className="p-4 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-violet-500/20 hover:border-violet-400 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-violet-300 font-semibold">{activity.time}</p>
                  <p className="text-white font-bold mt-1">{activity.activity}</p>
                  <p className="text-sm text-white/60 mt-1">{activity.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-violet-300">⏱️ {activity.duration}</span>
                    <span className="text-xs text-violet-300">💰 ${activity.cost}</span>
                  </div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="bg-violet-500 text-white rounded-lg p-2">→</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
