import {
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getDaysInMonth,
  isValid,
  parseISO,
  setDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { zhCN } from "date-fns/locale"

export const APP_TIME_ZONE = "Asia/Shanghai"
export const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"]

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function getTodayInTimeZone(
  timeZone = APP_TIME_ZONE,
  now = new Date()
): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  )

  return new Date(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day)
  )
}

export function formatMonthTitle(month: Date): string {
  return format(month, "yyyy年M月", { locale: zhCN })
}

export function formatLongDate(date: Date): string {
  return format(date, "M月d日 EEEE", { locale: zhCN })
}

export function formatMonthDay(date: Date): string {
  return format(date, "M月d日", { locale: zhCN })
}

export function formatWeekday(date: Date): string {
  return format(date, "EEEE", { locale: zhCN })
}

export function formatDayNumber(date: Date): string {
  return format(date, "dd")
}

export function formatYear(date: Date): string {
  return format(date, "yyyy")
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = parseISO(value)
  return isValid(date) && formatDateKey(date) === value
}

export function isValidTimeValue(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function formatDateKeyLabel(value: string): string {
  return format(parseISO(value), "yyyy年M月d日 EEEE", { locale: zhCN })
}

export function formatTimestamp(value: string): string {
  return format(parseISO(value), "M月d日 HH:mm", { locale: zhCN })
}

export function getCalendarDays(month: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days: Date[] = []

  for (
    let cursor = gridStart;
    cursor <= gridEnd;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  ) {
    days.push(cursor)
  }

  return days
}

export function getDateInMonthClamped(
  sourceDate: Date,
  targetMonth: Date
): Date {
  const targetDay = Math.min(getDate(sourceDate), getDaysInMonth(targetMonth))
  return setDate(startOfMonth(targetMonth), targetDay)
}

export function getDaysUntil(date: string, now = new Date()): number {
  return differenceInCalendarDays(parseISO(date), startOfDay(now))
}

export function getDeadlineLabel(date: string, now = new Date()): string {
  const days = getDaysUntil(date, now)

  if (days < 0) {
    return `已逾期 ${Math.abs(days)} 天`
  }

  if (days === 0) {
    return "今天截止"
  }

  if (days === 1) {
    return "明天截止"
  }

  return `还有 ${days} 天`
}
