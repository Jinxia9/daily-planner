import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  path: string
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
}

export function PageHeader({
  path,
  title,
  description,
  actions,
  meta,
}: PageHeaderProps) {
  return (
    <header
      data-page-header
      className="flex flex-row items-end justify-between gap-3 border-b pb-5 sm:gap-6 sm:pb-6"
    >
      <div className="min-w-0 max-w-2xl">
        <p className="font-mono text-xs tracking-[0.04em] text-muted-foreground">
          {path}
        </p>
        <h1 className="mt-2 text-[clamp(2.1rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.04em] sm:mt-3">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {(meta || actions) && (
        <div
          data-page-header-side
          className={cn(
            "ml-auto flex shrink-0 flex-col gap-2",
            meta ? "w-48 items-stretch lg:w-56" : "items-end"
          )}
        >
          {meta && <div className="block">{meta}</div>}
          {actions && (
            <div
              data-page-header-actions
              className={cn(
                "flex flex-wrap items-center justify-end gap-1.5 sm:gap-2",
                meta && "lg:justify-between"
              )}
            >
              {actions}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
