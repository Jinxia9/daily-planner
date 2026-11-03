import { useEffect, useState } from "react"

import { getTodayInTimeZone } from "@/lib/date"

const DATE_REFRESH_INTERVAL_MS = 60_000

export function useCurrentDate() {
  const [today, setToday] = useState(() => getTodayInTimeZone())

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextToday = getTodayInTimeZone()
      setToday((currentToday) =>
        currentToday.getTime() === nextToday.getTime()
          ? currentToday
          : nextToday
      )
    }, DATE_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  return today
}
