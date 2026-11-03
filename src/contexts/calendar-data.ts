import { createContext } from "react"

import type {
  Category,
  CategoryInput,
} from "@/types/category"
import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from "@/types/event"
import type { DDL, DDLInput } from "@/types/ddl"

export interface CalendarDataContextValue {
  categories: Category[]
  categoryById: Map<string, Category>
  events: Event[]
  ddls: DDL[]
  isLoading: boolean
  loadError: string | null
  mutationError: string | null
  clearMutationError: () => void
  refreshData: () => Promise<void>
  createCategory: (input: CategoryInput) => Promise<Category>
  updateCategory: (categoryId: string, input: CategoryInput) => Promise<Category>
  deleteCategory: (
    categoryId: string,
    replacementCategoryId?: string
  ) => Promise<void>
  createEvent: (input: CreateEventInput) => Promise<Event>
  updateEvent: (eventId: string, input: UpdateEventInput) => Promise<Event>
  deleteEvent: (eventId: string) => Promise<void>
  createDDL: (input: DDLInput) => Promise<DDL>
  updateDDL: (ddlId: string, input: DDLInput) => Promise<DDL>
  updateDDLProgress: (ddlId: string, progress: number) => Promise<DDL>
  setDDLCompleted: (ddlId: string, completed: boolean) => Promise<DDL>
  deleteDDL: (ddlId: string) => Promise<void>
}

export const CalendarDataContext =
  createContext<CalendarDataContextValue | null>(null)
