import type { TravelIntake, IntakeQuestion } from "@/app/types/travel.types";

// Master list of countries with their cities
const COUNTRIES_WITH_CITIES: Record<string, string[]> = {
  USA: [
    "New York",
    "Los Angeles",
    "San Francisco",
    "Las Vegas",
    "Miami",
    "Boston",
    "Seattle",
    "Austin",
    "Denver",
    "Chicago",
    "Washington DC",
    "New Orleans",
  ],
  Canada: [
    "Toronto",
    "Vancouver",
    "Montreal",
    "Calgary",
    "Ottawa",
    "Edmonton",
    "Quebec City",
    "Victoria",
    "Banff",
    "Whistler",
  ],
  Mexico: [
    "Mexico City",
    "Cancun",
    "Playa del Carmen",
    "Los Cabos",
    "Puerto Vallarta",
    "Acapulco",
    "Cozumel",
    "Guadalajara",
    "Oaxaca",
    "Merida",
  ],
  UK: [
    "London",
    "Manchester",
    "Liverpool",
    "Birmingham",
    "Bristol",
    "Oxford",
    "Cambridge",
    "Edinburgh",
    "York",
    "Brighton",
  ],
  France: [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Bordeaux",
    "Lille",
    "Cannes",
  ],
  Germany: [
    "Berlin",
    "Munich",
    "Hamburg",
    "Frankfurt",
    "Cologne",
    "Stuttgart",
    "Düsseldorf",
    "Dresden",
    "Nuremberg",
    "Heidelberg",
  ],
  Spain: [
    "Barcelona",
    "Madrid",
    "Valencia",
    "Seville",
    "Malaga",
    "Granada",
    "Bilbao",
    "Salamanca",
    "Toledo",
    "San Sebastian",
  ],
  Italy: [
    "Rome",
    "Venice",
    "Florence",
    "Milan",
    "Naples",
    "Palermo",
    "Bologna",
    "Verona",
    "Pisa",
    "Cinque Terre",
  ],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Groningen", "Arnhem", "Alkmaar", "Delft", "Haarlem", "Volendam"],
  Switzerland: ["Zurich", "Bern", "Geneva", "Lucerne", "Interlaken", "Zermatt", "Basel", "Lausanne", "St. Moritz"],
  Austria: ["Vienna", "Salzburg", "Innsbruck", "Graz", "Linz", "Hallstatt", "St. Anton", "Bad Gastein"],
  "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzen", "Cesky Krumlov", "Kutna Hora"],
  Poland: ["Warsaw", "Krakow", "Gdansk", "Wroclaw", "Poznan", "Auschwitz"],
  Greece: ["Athens", "Santorini", "Mykonos", "Rhodes", "Crete", "Paros", "Naxos", "Delphi", "Thessaloniki", "Meteora"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Cappadocia", "Bodrum", "Antalya", "Gallipoli", "Bursa", "Konya"],
  Portugal: ["Lisbon", "Porto", "Algarve", "Sintra", "Cascais", "Évora", "Madeira", "Braga", "Aveiro"],
  Belgium: ["Brussels", "Bruges", "Antwerp", "Ghent", "Namur", "Liège"],
  Luxembourg: ["Luxembourg City", "Vianden", "Echternach", "Mondorf-les-Bains"],
  Croatia: ["Zagreb", "Dubrovnik", "Split", "Zadar", "Rovinj", "Hvar"],
  Hungary: ["Budapest", "Debrecen", "Szeged", "Pécs", "Eger"],
  Romania: ["Bucharest", "Brasov", "Transylvania", "Cluj-Napoca", "Sibiu"],
  Bulgaria: ["Sofia", "Plovdiv", "Varna", "Burgas", "Bansko"],
  Serbia: ["Belgrade", "Nis", "Subotica", "Kragujevac"],
  Albania: ["Tirana", "Durrës", "Vlorë", "Berat"],
  Montenegro: ["Podgorica", "Kotor", "Budva", "Cetinje"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Jeju", "Gyeongju", "Suwon", "Gangneung"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nagasaki", "Yokohama", "Kobe", "Nagoya", "Sapporo", "Nara"],
  China: ["Beijing", "Shanghai", "Xi'an", "Guangzhou", "Chengdu", "Hangzhou", "Nanjing", "Suzhou"],
  Thailand: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi", "Koh Samui", "Koh Phi Phi", "Chiang Rai", "Ayutthaya", "Hua Hin"],
  Vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An", "Ha Long Bay", "Sapa", "Nha Trang", "Da Lat", "Hue", "Phu Quoc"],
  Indonesia: ["Jakarta", "Bali", "Yogyakarta", "Bandung", "Lombok", "Gili Islands", "Flores", "Komodo", "Sulawesi", "Sumatra"],
  Philippines: ["Manila", "Cebu", "Davao", "Boracay", "Palawan", "Baguio", "Quezon City"],
  Singapore: ["Singapore", "Marina Bay", "Sentosa Island", "Orchard Road", "Kampong Glam", "Chinatown", "Little India"],
  Malaysia: ["Kuala Lumpur", "Penang", "Melaka", "Johor Bahru", "Kota Kinabalu", "Langkawi"],
  India: ["New Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Jaipur", "Goa", "Agra", "Varanasi", "Kerala", "Udaipur", "Jodhpur", "Amritsar"],
  Brazil: ["Rio de Janeiro", "São Paulo", "Salvador", "Brasília", "Manaus", "Florianópolis", "Iguazu Falls", "Recife", "Paraty"],
  Argentina: ["Buenos Aires", "Mendoza", "Córdoba", "La Paz", "Salta", "San Juan", "Rio de la Plata"],
  Chile: ["Santiago", "Atacama Desert", "Atacama Valley", "Easter Island", "Patagonia", "Valparaíso", "Viña del Mar", "Puerto Varas"],
  Peru: ["Lima", "Cusco", "Machu Picchu", "Sacred Valley", "Arequipa", "Lake Titicaca"],
  Colombia: ["Bogotá", "Cartagena", "Medellín", "Cali", "Santa Marta"],
  "Costa Rica": ["San José", "Manuel Antonio", "Arenal", "Monteverde"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Queenstown", "Rotorua", "Tongariro", "Milford Sound", "Abel Tasman"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Cairns", "Hobart", "Canberra", "Byron Bay"],
  Egypt: ["Cairo", "Giza", "Luxor", "Aswan", "Alexandria", "Sharm El-Sheikh", "Hurghada", "Siwa Oasis", "Valley of the Kings"],
  Morocco: ["Casablanca", "Marrakech", "Fez", "Tangier", "Agadir", "Essaouira", "Meknes", "Chefchaouen", "Ouarzazate"],
};

