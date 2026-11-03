import { AlignLeft, ListTodo, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { NoteType } from "@/types/note"

const NOTE_TYPE_META = {
  text: { icon: AlignLeft, label: "文本" },
  address: { icon: MapPin, label: "地址" },
  todo: { icon: ListTodo, label: "待办" },
} satisfies Record<
  NoteType,
  { icon: typeof AlignLeft; label: string }
>

interface NoteContentProps {
  completed?: boolean
  description?: string
  isUpdating?: boolean
  noteType: NoteType
  onToggleCompleted?: (completed: boolean) => void
}

export function NoteContent({
  completed = false,
  description,
  isUpdating = false,
  noteType,
  onToggleCompleted,
}: NoteContentProps) {
  const normalizedDescription = description?.trim()
  if (!normalizedDescription) {
    return <span className="text-muted-foreground">暂无备注</span>
  }

  const meta = NOTE_TYPE_META[noteType]
  const Icon = meta.icon
  const noteText = (
    <span
      className={
        completed
          ? "text-muted-foreground line-through decoration-1"
          : "leading-relaxed text-muted-foreground"
      }
    >
      {normalizedDescription}
    </span>
  )

  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      <Badge variant="outline">
        <Icon data-icon="inline-start" aria-hidden="true" />
        {meta.label}
      </Badge>
      {noteType === "todo" && onToggleCompleted ? (
        <label className="flex min-w-0 cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={completed}
            disabled={isUpdating}
            onChange={(event) =>
              onToggleCompleted(event.target.checked)
            }
            aria-label={`完成待办：${normalizedDescription}`}
            className="mt-1 size-4 shrink-0 rounded border-input accent-primary"
          />
          <span className="min-w-0 whitespace-pre-wrap break-words">
            {noteText}
          </span>
        </label>
      ) : (
        <p className="whitespace-pre-wrap break-words">{noteText}</p>
      )}
    </div>
  )
}
