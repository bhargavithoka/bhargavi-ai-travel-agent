// Extracted from app/api/ai/route.ts - Tab-specific data enrichment logic

import { AIResult } from "@/app/types/travel.types";

export type EnrichedResult = AIResult & {
  flights?: Array<{
    airline: string;
    route: string;
    duration: string;
    stops: string;
    price: number;
  }>;
  hotels?: Array<{
    name: string;
    area: string;
    rating: number;
    pricePerNight: number;
    type: string;
  }>;
};

export function enrichResultByTab(parsed: AIResult, tab: string): EnrichedResult {
  // Flights tab → add Expedia-style flight cards
  if (tab === "Flights") {
    return {
      ...parsed,
      flights: [
        {
          airline: "Air France",
          route: "NYC (JFK) → Paris (CDG)",
          duration: "7h 20m",
          stops: "Non-stop",
          price: parsed.budget?.flights || 520,
        },
        {
          airline: "Delta",
          route: "NYC (JFK) → Paris (CDG)",
          duration: "8h 05m",
          stops: "1 stop",
          price:
            parsed.budget?.flights > 0
              ? parsed.budget.flights - 40
              : 460,
        },
        {
          airline: "United",
          route: "NYC (EWR) → Paris (CDG)",
          duration: "7h 45m",
          stops: "Non-stop",
          price:
            parsed.budget?.flights > 0
              ? parsed.budget.flights + 30
              : 540,
        },
      ],
    };
  }

  // Hotels tab → add booking-style hotel cards
  if (tab === "Hotels") {
    return {
      ...parsed,
      hotels: [
        {
          name: "Hotel Le Marais",
          area: "Le Marais",
          rating: 4.6,
          pricePerNight: 180,
          type: "Mid-range",
        },
        {
          name: "Ibis Paris Bastille",
          area: "Bastille",
          rating: 4.2,
          pricePerNight: 140,
          type: "Budget",
        },
        {
          name: "Pullman Paris Tour Eiffel",
          area: "7th Arrondissement",
          rating: 4.8,
          pricePerNight: 260,
          type: "Premium",
        },
      ],
    };
  }

  // Default: all other tabs unchanged
  return parsed;
}
