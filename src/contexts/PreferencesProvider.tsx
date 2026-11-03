import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  PreferencesContext,
  type PreferencesContextValue,
} from "@/contexts/preferences"
import type { AppPreferences } from "@/types/preferences"

const PREFERENCES_STORAGE_KEY = "daily-planner:preferences:v1"

const DEFAULT_PREFERENCES: AppPreferences = {
  showWeekNumbers: false,
  use24HourTime: true,
  weekStartsOnMonday: true,
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

function readStoredPreferences(): AppPreferences {
  try {
    const rawValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!rawValue) {
      return DEFAULT_PREFERENCES
    }

    const storedValue = JSON.parse(rawValue) as Partial<AppPreferences>
    return {
      showWeekNumbers: isBoolean(storedValue.showWeekNumbers)
        ? storedValue.showWeekNumbers
        : DEFAULT_PREFERENCES.showWeekNumbers,
      use24HourTime: isBoolean(storedValue.use24HourTime)
        ? storedValue.use24HourTime
        : DEFAULT_PREFERENCES.use24HourTime,
      weekStartsOnMonday: isBoolean(storedValue.weekStartsOnMonday)
        ? storedValue.weekStartsOnMonday
        : DEFAULT_PREFERENCES.weekStartsOnMonday,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

interface PreferencesProviderProps {
  children: ReactNode
}

export function PreferencesProvider({
  children,
}: PreferencesProviderProps) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(readStoredPreferences)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences)
      )
    } catch {
      // Preferences remain usable for the current session when storage fails.
    }
  }, [preferences])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === PREFERENCES_STORAGE_KEY) {
        setPreferences(readStoredPreferences())
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const updatePreferences = useCallback(
    (updates: Partial<AppPreferences>) => {
      setPreferences((current) => ({ ...current, ...updates }))
    },
    []
  )

  const value = useMemo<PreferencesContextValue>(
    () => ({ preferences, updatePreferences }),
    [preferences, updatePreferences]
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}
