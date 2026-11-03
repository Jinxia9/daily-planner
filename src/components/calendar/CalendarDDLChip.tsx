import { Hourglass } from "lucide-react"

import { ACCENT_BACKGROUND } from "@/lib/accent"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"

interface CalendarDDLChipProps {
  category?: Category
  className?: string
  ddl: DDL
}

export function CalendarDDLChip({
  category,
  className,
  ddl,
}: CalendarDDLChipProps) {
  return (
    <span
      title={`${ddl.deadlineTime ?? ""} ${ddl.title}`.trim()}
      className={cn(
        "flex min-w-0 items-center gap-1 rounded-md bg-muted/75 px-1 py-0.5",
        className
      )}
    >
      <Hourglass
        aria-hidden="true"
        className="size-2 shrink-0 text-muted-foreground"
      />
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          ACCENT_BACKGROUND[category?.color ?? "red"]
        )}
      />
      <span className="truncate leading-none">{ddl.title}</span>
    </span>
  )
}
