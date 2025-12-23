// Extracted from page.tsx - Type definitions
import type { LucideIcon } from "lucide-react";
export type Tab = "Overview" | "Budget" | "Flights" | "Hotels" | "Food" | "Shopping" | "Trip Planner";

export type Budget = {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
};

export type HotelCard = {
  name: string;
  area: string;
  rating: number;
  pricePerNight: number;
  type: string;
};

export type AIResult = {
  summary: string;
  days: number;
  budget: Budget;
  recommendations: string[];
  hotels?: HotelCard[];
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

export type TabItem = {
  name: Tab;
  icon: LucideIcon;
};

export type TravelIntake = {
  destination?: string;
  dates?: {
    startDate?: string;
    endDate?: string;
  };
  budget?: number;
  preferredCities?: string[];
  purpose?: string;
  travelStyle?: string;
};

export type IntakeQuestion = {
  id: string;
  question: string;
  type: "text" | "date" | "dateRange" | "number" | "multiselect";
  required: boolean;
  placeholder?: string;
  options?: string[];
  dependency?: {
    field: string;
    value: string | string[];
  };
};

