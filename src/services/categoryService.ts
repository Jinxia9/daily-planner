import { DataOperationError, normalizeDataError } from "@/lib/errors"
import { mapCategoryRow } from "@/lib/dataMappers"
import { requireAuthenticatedUser } from "@/lib/supabase"
import type { Category, CategoryInput } from "@/types/category"
import type { CategoryRow } from "@/types/database"

const CATEGORY_COLUMNS =
  "id, user_id, name, color, created_at"

export async function listCategories(): Promise<Category[]> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return ((data ?? []) as CategoryRow[]).map(mapCategoryRow)
  } catch (error) {
    throw normalizeDataError(error, "加载分类失败。")
  }
}

export async function createCategory(
  input: CategoryInput
): Promise<Category> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("categories")
      .insert({
        user_id: userId,
        name: input.name.trim(),
        color: input.color,
      })
      .select(CATEGORY_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("创建分类失败，请稍后重试。")
    }

    return mapCategoryRow(data as CategoryRow)
  } catch (error) {
    throw normalizeDataError(error, "创建分类失败。")
  }
}

export async function updateCategory(
  categoryId: string,
  input: CategoryInput
): Promise<Category> {
  try {
    const { client, userId } = await requireAuthenticatedUser()
    const { data, error } = await client
      .from("categories")
      .update({
        name: input.name.trim(),
        color: input.color,
      })
      .eq("id", categoryId)
      .eq("user_id", userId)
      .select(CATEGORY_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new DataOperationError("分类不存在或无权访问。")
    }

    return mapCategoryRow(data as CategoryRow)
  } catch (error) {
    throw normalizeDataError(error, "更新分类失败。")
  }
}

export async function deleteCategoryWithReplacement(
  categoryId: string,
  replacementCategoryId?: string
): Promise<void> {
  try {
    const { client } = await requireAuthenticatedUser()
    const { error } = await client.rpc(
      "delete_category_with_replacement",
      {
        p_category_id: categoryId,
        p_replacement_category_id: replacementCategoryId ?? null,
      }
    )

    if (error) {
      throw error
    }
  } catch (error) {
    throw normalizeDataError(error, "删除分类失败。")
  }
}
