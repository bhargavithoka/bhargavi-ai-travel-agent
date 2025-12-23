import { NextRequest, NextResponse } from "next/server";
import { HotelAdapter } from "@/app/services/providers.service";
import { TravelIntake } from "@/app/types/travel.types";

const adapter = new HotelAdapter();

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

    const hotels = await adapter.getHotels(intake);

    return NextResponse.json({
      success: true,
      data: hotels,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Hotels API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}
