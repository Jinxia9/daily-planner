import { ChevronRight } from "lucide-react"

import { ACCENT_BACKGROUND } from "@/lib/accent"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface EventItemProps {
  category?: Category
  event: Event
  onSelect: (event: Event) => void
}

export function EventItem({ category, event, onSelect }: EventItemProps) {
  const categoryColor = category?.color ?? "red"

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      aria-label={`查看日程：${event.title}`}
      data-event-id={event.id}
      data-category-id={event.categoryId}
      className="group -mx-2 flex min-w-0 items-start gap-3 rounded-lg px-2 py-3 text-left outline-none transition-colors hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="w-11 shrink-0 pt-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
        {event.startTime ?? "全天"}
      </span>
      <span
        aria-hidden="true"
        data-category-color={categoryColor}
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          ACCENT_BACKGROUND[categoryColor]
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5">
          {event.title}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {category?.name ?? "未分类"}
          {event.endTime ? ` · 至 ${event.endTime}` : ""}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </button>
  )
}
