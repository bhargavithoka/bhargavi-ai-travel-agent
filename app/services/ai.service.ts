// Extracted from page.tsx - AI API service
import { AIResult } from "@/app/types/travel.types";

export async function fetchAIResponse(query: string, tab: string): Promise<AIResult> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      tab,
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch AI response");

  const data = await res.json();
  return data;
}
