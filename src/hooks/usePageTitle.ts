import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const PAGE_TITLES: Record<string, string> = {
  "/calendar": "月历 · Daily Planner",
  "/ddl": "DDL 倒计时 · Daily Planner",
  "/settings": "设置 · Daily Planner",
}

export function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title =
      PAGE_TITLES[pathname] ?? "页面不存在 · Daily Planner"
  }, [pathname])
}
