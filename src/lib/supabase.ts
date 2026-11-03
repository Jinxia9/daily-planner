import { createClient } from "@supabase/supabase-js"

import { DataOperationError } from "@/lib/errors"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const hasSupabaseEnvironment = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-anon-key")
)

function createSupabaseClient() {
  if (!hasSupabaseEnvironment) {
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  } catch {
    return null
  }
}

export const supabase = createSupabaseClient()
export const isSupabaseConfigured = supabase !== null

export function requireSupabase() {
  if (!supabase) {
    throw new DataOperationError(
      "Supabase 尚未配置。请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。",
      "SUPABASE_NOT_CONFIGURED"
    )
  }

  return supabase
}

export async function requireAuthenticatedUser() {
  const client = requireSupabase()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) {
    throw new DataOperationError(
      "登录状态已失效，请重新登录。",
      "AUTH_EXPIRED"
    )
  }

  return { client, userId: user.id }
}
