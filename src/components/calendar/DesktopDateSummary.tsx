import {
  formatMonthDay,
  formatWeekday,
  formatYear,
} from "@/lib/date"

interface DesktopDateSummaryProps {
  date: Date
}

export function DesktopDateSummary({
  date,
}: DesktopDateSummaryProps) {
  return (
    <div
      data-desktop-date-summary
      className="flex w-full items-start justify-between gap-3 lg:gap-5"
    >
      <div className="font-mono text-[10px] leading-relaxed tracking-[0.04em] text-muted-foreground">
        <p>{formatYear(date)}</p>
        <p>{formatWeekday(date)}</p>
      </div>
      <p className="text-lg leading-tight font-medium tracking-[-0.03em] sm:text-xl">
        {formatMonthDay(date)}
      </p>
    </div>
  )
}
