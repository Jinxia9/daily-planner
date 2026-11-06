import { format, isSameDay, isSameMonth, isWeekend } from "date-fns"

import { formatLongDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"
import type { Event } from "@/types/event"

import { CalendarDDLChip } from "./CalendarDDLChip"
import { CalendarEventChip } from "./CalendarEventChip"

interface CalendarDayCellProps {
  date: Date
  month: Date
  categoryById: Map<string, Category>
  dayEvents: Event[]
  dayDDLs: DDL[]
  selectedDate: Date
  today: Date
  onSelectDate: (date: Date) => void
}

export function CalendarDayCell({
  date,
  month,
  categoryById,
  dayEvents,
  dayDDLs,
  selectedDate,
  today,
  onSelectDate,
}: CalendarDayCellProps) {
  const isToday = isSameDay(date, today)
  const isSelected = isSameDay(date, selectedDate)
  const isCurrentMonth = isSameMonth(date, month)
  const desktopEvents = dayEvents.slice(
    0,
    dayEvents.length > 0 ? 1 : 0
  )
  const desktopDDLs = dayDDLs.slice(
    0,
    desktopEvents.length > 0 ? 1 : 2
  )
  const desktopShown = desktopEvents.length + desktopDDLs.length
  const totalItems = dayEvents.length + dayDDLs.length

  return (
    <td className="min-w-0 border-0 align-top md:border-r md:border-b md:last:border-r-0">
      <button
        type="button"
        onClick={() => onSelectDate(date)}
        aria-label={`${formatLongDate(date)}${isToday ? "，今天" : ""}${totalItems > 0 ? `，有 ${totalItems} 项安排` : ""}`}
        aria-pressed={isSelected}
        aria-current={isToday ? "date" : undefined}
        className={cn(
          "flex min-h-[3.25rem] w-full min-w-0 flex-col p-1 text-left outline-none transition-colors hover:bg-muted/55 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:p-2 md:min-h-[7.1rem]",
          isWeekend(date) &&
            isCurrentMonth &&
            "md:bg-muted/30",
          !isCurrentMonth && "bg-background/60 text-muted-foreground/50",
          isSelected &&
            "md:bg-accent-pink/10 md:ring-1 md:ring-foreground/40 md:ring-inset md:hover:bg-accent-pink/15"
        )}
      >
        <span className="flex items-center justify-center gap-1 md:justify-between">
          <span
            data-calendar-day-number
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-medium tabular-nums",
              isToday && "bg-accent-red text-white",
              !isToday &&
                isSelected &&
                "bg-primary text-primary-foreground",
              !isToday &&
                !isSelected &&
                isCurrentMonth &&
                "text-foreground",
              !isToday &&
                !isSelected &&
                !isCurrentMonth &&
                "text-muted-foreground/45"
            )}
          >
            {format(date, "d")}
          </span>
          <span className="hidden items-center gap-1 md:flex">
            {isToday && (
              <span className="hidden font-mono text-[8px] tracking-[0.05em] text-destructive xl:block">
                今天
              </span>
            )}
          </span>
        </span>

        <span className="mt-auto flex justify-center pb-0.5 md:hidden">
          {totalItems > 0 && (
            <span
              data-calendar-activity-dot
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                isToday
                  ? "bg-accent-red"
                  : isSelected
                    ? "bg-primary"
                    : "bg-muted-foreground/55"
              )}
            />
          )}
        </span>

        <span className="mt-auto hidden min-w-0 flex-col gap-1 pt-2 md:flex">
          {desktopEvents.map((event) => (
            <CalendarEventChip
              key={event.id}
              event={event}
              category={categoryById.get(event.categoryId)}
              className="px-1.5 py-1 text-[10px] text-muted-foreground"
            />
          ))}
          {desktopDDLs.map((ddl) => (
            <CalendarDDLChip
              key={ddl.id}
              ddl={ddl}
              category={
                ddl.categoryId
                  ? categoryById.get(ddl.categoryId)
                  : undefined
              }
              className="px-1.5 py-1 text-[10px] text-muted-foreground"
            />
          ))}
          {totalItems > desktopShown && (
            <span className="px-1.5 font-mono text-[9px] text-muted-foreground">
              还有 {totalItems - desktopShown} 项
            </span>
          )}
        </span>
      </button>
    </td>
  )
}
