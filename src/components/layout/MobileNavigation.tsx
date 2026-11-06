import { NavigationList } from "@/components/layout/NavigationList"

export function MobileNavigation() {
  return (
    <NavigationList
      variant="mobile"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t bg-card/95 px-3 pt-1 pb-[calc(0.35rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    />
  )
}
