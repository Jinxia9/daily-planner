import { chunk } from "@/lib/utils"
import { formatDateKey, WEEKDAY_LABELS } from "@/lib/date"
import { getEventsForDate } from "@/lib/events"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

import { CalendarDayCell } from "./CalendarDayCell"

interface CalendarGridProps {
  days: Date[]
  month: Date
  categoryById: Map<string, Category>
  eventsByDate: Map<string, Event[]>
  selectedDate: Date
  today: Date
  onSelectDate: (date: Date) => void
}

const WEEKS_PER_CALENDAR = 7

export function CalendarGrid({
  days,
  month,
  categoryById,
  eventsByDate,
  selectedDate,
  today,
  onSelectDate,
}: CalendarGridProps) {
  const weeks = chunk(days, WEEKS_PER_CALENDAR)

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <table className="w-full min-w-0 table-fixed border-collapse">
        <caption className="sr-only">月历日程预览</caption>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label, index) => (
              <th
                key={label}
                scope="col"
                className="border-r border-b bg-muted/50 py-2 text-center font-mono text-[9px] font-normal tracking-[0.08em] text-muted-foreground last:border-r-0 sm:text-[10px]"
              >
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">周{label}</span>
                <span className="sr-only">
                  {index === 5 || index === 6 ? "，周末" : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={formatDateKey(week[0])}>
              {week.map((date) => (
                <CalendarDayCell
                  key={formatDateKey(date)}
                  date={date}
                  month={month}
                  categoryById={categoryById}
                  dayEvents={getEventsForDate(eventsByDate, date)}
                  selectedDate={selectedDate}
                  today={today}
                  onSelectDate={onSelectDate}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
