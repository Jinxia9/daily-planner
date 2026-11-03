import {
  CheckCircle2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import { NoteContent } from "@/components/notes/NoteContent"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  formatDDLDeadline,
  type DDLTimeInfo,
} from "@/lib/ddl"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import { cn } from "@/lib/utils"
import { normalizeDataError } from "@/lib/errors"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"

interface DDLTaskCardProps {
  category?: Category
  ddl: DDL
  onDelete: (ddlId: string) => Promise<void>
  onEdit: (ddl: DDL) => void
  onToggleCompleted: (ddlId: string, completed: boolean) => Promise<DDL>
  onToggleNoteCompleted: (
    ddlId: string,
    completed: boolean
  ) => Promise<DDL>
  timeInfo: DDLTimeInfo
}

function getStatusBadge(timeInfo: DDLTimeInfo) {
  switch (timeInfo.state) {
    case "completed":
      return { label: "已完成", variant: "secondary" as const }
    case "overdue":
      return { label: "已逾期", variant: "destructive" as const }
    case "today":
      return { label: "今天截止", variant: "outline" as const }
    case "due-soon":
      return { label: "即将到期", variant: "outline" as const }
    default:
      return { label: "进行中", variant: "outline" as const }
  }
}

export function DDLTaskCard({
  category,
  ddl,
  onDelete,
  onEdit,
  onToggleCompleted,
  onToggleNoteCompleted,
  timeInfo,
}: DDLTaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingNote, setIsUpdatingNote] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const statusBadge = getStatusBadge(timeInfo)
  async function handleToggleCompleted() {
    setUpdateError(null)
    setIsUpdating(true)

    try {
      await onToggleCompleted(ddl.id, !ddl.completed)
    } catch (error) {
      setUpdateError(
        normalizeDataError(error, "更新完成状态失败。").message
      )
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleToggleNoteCompleted(completed: boolean) {
    setUpdateError(null)
    setIsUpdatingNote(true)

    try {
      await onToggleNoteCompleted(ddl.id, completed)
    } catch (error) {
      setUpdateError(
        normalizeDataError(error, "更新待办备注失败。").message
      )
    } finally {
      setIsUpdatingNote(false)
    }
  }

  async function handleDelete() {
    setDeleteError(null)
    setIsDeleting(true)

    try {
      await onDelete(ddl.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      setDeleteError(
        normalizeDataError(error, "删除 DDL 失败。").message
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card data-ddl-id={ddl.id}>
      <CardHeader>
        <CardDescription className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] tracking-[0.06em]">
          <span>
            截止 {formatDDLDeadline(ddl.deadline, ddl.deadlineTime)}
          </span>
          <span aria-hidden="true">·</span>
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              ACCENT_BACKGROUND[category?.color ?? "red"]
            )}
          />
          <span>{category?.name ?? "未分类"}</span>
        </CardDescription>
        <CardTitle
          data-ddl-title
          className="text-base tracking-[-0.02em] sm:text-lg"
        >
          {ddl.title}
        </CardTitle>
        {ddl.description && (
          <div className="col-span-2 text-sm">
            <NoteContent
              completed={ddl.noteCompleted}
              description={ddl.description}
              isUpdating={isUpdatingNote}
              noteType={ddl.noteType}
              onToggleCompleted={(completed) => {
                void handleToggleNoteCompleted(completed)
              }}
            />
          </div>
        )}
        <CardAction className="flex flex-col items-end gap-2 text-right">
          <Badge variant={statusBadge.variant}>
            {statusBadge.label}
          </Badge>
          <p
            data-ddl-time-label
            className={cn(
              "whitespace-nowrap text-base leading-snug font-medium tracking-[-0.02em] sm:text-lg",
              timeInfo.state === "overdue"
                ? "text-destructive"
                : timeInfo.state === "due-soon" ||
                    timeInfo.state === "today"
                  ? "text-status-warning"
                  : "text-muted-foreground"
            )}
          >
            {timeInfo.label}
          </p>
        </CardAction>
      </CardHeader>

      {updateError && (
        <Alert variant="destructive" className="mx-4">
          <AlertTitle>更新失败</AlertTitle>
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant={ddl.completed ? "outline" : "secondary"}
          size="sm"
          onClick={handleToggleCompleted}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <Spinner data-icon="inline-start" />
          ) : ddl.completed ? (
            <RotateCcw data-icon="inline-start" />
          ) : (
            <CheckCircle2 data-icon="inline-start" />
          )}
          {isUpdating
            ? "正在更新..."
            : ddl.completed
              ? "重新开启"
              : "标记完成"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(ddl)}
          disabled={isDeleting || isUpdatingNote}
        >
          <Pencil data-icon="inline-start" />
          编辑
        </Button>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                disabled={isUpdating || isDeleting}
              />
            }
          >
            <Trash2 data-icon="inline-start" />
            删除
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2 aria-hidden="true" />
              </AlertDialogMedia>
              <AlertDialogTitle>删除这个 DDL？</AlertDialogTitle>
              <AlertDialogDescription>
                “{ddl.title}”及其截止信息将被永久删除。
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError && (
              <Alert variant="destructive">
                <AlertTitle>删除失败</AlertTitle>
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting && <Spinner data-icon="inline-start" />}
                {isDeleting ? "正在删除..." : "确认删除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
