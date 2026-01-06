"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { IntakeQuestion } from "@/app/types/travel.types";
import { ChevronRight, ChevronLeft, CheckCircle2, Circle } from "lucide-react";

interface IntakeDialogProps {
  questions: IntakeQuestion[];
  onComplete: (answers: Record<string, string | number | string[]>) => void;
  onCancel: () => void;
}

export function IntakeDialog({
  questions,
  onComplete,
  onCancel,
}: IntakeDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>("");
  const [error, setError] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isMultiselect = currentQuestion?.type === "multiselect";

  const handleNext = useCallback(() => {
    setError("");

    if (currentQuestion.required && !currentAnswer) {
      if (Array.isArray(currentAnswer) && currentAnswer.length === 0) {
        setError("Please select at least one option");
        return;
      }
      if (typeof currentAnswer === "string" && !currentAnswer.trim()) {
        setError("This field is required");
        return;
      }
    }

    // Validate answer based on type
    if (currentQuestion.type === "number" && typeof currentAnswer === "string") {
      const numValue = parseFloat(currentAnswer);
      if (isNaN(numValue) || numValue <= 0) {
        setError("Please enter a valid positive number");
        return;
      }
    }

    if (currentQuestion.type === "date" && typeof currentAnswer === "string") {
      const dateValue = new Date(currentAnswer);
      if (isNaN(dateValue.getTime())) {
        setError("Please enter a valid date");
        return;
      }
      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateValue < today) {
        setError("Travel date cannot be in the past");
        return;
      }
    }

    // Validate date range
    if (currentQuestion.type === "dateRange" && typeof currentAnswer === "string") {
      const [startStr, endStr] = currentAnswer.split("|");
      if (!startStr || !endStr) {
        setError("Please enter both start and end dates");
        return;
      }
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError("Please enter valid dates");
        return;
      }

      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        setError("Start date cannot be in the past");
        return;
      }

      // Check if end date is before start date
      if (endDate < startDate) {
        setError("End date cannot be before start date");
        return;
      }
    }

    let finalAnswer: string | number | string[] = currentAnswer;
    if (currentQuestion.type === "number" && typeof currentAnswer === "string") {
      finalAnswer = parseFloat(currentAnswer);
    }

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: finalAnswer,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer("");
    }
  }, [currentQuestion, currentAnswer, answers, isLastQuestion, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevAnswer = answers[prevQuestion.id];
      setCurrentAnswer(prevAnswer ? (Array.isArray(prevAnswer) ? prevAnswer : prevAnswer.toString()) : "");
      setError("");
    }
  }, [currentQuestionIndex, questions, answers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isMultiselect) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleCheckboxChange = (option: string) => {
    const current = Array.isArray(currentAnswer) ? currentAnswer : [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setCurrentAnswer(updated);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-blue-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-lg font-medium text-white mb-4">
            {currentQuestion.question}
          </label>

          {/* Multiselect with checkboxes */}
          {currentQuestion.type === "multiselect" && currentQuestion.options ? (
            <div className="space-y-2 max-h-64 overflow-y-auto bg-white/5 rounded-lg p-4 border border-white/10">
              {currentQuestion.options.map((option) => {
                const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                return (
                  <motion.button
                    key={option}
                    onClick={() => handleCheckboxChange(option)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-150 text-left"
                    whileHover={{ paddingLeft: 24 }}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/40 flex-shrink-0" />
                    )}
                    <span className={isSelected ? "text-white font-medium" : "text-white/70"}>
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ) : null}

          {/* Text input */}
          {currentQuestion.type === "text" && (
            <input
              type="text"
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              autoFocus
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
            />
          )}

          {/* Date input */}
          {currentQuestion.type === "date" && (
            <input
              type="date"
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              min={new Date().toISOString().split("T")[0]}
              autoFocus
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
            />
          )}

          {/* Date Range input */}
          {currentQuestion.type === "dateRange" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Start Date</label>
                <input
                  type="date"
                  value={
                    typeof currentAnswer === "string"
                      ? currentAnswer.split("|")[0] || ""
                      : ""
                  }
                  onChange={(e) => {
                    const startDate = e.target.value;
                    const endDate =
                      typeof currentAnswer === "string"
                        ? currentAnswer.split("|")[1] || ""
                        : "";
                    setCurrentAnswer(endDate ? `${startDate}|${endDate}` : startDate);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  autoFocus
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">End Date</label>
                <input
                  type="date"
                  value={
                    typeof currentAnswer === "string"
                      ? currentAnswer.split("|")[1] || ""
                      : ""
                  }
                  onChange={(e) => {
                    const startDate =
                      typeof currentAnswer === "string"
                        ? currentAnswer.split("|")[0] || ""
                        : "";
                    const endDate = e.target.value;
                    setCurrentAnswer(startDate ? `${startDate}|${endDate}` : endDate);
                  }}
                  min={
                    typeof currentAnswer === "string" && currentAnswer.split("|")[0]
                      ? currentAnswer.split("|")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Number input */}
          {currentQuestion.type === "number" && (
            <input
              type="number"
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              autoFocus
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
            />
          )}

          {/* Error message */}
          {error && (
            <motion.p
              className="mt-2 text-red-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          {/* Help text for optional fields */}
          {!currentQuestion.required && (
            <p className="mt-2 text-white/40 text-sm">Optional</p>
          )}
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </motion.button>

          <motion.button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/15 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLastQuestion ? "Complete" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
