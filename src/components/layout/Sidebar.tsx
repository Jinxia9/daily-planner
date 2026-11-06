import { BrandMark } from "@/components/layout/BrandMark"
import { NavigationList } from "@/components/layout/NavigationList"

export function Sidebar() {
  return (
    <aside
      data-layout-nav="desktop"
      className="fixed inset-y-0 left-0 hidden w-20 flex-col items-center border-r bg-card/95 px-3 py-5 backdrop-blur lg:flex"
    >
      <BrandMark iconOnly />

      <NavigationList variant="sidebar" className="mt-8" />

      <span
        aria-hidden="true"
        className="mt-auto size-1.5 rounded-full bg-accent-turquoise"
      />
    </aside>
  )
}
