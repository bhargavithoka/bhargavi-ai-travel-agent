"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SettingsData {
  animations: "none" | "reduced" | "full";
  soundEnabled: boolean;
  reducedMotion: boolean;
  backgroundEffects: boolean;
}

interface SettingsContextType {
  settings: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  effectiveTheme: "dark"; // Fixed to dark
  shouldReduceMotion: boolean;
  shouldShowAnimations: boolean;
  shouldShowBackgroundEffects: boolean;
}

const defaultSettings: SettingsData = {
  animations: "full",
  soundEnabled: true,
  reducedMotion: false,
  backgroundEffects: true
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  // Set theme to dark by default
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
  }, []);

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("userSettings", JSON.stringify(updated));
      return updated;
    });
  };

  // Computed values
  const shouldReduceMotion = settings.reducedMotion;
  const shouldShowAnimations = settings.animations === "full";
  const shouldShowBackgroundEffects = settings.backgroundEffects;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        effectiveTheme: "dark", // Fixed to dark
        shouldReduceMotion,
        shouldShowAnimations,
        shouldShowBackgroundEffects
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}