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
  description?: string
  noteType: NoteType
}

export function NoteContent({
  description,
  noteType,
}: NoteContentProps) {
  const normalizedDescription = description?.trim()
  if (!normalizedDescription) {
    return <span className="text-muted-foreground">暂无备注</span>
  }

  const meta = NOTE_TYPE_META[noteType]
  const Icon = meta.icon

  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      <Badge variant="outline">
        <Icon data-icon="inline-start" aria-hidden="true" />
        {meta.label}
      </Badge>
      <p className="whitespace-pre-wrap break-words leading-relaxed text-muted-foreground">
        {normalizedDescription}
      </p>
    </div>
  )
}
