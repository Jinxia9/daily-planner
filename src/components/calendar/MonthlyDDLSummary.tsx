import { CalendarClock, ChevronRight, Hourglass } from "lucide-react"
import { isSameMonth, parseISO } from "date-fns"
import { useMemo } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCalendarData } from "@/hooks/useCalendarData"
import { useCurrentDateTime } from "@/hooks/useCurrentDateTime"
import {
  APP_TIME_ZONE,
  getTodayInTimeZone,
} from "@/lib/date"
import {
  formatDDLDeadline,
  getDDLTimeInfo,
  sortDDLsByDeadline,
} from "@/lib/ddl"
import { cn } from "@/lib/utils"

interface MonthlyDDLSummaryProps {
  month: Date
}

export function MonthlyDDLSummary({
  month,
}: MonthlyDDLSummaryProps) {
  const { ddls } = useCalendarData()
  const now = useCurrentDateTime()
  const today = getTodayInTimeZone(APP_TIME_ZONE, now)
  const monthlyDDLs = useMemo(
    () =>
      sortDDLsByDeadline(
        ddls.filter((ddl) => isSameMonth(parseISO(ddl.deadline), month))
      ),
    [ddls, month]
  )
  const isCurrentMonth = isSameMonth(month, today)

  return (
    <Card data-monthly-ddl-summary>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /monthly ddl
        </CardDescription>
        <CardTitle className="text-base">
          {isCurrentMonth ? "本月 DDL" : `${month.getMonth() + 1}月 DDL`}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">{monthlyDDLs.length} 项</Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        {monthlyDDLs.length === 0 ? (
          <Empty className="border border-dashed bg-muted/20 px-3 py-5">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarClock aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>本月没有 DDL</EmptyTitle>
              <EmptyDescription>
                切换到有截止日期的月份查看。
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="flex flex-col">
            {monthlyDDLs.map((ddl, index) => {
              const timeInfo = getDDLTimeInfo(ddl, now)
              return (
                <li
                  key={ddl.id}
                  data-monthly-ddl-id={ddl.id}
                  className={cn(
                    "flex flex-col gap-2 py-3",
                    index > 0 && "border-t",
                    index === 0 && "pt-0",
                    index === monthlyDDLs.length - 1 && "pb-0"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {ddl.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatDDLDeadline(
                          ddl.deadline,
                          ddl.deadlineTime
                        )}
                      </p>
                    </div>
                    <span
                      data-monthly-ddl-time-label
                      className={cn(
                        "shrink-0 text-right text-xl leading-tight font-medium tracking-[-0.03em] whitespace-nowrap sm:text-2xl",
                        timeInfo.state === "overdue"
                          ? "text-destructive"
                          : timeInfo.state === "due-soon" ||
                              timeInfo.state === "today"
                            ? "text-status-warning"
                            : "text-muted-foreground"
                      )}
                    >
                      {timeInfo.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>

      <CardFooter>
        <Link
          to="/ddl"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full justify-between",
          })}
        >
          <span className="flex items-center gap-2">
            <Hourglass data-icon="inline-start" />
            管理全部 DDL
          </span>
          <ChevronRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  )
}
