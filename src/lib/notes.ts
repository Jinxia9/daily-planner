import type { NoteType } from "@/types/note"

export const NOTE_TYPE_OPTIONS: Array<{
  label: string
  value: NoteType
}> = [
  { label: "文本", value: "text" },
  { label: "地址", value: "address" },
  { label: "待办", value: "todo" },
]

export function isNoteType(value: unknown): value is NoteType {
  return (
    value === "text" || value === "address" || value === "todo"
  )
}

export function getNotePlaceholder(noteType: NoteType): string {
  switch (noteType) {
    case "address":
      return "填写地址，例如：图书馆三楼东侧研讨室"
    case "todo":
      return "填写要完成的事项，例如：带上学生证"
    default:
      return "补充准备事项或其他说明"
  }
}
