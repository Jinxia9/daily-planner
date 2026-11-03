import { isCategoryColor } from "@/data/categoryColors"
import { isNoteType } from "@/lib/notes"
import type { Category } from "@/types/category"
import type { DDL } from "@/types/ddl"
import type { Event } from "@/types/event"
import type {
  CategoryRow,
  DDLRow,
  EventRow,
} from "@/types/database"

function formatPostgresTime(value: string | null): string | undefined {
  return value ? value.slice(0, 5) : undefined
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: isCategoryColor(row.color) ? row.color : "red",
    createdAt: row.created_at,
  }
}

export function mapEventRow(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: formatPostgresTime(row.start_time),
    endTime: formatPostgresTime(row.end_time),
    categoryId: row.category_id,
    description: row.description ?? undefined,
    noteType: isNoteType(row.note_type) ? row.note_type : "text",
    noteCompleted: row.note_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapDDLRow(row: DDLRow): DDL {
  return {
    id: row.id,
    title: row.title,
    deadline: row.deadline,
    deadlineTime: formatPostgresTime(row.deadline_time),
    description: row.description ?? undefined,
    noteType: isNoteType(row.note_type) ? row.note_type : "text",
    noteCompleted: row.note_completed,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
