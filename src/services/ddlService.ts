import { DataOperationError, normalizeDataError } from "@/lib/errors"
import { mapDDLRow } from "@/lib/dataMappers"
import { requireAuthenticatedUser } from "@/lib/supabase"
import type { DDLRow } from "@/types/database"
import type { DDL, DDLInput } from "@/types/ddl"

const DDL_COLUMNS =
  "id, user_id, title, deadline, deadline_time, category_id, description, note_type, note_completed, completed, created_at, updated_at"

function toDDLRowInput(input: DDLInput) {
  return {
    title: input.title.trim(),
    deadline: input.deadline,
    deadline_time: input.deadlineTime ?? null,
    category_id: input.categoryId ?? null,
    description: input.description ?? null,
    note_type: input.noteType,
    note_completed: input.noteCompleted,
  }
}

export async function listDDLs(): Promise<DDL[]> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .select(DDL_COLUMNS)
      .eq("user_id", userId)
      .order("deadline", { ascending: true })

    if (error) {
      throw error
    }

    return ((data ?? []) as DDLRow[]).map(mapDDLRow)
  } catch (error) {
    throw normalizeDataError(error, "加载 DDL 失败。")
  }
}

export async function createDDL(input: DDLInput): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .insert({
        user_id: userId,
        ...toDDLRowInput(input),
        completed: false,
      })
      .select(DDL_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("创建 DDL 失败，请稍后重试。")
    }

    return mapDDLRow(data as DDLRow)
  } catch (error) {
    throw normalizeDataError(error, "创建 DDL 失败。")
  }
}

export async function updateDDL(
  ddlId: string,
  input: DDLInput
): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .update(toDDLRowInput(input))
      .eq("id", ddlId)
      .eq("user_id", userId)
      .select(DDL_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("DDL 不存在或无权访问。")
    }

    return mapDDLRow(data as DDLRow)
  } catch (error) {
    throw normalizeDataError(error, "更新 DDL 失败。")
  }
}

export async function setDDLCompleted(
  ddlId: string,
  completed: boolean
): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .update({ completed })
      .eq("id", ddlId)
      .eq("user_id", userId)
      .select(DDL_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("DDL 不存在或无权访问。")
    }

    return mapDDLRow(data as DDLRow)
  } catch (error) {
    throw normalizeDataError(error, "更新 DDL 完成状态失败。")
  }
}

export async function setDDLNoteCompleted(
  ddlId: string,
  completed: boolean
): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .update({ note_completed: completed })
      .eq("id", ddlId)
      .eq("user_id", userId)
      .eq("note_type", "todo")
      .select(DDL_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("待办备注不存在或无权访问。")
    }

    return mapDDLRow(data as DDLRow)
  } catch (error) {
    throw normalizeDataError(error, "更新待办备注失败。")
  }
}

export async function deleteDDL(ddlId: string): Promise<void> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .delete()
      .eq("id", ddlId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("DDL 不存在或无权访问。")
    }
  } catch (error) {
    throw normalizeDataError(error, "删除 DDL 失败。")
  }
}
