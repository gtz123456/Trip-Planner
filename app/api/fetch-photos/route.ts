import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { placeName, location, googleMapsApiKey } = await req.json();

    if (!placeName || !googleMapsApiKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Fetching photos for:", placeName, "at", location);

    // Use Google Places API to find the place and get photos
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=place_id,name,photos&key=${googleMapsApiKey}${location ? `&locationbias=circle:5000@${location.lat},${location.lng}` : ""
      }`;

    console.log("Search URL:", searchUrl.replace(googleMapsApiKey, "***"));

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    console.log("Places API response status:", searchData.status);
    console.log("Places API response:", JSON.stringify(searchData, null, 2));

    if (searchData.status === "REQUEST_DENIED") {
      console.error("Places API request denied. Check if Places API is enabled and API key is correct.");
      return NextResponse.json({
        success: true,
        photos: [
          `https://source.unsplash.com/800x600/?${encodeURIComponent(
            placeName
          )}`,
        ],
        debug: "Places API not enabled or invalid API key",
      });
    }

    if (
      searchData.status !== "OK" ||
      !searchData.candidates ||
      searchData.candidates.length === 0
    ) {
      console.log("No place found, using fallback image");
      return NextResponse.json({
        success: true,
        photos: [
          `https://source.unsplash.com/800x600/?${encodeURIComponent(
            placeName
          )}`,
        ],
        debug: `Places API status: ${searchData.status}`,
      });
    }

    const place = searchData.candidates[0];
    console.log("Found place:", place.name, "Photos:", place.photos?.length || 0);

    // Get photo URLs if available
    let photoUrls: string[] = [];
    if (place.photos && place.photos.length > 0) {
      // Get up to 3 photos
      photoUrls = place.photos.slice(0, 3).map((photo: any) => {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${googleMapsApiKey}`;
        console.log("Generated photo URL:", url.replace(googleMapsApiKey, "***"));
        return url;
      });
    } else {
      console.log("No photos available for this place, using fallback");
      // Fallback to Unsplash if no photos in Google
      photoUrls = [
        `https://source.unsplash.com/800x600/?${encodeURIComponent(
          placeName
        )}`,
      ];
    }

    return NextResponse.json({
      success: true,
      photos: photoUrls,
      debug: `Found ${photoUrls.length} photos from ${place.photos?.length > 0 ? 'Google' : 'Unsplash'}`,
    });
  } catch (error: any) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch photos",
      },
      { status: 500 }
    );
  }
}
