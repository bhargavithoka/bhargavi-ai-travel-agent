import { TravelIntake } from "@/app/types/travel.types";

export type FlightOption = {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  rating: number;
};

export type HotelOption = {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  amenities: string[];
  image: string;
};

export type FoodOption = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  price: string;
  description: string;
};

export type ShoppingOption = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
};

// Mock data generators
function generateFlights(intake: TravelIntake): FlightOption[] {
  const airlines = ["United", "Delta", "American", "Emirates", "Air France"];
  const flights: FlightOption[] = [];
  
  for (let i = 0; i < 5; i++) {
    flights.push({
      id: `flight-${i}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departure: `${9 + i}:${Math.random() > 0.5 ? "00" : "30"} AM`,
      arrival: `${15 + i}:${Math.random() > 0.5 ? "00" : "30"} PM`,
      duration: `${7 + Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m`,
      price: 250 + Math.floor(Math.random() * 500),
      stops: Math.floor(Math.random() * 3),
      rating: 3.5 + Math.random() * 1.5,
    });
  }
  
  return flights;
}

function generateHotels(intake: TravelIntake): HotelOption[] {
  const hotelTypes = ["Luxury", "Business", "Boutique", "Resort", "Modern"];
  const amenities = ["WiFi", "Pool", "Gym", "Restaurant", "Spa", "Parking"];
  const hotels: HotelOption[] = [];
  
  for (let i = 0; i < 6; i++) {
    const amenityCount = 3 + Math.floor(Math.random() * 4);
    hotels.push({
      id: `hotel-${i}`,
      name: `${hotelTypes[i % hotelTypes.length]} Hotel ${i + 1}`,
      location: intake.preferredCities?.[0] || "Downtown",
      rating: 3.5 + Math.random() * 1.5,
      price: 80 + Math.floor(Math.random() * 400),
      amenities: amenities.slice(0, amenityCount),
      image: `https://images.unsplash.com/photo-161240${1000 + i}?w=400&h=300&fit=crop`,
    });
  }
  
  return hotels;
}

function generateFood(intake: TravelIntake): FoodOption[] {
  const cuisines = ["Italian", "Thai", "Indian", "Japanese", "Mexican", "French"];
  const restaurants: FoodOption[] = [];
  
  for (let i = 0; i < 8; i++) {
    restaurants.push({
      id: `food-${i}`,
      name: `${cuisines[i % cuisines.length]} Restaurant ${i + 1}`,
      cuisine: cuisines[i % cuisines.length],
      rating: 3.5 + Math.random() * 1.5,
      price: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
      description: `Authentic ${cuisines[i % cuisines.length]} cuisine with modern twist`,
    });
  }
  
  return restaurants;
}

function generateShopping(intake: TravelIntake): ShoppingOption[] {
  const categories = ["Markets", "Malls", "Boutiques", "Souvenirs", "Electronics"];
  const locations = intake.preferredCities || ["Downtown"];
  const shopping: ShoppingOption[] = [];
  
  for (let i = 0; i < 6; i++) {
    shopping.push({
      id: `shop-${i}`,
      name: `${categories[i % categories.length]} ${i + 1}`,
      category: categories[i % categories.length],
      description: `Popular ${categories[i % categories.length].toLowerCase()} destination`,
      location: locations[i % locations.length],
    });
  }
  
  return shopping;
}

// Real provider adapters (with fallback to mock)
export class FlightAdapter {
  async getFlights(intake: TravelIntake): Promise<FlightOption[]> {
    try {
      // Attempt real API call (example: Amadeus, Kayak, etc)
      // This would use process.env.FLIGHT_API_KEY
      // For now, return mock data with fallback pattern
      return generateFlights(intake);
    } catch (error) {
      console.warn("Flight provider error, using mock data:", error);
      return generateFlights(intake);
    }
  }
}

export class HotelAdapter {
  async getHotels(intake: TravelIntake): Promise<HotelOption[]> {
    try {
      // Attempt real API call (example: Booking.com, Agoda, etc)
      // This would use process.env.HOTEL_API_KEY
      return generateHotels(intake);
    } catch (error) {
      console.warn("Hotel provider error, using mock data:", error);
      return generateHotels(intake);
    }
  }
}

export class FoodAdapter {
  async getRestaurants(intake: TravelIntake): Promise<FoodOption[]> {
    try {
      // Attempt real API call (example: Yelp, Foursquare, etc)
      // This would use process.env.FOOD_API_KEY
      return generateFood(intake);
    } catch (error) {
      console.warn("Food provider error, using mock data:", error);
      return generateFood(intake);
    }
  }
}

export class ShoppingAdapter {
  async getShoppingDestinations(intake: TravelIntake): Promise<ShoppingOption[]> {
    try {
      // Attempt real API call
      // This would use process.env.SHOPPING_API_KEY or Google Maps API
      return generateShopping(intake);
    } catch (error) {
      console.warn("Shopping provider error, using mock data:", error);
      return generateShopping(intake);
    }
  }
}
