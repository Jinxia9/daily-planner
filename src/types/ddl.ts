import type { NoteType } from "@/types/note"

export interface DDL {
  id: string
  title: string
  deadline: string
  deadlineTime?: string
  categoryId?: string
  description?: string
  noteType: NoteType
  noteCompleted: boolean
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface DDLInput {
  title: string
  deadline: string
  deadlineTime?: string
  categoryId?: string
  description?: string
  noteType: NoteType
  noteCompleted: boolean
}

export type DDLFilter =
  | "all"
  | "active"
  | "due-soon"
  | "overdue"
  | "completed"
