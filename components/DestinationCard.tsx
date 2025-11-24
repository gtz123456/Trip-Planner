"use client";

import { MapPin, Star, DollarSign, Clock } from "lucide-react";
import { Destination } from "@/types/trip";

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export default function DestinationCard({
  destination,
  index,
}: DestinationCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-xl transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
        {destination.photos && destination.photos.length > 0 ? (
          <img
            src={destination.photos[0]}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-lg shadow-lg">
          {index + 1}
        </div>
        {destination.category && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-sm font-medium">
            {destination.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          {destination.name}
        </h3>

        <div className="flex items-start gap-1 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{destination.address}</span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
          {destination.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {destination.rating !== undefined && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {destination.rating.toFixed(1)}
                </div>
                {destination.reviewCount && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {destination.reviewCount} reviews
                  </div>
                )}
              </div>
            </div>
          )}

          {destination.price && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {destination.price.currency} {destination.price.amount}
                </div>
                {destination.price.description && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                    {destination.price.description}
                  </div>
                )}
              </div>
            </div>
          )}

          {destination.duration && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {destination.duration}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
