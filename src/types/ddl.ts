import type { NoteType } from "@/types/note"

export interface DDL {
  id: string
  title: string
  deadline: string
  progress: number
  description?: string
  noteType: NoteType
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface DDLInput {
  title: string
  deadline: string
  progress: number
  description?: string
  noteType: NoteType
}

export type DDLFilter =
  | "all"
  | "active"
  | "due-soon"
  | "overdue"
  | "completed"
