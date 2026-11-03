export interface Event {
  id: string
  title: string
  date: string
  startTime?: string
  endTime?: string
  categoryId: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type CreateEventInput = Omit<
  Event,
  "id" | "createdAt" | "updatedAt"
>

export type UpdateEventInput = CreateEventInput
