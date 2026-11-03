import { CalendarX2, Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { CategoryFilter } from "@/components/calendar/CategoryFilter"
import { DDLDialog } from "@/components/ddl/DDLDialog"
import { DDLFilterBar } from "@/components/ddl/DDLFilterBar"
import { DDLStatusPanel } from "@/components/ddl/DDLStatusPanel"
import { DDLTaskCard } from "@/components/ddl/DDLTaskCard"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCalendarData } from "@/hooks/useCalendarData"
import { useCurrentDate } from "@/hooks/useCurrentDate"
import { useCurrentDateTime } from "@/hooks/useCurrentDateTime"
import {
  getDDLTimeInfo,
  matchesDDLFilter,
  sortDDLsByDeadline,
} from "@/lib/ddl"
import { formatDateKey } from "@/lib/date"
import type {
  DDL,
  DDLFilter,
  DDLInput,
} from "@/types/ddl"

const FILTER_LABELS: Record<DDLFilter, string> = {
  all: "全部 DDL",
  active: "进行中",
  "due-soon": "即将到期",
  overdue: "已逾期",
  completed: "已完成",
}

export function DDLPage() {
  const {
    categories,
    categoryById,
    ddls,
    createDDL,
    updateDDL,
    setDDLNoteCompleted,
    setDDLCompleted,
    deleteDDL,
  } = useCalendarData()
  const today = useCurrentDate()
  const now = useCurrentDateTime()
  const [filter, setFilter] = useState<DDLFilter>("all")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    []
  )
  const [editingDDL, setEditingDDL] = useState<DDL | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const visibleDDLs = useMemo(
    () =>
      sortDDLsByDeadline(
        ddls
          .filter((ddl) => matchesDDLFilter(ddl, filter, now))
          .filter(
            (ddl) =>
              selectedCategoryIds.length === 0 ||
              (ddl.categoryId !== undefined &&
                selectedCategoryIds.includes(ddl.categoryId))
          )
      ),
    [ddls, filter, now, selectedCategoryIds]
  )
  const defaultDeadline = formatDateKey(today)
  const canCreateDDL = categories.length > 0

  function openCreateDialog() {
    if (!canCreateDDL) {
      return
    }

    setEditingDDL(null)
    setIsEditorOpen(true)
  }

  function openEditDialog(ddl: DDL) {
    setEditingDDL(ddl)
    setIsEditorOpen(true)
  }

  async function saveDDL(input: DDLInput) {
    if (editingDDL) {
      await updateDDL(editingDDL.id, input)
    } else {
      await createDDL(input)
    }

    setIsEditorOpen(false)
    setEditingDDL(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        path="/ddl"
        title="DDL 倒计时"
        actions={
          <Button
            size="sm"
            onClick={openCreateDialog}
            disabled={!canCreateDDL}
            title={canCreateDDL ? undefined : "请先在设置中创建分类"}
          >
            <Plus data-icon="inline-start" />
            新增 DDL
          </Button>
        }
      />

      <div className="mt-6 grid flex-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-labelledby="ddl-list-title" className="min-w-0">
          <Card size="sm" className="gap-0 py-4">
            <CardContent>
              <div className="flex flex-col gap-4">
                <DDLFilterBar value={filter} onValueChange={setFilter} />
                <Separator />
                <CategoryFilter
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  onValueChange={setSelectedCategoryIds}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 flex items-end justify-between gap-4">
            <h2
              id="ddl-list-title"
              className="text-lg font-medium tracking-[-0.025em]"
            >
              {FILTER_LABELS[filter]}
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              {visibleDDLs.length} 项
            </span>
          </div>

          {visibleDDLs.length === 0 ? (
            <Empty className="mt-3 border border-dashed bg-card px-4 py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarX2 aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>
                  {filter === "completed"
                    ? "还没有已完成的 DDL"
                    : "当前视图没有 DDL"}
                </EmptyTitle>
                <EmptyDescription>
                  切换其他筛选条件，或新增一个需要跟进的事项。
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  size="sm"
                  onClick={openCreateDialog}
                  disabled={!canCreateDDL}
                >
                  <Plus data-icon="inline-start" />
                  新增 DDL
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {visibleDDLs.map((ddl) => (
                <DDLTaskCard
                  key={ddl.id}
                  category={
                    ddl.categoryId
                      ? categoryById.get(ddl.categoryId)
                      : undefined
                  }
                  ddl={ddl}
                  timeInfo={getDDLTimeInfo(ddl, now)}
                  onDelete={deleteDDL}
                  onEdit={openEditDialog}
                  onToggleNoteCompleted={setDDLNoteCompleted}
                  onToggleCompleted={setDDLCompleted}
                />
              ))}
            </div>
          )}
        </section>

        <DDLStatusPanel ddls={ddls} now={now} />
      </div>

      <DDLDialog
        categories={categories}
        open={isEditorOpen}
        ddl={editingDDL ?? undefined}
        defaultDeadline={defaultDeadline}
        onOpenChange={(open) => {
          setIsEditorOpen(open)
          if (!open) {
            setEditingDDL(null)
          }
        }}
        onSubmit={saveDDL}
      />
    </div>
  )
}
