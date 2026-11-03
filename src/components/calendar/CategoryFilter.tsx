import { Button } from "@/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface CategoryFilterProps {
  categories: Category[]
  onValueChange: (categoryIds: string[]) => void
  selectedCategoryIds: string[]
}

export function CategoryFilter({
  categories,
  onValueChange,
  selectedCategoryIds,
}: CategoryFilterProps) {
  const isShowingAll = selectedCategoryIds.length === 0

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          isShowingAll && "max-sm:hidden"
        )}
      >
        <p className="hidden font-mono text-[10px] tracking-[0.06em] text-muted-foreground sm:block">
          /filter by category
        </p>
        <Button
          type="button"
          variant={isShowingAll ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={isShowingAll}
          onClick={() => onValueChange([])}
        >
          显示全部
        </Button>
      </div>

      {categories.length > 0 ? (
        <ToggleGroup
          multiple
          value={selectedCategoryIds}
          onValueChange={onValueChange}
          variant="outline"
          size="sm"
          spacing={2}
          aria-label="按分类筛选日程"
          className="flex-wrap"
        >
          {categories.map((category) => (
            <ToggleGroupItem
              key={category.id}
              value={category.id}
              data-category-id={category.id}
              aria-label={`筛选${category.name}分类`}
            >
              <span
                aria-hidden="true"
                data-category-color={category.color}
                className={cn(
                  "size-1.5 rounded-full",
                  ACCENT_BACKGROUND[category.color]
                )}
              />
              {category.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : (
        <p className="text-xs text-muted-foreground">
          暂无分类，请先在设置中创建分类。
        </p>
      )}
    </div>
  )
}
