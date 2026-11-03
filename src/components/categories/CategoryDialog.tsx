import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "@/components/categories/CategoryForm"
import type {
  Category,
  CategoryInput,
} from "@/types/category"

interface CategoryDialogProps {
  categories: Category[]
  category?: Category
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CategoryInput) => Promise<void>
  open: boolean
}

export function CategoryDialog({
  categories,
  category,
  onOpenChange,
  onSubmit,
  open,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "编辑分类" : "新增分类"}</DialogTitle>
          <DialogDescription>
            {category
              ? "保存后，所有关联日程会立即使用新的名称和颜色。"
              : "创建后可以在日程表单和月历筛选中使用这个分类。"}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          key={category?.id ?? "new-category"}
          categories={categories}
          category={category}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
