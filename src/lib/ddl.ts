import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"

import { getDaysUntil } from "@/lib/date"
import type { DDL, DDLFilter } from "@/types/ddl"

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

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(value)))
}

export function getDDLTimeInfo(ddl: DDL, today: Date): DDLTimeInfo {
  if (ddl.completed) {
    return {
      daysRemaining: getDaysUntil(ddl.deadline, today),
      label: "已完成",
      state: "completed",
    }
  }

  const daysRemaining = getDaysUntil(ddl.deadline, today)

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
  today: Date
): boolean {
  const timeInfo = getDDLTimeInfo(ddl, today)

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
    return (
      deadlineComparison || first.title.localeCompare(second.title, "zh-CN")
    )
  })
}

export function formatDDLDeadline(deadline: string): string {
  return format(parseISO(deadline), "yyyy年M月d日", { locale: zhCN })
}
