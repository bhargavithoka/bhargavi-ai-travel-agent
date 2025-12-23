import { TravelIntake } from "@/app/types/travel.types";

export type ItineraryActivity = {
  time: string;
  activity: string;
  description: string;
  duration: string;
  cost: number;
};

export type ItineraryDay = {
  day: number;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
  totalCost: number;
  highlights: string[];
};

export type Itinerary = {
  days: ItineraryDay[];
  summary: string;
  missingInfo: string[];
};

// Question to ask if info is missing
export type PlannerQuestion = {
  id: string;
  field: string;
  question: string;
  label: string;
  type: "text" | "multiselect" | "radio";
  required: boolean;
  options?: string[];
};

// Detect what information is missing for better itinerary
export function detectMissingPlannerInfo(intake: TravelIntake): PlannerQuestion[] {
  const questions: PlannerQuestion[] = [];

  // Check for travel style/preferences
  if (!intake.travelStyle) {
    questions.push({
      id: "travelStyle",
      field: "travelStyle",
      question: "What's your travel style?",
      label: "Travel Style",
      type: "multiselect",
      required: false,
      options: ["Adventure", "Cultural", "Relaxation", "Luxury", "Budget", "Food-focused"],
    });
  }

  // Check for specific interests
  if (!intake.purpose) {
    questions.push({
      id: "interests",
      field: "interests",
      question: "What are your main interests?",
      label: "Main Interests",
      type: "multiselect",
      required: false,
      options: [
        "Sightseeing",
        "Adventure",
        "Food",
        "Shopping",
        "Nightlife",
        "Nature",
        "History",
        "Art",
      ],
    });
  }

  // Check for pace preference
  questions.push({
    id: "pace",
    field: "pace",
    question: "What's your preferred pace?",
    label: "Travel Pace",
    type: "radio",
    required: false,
  });

  return questions;
}

