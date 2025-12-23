import { NextRequest, NextResponse } from "next/server";
import { FoodAdapter } from "@/app/services/providers.service";
import { TravelIntake } from "@/app/types/travel.types";

const adapter = new FoodAdapter();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const intake: TravelIntake = body;

    if (!intake.destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    const restaurants = await adapter.getRestaurants(intake);

    return NextResponse.json({
      success: true,
      data: restaurants,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Food API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
