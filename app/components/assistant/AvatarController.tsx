"use client";

import { useEffect, useState } from "react";
import type { AvatarState } from "./types";

export function useAvatarController(
  activeTab: string,
  searchText: string
) {
  const [state, setState] = useState<AvatarState>("walk-in");

  // Walk in once on load
  useEffect(() => {
    const t = setTimeout(() => setState("idle"), 3500);
    return () => clearTimeout(t);
  }, []);

  // Search reaction
  useEffect(() => {
    if (searchText.length > 0) {
      setState("thinking");
    } else {
      setState("idle");
    }
  }, [searchText]);

  // Tab reactions
  useEffect(() => {
    if (activeTab === "Budget") setState("writing");
    if (activeTab === "Trip Planner") setState("thinking");
  }, [activeTab]);

  return { state };
}
