/**
 * app/lib/__tests__/utils.test.ts
 * Tests for utility functions
 */

import {
  safeNumber,
  categorizeError,
  getUserFriendlyMessage,
  getTravelStyle,
  formatCurrency,
  debounce,
  createCacheKey,
  isCacheExpired,
  deepClone,
} from "../utils";
import { TRAVEL_STYLES, BUDGET_THRESHOLDS } from "../constants";

describe("Utility Functions", () => {
  describe("safeNumber", () => {
    it("should return valid numbers", () => {
      expect(safeNumber(42)).toBe(42);
      expect(safeNumber(0)).toBe(0);
      expect(safeNumber(-100)).toBe(-100);
    });

    it("should return fallback for invalid values", () => {
      expect(safeNumber("abc")).toBe(0);
      expect(safeNumber(null)).toBe(0);
      expect(safeNumber(undefined)).toBe(0);
      expect(safeNumber(NaN)).toBe(0);
    });

    it("should use custom fallback", () => {
      expect(safeNumber("abc", 99)).toBe(99);
      expect(safeNumber(null, 50)).toBe(50);
    });
  });

  describe("categorizeError", () => {
    it("should identify timeout errors", () => {
      expect(categorizeError(new Error("timeout"))).toBe("timeout");
      expect(categorizeError(new Error("Request aborted"))).toBe("timeout");
    });

    it("should identify network errors", () => {
      expect(categorizeError(new Error("network error"))).toBe("network");
      expect(categorizeError(new Error("fetch failed"))).toBe("network");
    });

    it("should identify validation errors", () => {
      expect(categorizeError(new Error("validation failed"))).toBe("validation");
      expect(categorizeError(new Error("invalid input"))).toBe("validation");
    });

    it("should default to unknown", () => {
      expect(categorizeError(new Error("some other error"))).toBe("unknown");
      expect(categorizeError(null)).toBe("unknown");
    });
  });

  describe("getUserFriendlyMessage", () => {
    it("should return appropriate messages", () => {
      expect(getUserFriendlyMessage("timeout")).toContain("timed out");
      expect(getUserFriendlyMessage("network")).toContain("Network");
      expect(getUserFriendlyMessage("validation")).toContain("Invalid");
      expect(getUserFriendlyMessage("unknown")).toContain("wrong");
    });
  });

  describe("getTravelStyle", () => {
    it("should classify budget travel", () => {
      expect(getTravelStyle(1000)).toBe(TRAVEL_STYLES.BUDGET);
      expect(getTravelStyle(BUDGET_THRESHOLDS.BUDGET_FRIENDLY)).toBe(
        TRAVEL_STYLES.BUDGET
      );
    });

    it("should classify mid-range travel", () => {
      expect(getTravelStyle(1500)).toBe(TRAVEL_STYLES.MID_RANGE);
      expect(getTravelStyle(2000)).toBe(TRAVEL_STYLES.MID_RANGE);
    });

    it("should classify premium travel", () => {
      expect(getTravelStyle(3000)).toBe(TRAVEL_STYLES.PREMIUM);
      expect(getTravelStyle(10000)).toBe(TRAVEL_STYLES.PREMIUM);
    });
  });

  describe("formatCurrency", () => {
    it("should format USD currency", () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toBe("$1,000");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0");
    });

    it("should handle large numbers", () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain("1,000,000");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    it("should debounce function calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn("test");
      debouncedFn("test");
      debouncedFn("test");

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("test");
    });
  });

  describe("createCacheKey", () => {
    it("should create consistent cache keys", () => {
      const key1 = createCacheKey("tab", "query");
      const key2 = createCacheKey("tab", "query");
      expect(key1).toBe(key2);
    });

    it("should be case-insensitive", () => {
      const key1 = createCacheKey("TAB", "QUERY");
      const key2 = createCacheKey("tab", "query");
      expect(key1).toBe(key2);
    });

    it("should handle multiple parts", () => {
      const key = createCacheKey("section", "subsection", "id");
      expect(key).toContain(":");
    });
  });

  describe("isCacheExpired", () => {
    it("should identify non-expired cache", () => {
      const timestamp = Date.now();
      expect(isCacheExpired(timestamp)).toBe(false);
    });

    it("should identify expired cache", () => {
      const oldTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago
      expect(isCacheExpired(oldTimestamp)).toBe(true);
    });

    it("should use custom TTL", () => {
      const recentTimestamp = Date.now() - 1000; // 1 second ago
      expect(isCacheExpired(recentTimestamp, 2000)).toBe(false);
      expect(isCacheExpired(recentTimestamp, 500)).toBe(true);
    });
  });

  describe("deepClone", () => {
    it("should clone objects deeply", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      cloned.b.c = 999;
      expect(original.b.c).toBe(2);
    });

    it("should clone arrays", () => {
      const original = [1, [2, 3]];
      const cloned = deepClone(original);

      cloned[1][0] = 999;
      expect(original[1][0]).toBe(2);
    });
  });
});