const COUNTRIES = Object.keys(COUNTRIES_WITH_CITIES).sort();

// Function to extract country from user input
export function extractCountryFromInput(input: string): string | null {
  const lowerInput = input.toLowerCase();
  for (const country of COUNTRIES) {
    if (lowerInput.includes(country.toLowerCase())) {
      return country;
    }
  }
  return null;
}

export function detectMissingFields(intake: TravelIntake): IntakeQuestion[] {
  const missingQuestions: IntakeQuestion[] = [];

  // 1. If destination is not set, ask which country
  if (!intake.destination || intake.destination.trim() === "") {
    missingQuestions.push({
      id: "countries",
      question: "Which country would you like to visit?",
      type: "multiselect",
      required: true,
      options: COUNTRIES,
    });
  }

  // 2. Cities selection is required (only if country is selected)
  if (intake.destination && intake.destination.trim() !== "" && (!intake.preferredCities || intake.preferredCities.length === 0)) {
    const citiesForCountry = COUNTRIES_WITH_CITIES[intake.destination] || [];

    if (citiesForCountry.length > 0) {
      missingQuestions.push({
        id: "cities",
        question: `Which cities in ${intake.destination} interest you? (Select at least one)`,
        type: "multiselect",
        required: true,
        options: citiesForCountry,
      });
    }
  }

  // 3. Dates are required - ask both in one question
  if (!intake.dates?.startDate || !intake.dates?.endDate) {
    missingQuestions.push({
      id: "dateRange",
      question: "What are your trip dates? (Start date - End date)",
      type: "dateRange",
      required: true,
    });
  }

  // 4. Budget is required
  if (!intake.budget || intake.budget <= 0) {
    missingQuestions.push({
      id: "budget",
      question: "What's your total budget (in USD)?",
      type: "number",
      required: true,
      placeholder: "e.g., 2500",
    });
  }

  return missingQuestions;
}

export function mergeIntakeResponses(
  currentIntake: TravelIntake,
  questionId: string,
  answer: string | number | string[]
): TravelIntake {
  const updated = { ...currentIntake };

  switch (questionId) {
    case "countries":
      // Store selected country as destination
      if (Array.isArray(answer)) {
        updated.destination = answer[0]; // Take first selected country
      } else {
        updated.destination = answer as string;
      }
      break;
    case "cities":
      // Store selected cities
      updated.preferredCities = answer as string[];
      break;
    case "dateRange":
      // Handle date range - answer should be "startDate|endDate" format
      const dateRangeStr = answer as string;
      if (dateRangeStr.includes("|")) {
        const [start, end] = dateRangeStr.split("|");
        updated.dates = { startDate: start.trim(), endDate: end.trim() };
      }
      break;
    case "startDate":
      updated.dates = { ...updated.dates, startDate: answer as string };
      break;
    case "endDate":
      updated.dates = { ...updated.dates, endDate: answer as string };
      break;
    case "budget":
      updated.budget = answer as number;
      break;
  }

  return updated;
}

export function getCountriesList(): string[] {
  return COUNTRIES;
}

export function getCitiesForCountries(countries: string[]): string[] {
  if (!countries || countries.length === 0) {
    return [];
  }

  const cities = countries
    .flatMap((country) => COUNTRIES_WITH_CITIES[country] || [])
    .filter((city, idx, arr) => arr.indexOf(city) === idx)
    .sort();

  return cities;
}
