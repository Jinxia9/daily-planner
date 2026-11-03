import { createContext } from "react"

import type { AppPreferences } from "@/types/preferences"

export interface PreferencesContextValue {
  preferences: AppPreferences
  updatePreferences: (updates: Partial<AppPreferences>) => void
}

export const PreferencesContext =
  createContext<PreferencesContextValue | null>(null)
