import { DataOperationError, normalizeDataError } from "@/lib/errors"
import { mapDDLRow } from "@/lib/dataMappers"
import { clampProgress } from "@/lib/ddl"
import { requireAuthenticatedUser } from "@/lib/supabase"
import type { DDLRow } from "@/types/database"
import type { DDL, DDLInput } from "@/types/ddl"

const DDL_COLUMNS =
  "id, user_id, title, deadline, progress, description, note_type, completed, created_at, updated_at"

function toDDLRowInput(input: DDLInput) {
  return {
    title: input.title.trim(),
    deadline: input.deadline,
    progress: clampProgress(input.progress),
    description: input.description ?? null,
    note_type: input.noteType,
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

export async function updateDDLProgress(
  ddlId: string,
  progress: number
): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("ddls")
      .update({ progress: clampProgress(progress) })
      .eq("id", ddlId)
      .eq("user_id", userId)
      .eq("completed", false)
      .select(DDL_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("DDL 不存在或已完成。")
    }

    return mapDDLRow(data as DDLRow)
  } catch (error) {
    throw normalizeDataError(error, "更新 DDL 进度失败。")
  }
}

export async function setDDLCompleted(
  ddlId: string,
  completed: boolean
): Promise<DDL> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data: currentDDL, error: readError } = await client
      .from("ddls")
      .select("progress")
      .eq("id", ddlId)
      .eq("user_id", userId)
      .single()

    if (readError) {
      throw readError
    }

    const currentProgress = (currentDDL as { progress: number }).progress
    const nextProgress = completed
      ? 100
      : currentProgress >= 100
        ? 99
        : currentProgress
    const { data, error } = await client
      .from("ddls")
      .update({
        completed,
        progress: nextProgress,
      })
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
