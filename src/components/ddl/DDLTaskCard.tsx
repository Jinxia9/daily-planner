import {
  CheckCircle2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import { DDLProgressControl } from "@/components/ddl/DDLProgressControl"
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import {
  formatDDLDeadline,
  type DDLTimeInfo,
} from "@/lib/ddl"
import { cn } from "@/lib/utils"
import { normalizeDataError } from "@/lib/errors"
import type { DDL } from "@/types/ddl"

interface DDLTaskCardProps {
  ddl: DDL
  onDelete: (ddlId: string) => Promise<void>
  onEdit: (ddl: DDL) => void
  onProgressChange: (ddlId: string, progress: number) => Promise<DDL>
  onToggleCompleted: (ddlId: string, completed: boolean) => Promise<DDL>
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
  ddl,
  onDelete,
  onEdit,
  onProgressChange,
  onToggleCompleted,
  timeInfo,
}: DDLTaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const statusBadge = getStatusBadge(timeInfo)
  const showTimeDetail =
    timeInfo.state !== "completed" && timeInfo.state !== "today"

  async function handleProgressChange(progress: number) {
    setUpdateError(null)
    setIsUpdating(true)

    try {
      await onProgressChange(ddl.id, progress)
    } catch (error) {
      setUpdateError(
        normalizeDataError(error, "更新进度失败。").message
      )
    } finally {
      setIsUpdating(false)
    }
  }

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
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          截止 {formatDDLDeadline(ddl.deadline)}
        </CardDescription>
        <CardTitle className="text-base tracking-[-0.02em] sm:text-lg">
          {ddl.title}
        </CardTitle>
        {ddl.description && (
          <CardDescription>{ddl.description}</CardDescription>
        )}
        <CardAction>
          <Badge variant={statusBadge.variant}>
            {statusBadge.label}
          </Badge>
        </CardAction>
        {showTimeDetail && (
          <p
            className={cn(
              "font-mono text-[10px]",
              timeInfo.state === "overdue"
                ? "text-destructive"
                : timeInfo.state === "due-soon"
                  ? "text-status-warning"
                  : "text-muted-foreground"
            )}
          >
            {timeInfo.label}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
            <span>任务完成进度</span>
            <span className="text-foreground">{ddl.progress}%</span>
          </div>
          <Progress
            value={ddl.progress}
            aria-label={`${ddl.title} 完成进度 ${ddl.progress}%`}
            className="gap-0"
          />
        </div>

        <DDLProgressControl
          label="调整完成进度"
          value={ddl.progress}
          disabled={ddl.completed || isUpdating}
          onValueChange={(progress) => {
            void handleProgressChange(progress)
          }}
        />
        {updateError && (
          <Alert variant="destructive">
            <AlertTitle>更新失败</AlertTitle>
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}
      </CardContent>

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
                “{ddl.title}”及其完成进度将被永久删除。
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
