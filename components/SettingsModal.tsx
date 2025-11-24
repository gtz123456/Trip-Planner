"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Key, Check } from "lucide-react";
import { ApiKeys } from "@/types/trip";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  isFirstTime?: boolean;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKeys,
  onSave,
  isFirstTime = false,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<ApiKeys>(apiKeys);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(apiKeys);
  }, [apiKeys]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      if (!isFirstTime) {
        onClose();
      }
    }, 500);
  };

  const isValid = formData.googleMaps && formData.anthropic && formData.firecrawl;

  return (
    <Dialog.Root open={isOpen} onOpenChange={isFirstTime ? undefined : onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 animate-scaleIn">
          {!isFirstTime && (
            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </Dialog.Close>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <Dialog.Title className="text-2xl font-bold text-zinc-900 dark:text-white">
                {isFirstTime ? "Welcome! Set Up Your API Keys" : "API Settings"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {isFirstTime
                  ? "Configure your API keys to start planning trips"
                  : "Update your API keys"}
              </Dialog.Description>
            </div>
          </div>

          <div className="space-y-5">
            {/* Google Maps API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Google Maps API Key
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.googleMaps}
                  onChange={(e) =>
                    setFormData({ ...formData, googleMaps: e.target.value })
                  }
                  placeholder="Enter your Google Maps API key"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                />
                {formData.googleMaps && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                Get API key →
              </a>
            </div>

            {/* Anthropic API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Anthropic API Key
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.anthropic}
                  onChange={(e) =>
                    setFormData({ ...formData, anthropic: e.target.value })
                  }
                  placeholder="Enter your Anthropic API key"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                />
                {formData.anthropic && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                Get API key →
              </a>
            </div>

            {/* Firecrawl API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Firecrawl API Key
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.firecrawl}
                  onChange={(e) =>
                    setFormData({ ...formData, firecrawl: e.target.value })
                  }
                  placeholder="Enter your Firecrawl API key"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                />
                {formData.firecrawl && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              <a
                href="https://firecrawl.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                Get API key →
              </a>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {!isFirstTime && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSaving ? "Saving..." : isFirstTime ? "Get Started" : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
