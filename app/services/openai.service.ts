import OpenAI from "openai";
import { buildPrompt } from "./prompt.service";
import { validateAIResponse } from "./validation.service";
import { AIResult } from "@/app/types/travel.types";

/**
 * Create OpenAI client lazily (runtime-safe for Vercel)
 */
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new OpenAI({
    apiKey,
    timeout: 60000,
  });
}

/**
 * Main AI call used by /api/ai
 */
export async function callOpenAI(
  query: string,
  tab: string
): Promise<AIResult> {
  const client = getClient();
  const prompt = buildPrompt(query, tab);

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: "You are a helpful travel planning assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.output_text || "{}";

  // Clean possible markdown wrappers
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText
      .replace(/^```json\n?/, "")
      .replace(/^```\n?/, "")
      .replace(/\n?```$/, "");
  }

  const parsedJson = JSON.parse(cleanText);
  return validateAIResponse(parsedJson);
}
