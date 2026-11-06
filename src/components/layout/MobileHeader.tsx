import { format } from "date-fns"

import { BrandMark } from "@/components/layout/BrandMark"
import { useCurrentDate } from "@/hooks/useCurrentDate"

export function MobileHeader() {
  const today = useCurrentDate()

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <BrandMark compact />
        <div className="flex items-center gap-2.5 font-mono text-base font-medium tracking-[0.02em] text-muted-foreground">
          <span className="size-2 rounded-full bg-accent-turquoise" />
          {format(today, "yyyy.MM.dd")}
        </div>
      </div>
    </header>
  )
}
