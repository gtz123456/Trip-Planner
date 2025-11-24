"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

interface TripPlannerFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "Plan a 3-day romantic getaway to Paris with museums and cafes, budget $2000",
  "Weekend adventure in Tokyo with tech shops and traditional temples",
  "5-day family trip to New York with kid-friendly attractions, budget $3500",
  "Week-long food tour in Italy visiting Rome, Florence, and Venice",
];

export default function TripPlannerForm({
  onSubmit,
  isLoading,
}: TripPlannerFormProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            AI-Powered Trip Planning
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Plan Your Perfect Trip
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Describe your dream vacation in natural language and let AI create a
          personalized itinerary with destinations, routes, and pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Plan a week-long adventure to Japan with traditional temples, modern tech districts, and authentic cuisine. Budget around $3000..."
              rows={5}
              disabled={isLoading}
              className="w-full px-6 py-5 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none focus:outline-none text-lg"
            />
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {input.length} characters
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Planning...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Plan Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {!isLoading && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Try these examples:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-sm text-zinc-700 dark:text-zinc-300 group"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{example}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
