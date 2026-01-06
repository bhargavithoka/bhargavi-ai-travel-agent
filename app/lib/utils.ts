/**
 * app/lib/utils.ts
 * Common utility functions
 */

import { API_CONFIG, BUDGET_THRESHOLDS, TRAVEL_STYLES } from "./constants";
import type { ErrorContext } from "./commonTypes";

/**
 * Safe number conversion with fallback
 */
export function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === "number" && isFinite(value)) {
    return value;
  }
  return fallback;
}

/**
 * Categorize error for appropriate handling
 */
export function categorizeError(error: unknown): ErrorContext["type"] {
  if (!error) return "unknown";

  const errorStr = String(error).toLowerCase();

  if (errorStr.includes("timeout") || errorStr.includes("abort")) {
    return "timeout";
  }

  if (
    errorStr.includes("network") ||
    errorStr.includes("fetch") ||
    errorStr.includes("connection")
  ) {
    return "network";
  }

  if (errorStr.includes("validation") || errorStr.includes("invalid")) {
    return "validation";
  }

  return "unknown";
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyMessage(type: ErrorContext["type"]): string {
  const messages: Record<ErrorContext["type"], string> = {
    timeout: "Request timed out. Please try again.",
    network: "Network error. Please check your connection.",
    validation: "Invalid input. Please check your details.",
    unknown: "Something went wrong. Please try again.",
  };

  return messages[type] || messages.unknown;
}

/**
 * Determine travel style based on budget
 */
export function getTravelStyle(
  totalCost: number
): (typeof TRAVEL_STYLES)[keyof typeof TRAVEL_STYLES] {
  if (totalCost <= BUDGET_THRESHOLDS.BUDGET_FRIENDLY) {
    return TRAVEL_STYLES.BUDGET;
  }

  if (totalCost <= BUDGET_THRESHOLDS.MODERATE) {
    return TRAVEL_STYLES.MID_RANGE;
  }

  return TRAVEL_STYLES.PREMIUM;
}

/**
 * Format currency for display
 */
export function formatCurrency(
  value: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Debounce function for optimizing expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}

/**
 * Throttle function for rate-limiting operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Retry async function with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
  delayMs: number = API_CONFIG.RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Create cache key from multiple parts
 */
export function createCacheKey(...parts: (string | number)[]): string {
  return parts.map((p) => String(p).toLowerCase()).join(":");
}

/**
 * Check if cache entry is expired
 */
export function isCacheExpired(
  timestamp: number,
  ttlMs: number = API_CONFIG.CACHE_TTL_MS
): boolean {
  return Date.now() - timestamp > ttlMs;
}

/**
 * Clone object deeply (safe for JSON-serializable objects)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects recursively
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as any;
      }
    }
  }

  return result;
}

/**
 * Log with timestamp (useful for debugging)
 */
export function logDebug(label: string, data?: any): void {
  if (process.env.NODE_ENV === "development") {
    const timestamp = new Date().toISOString().split("T")[1];
    console.log(`[${timestamp}] ${label}`, data || "");
  }
}

/**
 * Assert condition and throw error
 */
export function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
