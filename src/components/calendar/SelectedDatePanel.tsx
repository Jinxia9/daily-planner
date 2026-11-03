import { CalendarPlus, Plus } from "lucide-react"
import { isSameDay } from "date-fns"

import { CalendarDDLItem } from "@/components/calendar/CalendarDDLItem"
import { EventList } from "@/components/events/EventList"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  formatDayNumber,
  formatMonthDay,
  formatWeekday,
  formatYear,
} from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"
import type { Event } from "@/types/event"

interface SelectedDatePanelProps {
  canAddEvent: boolean
  categoryById: Map<string, Category>
  ddls: DDL[]
  events: Event[]
  onQuickAdd: () => void
  onSelectEvent: (event: Event) => void
  selectedDate: Date
  today: Date
}

export function SelectedDatePanel({
  canAddEvent,
  categoryById,
  ddls,
  events,
  onQuickAdd,
  onSelectEvent,
  selectedDate,
  today,
}: SelectedDatePanelProps) {
  const isToday = isSameDay(selectedDate, today)
  const totalItems = events.length + ddls.length

  return (
    <Card
      id="selected-date-details"
      className="scroll-mt-20 overflow-hidden"
    >
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /selected day
        </CardDescription>
        <CardTitle>{formatMonthDay(selectedDate)}</CardTitle>
        <CardAction>
          <Badge variant="outline">
            {isToday ? "今天" : `${totalItems} 项`}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4 border-b pb-5">
          <div>
            <span className="block font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
              {isToday ? "TODAY / 今天" : "SELECTED / 已选"}
            </span>
            <span
              className={cn(
                "mt-2 block text-5xl leading-none font-medium tracking-[-0.04em]",
                isToday ? "text-accent-red" : "text-foreground"
              )}
            >
              {formatDayNumber(selectedDate)}
            </span>
          </div>
          <span className="text-right font-mono text-[10px] leading-relaxed tracking-[0.04em] text-muted-foreground">
            {formatYear(selectedDate)}
            <br />
            {formatWeekday(selectedDate)}
          </span>
        </div>

        {totalItems === 0 ? (
          <Empty className="border border-dashed bg-muted/20 px-4 py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarPlus aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>这天还没有安排</EmptyTitle>
              <EmptyDescription>
                留白也很好，或者为这一天加一件重要的小事。
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                size="sm"
                onClick={onQuickAdd}
                disabled={!canAddEvent}
                title={canAddEvent ? undefined : "请先在设置中创建分类"}
              >
                <Plus data-icon="inline-start" />
                添加日程
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-5">
            {events.length > 0 && (
              <EventList
                categoryById={categoryById}
                events={events}
                onSelectEvent={onSelectEvent}
              />
            )}
            {ddls.length > 0 && (
              <div className="border-t pt-4">
                <p className="mb-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
                  /DDL
                </p>
                <div className="flex flex-col">
                  {ddls.map((ddl) => (
                    <CalendarDDLItem
                      key={ddl.id}
                      ddl={ddl}
                      category={
                        ddl.categoryId
                          ? categoryById.get(ddl.categoryId)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {totalItems > 0 && (
        <CardFooter>
          <Button
            size="sm"
            className="w-full"
            onClick={onQuickAdd}
            disabled={!canAddEvent}
            title={canAddEvent ? undefined : "请先在设置中创建分类"}
          >
            <Plus data-icon="inline-start" />
            添加日程
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
