"use client";

import { useEffect, useRef, useState } from "react";
import { Destination } from "@/types/trip";

interface GoogleMapProps {
  destinations: Destination[];
  apiKey: string;
}

// Declare google maps types
declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMap({ destinations, apiKey }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey || !mapRef.current || destinations.length === 0) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps script manually (only once)
        if (!window.google) {
          // Check if script already exists in DOM
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

          if (!existingScript) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
            script.async = true;
            script.defer = true;

            await new Promise<void>((resolve, reject) => {
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Failed to load Google Maps"));
              document.head.appendChild(script);
            });
          } else {
            // Wait for existing script to load
            await new Promise<void>((resolve) => {
              const checkGoogle = setInterval(() => {
                if (window.google) {
                  clearInterval(checkGoogle);
                  resolve();
                }
              }, 100);
            });
          }
        }

        const google = window.google;

        // Calculate bounds to fit all destinations
        const bounds = new google.maps.LatLngBounds();
        destinations.forEach((dest) => {
          bounds.extend(
            new google.maps.LatLng(
              dest.coordinates.lat,
              dest.coordinates.lng
            )
          );
        });

        // Create map
        const mapInstance = new google.maps.Map(mapRef.current!, {
          zoom: 12,
          center: destinations[0].coordinates,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Add markers for each destination
        destinations.forEach((dest, index) => {
          const marker = new google.maps.Marker({
            position: dest.coordinates,
            map: mapInstance,
            title: dest.name,
            label: {
              text: `${index + 1}`,
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
              scale: 15,
            },
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${dest.name}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">${dest.address}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(mapInstance, marker);
          });
        });

        // Draw route if there are multiple destinations
        if (destinations.length > 1) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#8b5cf6",
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          });

          const waypoints = destinations.slice(1, -1).map((dest) => ({
            location: dest.coordinates,
            stopover: true,
          }));

          directionsService.route(
            {
              origin: destinations[0].coordinates,
              destination: destinations[destinations.length - 1].coordinates,
              waypoints: waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result: any, status: any) => {
              if (status === "OK" && result) {
                directionsRenderer.setDirections(result);
              } else {
                // Silently fail if Directions API is not enabled
                // User can still see markers and map
                console.info("Note: Route drawing is unavailable. Enable the Directions API in Google Cloud Console for route visualization.");
              }
            }
          );
        }

        // Fit map to bounds
        mapInstance.fitBounds(bounds);

        setMap(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading map:", err);
        setError("Failed to load map. Please check your API key.");
        setIsLoading(false);
      }
    };

    initMap();
  }, [destinations, apiKey]);

  if (error) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xl">
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-zinc-900 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
