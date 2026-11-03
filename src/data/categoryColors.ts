import type { CategoryColor } from "@/types/category"

export const CATEGORY_COLOR_OPTIONS: Array<{
  value: CategoryColor
  label: string
}> = [
  { value: "blue", label: "蓝色" },
  { value: "lavender", label: "紫色" },
  { value: "green", label: "绿色" },
  { value: "orange", label: "橙色" },
  { value: "red", label: "红色" },
  { value: "pink", label: "粉色" },
  { value: "yellow", label: "黄色" },
]

export function isCategoryColor(value: unknown): value is CategoryColor {
  return CATEGORY_COLOR_OPTIONS.some((option) => option.value === value)
}
