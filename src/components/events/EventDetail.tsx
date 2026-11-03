import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

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
import { NoteContent } from "@/components/notes/NoteContent"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import {
  formatDateKeyLabel,
  formatTimestamp,
} from "@/lib/date"
import { getEventTimeLabel } from "@/lib/events"
import { normalizeDataError } from "@/lib/errors"
import { usePreferences } from "@/hooks/usePreferences"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface EventDetailProps {
  category?: Category
  event: Event
  onDelete: (eventId: string) => Promise<void>
  onEdit: (event: Event) => void
}

export function EventDetail({
  category,
  event,
  onDelete,
  onEdit,
}: EventDetailProps) {
  const { preferences } = usePreferences()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleteError(null)
    setIsDeleting(true)

    try {
      await onDelete(event.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      setDeleteError(
        normalizeDataError(error, "删除日程失败。").message
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5" data-event-id={event.id}>
      <dl className="flex flex-col text-sm">
        <div className="grid grid-cols-[5rem_1fr] gap-3 border-b py-3 first:pt-0">
          <dt className="text-muted-foreground">日期</dt>
          <dd>{formatDateKeyLabel(event.date)}</dd>
        </div>
        <div className="grid grid-cols-[5rem_1fr] gap-3 border-b py-3">
          <dt className="text-muted-foreground">时间</dt>
          <dd>{getEventTimeLabel(event, preferences.use24HourTime)}</dd>
        </div>
        <div className="grid grid-cols-[5rem_1fr] gap-3 border-b py-3">
          <dt className="text-muted-foreground">分类</dt>
          <dd>
            <Badge variant="outline">
              <span
                aria-hidden="true"
                data-category-color={category?.color ?? "red"}
                className={cn(
                  "size-1.5 rounded-full",
                  ACCENT_BACKGROUND[category?.color ?? "red"]
                )}
              />
              {category?.name ?? "未分类"}
            </Badge>
          </dd>
        </div>
        <div className="grid grid-cols-[5rem_1fr] gap-3 py-3">
          <dt className="text-muted-foreground">备注</dt>
          <dd>
            <NoteContent
              description={event.description}
              noteType={event.noteType}
            />
          </dd>
        </div>
      </dl>

      <p className="font-mono text-[10px] text-muted-foreground">
        更新于 {formatTimestamp(event.updatedAt)}
      </p>

      <Separator />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger
            render={<Button variant="destructive" size="sm" />}
          >
            <Trash2 data-icon="inline-start" />
            删除日程
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2 aria-hidden="true" />
              </AlertDialogMedia>
              <AlertDialogTitle>删除这条日程？</AlertDialogTitle>
              <AlertDialogDescription>
                “{event.title}”将从当前月历和当天列表中移除，此操作无法撤销。
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

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(event)}
        >
          <Pencil data-icon="inline-start" />
          编辑日程
        </Button>
      </div>
    </div>
  )
}
