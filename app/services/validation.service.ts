// Extracted from app/lib/validateAIResponse.ts - Moved to services layer

import { Budget, AIResult } from "@/app/types/travel.types";

const DEFAULT_RESULT: AIResult = {
  summary: "Unable to generate a travel plan.",
  days: 1,
  budget: {
    flights: 0,
    hotels: 0,
    food: 0,
    activities: 0,
  },
  recommendations: [],
};

export function validateAIResponse(data: any): AIResult {
  try {
    return {
      summary:
        typeof data.summary === "string"
          ? data.summary
          : DEFAULT_RESULT.summary,

      days:
        typeof data.days === "number" && data.days > 0
          ? data.days
          : DEFAULT_RESULT.days,

      budget: {
        flights:
          typeof data.budget?.flights === "number"
            ? data.budget.flights
            : 0,
        hotels:
          typeof data.budget?.hotels === "number"
            ? data.budget.hotels
            : 0,
        food:
          typeof data.budget?.food === "number"
            ? data.budget.food
            : 0,
        activities:
          typeof data.budget?.activities === "number"
            ? data.budget.activities
            : 0,
      },

      recommendations: Array.isArray(data.recommendations)
        ? data.recommendations.filter((r: unknown): r is string => typeof r === "string")
        : [],
    };
  } catch {
    return DEFAULT_RESULT;
  }
}
