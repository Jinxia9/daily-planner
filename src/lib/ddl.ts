import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"

import {
  APP_TIME_ZONE,
  getDaysUntil,
  getTodayInTimeZone,
  isValidTimeValue,
} from "@/lib/date"
import type { DDL, DDLFilter } from "@/types/ddl"
import { formatDateKey } from "@/lib/date"

export type DDLTimeState =
  | "completed"
  | "overdue"
  | "today"
  | "due-soon"
  | "upcoming"

export interface DDLTimeInfo {
  daysRemaining: number
  label: string
  state: DDLTimeState
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000
const MINUTE_IN_MILLISECONDS = 60 * 1000

function getDeadlineInstant(
  deadline: string,
  deadlineTime?: string
): Date {
  const normalizedTime =
    deadlineTime && isValidTimeValue(deadlineTime)
      ? `${deadlineTime}:00`
      : "23:59:59"
  return new Date(`${deadline}T${normalizedTime}+08:00`)
}

function formatElapsedTime(milliseconds: number, prefix: string): string {
  if (milliseconds < HOUR_IN_MILLISECONDS) {
    const minutes = Math.max(
      1,
      Math.ceil(milliseconds / MINUTE_IN_MILLISECONDS)
    )
    return `${prefix} ${minutes} 分钟`
  }

  if (milliseconds < DAY_IN_MILLISECONDS) {
    const hours = Math.ceil(milliseconds / HOUR_IN_MILLISECONDS)
    return `${prefix} ${hours} 小时`
  }

  const days = Math.ceil(milliseconds / DAY_IN_MILLISECONDS)
  return `${prefix} ${days} 天`
}

export function getDDLTimeInfo(
  ddl: DDL,
  now: Date
): DDLTimeInfo {
  const today = getTodayInTimeZone(APP_TIME_ZONE, now)
  const daysRemaining = getDaysUntil(ddl.deadline, today)

  if (ddl.completed) {
    return {
      daysRemaining,
      label: "已完成",
      state: "completed",
    }
  }

  if (ddl.deadlineTime) {
    const millisecondsRemaining =
      getDeadlineInstant(ddl.deadline, ddl.deadlineTime).getTime() -
      now.getTime()

    if (millisecondsRemaining <= 0) {
      return {
        daysRemaining,
        label: formatElapsedTime(
          Math.abs(millisecondsRemaining),
          "已逾期"
        ),
        state: "overdue",
      }
    }

    return {
      daysRemaining,
      label: formatElapsedTime(millisecondsRemaining, "剩余"),
      state:
        daysRemaining <= 0
          ? "today"
          : millisecondsRemaining <= 3 * DAY_IN_MILLISECONDS
            ? "due-soon"
            : "upcoming",
    }
  }

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      label: `已逾期 ${Math.abs(daysRemaining)} 天`,
      state: "overdue",
    }
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining,
      label: "今天截止",
      state: "today",
    }
  }

  return {
    daysRemaining,
    label: `剩余 ${daysRemaining} 天`,
    state: daysRemaining <= 3 ? "due-soon" : "upcoming",
  }
}

export function matchesDDLFilter(
  ddl: DDL,
  filter: DDLFilter,
  now: Date
): boolean {
  const timeInfo = getDDLTimeInfo(ddl, now)

  switch (filter) {
    case "active":
      return !ddl.completed
    case "due-soon":
      return timeInfo.state === "today" || timeInfo.state === "due-soon"
    case "overdue":
      return timeInfo.state === "overdue"
    case "completed":
      return ddl.completed
    default:
      return true
  }
}

export function sortDDLsByDeadline(ddls: DDL[]): DDL[] {
  return [...ddls].sort((first, second) => {
    const deadlineComparison = first.deadline.localeCompare(second.deadline)
    const timeComparison = (first.deadlineTime ?? "23:59").localeCompare(
      second.deadlineTime ?? "23:59"
    )
    return (
      deadlineComparison ||
      timeComparison ||
      first.title.localeCompare(second.title, "zh-CN")
    )
  })
}

export function groupDDLsByDate(ddls: DDL[]) {
  const ddlsByDate = new Map<string, DDL[]>()

  for (const ddl of ddls) {
    const dayDDLs = ddlsByDate.get(ddl.deadline)
    if (dayDDLs) {
      dayDDLs.push(ddl)
    } else {
      ddlsByDate.set(ddl.deadline, [ddl])
    }
  }

  for (const [date, dayDDLs] of ddlsByDate) {
    ddlsByDate.set(date, sortDDLsByDeadline(dayDDLs))
  }

  return ddlsByDate
}

export function getDDLsForDate(
  ddlsByDate: Map<string, DDL[]>,
  date: Date
): DDL[] {
  return ddlsByDate.get(formatDateKey(date)) ?? []
}

export function formatDDLDeadline(
  deadline: string,
  deadlineTime?: string
): string {
  const dateLabel = format(parseISO(deadline), "yyyy年M月d日", {
    locale: zhCN,
  })
  return deadlineTime ? `${dateLabel} ${deadlineTime}` : dateLabel
}
