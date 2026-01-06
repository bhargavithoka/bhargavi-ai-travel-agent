// AI API service with retry logic, timeout handling, and better error messages
import { AIResult } from "@/app/types/travel.types";
import { API_CONFIG } from "@/app/lib/constants";
import {
  categorizeError,
  getUserFriendlyMessage,
  createCacheKey,
  isCacheExpired,
  logDebug,
} from "@/app/lib/utils";

// Simple in-memory cache for recent queries
const responseCache = new Map<string, { data: AIResult; timestamp: number }>();

/**
 * Get cached response if not expired
 */
const getCachedResponse = (key: string): AIResult | null => {
  const cached = responseCache.get(key);
  if (!cached) return null;

  if (isCacheExpired(cached.timestamp, API_CONFIG.CACHE_TTL_MS)) {
    responseCache.delete(key);
    return null;
  }

  logDebug(`[CACHE HIT] ${key}`);
  return cached.data;
};

/**
 * Store response in cache
 */
const setCachedResponse = (key: string, data: AIResult): void => {
  responseCache.set(key, { data, timestamp: Date.now() });
  logDebug(`[CACHE SET] ${key}`);
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch AI response with caching, timeout, and retry logic
 */
export async function fetchAIResponse(
  query: string,
  tab: string,
  retryCount = 0
): Promise<AIResult> {
  const cacheKey = createCacheKey(tab, query);

  // Check cache first
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      API_CONFIG.REQUEST_TIMEOUT_MS
    );

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, tab }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Server error: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    // Cache successful response
    setCachedResponse(cacheKey, data);
    logDebug(`[RESPONSE] ${tab} tab - ${query.slice(0, 30)}...`);

    return data;
  } catch (error: any) {
    const errorType = categorizeError(error);

    // Handle timeout
    if (error.name === "AbortError" || errorType === "timeout") {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        logDebug(
          `[TIMEOUT RETRY] Attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES}`
        );
        await sleep(API_CONFIG.RETRY_DELAY_MS);
        return fetchAIResponse(query, tab, retryCount + 1);
      }
      throw new Error(getUserFriendlyMessage("timeout"));
    }

    // Network errors - retry
    if (errorType === "network") {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        logDebug(
          `[NETWORK RETRY] Attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES}`
        );
        await sleep(API_CONFIG.RETRY_DELAY_MS);
        return fetchAIResponse(query, tab, retryCount + 1);
      }
      throw new Error(getUserFriendlyMessage("network"));
    }

    // Validation/parsing errors - don't retry
    if (error instanceof SyntaxError || errorType === "validation") {
      throw new Error(getUserFriendlyMessage("validation"));
    }

    // Unknown errors - attempt one retry
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (retryCount < API_CONFIG.MAX_RETRIES) {
      logDebug(`[ERROR RETRY] ${errorMessage}`);
      await sleep(API_CONFIG.RETRY_DELAY_MS);
      return fetchAIResponse(query, tab, retryCount + 1);
    }

    throw new Error(getUserFriendlyMessage("unknown"));
  }
}

/**
 * Clear the response cache (useful for testing or manual refresh)
 */
export function clearResponseCache(): void {
  responseCache.clear();
  logDebug("[CACHE CLEARED]");
}
