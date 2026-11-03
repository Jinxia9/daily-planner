export interface DDL {
  id: string
  title: string
  deadline: string
  progress: number
  description?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface DDLInput {
  title: string
  deadline: string
  progress: number
  description?: string
}

export type DDLFilter =
  | "all"
  | "active"
  | "due-soon"
  | "overdue"
  | "completed"
