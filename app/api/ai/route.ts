export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { callOpenAI } from "@/app/services/openai.service";
import { enrichResultByTab } from "@/app/services/enrichment.service";

/* ------------------ API HANDLER (THIN ORCHESTRATOR) ------------------ */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    const tab = body?.tab?.trim() || "Overview";

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Core AI reasoning (prompt + validation handled internally)
    const parsedResult = await callOpenAI(query, tab);

    // 2️⃣ Tab-specific enrichment (UI-friendly shaping)
    const enrichedResult = enrichResultByTab(parsedResult, tab);

    return NextResponse.json(enrichedResult);
  } catch (error) {
    console.error("AI API error:", error);

    return NextResponse.json(
      {
        error: "AI processing failed",
        message:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
