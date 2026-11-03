import { Pencil, Plus, Tags, Trash2 } from "lucide-react"
import { Fragment, useMemo, useState } from "react"

import { CategoryDeleteDialog } from "@/components/categories/CategoryDeleteDialog"
import { CategoryDialog } from "@/components/categories/CategoryDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { useCalendarData } from "@/hooks/useCalendarData"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import { formatTimestamp } from "@/lib/date"
import { cn } from "@/lib/utils"
import type {
  Category,
  CategoryInput,
} from "@/types/category"

type CategoryEditor =
  | { mode: "create" }
  | { mode: "edit"; category: Category }
  | null

export function CategoryManager() {
  const {
    categories,
    events,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCalendarData()
  const [editor, setEditor] = useState<CategoryEditor>(null)
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null)

  const eventCountByCategory = useMemo(() => {
    const counts = new Map<string, number>()

    for (const event of events) {
      counts.set(event.categoryId, (counts.get(event.categoryId) ?? 0) + 1)
    }

    return counts
  }, [events])

  async function saveCategory(input: CategoryInput) {
    if (editor?.mode === "edit") {
      await updateCategory(editor.category.id, input)
    } else {
      await createCategory(input)
    }

    setEditor(null)
  }

  async function confirmDeleteCategory(
    replacementCategoryId?: string
  ) {
    if (!categoryToDelete) {
      return
    }

    await deleteCategory(categoryToDelete.id, replacementCategoryId)
    setCategoryToDelete(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
            /categories
          </CardDescription>
          <CardTitle>分类管理</CardTitle>
          <CardDescription>
            分类名称与颜色会同步应用到月历、筛选和日程详情。
          </CardDescription>
          <CardAction>
            <Button size="sm" onClick={() => setEditor({ mode: "create" })}>
              <Plus data-icon="inline-start" />
              新增分类
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <Empty className="border border-dashed bg-muted/20 px-4 py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Tags aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>还没有分类</EmptyTitle>
                <EmptyDescription>
                  创建第一个分类后，就可以继续添加日程。
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  size="sm"
                  onClick={() => setEditor({ mode: "create" })}
                >
                  <Plus data-icon="inline-start" />
                  新增分类
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="flex flex-col">
              {categories.map((category, index) => {
                const eventCount =
                  eventCountByCategory.get(category.id) ?? 0

                return (
                  <Fragment key={category.id}>
                    <div
                      data-category-id={category.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        data-category-color={category.color}
                        className={cn(
                          "size-3 shrink-0 rounded-full",
                          ACCENT_BACKGROUND[category.color]
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {category.name}
                          </span>
                          <Badge variant="outline">
                            {eventCount} 条日程
                          </Badge>
                        </div>
                        <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                          创建于 {formatTimestamp(category.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`编辑${category.name}分类`}
                          onClick={() =>
                            setEditor({ mode: "edit", category })
                          }
                        >
                          <Pencil data-icon="inline-start" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`删除${category.name}分类`}
                          onClick={() => setCategoryToDelete(category)}
                        >
                          <Trash2 data-icon="inline-start" />
                        </Button>
                      </div>
                    </div>
                    {index < categories.length - 1 && <Separator />}
                  </Fragment>
                )
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between gap-3 text-xs text-muted-foreground">
          <span>{categories.length} 个分类</span>
          <span>{events.length} 条日程</span>
        </CardFooter>
      </Card>

      <CategoryDialog
        open={editor !== null}
        categories={categories}
        category={
          editor?.mode === "edit" ? editor.category : undefined
        }
        onOpenChange={(open) => {
          if (!open) {
            setEditor(null)
          }
        }}
        onSubmit={saveCategory}
      />

      {categoryToDelete && (
        <CategoryDeleteDialog
          key={categoryToDelete.id}
          category={categoryToDelete}
          eventCount={
            eventCountByCategory.get(categoryToDelete.id) ?? 0
          }
          otherCategories={categories.filter(
            (category) => category.id !== categoryToDelete.id
          )}
          onOpenChange={(open) => {
            if (!open) {
              setCategoryToDelete(null)
            }
          }}
          onConfirm={confirmDeleteCategory}
        />
      )}
    </>
  )
}
