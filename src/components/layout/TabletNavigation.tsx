import { BrandMark } from "@/components/layout/BrandMark"
import { NavigationList } from "@/components/layout/NavigationList"

export function TabletNavigation() {
  return (
    <aside
      data-layout-nav="tablet"
      className="fixed inset-y-0 left-0 hidden w-20 flex-col items-center border-r bg-card/95 px-2 py-4 backdrop-blur md:flex lg:hidden"
    >
      <BrandMark iconOnly />

      <NavigationList variant="tablet" iconOnly className="mt-8" />

      <div className="mt-auto flex flex-col items-center gap-2">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-accent-turquoise"
        />
        <span className="font-mono text-[8px] tracking-[0.08em] text-muted-foreground">
          CLOUD
        </span>
      </div>
    </aside>
  )
}
