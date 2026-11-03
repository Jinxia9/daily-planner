import type { ReactNode } from "react"

interface PageHeaderProps {
  path: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({
  path,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b pb-5 sm:gap-6 sm:pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.04em] text-muted-foreground">
          {path}
        </p>
        <h1 className="mt-2 text-[clamp(2.1rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.04em] sm:mt-3">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  )
}
