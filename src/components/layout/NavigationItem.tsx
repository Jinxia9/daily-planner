import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import type { AppNavigationItem } from "@/types/navigation"

interface NavigationItemProps {
  highlighted?: boolean
  iconOnly?: boolean
  item: AppNavigationItem
  variant: "sidebar" | "tablet" | "mobile"
}

export function NavigationItem({
  highlighted = false,
  iconOnly = false,
  item,
  variant,
}: NavigationItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      className={() =>
        cn(
          "group outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          variant === "sidebar"
            ? "relative z-10 flex size-14 items-center justify-center rounded-full transition-colors"
            : variant === "tablet"
              ? "relative z-10 flex min-h-16 w-full items-center justify-center rounded-full transition-colors active:bg-muted"
              : "relative z-10 flex min-h-14 flex-col items-center justify-center rounded-full px-2 transition-colors active:bg-muted",
          variant === "mobile"
            ? highlighted
              ? "text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
            : highlighted
              ? "text-primary-foreground"
              : "text-muted-foreground"
        )
      }
    >
      {() => (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              "shrink-0",
              variant === "sidebar" ? "size-5" : "size-[22px]",
              highlighted
                ? "text-primary-foreground"
                : "text-muted-foreground"
            )}
            strokeWidth={1.7}
          />
          {variant === "mobile" && !iconOnly && (
            <span className="max-w-full text-center text-[11px] text-balance">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
