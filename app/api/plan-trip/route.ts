import { NextRequest, NextResponse } from "next/server";

// URL of the Deno Zypher server
const ZYPHER_SERVER_URL = process.env.ZYPHER_SERVER_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { userInput, apiKeys } = await req.json();

    if (!userInput || !apiKeys) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!apiKeys.anthropic || !apiKeys.firecrawl) {
      return NextResponse.json(
        { success: false, error: "Anthropic and Firecrawl API keys are required" },
        { status: 400 }
      );
    }

    // Call the Deno Zypher server
    const response = await fetch(`${ZYPHER_SERVER_URL}/api/plan-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput,
        apiKeys: {
          anthropic: apiKeys.anthropic,
          firecrawl: apiKeys.firecrawl,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to plan trip",
        },
        { status: response.status }
      );
    }

    // Fetch photos for each destination if we have a trip plan
    if (data.success && data.data && data.data.destinations && apiKeys.googleMaps) {
      const destinations = data.data.destinations;

      // Fetch photos for each destination in parallel
      const photoPromises = destinations.map(async (dest: any) => {
        try {
          const photoResponse = await fetch(`${req.nextUrl.origin}/api/fetch-photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              placeName: dest.name,
              location: dest.coordinates,
              googleMapsApiKey: apiKeys.googleMaps,
            }),
          });

          const photoData = await photoResponse.json();
          return photoData.success ? photoData.photos : [];
        } catch (err) {
          console.error(`Error fetching photos for ${dest.name}:`, err);
          return [];
        }
      });

      const allPhotos = await Promise.all(photoPromises);

      // Add photos to each destination
      data.data.destinations = destinations.map((dest: any, index: number) => ({
        ...dest,
        photos: allPhotos[index] || [],
      }));
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error calling Zypher server:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to Zypher server. Make sure it's running on port 8000.",
      },
      { status: 500 }
    );
  }
}
