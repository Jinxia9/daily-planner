import { NavigationItem } from "@/components/layout/NavigationItem"
import { APP_NAVIGATION } from "@/lib/navigation"

export function MobileNavigation() {
  return (
    <nav
      data-layout-nav="mobile"
      aria-label="主要导航"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 px-3 pt-1 pb-[calc(0.35rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {APP_NAVIGATION.map((item) => (
          <NavigationItem key={item.path} item={item} variant="mobile" />
        ))}
      </div>
    </nav>
  )
}
