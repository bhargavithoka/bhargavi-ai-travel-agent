"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Assistant from "./components/assistant/Assistant";
import { Search } from "lucide-react";
import { TABS } from "./constants/tabs";
import { Tab, AIResult, TravelIntake } from "./types/travel.types";
import { fetchAIResponse } from "./services/ai.service";
import { SparkleBackground } from "./components/common/SparkleBackground";
import { Recommendations } from "./components/common/Recommendations";
import { IntakeDialog } from "./components/common/IntakeDialog";
import {
  detectMissingFields,
  mergeIntakeResponses,
  extractCountryFromInput,
} from "./services/intake.service";
import { OverviewView } from "./features/overview/view";
import { BudgetView } from "./features/budget/view";
import { HotelsView } from "./features/hotels/view";
import { FlightsView } from "./features/flights/view";
import { FoodView } from "./features/food/view";
import { ShoppingView } from "./features/shopping/view";
import { PlannerView } from "./features/planner/view";
import TabGrid from "@/app/components/common/TabGrid";

/* ============= PAGE COMPONENT ============= */

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [intakeData, setIntakeData] = useState<TravelIntake>({});
  const [missingQuestions, setMissingQuestions] = useState<any[]>([]);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;

    // Build initial intake data from query
    const initialIntake: TravelIntake = {
      ...intakeData,
    };

    // Try to extract country from user input
    const extractedCountry = extractCountryFromInput(query);
    if (extractedCountry && !initialIntake.destination) {
      initialIntake.destination = extractedCountry;
    }

    // Check for missing required fields
    const missing = detectMissingFields(initialIntake);

    if (missing.length > 0) {
      // Show intake dialog for missing fields
      setIntakeData(initialIntake);
      setMissingQuestions(missing);
      setShowIntakeDialog(true);
      return;
    }

    // All required fields are present, proceed with search
    await performSearch(initialIntake);
  }, [query, intakeData]);

  const performSearch = useCallback(
    async (intake: TravelIntake) => {
      setLoading(true);
      setError(null);

      try {
        // Build a comprehensive query from intake data
        const enhancedQuery = buildQueryFromIntake(intake, query);
        const data = await fetchAIResponse(enhancedQuery, "Overview");
        setAiResult(data);
        setActiveTab("Overview");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const handleIntakeComplete = useCallback(
    (answers: Record<string, string | number | string[]>) => {
      let finalIntake = intakeData;

      // Merge all answers into intake data
      Object.entries(answers).forEach(([questionId, answer]) => {
        finalIntake = mergeIntakeResponses(finalIntake, questionId, answer);
      });

      setIntakeData(finalIntake);
      setShowIntakeDialog(false);

      // Proceed with search
      performSearch(finalIntake);
    },
    [intakeData, performSearch]
  );

  const buildQueryFromIntake = (intake: TravelIntake, userQuery: string): string => {
    const parts = [userQuery];

    if (intake.destination) {
      parts.push(`Destination: ${intake.destination}`);
    }
    if (intake.dates?.startDate) {
      parts.push(`Start date: ${intake.dates.startDate}`);
    }
    if (intake.dates?.endDate) {
      parts.push(`End date: ${intake.dates.endDate}`);
    }
    if (intake.budget) {
      parts.push(`Budget: $${intake.budget}`);
    }
    if (intake.preferredCities && intake.preferredCities.length > 0) {
      parts.push(`Preferred cities: ${intake.preferredCities.join(", ")}`);
    }

    return parts.join(" | ");
  };

  const safeNum = (n: unknown) =>
    typeof n === "number" && isFinite(n) ? n : 0;

  const totalCost = useMemo(() => {
    if (!aiResult) return 0;
    return (
      safeNum(aiResult.budget.flights) +
      safeNum(aiResult.budget.hotels) +
      safeNum(aiResult.budget.food) +
      safeNum(aiResult.budget.activities)
    );
  }, [aiResult]);

  const travelStyle = useMemo(() => {
    return totalCost <= 1200 ? "Budget" : totalCost <= 2500 ? "Mid-range" : "Premium";
  }, [totalCost]);

  const renderTabContent = useCallback(() => {
    if (!aiResult) return null;

    const props = { aiResult, totalCost, travelStyle, intakeData };

    switch (activeTab) {
      case "Overview":
        return <OverviewView {...props} />;
      case "Budget":
        return <BudgetView aiResult={aiResult} />;
      case "Hotels":
        return <HotelsView aiResult={aiResult} intakeData={intakeData} />;
      case "Flights":
        return <FlightsView aiResult={aiResult} intakeData={intakeData} />;
      case "Food":
        return <FoodView aiResult={aiResult} intakeData={intakeData} />;
      case "Shopping":
        return <ShoppingView aiResult={aiResult} intakeData={intakeData} />;
      case "Trip Planner":
        return <PlannerView aiResult={aiResult} intakeData={intakeData} />;
      default:
        return null;
    }
  }, [activeTab, aiResult, totalCost, travelStyle, intakeData]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950">
      <SparkleBackground />

      {/* Intake Dialog */}
      <AnimatePresence>
        {showIntakeDialog && (
          <IntakeDialog
            questions={missingQuestions}
            onComplete={handleIntakeComplete}
            onCancel={() => setShowIntakeDialog(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* TOP SECTION: Header + Search */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 sm:py-12">
          {/* Header with entrance animation */}
          <motion.div
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent">
              Travel AI Advisor
            </h1>
            <p className="text-base sm:text-lg text-white/60 font-light tracking-wide">
              Plan smarter with AI-powered travel insights
            </p>
          </motion.div>

          {/* Floating Search Bar */}
          <motion.div
            className="w-full max-w-2xl mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              
              {/* Search input */}
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/15 transition-colors duration-300">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Ask me anything about your travels..."
                  className="w-full pl-10 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                />
                {loading && (
                  <motion.div
                    className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-transparent border-t-blue-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE SECTION: Tab Grid (centered, full width) */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 py-4 sm:py-6">
          <TabGrid tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* BOTTOM SECTION: Content Display */}
        <div className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16 min-h-fit">
          {/* Error message */}
          {error && (
            <motion.div
              className="mb-8 px-6 py-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 max-w-2xl w-full"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className="mb-8 text-white/60 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-blue-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span>Analyzing your request...</span>
            </motion.div>
          )}

          {/* Tab Content - optimized entrance, reduced motion complexity */}
          {renderTabContent() && (
            <motion.div
              className="w-full max-w-4xl will-change-contents"
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderTabContent()}
            </motion.div>
          )}

          {/* Recommendations */}
          {aiResult && activeTab !== "Overview" && (
            <motion.div
              className="w-full max-w-4xl mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Recommendations recommendations={aiResult.recommendations} />
            </motion.div>
          )}
        </div>
      </div>

      <Assistant activeTab={activeTab} searchText={query} />
    </main>
  );
}
