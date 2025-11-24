// Type definitions for the Trip Planner app

export interface ApiKeys {
  googleMaps: string;
  anthropic: string;
  firecrawl: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price?: {
    amount: number;
    currency: string;
    description: string;
  };
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  category?: string;
  duration?: string;
}

export interface TripPlan {
  id: string;
  summary: string;
  totalBudget?: {
    amount: number;
    currency: string;
  };
  duration: {
    days: number;
    startDate?: string;
    endDate?: string;
  };
  destinations: Destination[];
  route?: {
    distance: string;
    duration: string;
    waypoints: Array<{ lat: number; lng: number }>;
  };
}

export interface TripPlanRequest {
  userInput: string;
  apiKeys: ApiKeys;
}

export interface TripPlanResponse {
  success: boolean;
  data?: TripPlan;
  error?: string;
}
