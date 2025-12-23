// Extracted from page.tsx - Tab definitions
import {
  Plane,
  Hotel,
  CalendarDays,
  Wallet,
  Sparkles,
  Utensils,
  ShoppingBag,
} from "lucide-react";

export const TABS = [
  { name: "Overview", icon: Sparkles },
  { name: "Budget", icon: Wallet },
  { name: "Flights", icon: Plane },
  { name: "Hotels", icon: Hotel },
  { name: "Food", icon: Utensils },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Trip Planner", icon: CalendarDays },
] as const;
