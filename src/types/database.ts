import type { CategoryColor } from "@/types/category"
import type { NoteType } from "@/types/note"

export interface CategoryRow {
  id: string
  user_id: string
  name: string
  color: CategoryColor
  created_at: string
}

export interface EventRow {
  id: string
  user_id: string
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  category_id: string
  description: string | null
  note_type: NoteType
  note_completed: boolean
  created_at: string
  updated_at: string
}

export interface DDLRow {
  id: string
  user_id: string
  title: string
  deadline: string
  deadline_time: string | null
  category_id: string | null
  description: string | null
  note_type: NoteType
  note_completed: boolean
  completed: boolean
  created_at: string
  updated_at: string
}
