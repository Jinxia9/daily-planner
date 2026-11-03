import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { DDLFilter } from "@/types/ddl"

const FILTER_OPTIONS: Array<{ label: string; value: DDLFilter }> = [
  { label: "全部", value: "all" },
  { label: "进行中", value: "active" },
  { label: "即将到期", value: "due-soon" },
  { label: "已逾期", value: "overdue" },
  { label: "已完成", value: "completed" },
]

interface DDLFilterBarProps {
  onValueChange: (filter: DDLFilter) => void
  value: DDLFilter
}

export function DDLFilterBar({
  onValueChange,
  value,
}: DDLFilterBarProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
          /ddl views
        </p>
        <span className="text-xs text-muted-foreground">
          按截止日期从近到远
        </span>
      </div>
      <ToggleGroup
        value={[value]}
        onValueChange={(values) => {
          if (values[0]) {
            onValueChange(values[0] as DDLFilter)
          }
        }}
        variant="outline"
        size="sm"
        spacing={2}
        aria-label="筛选 DDL"
        className="flex-wrap"
      >
        {FILTER_OPTIONS.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
