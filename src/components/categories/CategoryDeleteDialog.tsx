import { AlertTriangle, Trash2 } from "lucide-react"
import { useId, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { normalizeDataError } from "@/lib/errors"
import type { Category } from "@/types/category"

interface CategoryDeleteDialogProps {
  category: Category
  eventCount: number
  onConfirm: (replacementCategoryId?: string) => Promise<void>
  onOpenChange: (open: boolean) => void
  otherCategories: Category[]
}

export function CategoryDeleteDialog({
  category,
  eventCount,
  onConfirm,
  onOpenChange,
  otherCategories,
}: CategoryDeleteDialogProps) {
  const id = useId()
  const [replacementCategoryId, setReplacementCategoryId] = useState<
    string | null
  >(otherCategories[0]?.id ?? null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const hasReferencedEvents = eventCount > 0
  const needsReplacement =
    hasReferencedEvents && otherCategories.length > 0
  const canDelete =
    !hasReferencedEvents ||
    (needsReplacement && replacementCategoryId !== null)
  const items = otherCategories.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  async function handleConfirm() {
    setDeleteError(null)
    setIsDeleting(true)

    try {
      await onConfirm(replacementCategoryId ?? undefined)
    } catch (error) {
      setDeleteError(
        normalizeDataError(error, "删除分类失败。").message
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>删除“{category.name}”？</AlertDialogTitle>
          <AlertDialogDescription>
            分类删除后无法撤销，月历和日程表单将不再显示这个分类。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          {hasReferencedEvents && (
            <Alert>
              <AlertTriangle aria-hidden="true" />
              <AlertTitle>
                该分类下有 {eventCount} 条日程
              </AlertTitle>
              <AlertDescription>
                请先将这些日程移动到其他分类，避免出现无效分类引用。
              </AlertDescription>
            </Alert>
          )}

          {needsReplacement && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-replacement`}>
                  将关联日程移动到
                </FieldLabel>
                <Select
                  items={items}
                  value={replacementCategoryId}
                  onValueChange={(value) =>
                    setReplacementCategoryId(value)
                  }
                >
                  <SelectTrigger
                    id={`${id}-replacement`}
                    className="w-full"
                    aria-label="将关联日程迁移到"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {otherCategories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  保存后，关联日程会改用所选分类的名称和颜色。
                </FieldDescription>
              </Field>
            </FieldGroup>
          )}

          {hasReferencedEvents && otherCategories.length === 0 && (
            <Alert>
              <AlertTriangle aria-hidden="true" />
              <AlertTitle>没有可迁移到的分类</AlertTitle>
              <AlertDescription>
                请先创建另一个分类，再删除当前分类。
              </AlertDescription>
            </Alert>
          )}

          {deleteError && (
            <Alert variant="destructive">
              <AlertTitle>删除失败</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!canDelete || isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Trash2 data-icon="inline-start" />
            )}
            {isDeleting ? "正在删除..." : "确认删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
