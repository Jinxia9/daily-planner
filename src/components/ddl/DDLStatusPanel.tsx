import {
  CheckCircle2,
  Clock3,
  ListTodo,
  TriangleAlert,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDDLTimeInfo } from "@/lib/ddl"
import type { DDL } from "@/types/ddl"

interface DDLStatusPanelProps {
  ddls: DDL[]
  today: Date
}

const STATUS_ICONS = {
  active: ListTodo,
  dueSoon: Clock3,
  overdue: TriangleAlert,
  completed: CheckCircle2,
}

export function DDLStatusPanel({ ddls, today }: DDLStatusPanelProps) {
  const counts = ddls.reduce(
    (result, ddl) => {
      const timeInfo = getDDLTimeInfo(ddl, today)

      if (ddl.completed) {
        result.completed += 1
      } else {
        result.active += 1

        if (timeInfo.state === "overdue") {
          result.overdue += 1
        } else if (
          timeInfo.state === "today" ||
          timeInfo.state === "due-soon"
        ) {
          result.dueSoon += 1
        }
      }

      return result
    },
    { active: 0, dueSoon: 0, overdue: 0, completed: 0 }
  )
  const statusItems = [
    {
      label: "进行中",
      value: counts.active,
      icon: STATUS_ICONS.active,
    },
    {
      label: "即将到期",
      value: counts.dueSoon,
      icon: STATUS_ICONS.dueSoon,
    },
    {
      label: "已逾期",
      value: counts.overdue,
      icon: STATUS_ICONS.overdue,
    },
    {
      label: "已完成",
      value: counts.completed,
      icon: STATUS_ICONS.completed,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /ddl overview
        </CardDescription>
        <CardTitle>任务概览</CardTitle>
        <CardAction>
          <Badge variant="outline">LOCAL</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
          >
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <item.icon aria-hidden="true" className="size-3.5" />
              {item.label}
            </span>
            <span className="font-mono text-xs text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="text-xs leading-relaxed text-muted-foreground">
        完成进度按任务投入计算，不会随时间自动增加。数据保存在当前浏览器。
      </CardFooter>
    </Card>
  )
}
