"use client";

import { useState, useCallback, useMemo, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { TABS } from "./constants/tabs";
import { Tab, AIResult, TravelIntake } from "./types/travel.types";
import { fetchAIResponse } from "./services/ai.service";
import { SparkleBackground } from "./components/common/SparkleBackground";
import { Recommendations } from "./components/common/Recommendations";
import { IntakeDialog } from "./components/common/IntakeDialog";
import { ProfileButton } from "./components/common/ProfileButton";
import { SettingsDropdown } from "./components/common/SettingsDropdown";
import {
  detectMissingFields,
  mergeIntakeResponses,
  extractCountryFromInput,
} from "./services/intake.service";
import TabGrid from "@/app/components/common/TabGrid";
import { SkeletonLoader } from "@/app/components/common/SkeletonLoader";
import { formatDateRange } from "./lib/dateUtils";

// Dynamic imports for code splitting - views are lazy loaded when first viewed
const OverviewView = lazy(() => import("./features/overview/view").then(mod => ({ default: mod.OverviewView })));
const BudgetView = lazy(() => import("./features/budget/view").then(mod => ({ default: mod.BudgetView })));
const HotelsView = lazy(() => import("./features/hotels/view").then(mod => ({ default: mod.HotelsView })));
const FlightsView = lazy(() => import("./features/flights/view").then(mod => ({ default: mod.FlightsView })));
const FoodView = lazy(() => import("./features/food/view").then(mod => ({ default: mod.FoodView })));
const ShoppingView = lazy(() => import("./features/shopping/view").then(mod => ({ default: mod.ShoppingView })));
const PlannerView = lazy(() => import("./features/planner/view").then(mod => ({ default: mod.PlannerView })));

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
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Add keyboard shortcut support for tab navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="travels"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Arrow keys for tab navigation when not typing
      if (e.key === "ArrowRight" && aiResult && !showIntakeDialog) {
        const tabIndices = TABS.map(t => t.name);
        const currentIndex = tabIndices.indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabIndices.length;
        setActiveTab(tabIndices[nextIndex] as Tab);
      } else if (e.key === "ArrowLeft" && aiResult && !showIntakeDialog) {
        const tabIndices = TABS.map(t => t.name);
        const currentIndex = tabIndices.indexOf(activeTab);
        const prevIndex = (currentIndex - 1 + tabIndices.length) % tabIndices.length;
        setActiveTab(tabIndices[prevIndex] as Tab);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, aiResult, showIntakeDialog]);

  // Reset all search-related state for fresh searches
  const resetSearchState = useCallback(() => {
    setIntakeData({});
    setAiResult(null);
    setActiveTab("Overview");
    setError(null);
    setShowIntakeDialog(false);
    setMissingQuestions([]);
    setRetryAttempt(0);
  }, []);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;

    // CRITICAL: Reset all state for a fresh search
    resetSearchState();

    // Build fresh intake data ONLY from current query (not old state)
    const freshIntake: TravelIntake = {};

    // Try to extract country from user input
    const extractedCountry = extractCountryFromInput(query);
    if (extractedCountry) {
      freshIntake.destination = extractedCountry;
    }

    // Check for missing required fields
    const missing = detectMissingFields(freshIntake);

    if (missing.length > 0) {
      // Show intake dialog for missing fields with fresh state
      setIntakeData(freshIntake);
      setMissingQuestions(missing);
      setShowIntakeDialog(true);
      return;
    }

    // All required fields are present, proceed with search
    await performSearch(freshIntake);
  }, [query, resetSearchState]);

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
        setRetryAttempt(0);
      } catch (err: any) {
        const errorMsg = err.message || "Something went wrong. Please try again.";
        setError(errorMsg);
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [query] // Need query for buildQueryFromIntake
  );

  // Retry handler - allows user to retry failed searches
  const handleRetry = useCallback(() => {
    setRetryAttempt(prev => prev + 1);
    // Re-run the last search
    const enhancedQuery = buildQueryFromIntake(intakeData, query);
    setLoading(true);
    setError(null);
    
    fetchAIResponse(enhancedQuery, "Overview")
      .then(data => {
        setAiResult(data);
        setActiveTab("Overview");
        setRetryAttempt(0);
      })
      .catch(err => {
        setError(err.message || "Retry failed. Please try again.");
        console.error("Retry error:", err);
      })
      .finally(() => setLoading(false));
  }, [intakeData, query]);

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
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950" role="main" aria-label="Travel planning application">
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
        <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 sm:py-12 relative">
          {/* Profile Button and Settings - Top Right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <SettingsDropdown />
            <ProfileButton />
          </div>

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
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Ask me anything about your travels..."
                  aria-label="Travel search input"
                  aria-describedby="search-help"
                  className="w-full pl-10 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                />
                {loading && (
                  <motion.div
                    className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-transparent border-t-blue-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Date Range Display */}
          {intakeData.dates?.startDate && intakeData.dates?.endDate && (
            <motion.div
              className="w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left flex-1">
                    {intakeData.destination && (
                      <p className="text-sm text-white/60 font-medium">Destination</p>
                    )}
                    <p className="text-lg text-blue-300 font-semibold">
                      {formatDateRange(intakeData.dates.startDate, intakeData.dates.endDate)}
                    </p>
                    {intakeData.destination && (
                      <p className="text-sm text-white/70 mt-1">{intakeData.destination}</p>
                    )}
                  </div>
                  {aiResult && (
                    <div className="text-center sm:text-right">
                      <p className="text-xs text-white/60 uppercase font-semibold">Trip Length</p>
                      <p className="text-2xl font-bold text-purple-300">{aiResult.days} days</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* MIDDLE SECTION: Tab Grid (centered, full width) */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 py-4 sm:py-6">
          <TabGrid tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* BOTTOM SECTION: Content Display */}
        <div className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16 min-h-fit">
          {/* Error message with retry button */}
          {error && (
            <motion.div
              className="mb-8 px-6 py-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 max-w-2xl w-full flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex-1">
                <p className="font-semibold">⚠️ Search Error</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
              {aiResult === null && (
                <motion.button
                  onClick={handleRetry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-100 font-semibold text-sm whitespace-nowrap transition-colors"
                >
                  {retryAttempt > 0 ? `Retry (${retryAttempt})` : "Retry"}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Loading indicator with skeleton */}
          {loading && (
            <motion.div
              className="w-full max-w-4xl space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-center mb-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  className="inline-block h-2 w-2 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-white/70">Analyzing your request and gathering information...</span>
              </motion.div>
              <SkeletonLoader />
            </motion.div>
          )}

          {/* Tab Content - optimized entrance with lazy loading and Suspense */}
          {renderTabContent() && (
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div
                className="w-full max-w-4xl will-change-contents"
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                {renderTabContent()}
              </motion.div>
            </Suspense>
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
    </main>
  );
}
