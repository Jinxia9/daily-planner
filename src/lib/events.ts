import { formatDateKey, formatTimeValue } from "@/lib/date"
import type { Event } from "@/types/event"

export const EMPTY_EVENTS: Event[] = []

function compareEvents(first: Event, second: Event) {
  const timeComparison = (first.startTime ?? "99:99").localeCompare(
    second.startTime ?? "99:99"
  )

  return timeComparison || first.title.localeCompare(second.title, "zh-CN")
}

export function groupEventsByDate(events: Event[]) {
  const eventsByDate = new Map<string, Event[]>()

  for (const event of events) {
    const dayEvents = eventsByDate.get(event.date)

    if (dayEvents) {
      dayEvents.push(event)
    } else {
      eventsByDate.set(event.date, [event])
    }
  }

  for (const dayEvents of eventsByDate.values()) {
    dayEvents.sort(compareEvents)
  }

  return eventsByDate
}

export function getEventsForDate(
  eventsByDate: Map<string, Event[]>,
  date: Date
) {
  return eventsByDate.get(formatDateKey(date)) ?? EMPTY_EVENTS
}

export function getEventTimeLabel(
  event: Event,
  use24HourTime = true
): string {
  if (event.startTime && event.endTime) {
    return `${formatTimeValue(event.startTime, use24HourTime)} – ${formatTimeValue(event.endTime, use24HourTime)}`
  }

  return event.startTime
    ? formatTimeValue(event.startTime, use24HourTime)
    : "全天"
}
