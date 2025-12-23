import { NextRequest, NextResponse } from "next/server";
import { ShoppingAdapter } from "@/app/services/providers.service";
import { TravelIntake } from "@/app/types/travel.types";

const adapter = new ShoppingAdapter();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const intake: TravelIntake = body;

    if (!intake.destination || !intake.preferredCities?.length) {
      return NextResponse.json(
        { error: "Destination and cities are required" },
        { status: 400 }
      );
    }

    const shopping = await adapter.getShoppingDestinations(intake);

    return NextResponse.json({
      success: true,
      data: shopping,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Shopping API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch shopping destinations" },
      { status: 500 }
    );
  }
}
