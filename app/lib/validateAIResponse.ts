type Budget = {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
};

export type AIResult = {
  summary: string;
  days: number;
  budget: Budget;
  recommendations: string[];
  overview?: {
    bestPlaces: Array<{
      title: string;
      description: string;
      highlights: string[];
    }>;
    foodExperiences: Array<{
      name: string;
      description: string;
      cuisine: string;
    }>;
    areasToStay: Array<{
      area: string;
      vibe: string;
      priceLevel: string;
      why: string;
    }>;
    seasonalNotes: {
      bestTime: string;
      weather: string;
      crowdLevel: string;
    };
    tips: string[];
  };
};

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
  overview: {
    bestPlaces: [],
    foodExperiences: [],
    areasToStay: [],
    seasonalNotes: {
      bestTime: "Year-round",
      weather: "Varies",
      crowdLevel: "Moderate",
    },
    tips: [],
  },
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

      overview: data.overview ? {
        bestPlaces: Array.isArray(data.overview.bestPlaces)
          ? data.overview.bestPlaces.filter((p: any) => typeof p.title === "string")
          : [],
        foodExperiences: Array.isArray(data.overview.foodExperiences)
          ? data.overview.foodExperiences.filter((f: any) => typeof f.name === "string")
          : [],
        areasToStay: Array.isArray(data.overview.areasToStay)
          ? data.overview.areasToStay.filter((a: any) => typeof a.area === "string")
          : [],
        seasonalNotes: data.overview.seasonalNotes || DEFAULT_RESULT.overview!.seasonalNotes,
        tips: Array.isArray(data.overview.tips)
          ? data.overview.tips.filter((t: unknown): t is string => typeof t === "string")
          : [],
      } : DEFAULT_RESULT.overview,
    };
  } catch {
    return DEFAULT_RESULT;
  }
}
