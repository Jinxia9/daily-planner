import { DataOperationError, normalizeDataError } from "@/lib/errors"
import { mapEventRow } from "@/lib/dataMappers"
import { requireAuthenticatedUser } from "@/lib/supabase"
import type { EventRow } from "@/types/database"
import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from "@/types/event"

const EVENT_COLUMNS =
  "id, user_id, title, date, start_time, end_time, category_id, description, created_at, updated_at"

function toEventRowInput(input: CreateEventInput) {
  return {
    title: input.title.trim(),
    date: input.date,
    start_time: input.startTime ?? null,
    end_time: input.endTime ?? null,
    category_id: input.categoryId,
    description: input.description ?? null,
  }
}

export async function listEvents(): Promise<Event[]> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true, nullsFirst: true })

    if (error) {
      throw error
    }

    return ((data ?? []) as EventRow[]).map(mapEventRow)
  } catch (error) {
    throw normalizeDataError(error, "加载日程失败。")
  }
}

export async function createEvent(
  input: CreateEventInput
): Promise<Event> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("events")
      .insert({
        user_id: userId,
        ...toEventRowInput(input),
      })
      .select(EVENT_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("创建日程失败，请稍后重试。")
    }

    return mapEventRow(data as EventRow)
  } catch (error) {
    throw normalizeDataError(error, "创建日程失败。")
  }
}

export async function updateEvent(
  eventId: string,
  input: UpdateEventInput
): Promise<Event> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("events")
      .update(toEventRowInput(input))
      .eq("id", eventId)
      .eq("user_id", userId)
      .select(EVENT_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("日程不存在或无权访问。")
    }

    return mapEventRow(data as EventRow)
  } catch (error) {
    throw normalizeDataError(error, "更新日程失败。")
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("日程不存在或无权访问。")
    }
  } catch (error) {
    throw normalizeDataError(error, "删除日程失败。")
  }
}
