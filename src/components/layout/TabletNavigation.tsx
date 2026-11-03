import { BrandMark } from "@/components/layout/BrandMark"
import { NavigationItem } from "@/components/layout/NavigationItem"
import { APP_NAVIGATION } from "@/lib/navigation"

export function TabletNavigation() {
  return (
    <aside
      data-layout-nav="tablet"
      className="fixed inset-y-0 left-0 hidden w-20 flex-col items-center border-r bg-card/95 px-2 py-4 backdrop-blur md:flex lg:hidden"
    >
      <BrandMark iconOnly />

      <nav
        aria-label="主要导航"
        className="mt-8 flex w-full flex-col gap-2"
      >
        {APP_NAVIGATION.map((item) => (
          <NavigationItem key={item.path} item={item} variant="tablet" />
        ))}
      </nav>

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
