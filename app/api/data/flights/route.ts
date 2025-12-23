import { NextRequest, NextResponse } from "next/server";
import { FlightAdapter } from "@/app/services/providers.service";
import { TravelIntake } from "@/app/types/travel.types";

const adapter = new FlightAdapter();

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

    const flights = await adapter.getFlights(intake);

    return NextResponse.json({
      success: true,
      data: flights,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Flights API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
