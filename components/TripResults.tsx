"use client";

import { TripPlan } from "@/types/trip";
import GoogleMap from "./GoogleMap";
import DestinationCard from "./DestinationCard";
import { Calendar, DollarSign, MapPin, Navigation } from "lucide-react";

interface TripResultsProps {
  tripPlan: TripPlan;
  googleMapsApiKey: string;
}

export default function TripResults({
  tripPlan,
  googleMapsApiKey,
}: TripResultsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Trip Summary Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Trip Plan</h2>
        <p className="text-lg text-white/90 mb-6">{tripPlan.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-white/70">Duration</div>
                <div className="text-xl font-semibold">
                  {tripPlan.duration.days} Days
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          {tripPlan.totalBudget && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Budget</div>
                  <div className="text-xl font-semibold">
                    {tripPlan.totalBudget.currency} {tripPlan.totalBudget.amount}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Destinations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-white/70">Destinations</div>
                <div className="text-xl font-semibold">
                  {tripPlan.destinations.length} Stops
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Route Map
          </h3>
        </div>
        <GoogleMap
          destinations={tripPlan.destinations}
          apiKey={googleMapsApiKey}
        />
      </div>

      {/* Destinations List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Destinations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripPlan.destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Route Info */}
      {tripPlan.route && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Route Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Total Distance
                </div>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {tripPlan.route.distance}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Travel Time
                </div>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {tripPlan.route.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
