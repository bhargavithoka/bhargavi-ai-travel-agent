/**
 * app/lib/constants.ts
 * Centralized constants for the application
 */

// API & Request Configuration
export const API_CONFIG = {
  REQUEST_TIMEOUT_MS: 45000, // 45 seconds
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 2,
  RETRY_DELAY_MS: 1000,
} as const;

// Travel Budget Thresholds
export const BUDGET_THRESHOLDS = {
  BUDGET_FRIENDLY: 1200,
  MODERATE: 2500,
} as const;

// Travel Style Classifications
export const TRAVEL_STYLES = {
  BUDGET: "Budget",
  MID_RANGE: "Mid-range",
  PREMIUM: "Premium",
} as const;

// Budget Health Status
export const BUDGET_HEALTH = {
  EXCELLENT: "excellent",
  GOOD: "good",
  WARNING: "warning",
  HIGH: "high",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  TIMEOUT: "Request timed out. Try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  VALIDATION_ERROR: "Invalid input. Please check your details.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  API_KEY_MISSING: "OPENAI_API_KEY is not set",
} as const;

// UI Animation Durations (ms)
export const ANIMATIONS = {
  FAST: 200,
  NORMAL: 400,
  SLOW: 800,
  FADE_IN: 0.3,
  STAGGER: 0.1,
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: "k", // Cmd/Ctrl+K
  NEXT_TAB: "ArrowRight",
  PREV_TAB: "ArrowLeft",
} as const;

// Date & Time Formats
export const DATE_FORMATS = {
  ISO: "YYYY-MM-DD",
  DISPLAY: "MMM DD, YYYY",
  SHORT: "MMM DD",
} as const;

// CSS Classes & Patterns
export const CSS_PATTERNS = {
  GRADIENT_PRIMARY: "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400",
  GRADIENT_SECONDARY: "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
  BACKDROP_BLUR: "backdrop-blur-xl bg-white/10 border border-white/20",
  GRADIENT_TEXT: "bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent",
} as const;

// Default Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS: 100,
} as const;

export type BudgetThreshold = typeof BUDGET_THRESHOLDS[keyof typeof BUDGET_THRESHOLDS];
export type TravelStyle = typeof TRAVEL_STYLES[keyof typeof TRAVEL_STYLES];
export type BudgetHealthStatus = typeof BUDGET_HEALTH[keyof typeof BUDGET_HEALTH];
