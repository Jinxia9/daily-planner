import { useEffect, useState } from "react"

const TIME_REFRESH_INTERVAL_MS = 30_000

export function useCurrentDateTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, TIME_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  return now
}
