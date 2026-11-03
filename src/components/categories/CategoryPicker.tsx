import { useId } from "react"

import { FieldTitle } from "@/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface CategoryPickerProps {
  categories: Category[]
  label: string
  onValueChange: (categoryId: string) => void
  value: string
}

export function CategoryPicker({
  categories,
  label,
  onValueChange,
  value,
}: CategoryPickerProps) {
  const id = useId()

  return (
    <>
      <FieldTitle id={`${id}-label`}>{label}</FieldTitle>
      <ToggleGroup
        value={value ? [value] : []}
        onValueChange={(values) => {
          if (values[0]) {
            onValueChange(values[0])
          }
        }}
        variant="outline"
        size="sm"
        spacing={2}
        aria-labelledby={`${id}-label`}
        className="flex-wrap"
      >
        {categories.map((category) => (
          <ToggleGroupItem
            key={category.id}
            value={category.id}
            aria-label={`选择${category.name}分类`}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                ACCENT_BACKGROUND[category.color]
              )}
            />
            {category.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  )
}
