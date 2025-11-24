"use client";

import { useState, useEffect } from "react";
import { Settings, Plane } from "lucide-react";
import { useApiKeys } from "@/hooks/useApiKeys";
import SettingsModal from "@/components/SettingsModal";
import TripPlannerForm from "@/components/TripPlannerForm";
import TripResults from "@/components/TripResults";
import { TripPlan } from "@/types/trip";

export default function Home() {
  const { apiKeys, saveApiKeys, hasAllKeys, isFirstTime, isLoaded } =
    useApiKeys();
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Show settings modal on first load if no API keys
  useEffect(() => {
    if (isLoaded && isFirstTime) {
      setShowSettings(true);
    }
  }, [isLoaded, isFirstTime]);

  const handlePlanTrip = async (userInput: string) => {
    if (!hasAllKeys()) {
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setTripPlan(null);

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          apiKeys,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setTripPlan(data.data);
      } else {
        setError(data.error || "Failed to plan trip. Please try again.");
      }
    } catch (err: any) {
      console.error("Error planning trip:", err);
      setError("An error occurred. Please check your API keys and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950/20">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKeys={apiKeys}
        onSave={saveApiKeys}
        isFirstTime={isFirstTime}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                AI Trip Planner
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Powered by Zypher
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!tripPlan ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <TripPlannerForm onSubmit={handlePlanTrip} isLoading={isLoading} />

            {/* Error Display */}
            {error && (
              <div className="mt-8 max-w-2xl w-full">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                  Creating your perfect trip...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setTripPlan(null)}
              className="mb-6 px-6 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-zinc-700 dark:text-zinc-300 font-medium"
            >
              ← Plan Another Trip
            </button>

            {/* Trip Results */}
            <TripResults tripPlan={tripPlan} googleMapsApiKey={apiKeys.googleMaps} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Built with Next.js, TailwindCSS, and powered by{" "}
            <a
              href="https://zypher.corespeed.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Zypher
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
