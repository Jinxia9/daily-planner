import { CalendarDays } from "lucide-react"
import { isSameMonth, parseISO } from "date-fns"
import { useMemo } from "react"

import { EventList } from "@/components/events/EventList"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import {
  formatDateKeyLabel,
  formatMonthTitle,
} from "@/lib/date"
import { groupEventsByDate } from "@/lib/events"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface MonthlyEventOverviewProps {
  categoryById: Map<string, Category>
  events: Event[]
  month: Date
  onSelectEvent: (event: Event) => void
}

export function MonthlyEventOverview({
  categoryById,
  events,
  month,
  onSelectEvent,
}: MonthlyEventOverviewProps) {
  const eventsByDate = useMemo(() => {
    const monthEvents = events
      .filter((event) => isSameMonth(parseISO(event.date), month))
      .sort(
        (first, second) =>
          first.date.localeCompare(second.date) ||
          (first.startTime ?? "99:99").localeCompare(
            second.startTime ?? "99:99"
          )
      )

    return groupEventsByDate(monthEvents)
  }, [events, month])
  const eventCount = [...eventsByDate.values()].reduce(
    (count, dayEvents) => count + dayEvents.length,
    0
  )
  const days = [...eventsByDate.entries()]

  return (
    <Card data-monthly-event-overview>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /month events
        </CardDescription>
        <CardTitle>本月日程</CardTitle>
        <CardAction>
          <Badge variant="outline">{eventCount} 项</Badge>
        </CardAction>
        <CardDescription>{formatMonthTitle(month)}</CardDescription>
      </CardHeader>

      <CardContent>
        {days.length === 0 ? (
          <Empty className="border border-dashed bg-muted/20 px-3 py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>本月还没有日程</EmptyTitle>
              <EmptyDescription>
                点击月历中的日期添加当天安排。
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {days.map(([date, dayEvents], index) => (
              <div key={date} data-month-event-group={date}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
                    {formatDateKeyLabel(date)}
                  </p>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {dayEvents.length} 项
                  </span>
                </div>
                <EventList
                  categoryById={categoryById}
                  events={dayEvents}
                  onSelectEvent={onSelectEvent}
                />
                {index < days.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
