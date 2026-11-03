import { ChevronRight, Hourglass } from "lucide-react"
import { Link } from "react-router-dom"

import { ACCENT_BACKGROUND } from "@/lib/accent"
import { formatDDLDeadline } from "@/lib/ddl"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"

interface CalendarDDLItemProps {
  category?: Category
  ddl: DDL
}

export function CalendarDDLItem({
  category,
  ddl,
}: CalendarDDLItemProps) {
  return (
    <Link
      to="/ddl"
      aria-label={`查看 DDL：${ddl.title}`}
      className="group -mx-2 flex min-w-0 items-start gap-3 rounded-lg px-2 py-3 outline-none transition-colors hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Hourglass
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          ACCENT_BACKGROUND[category?.color ?? "red"]
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5">
          {ddl.title}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {category?.name ?? "未分类"} ·{" "}
          {formatDDLDeadline(ddl.deadline, ddl.deadlineTime)}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}
