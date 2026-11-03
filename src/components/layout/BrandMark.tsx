import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

interface BrandMarkProps {
  compact?: boolean
  iconOnly?: boolean
}

export function BrandMark({
  compact = false,
  iconOnly = false,
}: BrandMarkProps) {
  return (
    <Link
      to="/calendar"
      aria-label="Daily Planner 首页"
      className="group inline-flex w-fit items-center gap-3 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 grid-cols-2 gap-1 rounded-[0.8rem] bg-primary p-2.5 transition-transform duration-200 group-hover:-rotate-2"
      >
        <span className="rounded-full bg-accent-red" />
        <span className="rounded-full bg-accent-pink" />
        <span className="rounded-full bg-accent-turquoise" />
        <span className="rounded-full bg-accent-yellow" />
      </span>

      {!iconOnly && (
        <span className="flex min-w-0 flex-col">
          <span className="text-[1.05rem] leading-none font-medium tracking-[-0.035em]">
            Daily Planner
          </span>
          <span
            className={cn(
              "mt-1.5 font-mono text-[9px] leading-none tracking-[0.08em] text-muted-foreground",
              compact && "hidden sm:block"
            )}
          >
            PERSONAL / CALENDAR
          </span>
        </span>
      )}
    </Link>
  )
}
