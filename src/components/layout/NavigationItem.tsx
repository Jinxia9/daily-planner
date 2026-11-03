import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import type { AppNavigationItem } from "@/types/navigation"

interface NavigationItemProps {
  item: AppNavigationItem
  variant: "sidebar" | "tablet" | "mobile"
}

export function NavigationItem({ item, variant }: NavigationItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "group outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          variant === "sidebar"
            ? "flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors"
            : variant === "tablet"
              ? "relative flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] leading-tight transition-colors active:bg-muted"
              : "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] transition-colors active:bg-muted",
          isActive
            ? variant !== "mobile"
              ? "bg-primary text-primary-foreground"
              : "text-foreground after:absolute after:inset-x-5 after:top-1 after:h-0.5 after:rounded-full after:bg-accent-red"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              "shrink-0",
              variant === "sidebar" ? "size-[18px]" : "size-5",
              isActive && variant !== "mobile"
                ? "text-accent-pink"
                : "text-current"
            )}
            strokeWidth={1.7}
          />

          {variant === "sidebar" ? (
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] leading-tight font-medium">
                {item.label}
              </span>
              <span
                className={cn(
                  "mt-1 truncate text-[10px] leading-tight",
                  isActive
                    ? "text-primary-foreground/65"
                    : "text-muted-foreground"
                )}
              >
                {item.description}
              </span>
            </span>
          ) : (
            <span className="max-w-full text-center text-balance">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
