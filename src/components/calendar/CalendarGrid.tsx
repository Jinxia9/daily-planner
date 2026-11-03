import { chunk } from "@/lib/utils"
import {
  formatDateKey,
  getCalendarWeekNumber,
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_SUNDAY_FIRST,
} from "@/lib/date"
import { getEventsForDate } from "@/lib/events"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

import { CalendarDayCell } from "./CalendarDayCell"

interface CalendarGridProps {
  days: Date[]
  month: Date
  categoryById: Map<string, Category>
  eventsByDate: Map<string, Event[]>
  showWeekNumbers: boolean
  selectedDate: Date
  today: Date
  weekStartsOnMonday: boolean
  onSelectDate: (date: Date) => void
}

const WEEKS_PER_CALENDAR = 7

export function CalendarGrid({
  days,
  month,
  categoryById,
  eventsByDate,
  showWeekNumbers,
  selectedDate,
  today,
  weekStartsOnMonday,
  onSelectDate,
}: CalendarGridProps) {
  const weeks = chunk(days, WEEKS_PER_CALENDAR)
  const weekdayLabels = weekStartsOnMonday
    ? WEEKDAY_LABELS
    : WEEKDAY_LABELS_SUNDAY_FIRST

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <table className="w-full min-w-0 table-fixed border-collapse">
        <colgroup>
          {showWeekNumbers && <col className="w-7 sm:w-10" />}
          {Array.from({ length: WEEKS_PER_CALENDAR }, (_, index) => (
            <col key={index} />
          ))}
        </colgroup>
        <caption className="sr-only">月历日程预览</caption>
        <thead>
          <tr>
            {showWeekNumbers && (
              <th
                scope="col"
                className="border-r border-b bg-muted/50 py-2 text-center font-mono text-[8px] font-normal text-muted-foreground sm:text-[9px]"
              >
                周
              </th>
            )}
            {weekdayLabels.map((label, index) => (
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
              {showWeekNumbers && (
                <th
                  scope="row"
                  className="border-r border-b bg-muted/20 p-1 text-center align-middle font-mono text-[8px] font-normal text-muted-foreground sm:text-[9px]"
                >
                  {getCalendarWeekNumber(
                    week[0],
                    weekStartsOnMonday
                  )}
                </th>
              )}
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
