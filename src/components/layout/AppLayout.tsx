import { Suspense, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { MobileHeader } from "@/components/layout/MobileHeader"
import { MobileNavigation } from "@/components/layout/MobileNavigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { DataStateGate } from "@/components/layout/DataStateGate"
import { TabletNavigation } from "@/components/layout/TabletNavigation"
import { usePageTitle } from "@/hooks/usePageTitle"

export function AppLayout() {
  usePageTitle()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        跳到主要内容
      </a>

      <Sidebar />
      <TabletNavigation />
      <MobileHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-svh outline-none md:pl-20 lg:pl-[17.5rem]"
      >
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[96rem] flex-col px-4 pt-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-7 md:min-h-svh md:px-6 md:py-7 lg:px-10 lg:py-8">
          <DataStateGate>
            <div
              key={pathname}
              className="page-transition flex flex-1 flex-col"
            >
              <Suspense
                fallback={
                  <div
                    role="status"
                    className="flex min-h-64 items-center justify-center font-mono text-xs text-muted-foreground"
                  >
                    正在加载页面...
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </DataStateGate>
        </div>
      </main>

      <MobileNavigation />
    </div>
  )
}
