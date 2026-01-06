/**
 * app/lib/commonTypes.ts
 * Shared type definitions across the application
 */

/**
 * Standard API Response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * Error context for logging and debugging
 */
export interface ErrorContext {
  type: "timeout" | "network" | "validation" | "unknown";
  message: string;
  code?: string;
  timestamp: number;
  userFriendlyMessage: string;
  originalError?: Error;
}

/**
 * Cached data with metadata
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  isExpired: boolean;
}

/**
 * UI state for loading, error, and success states
 */
export interface AsyncState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  timestamp: number | null;
}

/**
 * Generic page component props
 */
export interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

/**
 * Keyed by enum for type-safe key access
 */
export type ValueOf<T> = T[keyof T];

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Make all properties of T required recursively
 */
export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>;
    }
  : T;
