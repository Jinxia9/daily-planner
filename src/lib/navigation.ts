import { CalendarDays, Hourglass, Settings2 } from "lucide-react"

import type { AppNavigationItem } from "@/types/navigation"

export const APP_NAVIGATION: AppNavigationItem[] = [
  {
    label: "月历",
    path: "/calendar",
    description: "按月查看日程",
    icon: CalendarDays,
  },
  {
    label: "DDL 倒计时",
    path: "/ddl",
    description: "跟进截止任务",
    icon: Hourglass,
  },
  {
    label: "设置",
    path: "/settings",
    description: "偏好与数据状态",
    icon: Settings2,
  },
]
