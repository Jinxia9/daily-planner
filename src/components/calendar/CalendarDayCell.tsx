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
  const mobileEvents = dayEvents.slice(0, dayEvents.length > 0 ? 1 : 0)
  const mobileDDLs = dayDDLs.slice(
    0,
    mobileEvents.length > 0 ? 1 : 2
  )
  const desktopEvents = dayEvents.slice(
    0,
    dayEvents.length > 0 ? 1 : 0
  )
  const desktopDDLs = dayDDLs.slice(
    0,
    desktopEvents.length > 0 ? 1 : 2
  )
  const mobileShown = mobileEvents.length + mobileDDLs.length
  const desktopShown = desktopEvents.length + desktopDDLs.length
  const totalItems = dayEvents.length + dayDDLs.length

  return (
    <td className="min-w-0 border-r border-b align-top last:border-r-0">
      <button
        type="button"
        onClick={() => onSelectDate(date)}
        aria-label={`${formatLongDate(date)}${isToday ? "，今天" : ""}`}
        aria-pressed={isSelected}
        aria-current={isToday ? "date" : undefined}
        className={cn(
          "flex min-h-[5.4rem] w-full min-w-0 flex-col p-1.5 text-left outline-none transition-colors hover:bg-muted/55 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:min-h-[6.25rem] sm:p-2 md:min-h-[7.1rem]",
          isWeekend(date) && isCurrentMonth && "bg-muted/30",
          !isCurrentMonth && "bg-background/60 text-muted-foreground/50",
          isSelected &&
            "bg-accent-pink/10 ring-1 ring-foreground/40 ring-inset hover:bg-accent-pink/15"
        )}
      >
        <span className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-[11px] font-medium tabular-nums sm:size-7 sm:text-xs",
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
          <span className="flex items-center gap-1">
            {isSelected && (
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
            )}
            {isToday && (
              <span className="hidden font-mono text-[8px] tracking-[0.05em] text-destructive xl:block">
                今天
              </span>
            )}
          </span>
        </span>

        <span className="mt-auto flex min-w-0 flex-col gap-0.5 pt-2">
          <span className="flex min-w-0 flex-col gap-0.5 md:hidden">
            {mobileEvents.map((event) => (
              <CalendarEventChip
                key={event.id}
                event={event}
                category={categoryById.get(event.categoryId)}
                className="px-0.5 text-[8px]"
              />
            ))}
            {mobileDDLs.map((ddl) => (
              <CalendarDDLChip
                key={ddl.id}
                ddl={ddl}
                category={
                  ddl.categoryId
                    ? categoryById.get(ddl.categoryId)
                    : undefined
                }
                className="px-0.5 text-[8px]"
              />
            ))}
            {totalItems > mobileShown && (
              <span className="pl-0.5 font-mono text-[8px] text-muted-foreground">
                +{totalItems - mobileShown}
              </span>
            )}
          </span>

          <span className="hidden min-w-0 flex-col gap-1 md:flex">
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
        </span>
      </button>
    </td>
  )
}
