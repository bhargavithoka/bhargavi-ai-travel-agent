"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Zap, Volume2, VolumeX, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

type AnimationLevel = "none" | "reduced" | "full";

interface SettingsData {
  animations: AnimationLevel;
  soundEnabled: boolean;
  reducedMotion: boolean;
  backgroundEffects: boolean;
}

export function SettingsDropdown() {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<SettingsData>(settings);

  // Update local settings when context changes
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white"
      >
        <Settings size={18} />
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 backdrop-blur-xl border rounded-lg shadow-xl z-40 overflow-hidden bg-slate-900/95 border-white/20"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <Settings className="text-blue-400" size={20} />
                  <h3 className="text-lg font-semibold text-white">Settings</h3>
                </div>

                {/* Animations Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="text-purple-400" size={16} />
                    <h4 className="text-sm font-medium text-white">Animations</h4>
                  </div>

                  <div className="space-y-2">
                    {[
                      { value: "full" as AnimationLevel, label: "Full", desc: "All animations" },
                      { value: "reduced" as AnimationLevel, label: "Reduced", desc: "Subtle only" },
                      { value: "none" as AnimationLevel, label: "None", desc: "Disabled" }
                    ].map(({ value, label, desc }) => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="animations"
                          value={value}
                          checked={localSettings.animations === value}
                          onChange={(e) => handleSettingChange("animations", e.target.value as AnimationLevel)}
                          className="text-blue-400 focus:ring-blue-400"
                        />
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{label}</div>
                          <div className="text-white/60 text-xs">{desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Eye className="text-green-400" size={16} />
                      <div>
                        <div className="text-white text-sm font-medium">Background Effects</div>
                        <div className="text-white/60 text-xs">Sparkles & animations</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange("backgroundEffects", !localSettings.backgroundEffects)}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        localSettings.backgroundEffects ? "bg-blue-400" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          localSettings.backgroundEffects ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      {localSettings.soundEnabled ? (
                        <Volume2 className="text-green-400" size={16} />
                      ) : (
                        <VolumeX className="text-red-400" size={16} />
                      )}
                      <div>
                        <div className="text-white text-sm font-medium">Sound Effects</div>
                        <div className="text-white/60 text-xs">UI sounds</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange("soundEnabled", !localSettings.soundEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        localSettings.soundEnabled ? "bg-green-400" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          localSettings.soundEnabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <EyeOff className="text-orange-400" size={16} />
                      <div>
                        <div className="text-white text-sm font-medium">Reduced Motion</div>
                        <div className="text-white/60 text-xs">For accessibility</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange("reducedMotion", !localSettings.reducedMotion)}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        localSettings.reducedMotion ? "bg-orange-400" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          localSettings.reducedMotion ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}