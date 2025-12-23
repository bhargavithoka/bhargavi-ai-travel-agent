import { TravelIntake } from "@/app/types/travel.types";
import {
  FlightOption,
  HotelOption,
  FoodOption,
  ShoppingOption,
} from "./providers.service";

// Re-export types for use in client components
export type { FlightOption, HotelOption, FoodOption, ShoppingOption };

export async function fetchFlights(
  intake: TravelIntake
): Promise<FlightOption[]> {
  try {
    const response = await fetch("/api/data/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch flights:", error);
    return [];
  }
}

export async function fetchHotels(intake: TravelIntake): Promise<HotelOption[]> {
  try {
    const response = await fetch("/api/data/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return [];
  }
}

export async function fetchRestaurants(
  intake: TravelIntake
): Promise<FoodOption[]> {
  try {
    const response = await fetch("/api/data/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return [];
  }
}

export async function fetchShoppingDestinations(
  intake: TravelIntake
): Promise<ShoppingOption[]> {
  try {
    const response = await fetch("/api/data/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch shopping destinations:", error);
    return [];
  }
}
