"use client";

import { useState, useEffect } from "react";
import { ApiKeys } from "@/types/trip";

const STORAGE_KEY = "trip_planner_api_keys";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    googleMaps: "",
    anthropic: "",
    firecrawl: "",
  });
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
        setIsFirstTime(false);
      } catch (error) {
        console.error("Error parsing stored API keys:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    setIsFirstTime(false);
  };

  const clearApiKeys = () => {
    setApiKeys({
      googleMaps: "",
      anthropic: "",
      firecrawl: "",
    });
    localStorage.removeItem(STORAGE_KEY);
    setIsFirstTime(true);
  };

  const hasAllKeys = () => {
    return !!(apiKeys.googleMaps && apiKeys.anthropic && apiKeys.firecrawl);
  };

  return {
    apiKeys,
    saveApiKeys,
    clearApiKeys,
    hasAllKeys,
    isFirstTime,
    isLoaded,
  };
}
