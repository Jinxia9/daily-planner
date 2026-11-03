import { useContext } from "react"

import { CalendarDataContext } from "@/contexts/calendar-data"

export function useCalendarData() {
  const context = useContext(CalendarDataContext)

  if (!context) {
    throw new Error(
      "useCalendarData must be used within CalendarDataProvider"
    )
  }

  return context
}
