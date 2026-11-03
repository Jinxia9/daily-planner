import { AlignLeft, ListTodo, MapPin } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { NoteType } from "@/types/note"

const NOTE_TYPE_ITEMS = [
  { icon: AlignLeft, label: "文本", value: "text" },
  { icon: MapPin, label: "地址", value: "address" },
  { icon: ListTodo, label: "待办", value: "todo" },
] as const satisfies ReadonlyArray<{
  icon: typeof AlignLeft
  label: string
  value: NoteType
}>

interface NoteTypeSelectorProps {
  onValueChange: (value: NoteType) => void
  value: NoteType
}

export function NoteTypeSelector({
  onValueChange,
  value,
}: NoteTypeSelectorProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(values) => {
        if (values[0]) {
          onValueChange(values[0] as NoteType)
        }
      }}
      variant="outline"
      size="sm"
      spacing={2}
      aria-label="备注类型"
      className="flex-wrap"
    >
      {NOTE_TYPE_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={`备注类型：${item.label}`}
          >
            <Icon data-icon="inline-start" />
            {item.label}
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
