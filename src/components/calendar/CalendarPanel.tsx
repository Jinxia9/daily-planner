import { CalendarCheck2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { CategoryFilter } from "@/components/calendar/CategoryFilter"
import { formatMonthTitle, getCalendarDays } from "@/lib/date"
import { usePreferences } from "@/hooks/usePreferences"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"
import type { Event } from "@/types/event"

interface CalendarPanelProps {
  categoryById: Map<string, Category>
  categories: Category[]
  ddlsByDate: Map<string, DDL[]>
  eventsByDate: Map<string, Event[]>
  month: Date
  selectedDate: Date
  today: Date
  onNextMonth: () => void
  onCategoryFilterChange: (categoryIds: string[]) => void
  onPreviousMonth: () => void
  onSelectDate: (date: Date) => void
  onToday: () => void
  selectedCategoryIds: string[]
}

export function CalendarPanel({
  categoryById,
  categories,
  ddlsByDate,
  eventsByDate,
  month,
  selectedDate,
  today,
  onNextMonth,
  onCategoryFilterChange,
  onPreviousMonth,
  onSelectDate,
  onToday,
  selectedCategoryIds,
}: CalendarPanelProps) {
  const { preferences } = usePreferences()
  const days = getCalendarDays(month, preferences.weekStartsOnMonday)

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <CardHeader className="gap-2 border-b py-4 sm:gap-4 sm:py-6">
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /month view
        </CardDescription>
        <div className="flex items-end justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <CardTitle className="text-lg tracking-[-0.03em] sm:text-2xl">
              {formatMonthTitle(month)}
            </CardTitle>
            <p className="mt-2 hidden text-xs text-muted-foreground sm:block">
              点击任意日期查看当天安排。
            </p>
          </div>

          <div
            role="group"
            aria-label="月份导航"
            className="flex shrink-0 items-center gap-1.5"
          >
            <Button
              variant="outline"
              size="sm"
              className="size-8 px-0 sm:h-10 sm:w-auto sm:px-2.5"
              onClick={onToday}
              aria-label="今天"
            >
              <CalendarCheck2 data-icon="inline-start" />
              <span className="hidden sm:inline">今天</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 shrink-0 sm:size-10"
              aria-label="上一个月"
              onClick={onPreviousMonth}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 shrink-0 sm:size-10"
              aria-label="下一个月"
              onClick={onNextMonth}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b px-3 py-2.5 sm:px-4 sm:py-3">
          <CategoryFilter
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onValueChange={onCategoryFilterChange}
          />
        </div>
        <CalendarGrid
          days={days}
          ddlsByDate={ddlsByDate}
          month={month}
          categoryById={categoryById}
          eventsByDate={eventsByDate}
          selectedDate={selectedDate}
          today={today}
          showWeekNumbers={preferences.showWeekNumbers}
          weekStartsOnMonday={preferences.weekStartsOnMonday}
          onSelectDate={onSelectDate}
        />
      </CardContent>
    </Card>
  )
}