// Generate a day-by-day itinerary
export function generateItinerary(
  intake: TravelIntake,
  preferences?: Record<string, any>
): Itinerary {
  const days = intake.dates?.startDate && intake.dates?.endDate
    ? Math.ceil(
        (new Date(intake.dates.endDate).getTime() -
          new Date(intake.dates.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 5;

  const destination = intake.destination || "Destination";
  const cities = intake.preferredCities || [destination];
  const travelStyle = preferences?.travelStyle?.[0] || intake.travelStyle || "Cultural";
  const interests = preferences?.interests || ["Sightseeing", "Food"];
  const isPacedFast = preferences?.pace === "yes";

  // Generate themes for each day
  const themes = [
    "Arrival & Orientation",
    travelStyle === "Adventure" ? "Adventure Day" : "Main Attractions",
    "Local Experience",
    "Hidden Gems",
    "Leisure & Shopping",
    "Departure",
  ];

  // Activity templates based on travel style and interests
  const activityTemplates: Record<string, ItineraryActivity[]> = {
    arrival: [
      {
        time: "14:00",
        activity: "Arrive & Check-in",
        description: "Arrive at destination and settle into hotel",
        duration: "2h",
        cost: 0,
      },
      {
        time: "16:30",
        activity: "Explore Neighborhood",
        description: "Walk around local area, find restaurants",
        duration: "1.5h",
        cost: 0,
      },
      {
        time: "18:30",
        activity: "Welcome Dinner",
        description: "Dinner at local restaurant",
        duration: "2h",
        cost: 25,
      },
    ],
    cultural: [
      {
        time: "09:00",
        activity: "Museum/Heritage Site",
        description: "Visit main cultural attraction",
        duration: "3h",
        cost: 15,
      },
      {
        time: "12:30",
        activity: "Local Lunch",
        description: "Eat at traditional restaurant",
        duration: "1.5h",
        cost: 12,
      },
      {
        time: "14:30",
        activity: "Walking Tour",
        description: "Guided or self-guided exploration",
        duration: "2h",
        cost: 20,
      },
      {
        time: "18:00",
        activity: "Street Food & Market",
        description: "Explore local markets and street food",
        duration: "2h",
        cost: 15,
      },
    ],
    adventure: [
      {
        time: "07:00",
        activity: "Early Start Activity",
        description: "Outdoor adventure or hiking",
        duration: "4h",
        cost: 30,
      },
      {
        time: "12:00",
        activity: "Adventure Lunch",
        description: "Pack lunch or local spot",
        duration: "1h",
        cost: 10,
      },
      {
        time: "14:00",
        activity: "Water Sports/Extreme Activity",
        description: "Thrilling experience",
        duration: "2h",
        cost: 40,
      },
      {
        time: "18:00",
        activity: "Recovery Dinner",
        description: "Dinner and early rest",
        duration: "2h",
        cost: 20,
      },
    ],
    leisure: [
      {
        time: "09:00",
        activity: "Leisurely Breakfast",
        description: "Explore breakfast spots",
        duration: "1.5h",
        cost: 10,
      },
      {
        time: "11:00",
        activity: "Shopping/Browsing",
        description: "Visit markets, shops, boutiques",
        duration: "3h",
        cost: 30,
      },
      {
        time: "14:30",
        activity: "Spa or Relaxation",
        description: "Massage, spa, or beach time",
        duration: "2h",
        cost: 35,
      },
      {
        time: "17:30",
        activity: "Sunset Activity",
        description: "Scenic viewpoint or activity",
        duration: "1.5h",
        cost: 15,
      },
      {
        time: "19:30",
        activity: "Dinner & Nightlife",
        description: "Fine dining or nightlife",
        duration: "3h",
        cost: 40,
      },
    ],
  };

  // Select activity set based on preferences
  let baseActivities = activityTemplates.cultural;
  if (interests.includes("Adventure")) baseActivities = activityTemplates.adventure;
  else if (interests.includes("Relaxation") || interests.includes("Shopping"))
    baseActivities = activityTemplates.leisure;

  const itineraryDays: ItineraryDay[] = [];

  for (let i = 0; i < days; i++) {
    const dayNumber = i + 1;
    const isArrivalDay = dayNumber === 1;
    const isDepartureDay = dayNumber === days;

    let activities: ItineraryActivity[];
    let theme: string;

    if (isArrivalDay) {
      activities = activityTemplates.arrival;
      theme = "Arrival & Orientation";
    } else if (isDepartureDay) {
      activities = [
        {
          time: "08:00",
          activity: "Final Breakfast",
          description: "Last meal at favorite spot",
          duration: "1h",
          cost: 10,
        },
        {
          time: "09:30",
          activity: "Last-Minute Shopping",
          description: "Souvenirs and gifts",
          duration: "1.5h",
          cost: 20,
        },
        {
          time: "11:00",
          activity: "Checkout & Transfer",
          description: "Leave for airport/station",
          duration: "2h",
          cost: 10,
        },
      ];
      theme = "Departure Day";
    } else {
      // Vary activities across days
      const activityIndex = (i - 1) % 3;
      if (activityIndex === 0) {
        activities = baseActivities;
        theme = travelStyle === "Adventure" ? "Adventure Day" : "Exploration Day";
      } else if (activityIndex === 1) {
        activities = activityTemplates.leisure;
        theme = "Relaxation & Shopping";
      } else {
        activities = activityTemplates.cultural;
        theme = "Culture & Local Life";
      }
    }

    const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
    const highlights = activities
      .slice(0, 2)
      .map((a) => a.activity);

    itineraryDays.push({
      day: dayNumber,
      title: isArrivalDay ? "Arrival Day" : isDepartureDay ? "Departure Day" : `Day ${dayNumber}`,
      theme,
      activities,
      totalCost,
      highlights,
    });
  }

  const missingInfo: string[] = [];
  if (!intake.travelStyle) missingInfo.push("travel style");
  if (!intake.purpose) missingInfo.push("specific interests");

  return {
    days: itineraryDays,
    summary: `${days}-day ${travelStyle.toLowerCase()} itinerary for ${cities.join(", ")}`,
    missingInfo,
  };
}

// Swap an activity with an alternative
export function swapActivity(
  itinerary: Itinerary,
  dayIndex: number,
  activityIndex: number,
  newActivity: ItineraryActivity
): Itinerary {
  const updated = { ...itinerary };
  updated.days = [...itinerary.days];
  updated.days[dayIndex] = {
    ...itinerary.days[dayIndex],
    activities: [...itinerary.days[dayIndex].activities],
  };
  updated.days[dayIndex].activities[activityIndex] = newActivity;
  return updated;
}

// Regenerate itinerary with new seed/preferences
export function regenerateItinerary(
  intake: TravelIntake,
  preferences: Record<string, any>
): Itinerary {
  // Simple regeneration by tweaking preferences slightly
  return generateItinerary(intake, preferences);
}
