import { ACCENT_BACKGROUND } from "@/lib/accent"
import { formatTimeValue } from "@/lib/date"
import { usePreferences } from "@/hooks/usePreferences"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface CalendarEventChipProps {
  category?: Category
  event: Event
  className?: string
}

export function CalendarEventChip({
  category,
  event,
  className,
}: CalendarEventChipProps) {
  const { preferences } = usePreferences()
  const categoryColor = category?.color ?? "red"
  const timeLabel = event.startTime
    ? `${formatTimeValue(event.startTime, preferences.use24HourTime)} `
    : ""

  return (
    <span
      title={`${timeLabel}${event.title}`}
      className={cn(
        "flex min-w-0 items-center gap-1 rounded-md bg-muted/75 px-1 py-0.5",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          ACCENT_BACKGROUND[categoryColor]
        )}
      />
      <span className="truncate leading-none">{event.title}</span>
    </span>
  )
}
