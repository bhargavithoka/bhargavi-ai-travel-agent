/**
 * Format a date string (ISO format YYYY-MM-DD) to user-friendly format
 * Example: "2025-01-15" → "Jan 15, 2025"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  const date = new Date(dateStr + "T00:00:00Z"); // Add time to prevent timezone issues
  
  if (isNaN(date.getTime())) {
    return dateStr; // Return original if invalid
  }
  
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  };
  
  return date.toLocaleDateString("en-US", options);
}

/**
 * Format a date range
 * Example: "2025-01-15" to "2025-01-20" → "Jan 15 - 20, 2025"
 */
export function formatDateRange(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return "";
  
  const startDate = new Date(startStr + "T00:00:00Z");
  const endDate = new Date(endStr + "T00:00:00Z");
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "";
  }
  
  const startMonth = startDate.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const startDay = startDate.getUTCDate();
  const endDay = endDate.getUTCDate();
  const year = startDate.getUTCFullYear();
  
  // If same month, format as "Jan 15 - 20, 2025"
  const endMonth = endDate.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  
  // Different months: "Jan 15 - Feb 20, 2025"
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Calculate number of days between two dates (inclusive)
 */
export function calculateDays(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  
  const startDate = new Date(startStr + "T00:00:00Z");
  const endDate = new Date(endStr + "T00:00:00Z");
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Include both start and end dates
}
